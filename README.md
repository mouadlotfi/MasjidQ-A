# Masjid Q&A Forum

A full-stack web application for a Masjid Q&A/Forum where community members can ask questions and receive answers from Imams and other parents.

## Features

### Backend
- **Node.js + Express.js** server
- **SQLite** database with three tables (Users, Questions, Answers)
- **Session-based authentication** with bcrypt password hashing
- **Role-based access control** (Imam and Parent roles)
- RESTful API endpoints for all operations
- Sample data included for immediate testing

### Frontend
- **Svelte + Tailwind CSS** for modern, responsive UI
- **Animated hero section** with fade-in and bounce effects
- **Question cards** with hover animations (scale and slide)
- **Role-based UI elements** with color-coded badges
- **Imam-only features** for marking answers as accepted
- Fully responsive design for desktop and mobile

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Clone or navigate to the project directory**
```bash
git clone https://github.com/defaltastra/MasjidQ-A/ && cd MasjidQ-A
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Initialize and seed the database**
```bash
npm run seed
```

4. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server** (in the `backend` directory):
```bash
npm start
```
Server will run on `http://localhost:5000`

2. **Start the frontend dev server** (in the `frontend` directory, in a new terminal):
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Sample Credentials

After seeding the database, you can login with:

- **Imam**: `imam_abdullah` / `password123`
- **Parent**: `parent_fatima` / `password123`
- **Parent**: `parent_ahmed` / `password123`

## Project Structure

```
masjid/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── questions.js     # Question endpoints
│   │   └── answers.js       # Answer endpoints
│   ├── middleware/
│   │   └── middleware.js    # Auth middleware
│   ├── db.js                # Database configuration
│   ├── server.js            # Express server
│   ├── seed.js              # Database seeding script
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.svelte           # Home page
│   │   │   ├── Login.svelte          # Login/Register page
│   │   │   ├── AskQuestion.svelte    # Ask question page
│   │   │   └── QuestionDetail.svelte # Question detail page
│   │   ├── lib/
│   │   │   ├── api.js       # API service
│   │   │   └── auth.js      # Auth store
│   │   ├── App.svelte       # Main app component
│   │   ├── main.js          # Entry point
│   │   └── app.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Questions
- `GET /api/questions` - Get all questions with answers
- `GET /api/questions/:id` - Get single question with answers
- `POST /api/questions` - Create new question (authenticated)

### Answers
- `POST /api/answers` - Create new answer (authenticated)
- `PUT /api/answers/:id/accept` - Mark answer as accepted (Imam only)

## Technologies Used

### Backend
- Express.js - Web framework
- SQLite3 - Database
- bcryptjs - Password hashing
- express-session - Session management
- cors - Cross-origin resource sharing

### Frontend
- Svelte - Frontend framework
- Vite - Build tool
- Tailwind CSS - Styling
- svelte-routing - Client-side routing

## Features Showcase

### User Roles
- **Imam**: Can answer questions and mark answers as accepted
- **Parent**: Can ask questions and provide answers

### Animations
- Fade-in hero headings
- Bounce effects on CTA buttons
- Card hover effects (scale + translate)
- Slide-up animations for content
- Smooth transitions throughout

### Responsive Design
- Mobile-friendly navigation
- Responsive grid layouts
- Touch-friendly buttons and cards

## Development

For detailed development instructions, see:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## License

MIT
