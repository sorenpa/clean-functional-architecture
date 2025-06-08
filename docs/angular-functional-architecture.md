# Clean Functional Architecture vs Angular DI

A concise comparison between Angular’s built-in class-based Dependency Injection system and a minimal, functional architecture based on closures, prop injection, and RxJS.

---

## 🌳 Angular DI: Class-Based, Framework-Centric

- Services are **classes** annotated with `@Injectable()`.
- Angular instantiates and injects services based on **module/provider** configuration.
- Lifecycle hooks (`ngOnInit`, etc.) often trigger logic.
- **Side effects can be hidden** inside lifecycle methods or constructor logic.
- Testing requires Angular’s TestBed and mock modules.

---

## 🧠 Clean Functional Architecture: Closure-Based, Framework-Agnostic

- Services are **factories (closures)** that return behavior and state.
- Dependency Injection is done through **composition roots**.
- Dependencies are passed as **plain props** (e.g. in server-side React).
- **Side effects only happen when functions are explicitly called**.
- No decorators, no DI container, no framework coupling.
- Fully testable using plain JavaScript/TypeScript and mocking.

---

## 🔁 Side Effects: Visibility & Control

|                  | Angular DI (Class-Based)    | Clean FP Architecture     |
| ---------------- | --------------------------- | ------------------------- |
| Trigger Location | Constructor / ngOnInit      | Explicit call site        |
| Control          | Framework handles lifecycle | You control lifecycle     |
| Testability      | Requires Angular tools      | Works with pure functions |
| Coupling         | Bound to Angular            | Framework-agnostic        |

---

## 🧩 Composability & Flexibility

- Angular DI restricts service composition to DI container rules.
  - Cannot easily `new ServiceA(serviceB)` manually.
  - Inheritance, hierarchy, and injector scopes add complexity.
- FP-style services are **composed like functions**.
  - Easy to override, mock, or nest.
  - Ideal for feature modules, SSR/CSR parity, or multi-platform codebases.

---

## 🧾 Declarative vs Imperative DI

| Angular DI              | Clean FP DI                      |
| ----------------------- | -------------------------------- |
| Uses decorators         | Uses function factories          |
| Framework resolves tree | Developer composes explicitly    |
| Tied to lifecycle hooks | Works independently of lifecycle |
| Implicit service graph  | Explicit dependency graph        |

---

## ✅ Summary

Clean Functional Architecture offers:

- Full control over instantiation and side effects
- Better testability without special tooling
- Clear separation between logic and UI
- Flexibility to share logic across frameworks (React, Angular, Node)
- RxJS for expressive, composable state management

> A minimal, composable architecture rooted in closures, contracts, and prop injection — not containers.
