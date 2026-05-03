# Skill Registry - senahmi-fenologic-system-with-ia

This registry catalogs specialized agent skills and project conventions to ensure consistent behavior across all sessions.

## Project Conventions

| Context | Source | Description |
|---------|--------|-------------|
| Repo Rules | [GEMINI.md](../GEMINI.md) | Senior Architecture Lead persona, mandatory approach challenge. |

## User Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| typescript | When writing TypeScript code | Strict patterns, Const Types, No any. |
| react-19 | When writing React components | React 19 patterns, no useMemo/useCallback. |
| work-unit-commits | preparing commits, implementation | Structure commits as deliverable work units. |
| judgment-day | review adversarial, dual review | Parallel adversarial review protocol. |
| branch-pr | creating a pull request | PR creation workflow following issue-first system. |
| issue-creation | creating a GitHub issue | Issue creation workflow following issue-first system. |
| comment-writer | drafting feedback, PR comments | Warm, direct, human comments for collaboration. |
| cognitive-doc-design | writing guides, READMEs, RFCs | Design documentation that reduces cognitive load. |
| gentle-ai-chained-pr | PR > 400 lines, planning PRs | Split large changes into chained/stacked PRs. |

## Compact Rules

### typescript
- **Const Types**: Create const object first, then extract type: `export const Types = { ... } as const; export type Type = keyof typeof Types;`
- **Exhaustive Switches**: Use `assertNever(x)` in default cases.
- **Strict Interfaces**: Avoid `any`, use explicit interfaces/types for all data structures.

### react-19
- **No Manual Memoization**: Do NOT use `useMemo` or `useCallback`. React Compiler handles this.
- **Server Actions**: Use `useActionState` for form handling.
- **Clean Components**: Keep components focused on UI; extract logic to hooks.

### GEMINI.md Rules
- **Challenge Approach**: Always challenge the approach before implementing.
- **SOLID/DRY**: Prioritize these principles.
- **Persona**: Act as a Senior Architecture Lead.
