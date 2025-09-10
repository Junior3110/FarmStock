# Electron Menu App

This project is an Electron application that demonstrates how to create a basic application with a menu. It is structured to separate the main process, renderer process, and menu configuration, ensuring a clean and maintainable codebase.

## Project Structure

```
electron-menu-app
├── src
│   ├── main.ts          # Main entry point of the Electron application
│   ├── renderer.ts      # Handles the rendering process and UI
│   ├── menu.ts          # Defines the application menu
│   └── types
│       └── index.ts     # Type definitions for the application
├── package.json         # npm configuration file
├── tsconfig.json        # TypeScript configuration file
└── README.md            # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd electron-menu-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

## Features

- Basic Electron application structure
- Custom application menu
- TypeScript for type safety

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.