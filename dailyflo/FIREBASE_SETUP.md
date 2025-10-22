# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `dailyflo-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
5. Add your project support email
6. Save the configuration

## 3. Create Web App

1. In Firebase project overview, click the web icon (`</>`)
2. Register your app with nickname: `dailyflo-web`
3. Copy the Firebase configuration object

## 4. Environment Variables

Create a `.env` file in your project root with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with your actual Firebase configuration values.

## 5. Firestore Database (Optional)

If you want to store user data:

1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

## 6. Domain Configuration

For production deployment, add your domain to:
- Authentication > Settings > Authorized domains
- Firestore > Rules (if using Firestore)

## Security Rules (Firestore)

If using Firestore, update the security rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Partner sharing data
    match /partner_shares/{shareId} {
      allow read, write: if request.auth != null;
    }
  }
}
```


