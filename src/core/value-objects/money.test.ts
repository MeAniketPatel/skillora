import { describe, it, expect } from "vitest";
import { Money } from "./money";

describe("Money", () => {
  describe("USD factory", () => {
    it("accepts zero and positive numbers", () => {
      expect(Money.USD(0).amount).toBe(0);
      expect(Money.USD(12.34).amount).toBe(12.34);
      expect(Money.USD(999999).amount).toBe(999999);
      expect(Money.USD(0).currency).toBe("USD");
    });

    it("rejects NaN", () => {
      expect(() => Money.USD(Number.NaN)).toThrow(/Invalid money amount/);
    });

    it("rejects positive Infinity", () => {
      expect(() => Money.USD(Number.POSITIVE_INFINITY)).toThrow(
        /Invalid money amount/,
      );
    });

    it("rejects negative Infinity", () => {
      expect(() => Money.USD(Number.NEGATIVE_INFINITY)).toThrow(
        /Invalid money amount/,
      );
    });

    it("rejects negative numbers", () => {
      expect(() => Money.USD(-1)).toThrow(/Invalid money amount/);
    });
  });

  describe("of factory", () => {
    it("normalizes currency to upper case", () => {
      expect(Money.of(10, "eur").currency).toBe("EUR");
    });

    it("rejects invalid currency codes", () => {
      expect(() => Money.of(10, "EURO")).toThrow(/Invalid currency code/);
      expect(() => Money.of(10, "")).toThrow(/Invalid currency code/);
    });
  });

  describe("multiply", () => {
    it("multiplies by positive factor", () => {
      const m = Money.USD(100);
      const r = m.multiply(0.15);
      expect(r.amount).toBe(15);
      expect(r.currency).toBe("USD");
    });

    it("rejects NaN factor", () => {
      const m = Money.USD(100);
      expect(() => m.multiply(Number.NaN)).toThrow(/Factor must be a finite/);
    });

    it("rejects positive Infinity factor", () => {
      const m = Money.USD(100);
      expect(() => m.multiply(Number.POSITIVE_INFINITY)).toThrow(
        /Factor must be a finite/,
      );
    });

    it("rejects negative Infinity factor", () => {
      const m = Money.USD(100);
      expect(() => m.multiply(Number.NEGATIVE_INFINITY)).toThrow(
        /Factor must be a finite/,
      );
    });

    it("rejects negative factor", () => {
      const m = Money.USD(100);
      expect(() => m.multiply(-0.5)).toThrow(/non-negative/);
    });
  });

  describe("arithmetic", () => {
    it("adds two Money values", () => {
      expect(Money.USD(10).add(Money.USD(5)).amount).toBe(15);
    });

    it("rejects mismatched currencies on add", () => {
      expect(() => Money.USD(10).add(Money.of(5, "EUR"))).toThrow(
        /Currency mismatch/,
      );
    });
  });

  describe("helpers", () => {
    it("toCents rounds to the nearest cent", () => {
      expect(Money.USD(12.345).toCents()).toBe(1235);
      expect(Money.USD(12.34).toCents()).toBe(1234);
    });

    it("toString includes currency", () => {
      expect(Money.USD(12.5).toString()).toContain("USD");
      expect(Money.USD(12.5).toString()).toContain("12.50");
    });
  });
});
