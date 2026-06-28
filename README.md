# TodoApp

A full-stack todo management application built with .NET 10 and React 19, featuring a modern UI with Fluent UI 9 components.

## Features

### Core Functionality

- **CRUD Operations**: Create, read, update, and delete todos
- **Rich Todo Details**: Each todo includes a name, description, created date, and optional due date
- **Flexible Due Dates**: Set due dates using either:
  - Absolute dates (specific calendar date)
  - Relative dates (e.g., "3 days from now", "2 weeks from now")
- **Smart Reminders**: Optional email reminders for todos with due dates
- **Background Notifications**: Automated due date notification service
- **Data Persistence**: SQLite database with Entity Framework Core

> **Note**: The mail notification service is currently simulated for demo purposes. Email notifications are logged to the console via `Console.WriteLine` instead of being sent through an actual mail server. This allows the notification functionality to be demonstrated without requiring SMTP configuration.

### User Experience

- **Modern UI**: Built with Microsoft Fluent UI 9 design system
- **Responsive Design**: Clean, accessible interface that works across devices
- **Real-time Validation**:
  - Form validation with helpful error messages
  - Warning for past due dates
  - Smart form controls (reminders disabled without due dates)
- **Accessibility**:
  - Proper ARIA labels and semantic HTML
  - Full keyboard navigation support\*
  - Screen reader friendly
- **Visual Indicators**: Overdue todos highlighted in red

> \*Upon experimentation, the keyboard accessibility for selecting actions buttons in the column rows is not fully intuitive. Accessing Actions button requires keying down, then up again to be able to access button options. This seems to be a limitation of Fluent 9 however, and requires overengineered solutions outside the scope of this demo.

## Technology Stack

### Backend

- **.NET 10.0**: Latest ASP.NET Core framework
- **Entity Framework Core 10**: ORM for database operations
- **SQLite**: Lightweight, file-based database
- **RESTful API**: Clean API design with full CRUD support
- **Background Services**: Hosted service for due date notifications

### Frontend

- **React 19**: Latest React with modern hooks
- **TypeScript**: Type-safe development
- **Fluent UI 9**: Microsoft's official design system
- **Vite**: Fast build tool and dev server
- **ESLint**: Code quality and consistency

## Prerequisites

Before running this application, ensure you have the following installed:

- **Npm CLI**: v11 or later, use NVM ([Download](https://github.com/coreybutler/nvm-windows))
- **Node.js**: v26 or later (`nvm install 26` then `nvm use 26`)
- **.NET SDK**: .NET 10.0 or later ([Download](https://dotnet.microsoft.com/download))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **Visual Studio 2026**: Latest version with dotnet 10 support ([Download](https://visualstudio.microsoft.com/downloads/))

#### Optional but Recommended

- **SQLite and SQL Server Compact Toolbox**: Latest version for DB Debugging ([Download](https://marketplace.visualstudio.com/items?itemName=ErikEJ.SQLServerCompactSQLiteToolbox))
- **Visual Studio Code**: For hosting frontend ([Download](https://code.visualstudio.com/download?_exp_download=fb315fc982))

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lehrt/TodoApp.git
cd TodoApp
```

### 2. Backend Setup

It is recommended to use Visual Studio 2026 to host this backend service. Visual Studio Code will likely not work.

Navigate to the backend directory and restore dependencies:

```bash
cd TodoApp
dotnet restore
dotnet tool install --global dotnet-ef
```

Apply database migrations to create the SQLite database:

```bash
dotnet ef database update
```

Run the backend server:

```bash
dotnet run
```

The API will be available at:

- HTTP: `http://localhost:5025`
- HTTPS: `https://localhost:7268`

### 3. Frontend Setup

It is recommended to use Visual Studio Code to host the frontend service, though Visual Studio may work just as well.

Open a new terminal window and navigate to the frontend directory:

```bash
cd TodoAppClient
```

Install dependencies (first time setup only):

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000` to start using the TodoApp.

## API Endpoints

### Todos

- `GET /api/ToDos` - Get all todos
- `GET /api/ToDos/{id}` - Get a specific todo
- `POST /api/ToDos` - Create a new todo
- `PUT /api/ToDos/{id}` - Update a todo
- `PATCH /api/ToDos/{id}` - Partially update a todo
- `DELETE /api/ToDos/{id}` - Delete a todo

## Development

### Backend Commands

```bash
# Run the application
dotnet run

# Run with watch mode (auto-reload on changes)
dotnet watch run

# Create a new migration
# Use only if you have made changes to the
# db tables or data models
dotnet ef migrations add <MigrationName>

# Update database with latest migrations
dotnet ef database update

# Build the project
dotnet build
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Configuration

### Backend

- Database connection string is configured in `Program.cs`
  - NOTE: This is a known security weakness, but is acknowledged and is acceptable for demo purposes.
- CORS is configured to allow requests from `http://localhost:3000`
- API runs on ports 5025 (HTTP) and 7268 (HTTPS)

### Frontend

- API proxy is configured in `vite.config.ts` to forward `/api` requests to `http://localhost:5025`
- Development server runs on port 3000

## Future Work

This project is currently in demo/proof-of-concept stage. The following enhancements are known limitations that would be addressed in future iterations if this project was funded:

### 1. Accessibility Improvements

- **DataGrid Keyboard Navigation**: Improve keyboard accessibility for the actions menu buttons in the todo list
  - Current limitation: Accessing the actions button requires non-intuitive key combinations (down arrow, then up arrow)
  - This appears to be a Fluent UI 9 limitation that requires custom solutions beyond the scope of this demo

### 2. Email Notification Service

- **SMTP Integration**: Replace the simulated console-based email service with a real email server
  - Configure SMTP server credentials (e.g., SendGrid, AWS SES, or Azure Communication Services)
  - Implement HTML email templates for reminder notifications
  - Add email delivery tracking and error handling
- **Notification Preferences**: Allow users to customize reminder timing and frequency
- **Multiple Notification Channels**: Extend beyond email to support SMS or push notifications

### 3. Security Enhancements

- **Azure Key Vault Integration**: Move sensitive configuration out of source code
  - Store database connection strings in Azure Key Vault
  - Implement secure credential retrieval for SMTP settings
  - Use managed identities for authentication in Azure environments
- **Environment-Specific Configuration**: Properly separate development, staging, and production configurations
  - Currently, the connection string is hardcoded in `Program.cs` for demo convenience
  - Production deployments should use secure secret management
- **Authentication & Authorization**: Add user authentication to secure todo data
  - **Current Limitation**: All users currently see all todos in the system (no user isolation)
  - Implement user registration and login system
  - Store user identity (e.g., email address) with each todo in the database
  - Filter todos by authenticated user to show only their own tasks
  - Implement proper authorization checks at the API level to prevent unauthorized access

### 4. Additional Features

- **Todo Categories/Tags**: Organize todos with labels and categories
- **Search and Filter**: Advanced search and filtering capabilities
- **Bulk Operations**: Select and manage multiple todos at once
- **Data Export**: Export todos to CSV, JSON, or PDF formats
- **Recurring Todos**: Support for repeating tasks
- **Mobile Responsiveness**: Optimize UI for mobile devices and tablets
