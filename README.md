# IdeaVault

A modern Angular application for capturing and organizing your ideas. Built with Angular, Tailwind CSS, and spartan/ui.

## Technologies Used

  * **[Angular](https://angular.dev/)**: The core framework for building the application.
  * **[Angular CLI](https://angular.dev/tools/cli)**: Command-line interface for managing the project.
  * **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
  * **[spartan/ui](https://www.spartan.ng/)**: A collection of accessible UI components built with Tailwind CSS and Radix UI.

-----

## Getting Started

### Prerequisites

Make sure you have Node.js and the Angular CLI installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ideavault.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd ideavault
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Development Server

To start a local development server, run the following command:

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to the source files.

-----

## Building and Deployment

To build the project for production, run:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

-----

## Code Scaffolding

Use the Angular CLI to generate new components, services, or other project files. For example:

```bash
ng generate component component-name
```

To see all available options, use the `--help` flag:

```bash
ng generate --help
```

-----

## Running Tests

### Unit Tests

To execute the unit tests, run:

```bash
ng test
```

### End-to-End Tests

To run end-to-end tests, use the following command:

```bash
ng e2e
```

**Note:** Angular CLI does not include a default e2e testing framework. You will need to install one separately.