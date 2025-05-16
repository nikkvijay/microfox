# Contributing to Microfox AI

First off, thank you for considering contributing to Microfox AI! We appreciate your time and effort. This guide will help you understand how you can contribute to the project.

## Project Structure Overview

Microfox AI is a monorepo managed with npm/pnpm workspaces and Turborepo. Key directories include:

- **`packages/`**: Contains all the individual publishable packages. These are typically SDKs, API clients, or core functionalities.
  - Many packages follow a pattern like `service-name` (e.g., `google-sheets`, `slack-web-tiny`) or `service-name-feature` (e.g., `instagram-fb-business-oauth`).
  - Packages often have their own `__tests__` directory for unit tests.
  - Package have often their own public toolcalls (aka MCPS) at `sls` directory
  - Package complete information is at `package-info.json` and is very crucial for microfox to work.
- **`scripts/`**: Contains various ai agents, build, test, and utility scripts.
  - The primary source code for these scripts is usually within `scripts/src/`.
  - **`scripts/src/agents/`**: This directory houses specialized AI agents. Each subdirectory (e.g., `metafox/`, `docfox/`, `packagefox/`, `testfox/`) corresponds to an agent with a specific focus, such as metadata management, documentation processing, package operations, or test generation. Contributions here could involve improving existing agent logic, adding new capabilities to an agent, or developing entirely new agents.
  - **`scripts/src/embeddings/`**: This directory is responsible for generating and managing embeddings, which are crucial for semantic search and AI understanding of the codebase. It includes scripts for creating embeddings from documentation and API specifications (e.g., `embedDocs.ts`, `queryApis.ts`), Contributions could involve enhancing embedding generation processes, supporting new content types for embeddings, or optimizing embedding storage and retrieval.
- ## **`.github/`**: Contains GitHub-specific automations, including workflows for CI/CD and issue/PR templates.

Understanding this structure will help you navigate the codebase and identify where your contributions can fit.

## How to Contribute

We welcome contributions in various forms. Here are the primary ways you can help:

### 1. Package Level Contributions

This involves working directly within the `packages/` directory.

- **Testing & Bug Fixing**:
  - **Identify Bugs**: If you find a bug in any package, please [create an issue](https://github.com/THEMOONDEVS/microfox-ai/issues/new/choose) detailing the problem, steps to reproduce, and expected behavior.
  - **Fix Bugs**: If you're able to fix a bug, fork the repository, create a branch, apply your fix, and submit a Pull Request. Ensure your PR clearly describes the problem and the solution.
  - **Improve Test Coverage**: We aim for high test coverage. You can contribute by writing new tests or improving existing ones for packages.
- **Creating `__tests__` (Unit Tests)**:
  - **Location**: Unit tests for a package usually reside in a `__tests__` directory within that package (e.g., `packages/google-sheets/__tests__`).
  - **Framework**: We primarily use Jest (or a similar JavaScript testing framework). Check existing tests for patterns and best practices.
  - **Focus**: Unit tests should be focused, testing individual functions or modules in isolation. Mock dependencies where necessary.

### 2. Agent Level Contributions (High-Level Features & Refactors)

This involves more significant changes, introducing new core functionalities. All agents are in thhe scripts/agents and follow the pattern of multiple generators, helpers, toolcalls for a single agent. all agents are designed to primarily communicate via PR/Issue comments.

- **High-Level Refactors**:
  - If you see opportunities to improve code structure, performance, or maintainability at a broader level, especially within the agent framework or shared utilities, please discuss your ideas by creating an issue first. This allows for community feedback before significant effort is invested.
- **Adding New Generative Functionalities**:
  - This could involve creating new core utilities that agents can leverage, enhancing existing agent capabilities (e.g., making `docfox` understand new documentation patterns, or `testfox` generate tests for new scenarios), or adding features that benefit multiple agents.
  - **Proposal**: For substantial new features, please create a detailed proposal as an issue. Outline the problem, your proposed solution, and potential impact.
- **Developing New Specialized Agents**:
  - If you identify a new area that could benefit from AI-driven automation (e.g., a `securityfox` for vulnerability checks, an `i18nfox` for internationalization tasks, or a `uifox` for UI component generation/testing), proposing and developing a new agent is a valuable contribution.
  - Start by creating an issue to discuss the scope and feasibility of the new agent.
- **Integrating Advanced AI Models & Techniques**:
  - Enhancing agents by incorporating newer or more powerful AI models (e.g., different LLMs, specialized models for code, documentation, or specific domains).
  - Exploring and implementing advanced techniques like reinforcement learning for agent self-improvement, or more sophisticated Natural Language Processing (NLP) for better understanding and generation.
- **Improving Agent Orchestration & Inter-communication**:
  - For tasks that require multiple agents to collaborate, contributions to improve how agents are orchestrated, how they communicate, or how they share context would be beneficial.
  - This could involve working on a common agent framework or messaging system.
- **Enhancing Agent Tooling and Integration Capabilities**:
  - Improving the ability of agents to interact with other developer tools, APIs, or data sources.
  - Adding support for new tools that agents can leverage to perform their tasks more effectively.

### 3. Documentation & Team Level Contributions

- **Open Source Management**:
  - **Improving Documentation**: This `CONTRIBUTING.md` guide, the `README.md`, or inline code documentation (TSDoc/JSDoc) can always be improved.
  - **Issue Triage**: Help us by reviewing open issues, confirming bugs, or suggesting labels.
  - **Community Support**: Answer questions in discussions or on related forums.
  - **Improving Workflows**: Suggest improvements to our CI/CD workflows in `.github/workflows/`.

## Issue Creation and Labels

Understanding how issues are created and labeled can help you find areas to contribute effectively.

**Issue Creation (Primarily by Admins/Maintainers):**

New issues are typically created by project administrators or maintainers when:

- A new feature is planned.
- A bug is reported or discovered internally.
- A specific task needs to be tracked (e.g., refactoring a module, updating documentation).
- An AI agent (like `testfox` or `docfox`) identifies a need for code changes, documentation updates, or test generation.

While contributors are welcome to [create issues](https://github.com/THEMOONDEVS/microfox-ai/issues/new/choose) for bugs they find or features they'd like to propose, many core-specific issues, especially those related to the AI agents' operations, will be initiated by the core team.

**Understanding Issue Labels:**

We use labels to categorize issues and make them easier to find and understand. Here are some common labels you might see:

- **`bug`**: This label indicates that the issue is related to a bug or an unexpected problem in the codebase. These are often good starting points for contributors looking to make impactful fixes.
- **`refactor`**: Issues with this label concern improving the existing codebase. This could involve restructuring code for better readability or maintainability, optimizing performance, or reducing technical debt without changing external behavior.
- **`coding agent`**: This label is used for issues related to the AI agents themselves (e.g., `metafox`, `docfox`, `packagefox`, `testfox` located in `scripts/src/agents/`). This could involve:
  - Bugs within an agent's logic.
  - Proposals for new agent capabilities.
  - Tasks for an agent to perform (e.g., an issue created by `testfox` to add specific unit tests).
  - Improvements to the agent framework or how agents are invoked and managed.
- **`documentation`**: This label is for issues related to any form of documentation. This includes:
  - Improving this `CONTRIBUTING.md` guide.
  - Updating the main `README.md`.
  - Enhancing inline code comments (TSDoc/JSDoc).
  - Fixing issues with documentation generation (e.g., tasks for `docfox`).
  - Creating new documentation for packages or features.
- **`enhancement`**: This label suggests a new feature or an improvement to an existing feature that is not a bug fix.
- **`good first issue`**: These are issues that are considered suitable for new contributors. They typically have a clear scope and don't require extensive knowledge of the entire codebase.
- **`help wanted`**: This indicates that the maintainers would appreciate community help on this particular issue.

By filtering issues by these labels on the [GitHub Issues page](https://github.com/THEMOONDEVS/microfox-ai/issues), you can find tasks that match your interests and skills.

## Getting Started

1.  **Fork the repository**: Click the "Fork" button on the [Microfox AI GitHub page](https://github.com/THEMOONDEVS/microfox-ai).
2.  **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/microfox-ai.git`
3.  **Navigate to the project directory**: `cd microfox-ai`
4.  **Install dependencies**: We use pnpm as our package manager.
    ```bash
    npm install -g pnpm # If you don't have pnpm
    pnpm install
    ```
5.  **Create a new branch**: `git checkout -b my-feature-branch`
6.  **Make your changes**: Write your code and add tests!
7.  **Run tests**: `pnpm test` (or a more specific test command if available for the package you're working on).
8.  **Commit your changes**: `git commit -m "feat: Describe your feature"` (See [Conventional Commits](https://www.conventionalcommits.org/) for commit message guidelines).
9.  **Push to your branch**: `git push origin my-feature-branch`
10. **Submit a Pull Request (PR)**: Go to the original Microfox AI repository and click the "New pull request" button.

## Code Style & Conventions

- **Formatting**: We use Prettier for code formatting.
- **Linting**: We use ESLint for identifying and reporting on patterns in JavaScript/TypeScript.
- **Commit Messages**: Please follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/). This helps us automate changelog generation and versioning.
  - Example: `feat(google-sheets): add support for batchGet an API`
  - Example: `fix(core): resolve issue with token caching`
  - Example: `docs(contributing): clarify example contribution process`

## Issue and Pull Request Lifecycle

1.  **Issue Creation**: If you find a bug or want to suggest a new feature, please create an issue. Provide as much detail as possible.
2.  **Discussion**: For new features or significant changes, a maintainer will likely discuss the proposal with you in the issue comments.
3.  **Pull Request Submission**: Once you're ready to submit your code, create a PR.
    - Link the PR to any relevant issues (e.g., "Closes #123").
    - Provide a clear description of the changes.
4.  **Review**: Maintainers will review your PR. They may ask for changes or provide feedback.
5.  **Merging**: Once the PR is approved and passes all checks, it will be merged.

## Questions?

If you have any questions, feel free to ask by creating an issue or joining & communicating in our [discord](https://discord.gg/HAFDjqA2Jb).

Thank you for contributing to Microfox AI!
