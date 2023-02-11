import React, { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";
import { DatabaseMode } from "../enum/DatabaseMode";
import { PathTemplate } from "../enum/PathTemplate";
import { l, lf } from "../lib/intl";
import {
  getAppPath,
  base64UrlToArrayBuffer,
  stringToUTF8ByteArray,
  base64UrlEncode,
} from "../lib/utils";
import { SERVER_DATABASE_ENABLED } from "../config";
import useDatabaseControl from "../hooks/useDatabaseControl";

const LoginViewServer = () => {
  const {
    databaseModeRef,
    serverDatabaseProvider,
  } = useDatabaseControl();

  const [signUpToken, setSignUpToken] = useState("");
  const [disclaimer, setDisclaimer]
    = useState<string | null>(null);

  const navigate = useNavigate();

  const addCredentials = async () => {
    const response = await serverDatabaseProvider.register?.({
      type: "REQUEST_CHALLENGE",
      signUpToken,
    });

    if (!response) {
      throw new Error("No response received");
    }

    // @ts-ignore
    const registrationOptions = response.registrationOptions;

    const publicKeyCredentialOptions: PublicKeyCredentialCreationOptions = {
      ...registrationOptions,
      timeout: 60,
      challenge: base64UrlToArrayBuffer(registrationOptions.challenge),
      user: {
        ...registrationOptions.user,
        id: stringToUTF8ByteArray(registrationOptions.user.id),
      },
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialOptions,
    });

    if (!credential) throw new Error("No credential");

    serverDatabaseProvider.register?.({
      type: "SUBMIT_PUBLIC_KEY",
      // @ts-ignore
      rawId: await base64UrlEncode(credential.rawId),
      attestationObject:
        // @ts-ignore
        await base64UrlEncode(credential.response.attestationObject),
      // @ts-ignore
      clientDataJSON: await base64UrlEncode(credential.response.clientDataJSON),
    })
      .then((response) => {
        if (!response.graphIds) {
          throw new Error("No graph ids received");
        }

        if (response.graphIds.length === 0) {
          throw new Error("No graphs available on server database");
        }
        databaseModeRef.current = DatabaseMode.SERVER;
        navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          new Map([["GRAPH_ID", response.graphIds[0]]]),
        ));
      })
      .catch((e) => {
        const disclaimer = e.message;
        setDisclaimer(disclaimer);
      });
  };


  const startLoginAttempt = async () => {
    const response = await serverDatabaseProvider.login?.({
      type: "REQUEST_CHALLENGE",
    });

    if (!response) {
      throw new Error("No response received");
    }

    // @ts-ignore
    const authnOptions = response.authnOptions;

    const publicKeyGetRequestOptions = {
      ...authnOptions,
      challenge: base64UrlToArrayBuffer(authnOptions.challenge),
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyGetRequestOptions,
    });

    // @ts-ignore
    const assertionResponse = assertion.response;

    serverDatabaseProvider.login?.({
      type: "SUBMIT_ASSERTION",
      // @ts-ignore
      rawId: await base64UrlEncode(assertion.rawId),
      response: {
        // @ts-ignore
        authenticatorData:
          await base64UrlEncode(assertionResponse.authenticatorData),
        // @ts-ignore
        clientDataJSON: await base64UrlEncode(assertionResponse.clientDataJSON),
        // @ts-ignore
        signature: await base64UrlEncode(assertionResponse.signature),
        // @ts-ignore
        userHandle: await base64UrlEncode(assertionResponse.userHandle),
      },
    })
      .then((response) => {
        if (response.graphIds.length === 0) {
          throw new Error("No graphs available on server database");
        }
        databaseModeRef.current = DatabaseMode.SERVER;
        navigate(getAppPath(
          PathTemplate.NEW_NOTE,
          new Map([["GRAPH_ID", response.graphIds[0]]]),
        ));
      })
      .catch((e) => {
        const disclaimer = e.message;
        setDisclaimer(disclaimer);
      });
  };

  if (!SERVER_DATABASE_ENABLED) {
    return <>
      <h1>{l("login.server.heading")}</h1>
      <p>{lf("login.server.no-support")}</p>
    </>;
  }


  return <>
    <h1>{l("login.server.heading")}</h1>
    {
      disclaimer === "INVALID_CREDENTIALS"
        ? <p className="error-text">
          {l("login.server.invalid-credentials")}
        </p>
        : ""
    }
    {
      disclaimer === "TOO_EARLY"
        ? <p className="error-text">
          {l("login.server.too-many-attempts")}
        </p>
        : ""
    }
    {
      disclaimer === "SERVER_ERROR"
        ? <p className="error-text">
          {l("login.server.server-error")}
        </p>
        : ""
    }
    <p>
      <button
        type="button"
        className="default-button default-action"
        onClick={startLoginAttempt}
      >{l("login.server.login-with-passkey")}</button>
    </p>
    <h2>Sign up</h2>
    <p>
      <label htmlFor="login_input_sign-up-token">
        {l("login.server.sign-up-token")}
      </label>
      <br />
      <input
        id="login_input_sign-up-token" type="text"
        value={signUpToken}
        onChange={(e) => setSignUpToken(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            startLoginAttempt();
          }
        }}
      />
    </p>
    <p>
      <button
        type="button"
        className="default-button default-action"
        onClick={addCredentials}
      >{l("login.server.create-credentials")}</button>
    </p>
  </>;
};

export default LoginViewServer;
