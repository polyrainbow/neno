# Developer Notes

## Architecture Overview

![Architecture Overview](./img/architecture%20overview.png)

## Server Database Folder Structure

![Server Database Folder Structure](./img/database%20folder%20structure.png)

## Updating JSON schemas of Notes modules

```
(sudo) npm i typescript-json-schema tslib -g

# In project directory
typescript-json-schema tsconfig.json NoteFromUser --required --strictNullChecks --id NoteFromUser --noExtraProps
typescript-json-schema tsconfig.json GraphVisualizationFromUser --required --strictNullChecks --id GraphVisualizationFromUser --noExtraProps
```
