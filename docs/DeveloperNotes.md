# Developer Notes

## Architecture Overview

![Architecture Overview](./img/architecture%20overview.png)

## Server Database Folder Structure

![Server Database Folder Structure](./img/database%20folder%20structure.png)

## Updating JSON schemas of Notes module

This needs to be done when Typescript interfaces of the Notes module have been
changed.

```
(sudo) npm i typescript-json-schema tslib -g

# In project directory
typescript-json-schema "lib/notes/interfaces/Graph.ts" GraphObject --required --strictNullChecks --id GraphObject --noExtraProps -o lib/notes/schemas/GraphObject.schema.json
typescript-json-schema "lib/notes/interfaces/GraphVisualizationFromUser.ts" GraphVisualizationFromUser --required --strictNullChecks --id GraphVisualizationFromUser --noExtraProps -o lib/notes/schemas/GraphVisualizationFromUser.schema.json
typescript-json-schema "lib/notes/interfaces/NoteFromUser.ts" NoteFromUser --required --strictNullChecks --id NoteFromUser --noExtraProps -o lib/notes/schemas/NoteFromUser.schema.json
typescript-json-schema "lib/notes/interfaces/SavedNote.ts" SavedNote --required --strictNullChecks --id SavedNote --noExtraProps -o lib/notes/schemas/SavedNote.schema.json
```

## Publishing a release

1. Update the version number in the `package.json`
2. Commit this with the commit message `release: vX.Y.Z` (replace X.Y.Z with actual version number)
3. Add a tag to this commit: `git tag vX.Y.Z`
4. Push commit to remote (if required via PR)
5. Push tag to remote: `git push origin vX.Y.Z`

The release package will now be built remotely with the script 
`tools/buildReleasePackage.sh`