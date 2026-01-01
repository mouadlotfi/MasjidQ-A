# Masjid Q&A Forum - Frontend

Frontend application for the Masjid Q&A Forum built with Svelte, Vite, and Tailwind CSS.

## Features

- Responsive design for desktop and mobile
- Animated hero section with call-to-action buttons
- Question browsing with cards and hover effects
- User authentication (login/register)
- Ask questions (authenticated users)
- Answer questions (authenticated users)
- Mark answers as accepted (Imam only)
- Role-based UI elements and badges
- Smooth animations and transitions

## Prerequisites

- Node.js (v14 or higher)
- npm
- Backend server running on `http://localhost:5000`

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Pages

### Home Page (`/`)
- Hero section with animated headings
- Recent questions grid with cards
- Hover effects and animations
- Question preview with author info and answer count

### Login/Register Page (`/login`)
- Toggle between login and registration
- Form validation
- Role selection for new users

### Ask Question Page (`/ask`)
- Question submission form
- Requires authentication
- Title and content fields

### Question Detail Page (`/question/:id`)
- Full question display
- All answers with author info
- Answer submission form (authenticated users)
- Mark answer as accepted (Imam only)
- Accepted answers highlighted

## Technologies Used

- **Svelte** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and animations
- **svelte-routing** - Client-side routing

## Animations

- Fade-in effects for headings
- Slide-up animations for content
- Bounce effects for CTA buttons
- Card hover effects (scale and translate)
- Smooth transitions throughout

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api` using:
- Session-based authentication with credentials
- RESTful endpoints for questions and answers
- Error handling and loading states
