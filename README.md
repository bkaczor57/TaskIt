# Task It – Team-Based Task Management Application

**Task It** is a full-stack web application designed to streamline collaboration and task organization within teams. It allows users to create and manage project groups, assign and monitor tasks, and collaborate in real time through a clear, user-friendly interface.

## Key Features

- User authentication with JWT (stateless)
- Profile management 
- Team creation and member invitations
- Team roles: `Admin`, `Manager`, `Member`
- Sections and Tasks creation with status tracking
- Organize tasks in sections (kanban view)
- Filters and searching for tasks 
- Responsive UI with drag & drop Task

## Architecture Overview

Task It consists of two independent layers:

### Frontend (React + Vite)

- React.js SPA with modular component structure
- Vite as build tool and proxy server
- React Context API for state management
- Axios for RESTful API communication
- Realtime view updates (modals, filters, drag & drop)

### Backend (.NET 8 + Entity Framework + PostgreSQL)

- ASP.NET Core 8 (REST API)
- Entity Framework Core (Code-First with migrations)
- PostgreSQL database
- Clean three-layered architecture:
  - **Controllers**/**Services**/**Repositories**
- JWT authentication (no refresh tokens stored)
- Role-based access control using `UserTeam` relation
