# Frontend Application

React application built with Vite for School Book Inventory Management.

## Installation

```bash
npm install
```

## Running

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Features

- List all book sets with filtering
- Create new book sets
- Edit existing book sets
- Delete book sets
- Responsive design

## Configuration

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Update this for production deployment.
