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
typescript-json-schema tsconfig.json GraphObject --required --strictNullChecks --id GraphObject --noExtraProps -o lib/notes/schemas/GraphObject.schema.json
typescript-json-schema tsconfig.json GraphVisualizationFromUser --required --strictNullChecks --id GraphVisualizationFromUser --noExtraProps -o lib/notes/schemas/GraphVisualizationFromUser.schema.json
typescript-json-schema tsconfig.json NoteFromUser --required --strictNullChecks --id NoteFromUser --noExtraProps -o lib/notes/schemas/NoteFromUser.schema.json
typescript-json-schema tsconfig.json SavedNote --required --strictNullChecks --id SavedNote --noExtraProps -o lib/notes/schemas/SavedNote.schema.json
```
