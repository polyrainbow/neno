/*
  Ad-hoc signs the packaged macOS app, before electron-builder wraps it
  in the .dmg.

  Without this the bundle keeps the signature Electron's own binary
  ships with — linker-signed, `Identifier=Electron` — which declares
  sealed resources that the rebuilt bundle does not have:

    Sealed Resources=none
    $ codesign --verify --deep --strict NENO.app
    code has no resources but signature indicates they must be present

  A locally built app never shows this, because it carries no quarantine
  attribute and Gatekeeper never looks. A downloaded one does get
  looked at, and macOS reports the contradiction as
  "NENO is damaged and can't be opened" — which, unlike the
  "unidentified developer" refusal, offers the user no way through.

  Neither knob electron-builder exposes signs anything here:
  CSC_IDENTITY_AUTO_DISCOVERY=false and `mac.identity: null` both skip
  signing outright and leave the inherited signature in place. So the
  signature is applied here instead.

  This does not make the app pass Gatekeeper — it is ad-hoc, not
  notarized, so a downloaded copy still needs the quarantine attribute
  cleared (see README.md). It makes the bundle internally consistent,
  which turns an unworkable-around "damaged" into the ordinary
  "Apple cannot check it for malicious software".

  --deep is deprecated by Apple for signing with a real identity, but it
  remains the way to ad-hoc sign a tree of nested code in one pass, and
  the alternative — walking the frameworks and helpers inside-out by
  hand — buys nothing for a signature that carries no identity.
*/

import { execFileSync } from "node:child_process";
import path from "node:path";

export default async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") return;

  const appName = `${context.packager.appInfo.productFilename}.app`;
  const appPath = path.join(context.appOutDir, appName);

  execFileSync(
    "codesign",
    ["--force", "--deep", "--sign", "-", appPath],
    { stdio: "inherit" },
  );

  /*
    Fail the build rather than ship a bundle that will be called
    damaged: the whole point of this hook is a signature that verifies.
  */
  execFileSync(
    "codesign",
    ["--verify", "--deep", "--strict", appPath],
    { stdio: "inherit" },
  );
}
