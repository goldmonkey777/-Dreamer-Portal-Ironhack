# DreamerPortal MVP Roadmap

## Core Governance (immutable)

- `Docs/MANIFESTO.md` is the immutable core charter
- Every new feature must declare compatibility with the lifecycle:
	- Dream -> Interpretation -> Insight -> Action
- Raw dream record is immutable post-creation
- AI interpretation is non-deterministic and symbolic by policy
- Interpretation layers are append-only history

## Phase 1 - Core Foundation (done)

- Modular backend by domain (`auth`, `projects`, `dreams`, `tasks`)
- Service-layer business logic with thin controllers
- Ownership isolation (`owner` filter in all private reads/writes)
- Soft delete in key domain entities (`deletedAt`)
- AI-ready `analysis` object in Dream model
- React frontend with auth, dashboard, and project detail tabs

## Phase 2 - Product Hardening

- Add refresh token flow
- Add integration tests for private route ownership
- Add centralized request logging strategy
- Improve UI design system and feedback states

## Phase 3 - Expansion

- Internal event bus for `dream.created`
- AI analysis worker pipeline
- Pattern analytics dashboard
- Workspace layer for multi-tenant evolution
