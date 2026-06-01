# Centcible — Luxury AI-Powered Expense Tracker

![Centcible](https://img.shields.io/badge/Centcible-v0.1.0-A9927D?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![Capacitor](https://img.shields.io/badge/Capacitor-Android%20%7C%20iOS-119EFF?style=for-the-badge&logo=capacitor)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)

> **Track expenses. Scan receipts with Gemini AI. Sync with your partner. Command your wealth.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Gemini AI Receipt Scanner** | Upload any receipt — AI extracts items, amounts, categories, and flags impulse spends |
| 👫 **Partner Hub** | Share budgets, grocery lists, and chat in real-time with your partner |
| 🎯 **Budget Goals** | Set monthly category limits with visual progress bars and over-budget alerts |
| 💳 **Loans Tracker** | Track personal debts with payment progress and payoff history |
| 📄 **Monthly Statements** | Generate premium PDF reports with data-driven savings tips |
| 🌍 **Multi-Currency** | USD, EUR, GBP, JPY, CAD, AUD, INR — all supported |
| 📱 **Android & iOS** | Native apps via Capacitor — camera scanning, push notifications |
| 🌐 **Web App** | Fully responsive, mobile-first design |

---

## 🚀 Getting Started

### Web (Development)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Android

1. `npm run build` — build the web app
2. `npx cap sync android` — sync to Android project
3. Open `android/` in **Android Studio**
4. Click **Run** on your device or emulator

### iOS

1. `npm run build`
2. `npx cap sync ios`
3. Open `ios/App/App.xcodeproj` in **Xcode** (macOS required)
4. Click **Run** on a simulator or device

---

## ⚙️ Gemini AI Setup

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
2. Open the app → **Scan Receipt** → ⚙️ **AI Configuration**
3. Paste your key — it's stored securely in your browser's local storage

---

## 📦 Tech Stack

- **Frontend:** React 19 + Vite 8
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons:** Lucide React
- **OCR Fallback:** Tesseract.js
- **Mobile:** Capacitor (Android + iOS)
- **Auth/DB:** Firebase (mock for dev, real for production)
- **CI/CD:** GitHub Actions → automatic Android APK on every push

---

## 📱 Download

Latest Android APK and web builds are available on the [**Releases page**](https://github.com/SYNC-TECH-Solutions/centcible/releases).

---

## 👨‍💻 Author

**Sheraz Hussain** — [@SherazHussain546](https://github.com/SherazHussain546)  
SYNC TECH Solutions

---

© 2026 Centcible Inc. All rights reserved.
