// code-playground feature barrel

// Components
export { CodePlayground as CodeEditor } from "./components/code-editor";

// Permissions
export { canCodePlayground as canCodePlayground, assertCodePlaygroundAccess } from "./permissions/code-playground.permissions";

// Contracts
export { createCodePlaygroundSchema, updateCodePlaygroundSchema, listCodePlaygroundQuerySchema } from "./contracts/code-playground.contract";
export type { CreateCodePlaygroundInput, UpdateCodePlaygroundInput, ListCodePlaygroundQuery } from "./contracts/code-playground.contract";

// Hooks
export {  useCodePlaygroundList, useCodePlaygroundDetail, useCodePlaygroundCreate, useCodePlaygroundUpdate, useCodePlaygroundDelete } from "./hooks/use-code-playground";

