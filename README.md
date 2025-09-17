# Proposal Automation Frontend

A production-ready React frontend application for automating proposal generation, built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite for optimal development experience
- **Responsive Design**: Mobile-first approach with clean, professional UI
- **Form Management**: Dynamic forms with validation and localStorage persistence
- **API Integration**: Complete REST API integration with error handling
- **Real-time Updates**: Live health monitoring and status indicators
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```
   VITE_API_BASE=http://127.0.0.1:8000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Environment Configuration

The application uses environment variables for configuration:

- `VITE_API_BASE`: Backend API base URL (default: `http://127.0.0.1:8000`)

## API Integration

The frontend is designed to work with the Proposal Automation Backend API with the following endpoints:

- `GET /health` - Service health check
- `GET /api/info` - API information and metadata
- `GET /api/templates` - Available document templates
- `POST /api/process-proposal` - Process proposal with template
- `GET /api/download/{filename}` - Download generated documents

## Project Structure

```
src/
├── api/              # API layer and HTTP client
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── App.tsx          # Main application component
```

## Key Features

### Dashboard
- Template selection with refresh capability
- Dynamic form with validation
- Extra points and projects management
- Real-time JSON payload preview
- Form data persistence with localStorage
- Download processed proposals

### Info Page
- API service information display
- Real-time health status monitoring
- Available endpoints and features listing

### Form Validation
- Required field validation
- Template availability checking
- Project data validation
- Real-time error feedback

### Error Handling
- Network error handling with retry logic
- User-friendly error messages
- Toast notifications for feedback
- Graceful degradation for offline scenarios

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project includes:
- TypeScript for type safety
- ESLint for code linting
- Consistent code formatting
- Component-based architecture

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and conventions
2. Write TypeScript types for all new code
3. Ensure components are accessible
4. Test your changes thoroughly
5. Update documentation as needed

## License

This project is licensed under the MIT License.