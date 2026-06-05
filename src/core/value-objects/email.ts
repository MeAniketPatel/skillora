const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private constructor(public readonly value: string) {}

  static parse(input: string): Email {
    const trimmed = input.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      throw new Error(`Invalid email: ${input}`);
    }
    return new Email(trimmed);
  }

  static fromTrusted(value: string): Email {
    return new Email(value);
  }

  domain(): string {
    return this.value.split("@")[1] ?? "";
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
