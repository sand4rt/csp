# Architecture Decision Record (ADR) log

## ADR001: Domain layer in Zod

### Context

There is a lot of validation to be done in this application because files are being uploaded that can contain literally anything. It is a lot of work and error-prone to validate everything manually.

### Decision

[Zod](https://zod.dev) is used to describe validation and business rules instead of writing this manually in Plain Old JavaScript Objects _(POJO)_. With Zod you write much less code and it will create better types.

### Consequences

- Domain layer is heavily dependent on a library. This makes it expensive to migrate away from, if not handled responsibly.
- Learning curve and developers probably have to learn a new library.

## ADR002: Playwright for all testing types _(multi language)_

### Context

Testing whether the application works is done very often. To save a lot of time it is important that this feedback loop is as quick and reliable as possible.

### Decision

[Playwright](https://playwright.dev) is known for its speed and reliability and is used for all types of tests such as end-to-end, integration and unit tests, even if the test is written in a language other than JavaScript.

### Consequences

- Playwright is still quite new.
- Single point of failure.

## ADR003: Web worker for performance

### Context

When processing large files, the browser crashes because JavaScript has only one single thread and cannot handle this type of load out of the box.

### Decision

[Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) are used to make use of multi-core processing. This ensures processing of large files _(100k+ records)_ is faster and the browser will not crash.

### Consequences

- The domain layer needs to be executed in a Web Worker.
- The data that needs to be processed in a web worker must be converted to a string and parsed back to JSON.

## ADR004: Tailwind CSS framework

### Context

Make the application layout consistent and allow backend developers to write CSS in a less error-prone way when needed.

### Decision

[Tailwind](https://tailwindcss.com) is used to define the styling of the application. This means you don't have to use CSS modules or Styled Components anymore.

### Consequences

- HTML becomes more verbose.
- Small learning curve.

## ADR005: Vite build tool

### Context

Building and verifying if something works is extremely often done during development. To save a lot of time it is important that this feedback loop is as quick as possible.

### Decision

[Vite](https://vitejs.dev) is used because it is blazingly fast and easy to use. It is becoming an industry standard and is possible to import and use web workers in a simple way.

### Consequences

- Some older libraries are more difficult to integrate and build with Vite.
