# Developer Notes

## Publishing a release

1. Run `node tools/updateVersion.js {major,minor,patch}`
2. Commit this with the commit message `release: vX.Y.Z` (replace X.Y.Z with actual version number)
3. Add a tag to this commit: `git tag vX.Y.Z`
4. Push commit to remote (if required via PR)
5. Push tag to remote: `git push origin vX.Y.Z`

The release package will now be built remotely with the script 
`tools/buildReleasePackage.sh`

## Known issues

- Dots in the URL (e.g. in a slug) stop Vite from using History API fallback https://github.com/vitejs/vite/issues/2415 This prevents files being opened directly via
a URL.
- Some URLs are not parsed correctly by the editor. There is an open Lexical issue & an open PR for this: https://github.com/facebook/lexical/issues/3546 and https://github.com/facebook/lexical/pull/4430 When the fix is released, check if we still need our customized version of `AutoLinkNode` due to our transclusion nodes, or if we can just use the fixed upstream version.