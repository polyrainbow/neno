# Developer Notes

## Publishing a release

1. Run `node tools/updateVersion.js {major,minor,patch}`
2. Commit this with the commit message `release: vX.Y.Z` (replace X.Y.Z with actual version number)
3. Add a tag to this commit: `git tag vX.Y.Z`
4. Push commit to remote (if required via PR)
5. Push tag to remote: `git push origin vX.Y.Z`

The release package will now be built remotely with the script 
`tools/buildReleasePackage.sh`

## Commit convention
See https://www.conventionalcommits.org/en/v1.0.0/