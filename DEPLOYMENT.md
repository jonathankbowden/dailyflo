# Automated Deployment Guide

## 🚀 How It Works

This project uses **GitHub Actions** to automatically deploy to your hosting whenever you push changes. Perfect for working on mobile!

### Workflow:
1. Make changes in Claude Code (on mobile or desktop)
2. Commit and push to GitHub
3. GitHub Actions automatically builds and deploys to kreathaus.com
4. Your app is live within 2-3 minutes!

---

## ⚙️ Setup Instructions (One-Time)

You need to add your credentials as GitHub Secrets:

### Step 1: Go to GitHub Secrets

1. Go to your repository: https://github.com/jonathankbowden/dailyflo
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** (green button)

### Step 2: Add These Secrets

Add each of these secrets one by one:

#### FTP Credentials:
- **Name**: `FTP_PASSWORD`
- **Value**: `Anewview2614$$`

#### Firebase Configuration:
- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: `AIzaSyD8b-f5Cv_QAG8OV6F5WC9m0dJcjYkTbrI`

- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `dailyflo-app.firebaseapp.com`

- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: `dailyflo-app`

- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: `dailyflo-app.firebasestorage.app`

- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: `954188535649`

- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: `1:954188535649:web:2f0f911c42b6c1a61a9720`

---

## 🎯 How to Deploy

### Automatic (Recommended):
Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

GitHub Actions will automatically deploy within 2-3 minutes!

### Manual Trigger:
1. Go to **Actions** tab on GitHub
2. Click **Deploy to Kreathaus FTP**
3. Click **Run workflow**

---

## 📱 Mobile Workflow

Perfect for working on mobile with Claude Code:

1. Open Claude Code on mobile browser
2. Make your changes to the code
3. I (Claude) will commit and push for you
4. GitHub Actions deploys automatically
5. Check your live app at: https://kreathaus.com/dailyflo/

---

## 🔍 Monitoring Deployments

To see deployment status:
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. See all deployments and their status (✅ success, ❌ failed)
4. Click any deployment to see detailed logs

---

## 🎉 Benefits

- ✅ Works from anywhere (mobile, desktop, any device)
- ✅ Automatic deployments on every push
- ✅ No need for FTP client or local deployment
- ✅ Deployment history and logs
- ✅ Secure (credentials stored as secrets)
- ✅ Fast (2-3 minute deployments)
