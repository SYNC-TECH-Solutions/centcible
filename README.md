# Centcible — Luxury Smart Expense Tracker

> **Track Expenses. Scan Receipts. Command Your Wealth.**

Centcible is a premium, AI-powered financial management app for Web, Android, and iOS. Built with React + Vite and powered by **Google Gemini AI** for intelligent receipt parsing and personalised savings advice.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Real-time spending overview with interactive charts |
| 🧾 **AI Receipt Scanning** | Upload receipts — Gemini AI itemises and categorises instantly |
| 🎯 **Budget Goals** | Set monthly category limits with live progress tracking |
| 💳 **Loans Tracker** | Track debts, pay-downs, and loan completion |
| 👥 **Partner Hub** | Shared grocery lists, real-time partner chat, and joint ledger |
| 📄 **Monthly Statements** | Premium PDF statements with AI-generated savings tips |
| 💱 **Multi-Currency** | USD, EUR, GBP, JPY, INR, CAD, AUD support |
| 📱 **Android & iOS** | Native mobile apps via Capacitor |

---

## 🚀 Quick Start (Web)

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 📱 Mobile (Android)

1. Install [Android Studio](https://developer.android.com/studio)
2. Build the web app: `npm run build`
3. Sync Capacitor: `npx cap sync`
4. Open Android Studio: `npx cap open android`
5. Run on emulator or physical device

## 📱 Mobile (iOS)

> Requires macOS with Xcode installed.

1. Build the web app: `npm run build`
2. Sync Capacitor: `npx cap sync`
3. Open Xcode: `npx cap open ios`
4. Run on simulator or physical device

---

## 🤖 Gemini AI Setup

To enable AI-powered receipt scanning:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
2. Open the app → **Scan Receipt** → click **AI Configuration**
3. Paste your key and click **Save Key**

---

## 📦 Tech Stack

- **Frontend**: React 19, Vite 8, React Router 7
- **Charts**: Recharts
- **Icons**: Lucide React
- **OCR Fallback**: Tesseract.js
- **Mobile**: Capacitor (Android + iOS)
- **AI**: Google Gemini 2.5 Flash
- **Auth & DB**: Firebase (mock layer for local dev)

---

## 🔄 CI/CD

GitHub Actions automatically:
- Builds the web app on every push to `main`
- Compiles an Android Debug APK
- Creates a GitHub Release with downloadable artifacts

See [`.github/workflows/build.yml`](.github/workflows/build.yml)

---

## 👤 Author

**Sheraz Hussain** — [@SherazHussain546](https://github.com/SherazHussain546)
SYNC Tech Solutions

---

© 2026 Centcible Inc. All rights reserved.
