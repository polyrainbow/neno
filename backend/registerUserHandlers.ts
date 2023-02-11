import * as config from "./config.js";
import express from "express";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";
import * as logger from "./lib/logger.js";
import * as Users from "./users.js";
import { ExpectedAssertionResult, ExpectedAttestationResult, Fido2Lib } from "fido2-lib";
import { toArrayBuffer } from "./lib/utils.js";
import BruteForcePreventer from "./BruteForcePreventer.js";

export default (
  app,
  sessionMiddleware,
  verifyUser,
  handleJSONParseErrors,
  sessionCookieName,
  getGraphIdsForUser,
) => {
  const bruteForcePreventer = new BruteForcePreventer();

  const f2l = new Fido2Lib({
    timeout: 60,
    rpId: config.RELYING_PARTY,
    rpName: "NENO",
    rpIcon: `${config.ORIGIN}/assets/app-icon/logo.svg`,
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "required"
  });

  const handleUnsuccessfulLoginAttempt = (req, res) => {
    logger.verbose("Unsuccessful login attempt");
    logger.verbose(`User: ${req.body.username}`);
    logger.verbose(`IP: ${req.socket.remoteAddress}`);

    bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

    const response: APIResponse = {
      success: false,
      error: APIError.INVALID_CREDENTIALS,
    };
    return res.status(401).json(response);
  };

  app.post(
    config.USER_ENDOPINT + "authenticated",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const response: APIResponse = {
        success: true,
        payload: {
          graphIds: await getGraphIdsForUser(req.userId),
        },
      };
      res.json(response);
    },
  );


  app.post(
    config.USER_ENDOPINT + "logout",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const response: APIResponse = {
        success: true,
      };

      logger.verbose(`Logout: ${req.userId}`);

      await new Promise((resolve, reject) => {
        req.session.destroy(function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      });

      return res
        .status(200)
        .clearCookie(
          sessionCookieName,
        )
        .json(response);
    },
  );


  enum LoginRequestType {
    REQUEST_CHALLENGE = "REQUEST_CHALLENGE",
    SUBMIT_ASSERTION = "SUBMIT_ASSERTION",
  }


  app.post(
    config.USER_ENDOPINT + 'login',
    sessionMiddleware,
    express.json(),
    handleJSONParseErrors,
    async (req, res) => {
      const remoteAddress = req.socket.remoteAddress;
      // remote address may be undefined if the client has disconnected
      if (typeof remoteAddress !== "string") {
        return;
      }

      const type = req.body.type as LoginRequestType;

      if (!bruteForcePreventer.isLoginAttemptLegit(remoteAddress)) {
        logger.verbose(
          `Login request denied due to brute force prevention. IP: ${remoteAddress}`
        );

        const response: APIResponse = {
          success: false,
          error: APIError.TOO_EARLY,
        };
        return res.status(425).json(response);
      }

      if (type === LoginRequestType.REQUEST_CHALLENGE) {
        const authnOptions = await f2l.assertionOptions();

        // this modification of the session object initializes the session and
        // makes express-session set the cookie
        req.session.userAgent = req.headers["user-agent"];
        req.session.userPlatform = req.headers["sec-ch-ua-platform"];
        req.session.challenge = Buffer.from(authnOptions.challenge).toString("base64url");

        const response: APIResponse = {
          success: true,
          payload: {
            authnOptions: {
              ...authnOptions,
              challenge: Buffer.from(authnOptions.challenge).toString("base64url"),
            },
          },
        };
  
        return res.status(200).json(response);
      } else if (type === LoginRequestType.SUBMIT_ASSERTION) {
        const clientResponse = req.body.response;

        const userId = Buffer.from(clientResponse.userHandle, "base64url")
          .toString();

        const user = await Users.find((user) => {
          return user.id === userId;
        });

        if (!user) {
          return handleUnsuccessfulLoginAttempt(req, res);
        }

        const clientAssertionResponse = {
          rawId: toArrayBuffer(Buffer.from(req.body.rawId, "base64url")),
          response: {
            signature: clientResponse.signature,
            clientDataJSON: clientResponse.clientDataJSON,
            authenticatorData: clientResponse.authenticatorData,
          },
        };

        for (let i = 0; i < user.credentials.length; i++) {
          const assertionExpectations: ExpectedAssertionResult = {
            challenge: req.session.challenge,
            origin: config.ORIGIN,
            factor: "either",
            publicKey: user.credentials[i].pubKey,
            prevCounter: user.credentials[i].prevCounter,
            userHandle: null,
          };
        
          try {
            await f2l.assertionResult(
              clientAssertionResponse,
              assertionExpectations,
            );

            req.session.userId = user.id;
            req.session.challenge = null;
            req.session.loggedIn = true;
        
            bruteForcePreventer.successfulLogin(remoteAddress);

            const response: APIResponse = {
              success: true,
              payload: {
                graphIds: user.graphIds,
              },
            };
      
            return res.status(200).json(response);
          } catch (e) {
            continue;
          }
        }

        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };

        return res.status(406).json(response);
      }
    },
  );


  enum RegisterRequestType {
    REQUEST_CHALLENGE = "REQUEST_CHALLENGE",
    SUBMIT_PUBLIC_KEY = "SUBMIT_PUBLIC_KEY",
  }

  /*
    this register handler handles WebAuthn registration requests.
    this is a 4-step process:

    1. client calls this endpoint with a registration request and a
    sign-up token (type="request-challenge")
    2. server recognizes that the sign-up token is associated with a certain
    user and sends a webauthn challenge to the client:
    "You want to register your device for user Alice, so please create a public
    key with this challenge."
    3. client creates credentials and sends public key to server
      (type="submit-public-key")
    4. server saves public key.
  */
  app.post(
    config.USER_ENDOPINT + 'register',
    sessionMiddleware,
    express.json(),
    handleJSONParseErrors,
    async (req, res) => {
      const type = req.body.type as RegisterRequestType;

      const remoteAddress = req.socket.remoteAddress;
      // remote address may be undefined if the client has disconnected
      if (typeof remoteAddress !== "string") {
        return;
      }

      if (!bruteForcePreventer.isLoginAttemptLegit(remoteAddress)) {
        logger.verbose(
          `Login request denied due to brute force prevention. IP: ${remoteAddress}`
        );

        const response: APIResponse = {
          success: false,
          error: APIError.TOO_EARLY,
        };
        return res.status(425).json(response);
      }

      if (type === RegisterRequestType.REQUEST_CHALLENGE) {
        const signUpToken = req.body.signUpToken;

        if (!signUpToken) {
          bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_CREDENTIALS,
          };

          return res.status(401).json(response);
        }

        const user = await Users.find((user) => {
          return user.signUpTokens.includes(signUpToken);
        });

        if (!user) {
          bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_CREDENTIALS,
          };

          return res.status(401).json(response);
        }

        const registrationOptions = await f2l.attestationOptions();
        registrationOptions.user.id = user.id;
        registrationOptions.user.name = user.name;
        registrationOptions.user.displayName = user.name;

        // this modification of the session object initializes the session and
        // makes express-session set the cookie
        req.session.userId = user.id;
        req.session.userAgent = req.headers["user-agent"];
        req.session.userPlatform = req.headers["sec-ch-ua-platform"];
        req.session.challenge = Buffer.from(registrationOptions.challenge).toString("base64url");
        req.session.loggedIn = false;

        const response: APIResponse = {
          success: true,
          payload: {
            registrationOptions: {
              ...registrationOptions,
              challenge: Buffer.from(registrationOptions.challenge).toString("base64url"),
            },
          },
        };

        return res.status(200).json(response);
      } else if (type === RegisterRequestType.SUBMIT_PUBLIC_KEY) {
        if (typeof req.body.clientDataJSON !== "string") return;
        if (typeof req.body.attestationObject !== "string") return;
  
        const challenge = req.session.challenge;

        const attestationExpectations: ExpectedAttestationResult = {
          challenge,
          origin: config.ORIGIN,
          factor: "either"
        };

        const attestationResult = {
          rawId: toArrayBuffer(Buffer.from(req.body.rawId, "base64url")),
          response: {
            clientDataJSON: req.body.clientDataJSON as string,
            attestationObject: req.body.attestationObject as string,
          },
        };

        try {
          const regResult = await f2l.attestationResult(
            attestationResult,
            attestationExpectations,
          );

          req.session.challenge = null;
          req.session.loggedIn = true;

          logger.verbose(
            `Successful login: ${req.session.userId} IP: ${remoteAddress}`,
          );
          bruteForcePreventer.successfulLogin(remoteAddress);

          const user = await Users.find((user) => {
            return user.id === req.session.userId;
          });

          if (!user) {
            bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);
  
            const response: APIResponse = {
              success: false,
              error: APIError.INVALID_CREDENTIALS,
            };
  
            return res.status(401).json(response);
          }

          Users.addCredentials(
            user.id,
            {
              pubKey: regResult.authnrData.get("credentialPublicKeyPem"),
              prevCounter: 0,
            },
          );

          const response: APIResponse = {
            success: true,
            payload: {
              graphIds: user.graphIds,
            },
          };
  
          return res.status(200).json(response);
        } catch (e) {
          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };

          await new Promise((resolve, reject) => {
            req.session.destroy(function(err) {
              if (err) {
                reject(err);
              } else {
                resolve(null);
              }
            });
          });
    
          return res.status(406)
            .clearCookie(
              sessionCookieName,
            )
            .json(response);
        }
      } else {
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };

        await new Promise((resolve, reject) => {
          req.session.destroy(function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(null);
            }
          });
        });
  
        return res.status(406)
          .clearCookie(
            sessionCookieName,
          )
          .json(response);
      }
    },
  );


};