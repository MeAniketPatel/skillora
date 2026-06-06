// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

import { marketingService as service } from "./services/marketing.service";
export { service };

export * from './index';
