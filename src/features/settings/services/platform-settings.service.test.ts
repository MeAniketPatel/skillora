import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/shared/lib/prisma", () => ({
  default: {
    platformSetting: {
      findUnique: vi.fn(),
    },
  },
}));

import db from "@/shared/lib/prisma";
import { getPlatformSetting, getPlatformFeePercentage } from "./platform-settings.service";
import {
  PLATFORM_SETTINGS_DEFAULTS,
  PLATFORM_SETTINGS_KEYS,
} from "@/shared/constants/platform-settings";

const mockedFindUnique = vi.mocked(db.platformSetting.findUnique);

describe("getPlatformSetting", () => {
  beforeEach(() => {
    mockedFindUnique.mockReset();
  });

  it("returns the stored value when present", async () => {
    mockedFindUnique.mockResolvedValue({ value: "42" } as never);
    expect(await getPlatformSetting(PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE)).toBe(
      "42",
    );
    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { key: PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE },
    });
  });

  it("falls back to the default when the row is missing", async () => {
    mockedFindUnique.mockResolvedValue(null);
    const value = await getPlatformSetting(PLATFORM_SETTINGS_KEYS.SITE_NAME);
    expect(value).toBe(PLATFORM_SETTINGS_DEFAULTS[PLATFORM_SETTINGS_KEYS.SITE_NAME]);
  });
});

describe("getPlatformFeePercentage", () => {
  beforeEach(() => {
    mockedFindUnique.mockReset();
  });

  it("returns the stored value as a finite number in [0, 100]", async () => {
    mockedFindUnique.mockResolvedValue({ value: "12.5" } as never);
    expect(await getPlatformFeePercentage()).toBe(12.5);
  });

  it("falls back to default when the row is missing", async () => {
    mockedFindUnique.mockResolvedValue(null);
    expect(await getPlatformFeePercentage()).toBe(
      Number(
        PLATFORM_SETTINGS_DEFAULTS[PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE],
      ),
    );
  });

  it("falls back to default when the stored value is not a number", async () => {
    mockedFindUnique.mockResolvedValue({ value: "abc" } as never);
    expect(await getPlatformFeePercentage()).toBe(
      Number(
        PLATFORM_SETTINGS_DEFAULTS[PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE],
      ),
    );
  });

  it("falls back to default when the stored value is negative", async () => {
    mockedFindUnique.mockResolvedValue({ value: "-5" } as never);
    expect(await getPlatformFeePercentage()).toBe(
      Number(
        PLATFORM_SETTINGS_DEFAULTS[PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE],
      ),
    );
  });

  it("falls back to default when the stored value is above 100", async () => {
    mockedFindUnique.mockResolvedValue({ value: "150" } as never);
    expect(await getPlatformFeePercentage()).toBe(
      Number(
        PLATFORM_SETTINGS_DEFAULTS[PLATFORM_SETTINGS_KEYS.PLATFORM_FEE_PERCENTAGE],
      ),
    );
  });
});
