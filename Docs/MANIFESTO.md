# Dreamy Portal Core Charter (Immutable)

## Purpose
This charter defines the non-negotiable rules of the Dreamy Portal core. Features can evolve, but these laws cannot be broken.

## Core Laws

1. **Universal Lifecycle**
   - Every core flow follows: `Dream -> Interpretation -> Insight -> Action`.
   - Any new module must map explicitly to this lifecycle.

2. **AI Neutrality**
   - AI outputs are suggestive and symbolic.
   - The system must never present deterministic truth, diagnosis, or future prediction.

3. **User Sovereignty**
   - The user owns the final meaning.
   - Interpretations can be accepted, ignored, or revisited.

4. **Immutable Raw Dream Record**
   - Original dream content is never overwritten after creation.
   - New interpretations are derived layers.

5. **Symbolic Layers Are Extensions**
   - Jungian, tarot, mythological, spiritual, and other lenses are optional interpretation layers.
   - The dream record remains the core source.

6. **Extensible Core Boundary**
   - New capabilities (sleep sensors, multimodal AI, astrology, etc.) must plug into the core, not mutate it.

7. **Multiple Interpretations**
   - A single dream can have multiple interpretation layers over time.
   - Historical interpretation trace must be preserved.

8. **Temporal Context**
   - Interpretation should consider recurring patterns and prior records when possible.

9. **Absolute Privacy Principle**
   - Dream data is sensitive by default.
   - Consent, control, and deletion capabilities are mandatory roadmap commitments.

10. **Portal Metaphor Consistency**
   - UX, motion, and branding should reinforce the "inner portal" concept.

## Implementation Contracts

- **Domain contract:** raw dream fields are immutable post-creation.
- **Analysis contract:** interpretation output must include disclaimer and non-absolute wording.
- **Sovereignty contract:** each analysis includes user decision state (`pending|accepted|ignored`).
- **History contract:** interpretation layers are append-only with timestamps.
- **Feature-gate contract:** no feature merges without lifecycle compatibility statement.

## Change Policy
Any change that violates one of these laws is considered a breaking conceptual change and must be rejected.
