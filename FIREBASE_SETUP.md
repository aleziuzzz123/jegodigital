# Firebase Setup Guide for Jegodigital Dashboard

## 🔥 Firebase Project Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `jegodigital-dashboard`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location (choose closest to your users)
5. Click "Done"

### 4. Add Web App
1. In Project Overview, click the web icon `</>`
2. App nickname: `jegodigital-dashboard-web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase config object

### 5. Update Firebase Config
Replace the config in `firebase.ts` with your actual config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 6. Create Admin User
1. In Firebase Console, go to "Authentication" > "Users"
2. Click "Add user"
3. Email: `jegoalexdigital@gmail.com`
4. Password: [Create a strong password]
5. Click "Add user"

### 7. Initialize Admin Profile
Run the initialization script:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore rules
firebase init firestore

# Run the admin initialization script
node scripts/initAdmin.js
```

### 8. Set Up Firestore Security Rules
In Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Public data (if any)
    match /public/{document=**} {
      allow read: if true;
    }
  }
}
```

### 9. Environment Variables (Optional)
Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🔐 Admin User Setup

### Admin User Details:
- **Email:** `jegoalexdigital@gmail.com`
- **Role:** `admin`
- **Name:** `Alex Jego`
- **Company:** `Jegodigital`
- **Permissions:** Full access to all dashboard features

### Admin Permissions:
- ✅ Manage clients
- ✅ Manage projects
- ✅ Manage orders & payments
- ✅ Manage team members
- ✅ View analytics
- ✅ Manage products & pricing
- ✅ Handle support tickets

## 🚀 Deployment

After setting up Firebase:

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
npx netlify-cli deploy --prod --dir=dist
```

## 🔧 Testing

### Test Admin Login:
1. Go to `https://jegodigital.com/dashboard.html`
2. Enter email: `jegoalexdigital@gmail.com`
3. Enter your Firebase password
4. You should be logged in as admin

### Test Demo Users:
- Client: `client@demo.com` / `client123`
- Admin (Demo): `admin@demo.com` / `admin123`
- Staff: `staff@demo.com` / `staff123`

## 📱 Features Available

### Admin Dashboard:
- 📊 Business overview with key metrics
- 👥 Client management
- 💳 Orders & payments tracking
- 🚀 Project management
- 🎫 Support ticket system
- 🛍️ Product catalog management
- 👥 Team management
- 📈 Analytics & reporting

## 🛡️ Security Notes

1. **Firestore Rules:** Make sure to set up proper security rules
2. **Admin Access:** Only `jegoalexdigital@gmail.com` has admin access
3. **Password:** Use a strong, unique password for the admin account
4. **Environment:** Keep Firebase config secure in production

## 🆘 Troubleshooting

### Common Issues:
1. **Authentication Error:** Check Firebase config and ensure user exists
2. **Permission Denied:** Verify Firestore security rules
3. **Network Error:** Check Firebase project status and internet connection

### Support:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com


