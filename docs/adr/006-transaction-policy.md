# ADR 006: Transaction Policy

## Status
Accepted

## Context
Prisma's `$transaction` API can be called from any layer. Without a clear policy, transactions get scattered across actions, repositories, and services, making atomicity hard to reason about.

## Decision
**Services are the sole owners of transactions.**

| Layer | Transaction Ownership |
|---|---|
| Repositories | ❌ No transactions. Single atomic queries only. |
| Services | ✅ Sole owner. `prisma.$transaction(async tx => { ... })` lives here. |
| Actions | ❌ Never. Delegate to services. |

This means repositories should never import `db.$transaction`, and actions should never call it either.

## Consequences
- **Positive:** All multi-statement atomicity flows through the service layer.
- **Positive:** Test mocks of repositories don't need to mock transactions.
- **Negative:** Slightly more boilerplate when wrapping a single repo call in a transaction.
