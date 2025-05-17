# Contributing to Microfox AI 🦊

First off, thank you for considering contributing to Microfox AI! We appreciate your time and effort. This guide will help you understand how you can contribute to the project.

## 🏗️ Basic Repo Introduction

Microfox AI is a monorepo managed with npm workspaces and Turborepo. Key directories include:

- **`packages/` 📦**: Contains all the micor sdk packages. These are typically SDKs, API clients, or core functionalities.
  - Packages follow a pattern like `service-name` (e.g., `google-sheets`, `slack-web-tiny`)
  - Packages often have their own `__tests__` directory for unit tests.
  - Package have often their own public toolcalls (aka MCPS) at `sls` directory
  - Package complete information is at `package-info.json` and is very crucial for microfox to work.
- **`scripts/` 🔧**: Contains various ai agents, build, test, and utility scripts.
  - **`scripts/src/agents/` 🤖**: This directory houses specialized AI agents. Each subdirectory (e.g., `metafox/`, `docfox/`, `packagefox/`, `testfox/`) corresponds to an agent with a specific focus, such as metadata management, documentation processing, package operations, or test generation.
  - Contributions here could involve improving existing agent logic, adding new capabilities to an agent, or developing entirely new agents.
  - **`scripts/src/embeddings/` 🔍**: This directory is responsible for generating and managing embeddings, which are crucial for semantic search and AI understanding of the codebase.
- **`.github/` ⚙️**: Contains GitHub automations, including workflows for CI/CD and issue/PR.

Understanding this structure will help you navigate the codebase and identify where your contributions can fit.

## 🤝 How to Contribute

We welcome contributions in various forms. Here are the primary ways you can help:

### 1. 📦 Package Level Contributions

This involves working directly within the `packages/` directory.

- **Testing & Bug Fixing** 🐛:
  - **Identify Bugs**: If you find a bug in any package, please [create an issue](https://github.com/THEMOONDEVS/microfox-ai/issues/new/choose) detailing the problem, steps to reproduce, and expected behavior.
  - **Fix Bugs**: If you're able to fix a bug, fork the repository, create a branch, apply your fix, and submit a Pull Request. Ensure your PR clearly describes the problem and the solution.
  - **Improve Test Coverage**: We aim for high test coverage. You can contribute by writing new tests or improving existing ones for packages.
- **Creating `__tests__` (Unit Tests)** ✅:
  - **Location**: Unit tests for a package usually reside in a `__tests__` directory within that package (e.g., `packages/google-sheets/__tests__`).
  - **Framework**: We primarily use Jest (or a similar JavaScript testing framework). Check existing tests for patterns and best practices.
  - **Focus**: Unit tests should be focused, testing individual functions or modules in isolation. Mock dependencies where necessary.

### 2. 🤖 Agent Level Contributions (High-Level Features & Refactors)

This involves more significant changes, introducing new core functionalities. All agents are in thhe scripts/agents and follow the pattern of multiple generators, helpers, toolcalls for a single agent. all agents are designed to primarily communicate via PR/Issue comments.

- **High-Level Refactors** 🔄:
  - If you see opportunities to improve code structure, performance, or maintainability at a broader level, especially within the agent framework or shared utilities, please discuss your ideas by creating an issue first. This allows for community feedback before significant effort is invested.
- **Adding New Generative Functionalities** ✨:
  - This could involve creating new core utilities that agents can leverage, enhancing existing agent capabilities (e.g., making `docfox` understand new documentation patterns, or `testfox` generate tests for new scenarios), or adding features that benefit multiple agents.
  - **Proposal**: For substantial new features, please create a detailed proposal as an issue. Outline the problem, your proposed solution, and potential impact.
- **Developing New Specialized Agents** 🚀:
  - If you identify a new area that could benefit from AI-driven automation (e.g., a `securityfox` for vulnerability checks, an `i18nfox` for internationalization tasks, or a `uifox` for UI component generation/testing), proposing and developing a new agent is a valuable contribution.
  - Start by creating an issue to discuss the scope and feasibility of the new agent.

### 3. 📚 Documentation & Team Level Contributions

- **Open Source Management** 🌟:
  - **Improving Documentation**: This `CONTRIBUTING.md` guide, the `README.md`, or inline code documentation (TSDoc/JSDoc) can always be improved.
  - **Issue Triage**: Help us by reviewing open issues, confirming bugs, or suggesting labels.
  - **Community Support**: Answer questions in discussions or on related forums.
  - **Improving Workflows**: Suggest improvements to our CI/CD workflows in `.github/workflows/`.

## 🏷️ Contribute by Issue labels

Understanding how issues are created and labeled can help you find areas to contribute effectively.

We use labels to categorize issues and make them easier to find and understand. Here are some common labels you might see:

Contributors are welcome to [create issues](https://github.com/THEMOONDEVS/microfox-ai/issues/new/choose) for bugs they find or features they'd like to propose, many core-specific issues, especially those related to the AI agents' operations, will be take priority.

- **`bug` 🐛**: These are often good starting points for contributors looking to make impactful fixes.
- **`refactor` 🔄**: Issues with this label concern improving the existing agentic flows of the coding agents or workflows.
- **`coding agent` 🤖**: This label is used for issues related to the AI agents themselves (e.g., `metafox`, `docfox`, `packagefox`, `testfox` located in `scripts/src/agents/`). This could involve:
  - Bugs within an agent's logic.
  - Proposals for new agent capabilities.
  - Tasks for an agent to perform (e.g., an issue created by `testfox` to add specific unit tests).
  - Improvements to the agent framework or how agents are invoked and managed.
- **`documentation` 📚**: This label is for issues related to any form of documentation. This includes:
  - Improving this `CONTRIBUTING.md` guide.
  - Updating the main `README.md`.
  - Enhancing inline code comments (TSDoc/JSDoc).

### 🍴 Fork

1.  **Fork the repository**: Click the "Fork" button on the [Microfox AI GitHub page](https://github.com/THEMOONDEVS/microfox-ai).
2.  **Create a new branch**: `git checkout -b dev/feat-name/month`
3.  **Make your changes**: Write your code and add tests!
4.  **Run tests & build checks**: `npm run test` & `npm run build`
5.  **Submit a Pull Request (PR)**: Please mention the issue in the PR description

### 💅 Code Style & Conventions

- **Formatting**: We use Prettier for code formatting.
- **Linting**: Please run `npm run lint` to check if it follows the standards
- **Commit Messages**: Please follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). This helps us automate changelog generation and versioning.
  - Example: `feat(google-sheets): add support for batchGet an API`
  - Example: `fix(core): resolve issue with token caching`
  - Example: `docs(contributing): clarify example contribution process`

### 🔄 Lifecycle

1.  **Issue Creation**: Everythign starts with an issue. Provide as much detail as possible.
2.  **Discussion**: For significant changes, a maintainer will likely discuss the proposal with you in the issue comments, if it a minor, you can proceed with direct PR.
3.  **Pull Request Submission**: Once you're ready to submit your code, create a PR.
    - Link the PR to any relevant issues (e.g., "Closes #123").
    - Provide a clear description of the changes.
4.  **Review**: Maintainers will review your PR. They may ask for changes or provide feedback.
5.  **Merging**: Once the PR is approved and passes all checks, it will be merged.

## ❓ Questions?

If you have any questions, feel free to ask by creating an issue or joining & communicating in our [discord](https://discord.gg/HAFDjqA2Jb).

Thank you for contributing to Microfox AI! 🙏
