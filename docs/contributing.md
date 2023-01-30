# Contributing

- [Getting Code](#getting-code)
- [General guidelines](#general-guidelines)
- [Code reviews](#code-reviews)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Adding New Dependencies](#adding-new-dependencies)
- [Writing Tests](#writing-tests)

## How to Contribute

### Getting Code

Make sure you're running Node.js 14+ and NPM 8+, to verify and upgrade NPM do:

```bash
node --version
npm --version
npm i -g npm@latest
```

1. Clone this repository

```bash
git clone https://github.com/sand4rt/csp.git
cd csp
```

2. Install dependencies

```bash
npm ci
```

3. Start development server

```bash
npm run dev
```

4. Run all tests locally. For more information about tests, read [Writing Tests](#writing-tests).

```bash
npm run test:unit
```

```bash
npm run test:e2e
```

5. Install Visual Studio Code extensions

Open Visual Studio Code and press the following key combination: `CTRL+SHIFT+P` and type 'Show Recommended Extensions' and hit `ENTER`. The extension menu opens where all workspace extension recommendations should be installed. When installed make sure to restart Visual Studio Code.

### General Guidelines

When authoring new features, consider the following:

- Favor Functional Programming over Object Oriented Programming.
- A shared vocabulary by everyone involved in a project _(the ubiquitous language)_ should also be reflected in the code.
- Provide a minimum usable version of the feature initially and build upon that while gathering functional and technical feedback.
- Important decisions are discussed and logged in Architecture Decision Record's _(ADR)_.

### Code Reviews

All submissions, require review. GitHub pull requests is used for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

### Code Style

- Coding style is fully defined in [.eslintrc.cjs](../.eslintrc.cjs)
- Comments should be generally avoided. If the code would not be understood without comments, consider re-writing the code to make it self-explanatory.

To run code linter, use:

```bash
npm run lint
```

### Commit Messages

Commit messages should follow the [Conventional Commit Messages format](https://www.conventionalcommits.org/en/v1.0.0):

```
label(namespace): title

description

footer
```

1. _label_ is one of the following:
   - `fix` - bug fixes.
   - `feat` - features.
   - `docs` - changes to docs, e.g. `docs(api.md): ..` to change documentation.
   - `test` - changes to tests infrastructure.
   - `devops` - build-related work, e.g. CI related patches and general changes to the build infrastructure
   - `chore` - everything that doesn't fall under previous categories
2. _namespace_ is put in parenthesis after label and is optional. Must be lowercase.
3. _title_ is a brief summary of changes.
4. _description_ is **optional**, new-line separated from title and is in present tense.
5. _footer_ is **optional**, new-line separated from _description_ and contains "fixes" / "references" attribution to github issues.

Example:

```
fix(worker): make sure serialization works

This patch fixes serialization in a web workers.

Fixes #123, fixes #234
```

### Adding New Dependencies

For all dependencies _(both production and development)_:

- **Do not add** a dependency if the desired functionality is easily implementable.
- If adding a dependency, it should be well-maintained and trustworthy.

A barrier for introducing new dependencies is **high**:

- **Do not add** dependencies unless it's critical to project success.

### Writing Tests

- Every feature should be accompanied by a test.
- Unit tests must be _hermetic_. They should not depend on external services.
- Testing library philosophy should be used: [The more your tests resemble the way your software is used, the more confidence they can give you](https://testing-library.com/docs/guiding-principles).
- Test files are treated as first class citizens and are located as close to the production code as possible.
