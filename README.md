# DailyFlo - Cycle Tracking & Wellness App

A beautiful React + TypeScript app for cycle tracking, journaling, meditation, and partner sharing.

## Features

- 📅 **Cycle Calendar** - Track your menstrual cycle with beautiful visualizations
- 📝 **Journal** - Record thoughts, feelings, and experiences
- 🧘‍♀️ **Meditation** - Guided meditation sessions with ambient sounds
- 💕 **Partner Sharing** - Share cycle information with your partner for better support
- 🔐 **Authentication** - Secure Google Sign-In with Firebase

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Material-UI (MUI) with custom theming
- **Authentication**: Firebase Auth with Google Sign-In
- **Database**: Firebase Firestore (optional)
- **Styling**: Emotion (CSS-in-JS)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (see Firebase Setup below)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd dailyflo
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase (see Firebase Setup section)

4. Create environment variables
```bash
cp .env.example .env
# Edit .env with your Firebase configuration
```

5. Start the development server
```bash
npm run dev
```

## Firebase Setup

This app requires Firebase for authentication. Follow these steps:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `dailyflo-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
5. Add your project support email
6. Save the configuration

### 3. Create Web App

1. In Firebase project overview, click the web icon (`</>`)
2. Register your app with nickname: `dailyflo-web`
3. Copy the Firebase configuration object

### 4. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with your actual Firebase configuration values.

### 5. Firestore Database (Optional)

If you want to store user data:

1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

### 6. Domain Configuration

For production deployment, add your domain to:
- Authentication > Settings > Authorized domains
- Firestore > Rules (if using Firestore)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Bottom navigation
│   ├── ProtectedRoute.tsx # Route protection
│   └── ImageUploader.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── CycleCalendar.tsx
│   ├── Journal.tsx
│   ├── Meditation.tsx
│   ├── PartnerView.tsx
│   ├── NewJournalEntry.tsx
│   └── Login.tsx
├── config/             # Configuration files
│   └── firebase.ts     # Firebase setup
└── assets/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
