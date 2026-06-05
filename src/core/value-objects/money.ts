export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    if (Number.isNaN(amount) || amount < 0) {
      throw new Error(`Invalid money amount: ${amount}`);
    }
    if (!currency || currency.length !== 3) {
      throw new Error(`Invalid currency code: ${currency}`);
    }
  }

  static USD(amount: number): Money {
    return new Money(amount, "USD");
  }

  static of(amount: number, currency: string): Money {
    return new Money(amount, currency.toUpperCase());
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) throw new Error("Factor must be non-negative");
    return new Money(this.amount * factor, this.currency);
  }

  toCents(): number {
    return Math.round(this.amount * 100);
  }

  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  private assertSameCurrency(other: Money) {
    if (other.currency !== this.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}
