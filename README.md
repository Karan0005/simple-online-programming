# Online Multi-Language Code Execution Platform

This project provides a robust, scalable platform for compiling and executing code in various
programming languages, offering developers and learners an interactive and secure environment to run
their code in real-time.

## 🛠️ Project Overview

This application allows users to choose from **15 programming languages** for code execution. The
system provides customizable execution parameters such as **input values**, **timeout durations**,
and **execution power levels** to match the resource requirements of different programs.

The backend, built with **Nest.js**, ensures efficient and isolated code execution environments
using **Docker**, while the **Angular** frontend offers a clean, intuitive interface for user
interaction.

### 🚀 Key Features:

-   **Support for Multiple Languages:** The platform currently supports the following languages:

    `CPP`, `C`, `Java`, `Python`, `Go`, `JavaScript`, `TypeScript`, `Kotlin`, `PHP`, `C#`, `Swift`,
    `R`, `Ruby`, `Rust`, `Perl`.

-   **Customizable Execution Parameters:**

    -   **Timeouts:** 10, 30, or 60 seconds for code execution.
    -   **Execution Power:** Low, Medium, High, and Extreme power levels to optimize resource usage
        based on program needs.
    -   **Static Input Parameters:** Allow users to pass input parameters for their programs.

-   **Docker Sandbox:** Every code execution takes place in an isolated Docker container, ensuring
    secure, sandboxed execution without interference between users.

-   **Backend Integration Tests:** Comprehensive integration tests to ensure stability and
    correctness of code execution across supported languages.

-   **Future-Proof:** Designed to accommodate additional programming languages and features,
    ensuring scalability and flexibility for future enhancements.

## 🏗️ Project Structure

```
└── simple-online-programming/
    ├── .github
    │   └── workflows
    ├── LICENSE
    ├── README.md
    ├── apps
    │   ├── backend
    │   ├── backend-e2e
    │   ├── frontend
    │   └── frontend-e2e
    ├── devops
    │   ├── backend
    │   └── frontend
    ├── docker-compose.yml
    ├── jest.config.ts
    ├── jest.preset.js
    ├── libs
    │   └── shared
    ├── nx.json
    ├── package-lock.json
    ├── package.json
    ├── scripts
    │   ├── dependency.verifier.js
    │   ├── env.builder.js
    │   ├── frontend.ignite.js
    │   ├── generate.module.js
    │   ├── upgrade.js
    │   └── vs.extensions.setup.js
    └── tsconfig.base.json
```

## ⚙️ Backend: Nest.js + Docker

The backend is built with **Nest.js** and runs code in a fully isolated environment using **Docker
containers**. This ensures secure, concurrent code execution without any risk of interference
between different users' programs.

-   **Sandboxing:** Each execution happens in its own Docker container to prevent security breaches.
-   **Timeout & Resource Management:** The system allows setting limits on execution time and
    resource allocation (low, medium, high, extreme) for handling computationally intensive code.

### Key API Features:

-   **Language Selection:** Users can choose from 15+ supported programming languages.
-   **Execution Timeout:** Configurable to 10, 30, or 60 seconds.
-   **Execution Power:** From low to extreme, depending on the program’s resource needs.

### API Example:

```json
{
    "source_code": "print('Hello, World!')",
    "programming_language": "Python",
    "execution_power": "high",
    "run_time_inputs": "input values",
    "time_out": "30"
}
```

### Response:

-   **Success:**
    ```json
    {
        "output": "Hello, World!"
    }
    ```
-   **Failure:**
    ```json
    {
        "error": "Timeout exceeded"
    }
    ```

## 💻 Frontend: Angular

The frontend is built with **Angular** and offers a simple, user-friendly interface for submitting
code and viewing results. Users can:

-   Select a programming language.
-   Input custom parameters.
-   Adjust timeout and execution power settings.

### Features:

-   **Real-time Code Execution**: The interface communicates with the backend API to display
    execution results dynamically.
-   **Responsive Design**: Adapted for both desktop and mobile use.
-   **Interactive Code Input**: Users can write code directly within the browser and receive output
    immediately.

## 🐳 Docker Setup

This project leverages **Docker** to ensure a clean, isolated environment for executing code. The
use of Docker ensures that no code execution can interfere with the host machine or other users.

### Prerequisites:

-   **Docker** installed on your machine.

### Running the Project:

To build and run both the backend and frontend, use the following command:

```bash
docker-compose up --build
```

This will:

1. Start the backend (Nest.js API) at `http://localhost:8000`.
2. Start the frontend (Angular) at `http://localhost:4000`.

## 🧪 Testing

The backend includes **integration tests** that ensure all supported languages execute correctly.
Tests cover:

-   Simple code like "Hello, World!" in each language.
-   Basic arithmetic operations.

These tests run automatically during the Docker build process to verify that the environment is
correctly configured.

## 📈 Future Enhancements

We have plans to continuously improve the platform:

-   **Support for Additional Languages**: Adding more languages based on user requests.
-   **Advanced Input Handling**: Enable file inputs and outputs.
-   **Performance Optimization**: Further optimize Docker container performance for faster code
    execution.

## Author Information

-   **Author**: Karan Gupta
-   **LinkedIn**: [Karan Gupta](https://www.linkedin.com/in/karangupta0005)
-   **GitHub**: [Karan Gupta](https://github.com/Karan0005)
-   **Contact**: +91-8396919047
-   **Email**: [karangupta0005@gmail.com](mailto:karangupta0005@gmail.com)

## 🤝 Contributions

Contributions are welcome! Here are several ways you can contribute:

1. **Fork the Repository**: Start by forking the project repository to your github account.

2. **Clone Locally**: Clone the forked repository to your local machine using a git client.

    ```sh
    git clone https://github.com/Karan0005/simple-online-programming
    ```

3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.

    ```sh
    git checkout -b new-feature-x
    ```

4. **Make Your Changes**: Develop and test your changes locally.

5. **Commit Your Changes**: Commit with a clear message describing your updates.

    ```sh
    git commit -m 'Implemented new feature x.'
    ```

6. **Push to github**: Push the changes to your forked repository.

    ```sh
    git push origin new-feature-x
    ```

7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe
   the changes and their motivations.

8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch.
   Congratulations on your contribution!

-   **[Report Issues](https://github.com/Karan0005/simple-online-programming/issues)**: Submit bugs
    found or log feature requests for the `simple-online-programming` project.

## 📝 License

This project is licensed under the MIT License.
