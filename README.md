# Meal Calorie Tracker

A modern web application for tracking meal calories and nutritional information built with Next.js and React.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meal-calorie-frontend-{your-name}.git
cd meal-calorie
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your API configuration if needed

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technology Stack

- **Frontend Framework**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: Custom form components
- **API Communication**: Axios
- **Authentication**: JWT-based (via API)

## Key Features

- User authentication (Login & Registration)
- Meal search and tracking
- Calorie calculation and history
- Responsive design
- Real-time meal updates

## Design Decisions & Trade-offs

### Decisions Made:
1. **Zustand for State Management**: Lightweight and simple store management without boilerplate, suitable for app-scale state needs
2. **Tailwind CSS**: Utility-first CSS framework for rapid development and consistent styling
3. **API-driven Architecture**: Frontend communicates with backend API for all data operations
4. **NextAuth Integration**: Handles authentication flows securely with session management

### Trade-offs:
- **Client-side State vs Server State**: Chose client-side Zustand stores for UI state while keeping server data in API - trade-off between complexity and separation of concerns
- **Component Library**: Built custom components instead of using Material-UI to reduce bundle size
- **Styling Approach**: Tailwind CSS over CSS-in-JS for better performance and smaller CSS output

## Screenshots

*[Add screenshots of the application here]*
- Login page
- Dashboard
- Meal search interface
- Meal history

## Hosted Application

**Live Demo**: [Your Vercel deployment URL will be added here after deployment]

## Development

To modify the application:
- Edit pages in `app/` directory for routes
- Create/modify components in `components/` directory
- Update stores in `stores/` directory for state management
- API calls are in `lib/api.ts`

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).
