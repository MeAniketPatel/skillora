// code-playground feature barrel
export * from "./repositories";

// Components
export { CodePlayground as CodeEditor } from "./components/code-editor";
// Permissions
export { canCodePlayground as canCodePlayground, assertCodePlaygroundAccess } from "./permissions/code-playground.permissions";

// Contracts
export { createCodePlaygroundSchema, updateCodePlaygroundSchema, listCodePlaygroundQuerySchema } from "./contracts/code-playground.contract";
export type { CreateCodePlaygroundInput, UpdateCodePlaygroundInput, ListCodePlaygroundQuery } from "./contracts/code-playground.contract";

// Hooks
export {  useCodePlaygroundList, useCodePlaygroundDetail, useCodePlaygroundCreate, useCodePlaygroundUpdate, useCodePlaygroundDelete } from "./hooks/use-code-playground";


// Services
export { codePlaygroundService } from "./services/code-playground.service";
export type { CodePlaygroundService } from "./services/code-playground.service";
