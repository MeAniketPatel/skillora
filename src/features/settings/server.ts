// Server-only barrel. Import this from server actions, route handlers,
// server components, and middleware. NEVER import from "use client" files.

// Repository functions
export { getSetting, setSetting, getAllSettings } from "./repositories/settings.repository";

// Service

// Service
import { settingsService as service } from "./services/settings.service";
export { service };

export * from './index';
