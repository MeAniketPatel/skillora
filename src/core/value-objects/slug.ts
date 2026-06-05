export class Slug {
  private constructor(public readonly value: string) {}

  static parse(input: string): Slug {
    const normalized = input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!normalized) throw new Error("Slug cannot be empty");
    if (normalized.length > 120) throw new Error("Slug too long");
    return new Slug(normalized);
  }

  static fromTrusted(value: string): Slug {
    return new Slug(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
