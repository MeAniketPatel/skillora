import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));
vi.mock("@/features/auth/server", () => ({
  getUserById: vi.fn(),
}));
vi.mock("@/shared/lib/errors", () => ({
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor() {
      super("Unauthorized");
      this.name = "UnauthorizedError";
    }
  },
  ForbiddenError: class ForbiddenError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ForbiddenError";
    }
  },
}));

import { auth } from "@/auth";
import { cookies } from "next/headers";
import { getUserById } from "@/features/auth/server";
import {
  requireAuth,
  requireStudent,
  requireTeacher,
  requireAdmin,
} from "./auth-helpers";

const mockedAuth = vi.mocked(auth);
const mockedCookies = vi.mocked(cookies);
const mockedGetUserById = vi.mocked(getUserById);

describe("auth-helpers", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCookies.mockReset();
    mockedGetUserById.mockReset();
    // Default: cookies() resolves to a store with no impersonate cookie.
    mockedCookies.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as never);
  });

  describe("requireAuth", () => {
    it("returns the session user when authenticated", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "u1", role: "STUDENT", email: "x", name: "x" },
      } as never);
      const u = await requireAuth();
      expect(u.id).toBe("u1");
    });

    it("throws UnauthorizedError when no session", async () => {
      mockedAuth.mockResolvedValue(null);
      await expect(requireAuth()).rejects.toThrow(/Unauthorized/);
    });
  });

  describe("requireStudent", () => {
    it("allows STUDENT", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "u1", role: "STUDENT", email: "x", name: "x" },
      } as never);
      const u = await requireStudent();
      expect(u.id).toBe("u1");
    });

    it("allows ADMIN", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "admin", role: "ADMIN", email: "x", name: "x" },
      } as never);
      const u = await requireStudent();
      expect(u.id).toBe("admin");
    });

    it("throws ForbiddenError for TEACHER", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "t1", role: "TEACHER", email: "x", name: "x" },
      } as never);
      await expect(requireStudent()).rejects.toThrow(/Student access required/);
    });

    it("throws ForbiddenError for null role", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "u1", role: null, email: "x", name: "x" },
      } as never);
      await expect(requireStudent()).rejects.toThrow(/Student access required/);
    });
  });

  describe("requireTeacher", () => {
    it("allows TEACHER", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "t1", role: "TEACHER", email: "x", name: "x" },
      } as never);
      const u = await requireTeacher();
      expect(u.id).toBe("t1");
    });

    it("throws ForbiddenError for STUDENT", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "s1", role: "STUDENT", email: "x", name: "x" },
      } as never);
      await expect(requireTeacher()).rejects.toThrow(/Teacher access required/);
    });
  });

  describe("requireAdmin", () => {
    it("allows ADMIN", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "a1", role: "ADMIN", email: "x", name: "x" },
      } as never);
      const u = await requireAdmin();
      expect(u.id).toBe("a1");
    });

    it("throws ForbiddenError for non-ADMIN even with impersonation cookie", async () => {
      mockedAuth.mockResolvedValue({
        user: { id: "s1", role: "STUDENT", email: "x", name: "x" },
      } as never);
      mockedCookies.mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: "u-target" }),
      } as never);
      await expect(requireAdmin()).rejects.toThrow(/Admin access required/);
    });
  });
});
