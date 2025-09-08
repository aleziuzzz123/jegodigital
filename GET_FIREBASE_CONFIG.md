# 🔥 Get Your Firebase Configuration

## Step 1: Get Firebase Config from Console

1. Go to your Firebase Console: https://console.firebase.google.com/u/6/project/jegodigital-2ed98
2. Click the gear icon ⚙️ next to "Project Overview"
3. Select "Project settings"
4. Scroll down to "Your apps" section
5. If you don't have a web app yet:
   - Click "Add app" button
   - Choose the web icon `</>`
   - App nickname: `jegodigital-dashboard-web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
6. Copy the `firebaseConfig` object

## Step 2: Update firebase.ts

Replace the config in `firebase.ts` with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "jegodigital-2ed98.firebaseapp.com",
  projectId: "jegodigital-2ed98",
  storageBucket: "jegodigital-2ed98.appspot.com",
  messagingSenderId: "443719109773",
  appId: "your-actual-app-id"
};
```

## Step 3: Enable Email/Password Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started" if not already done
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 4: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 5: Initialize Admin User

Run this command to create your admin profile in Firestore:

```bash
node scripts/initAdmin.js
```

## Step 6: Test Login

1. Go to https://jegodigital.com/dashboard.html
2. Enter email: `jegoalexdigital@gmail.com`
3. Enter your Firebase password
4. You should be logged in as admin!

## Your Admin Details:
- **Email:** jegoalexdigital@gmail.com
- **UID:** Tb4iOWLHsCcSm9gd6rRPzeys4um1
- **Role:** admin
- **Name:** Alex Jego
- **Company:** Jegodigital

## Security Rules (Optional)

In Firebase Console > Firestore > Rules, you can add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```


