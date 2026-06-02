# Vaultr â€” Luxury Smart Expense Tracker

> **Track Expenses. Scan Receipts. Command Your Wealth.**

---

## ðŸ“² Download Vaultr Mobile Apps
* ðŸ¤– **[Download Android APK (Direct Download)](https://github.com/SYNC-TECH-Solutions/Vaultr/raw/main/app-debug.apk)** â€” Install instantly on any Android device!
* ðŸŽ **[Download iOS & Web Releases](https://github.com/SYNC-TECH-Solutions/Vaultr/releases/latest)** â€” Check the latest updates and compile native builds.

---

Vaultr is a premium, AI-powered financial management app for Web, Android, and iOS. Built with React + Vite and powered by **Google Gemini AI** for intelligent receipt parsing and personalised savings advice.

---

## âœ¨ Features

| Feature | Description |
|---|---|
| ðŸ“Š **Dashboard** | Real-time spending overview with interactive charts |
| ðŸ§¾ **AI Receipt Scanning** | Upload receipts â€” Gemini AI itemises and categorises instantly |
| ðŸŽ¯ **Budget Goals** | Set monthly category limits with live progress tracking |
| ðŸ’³ **Loans Tracker** | Track debts, pay-downs, and loan completion |
| ðŸ‘¥ **Partner Hub** | Shared grocery lists, real-time partner chat, and joint ledger |
| ðŸ“„ **Monthly Statements** | Premium PDF statements with AI-generated savings tips |
| ðŸ’± **Multi-Currency** | USD, EUR, GBP, JPY, INR, CAD, AUD support |
| ðŸ“± **Android & iOS** | Native mobile apps via Capacitor |

---

## ðŸš€ Quick Start (Web)

```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## ðŸ“± Mobile (Android)

1. Install [Android Studio](https://developer.android.com/studio)
2. Build the web app: `npm run build`
3. Sync Capacitor: `npx cap sync`
4. Open Android Studio: `npx cap open android`
5. Run on emulator or physical device

## ðŸ“± Mobile (iOS)

> Requires macOS with Xcode installed.

1. Build the web app: `npm run build`
2. Sync Capacitor: `npx cap sync`
3. Open Xcode: `npx cap open ios`
4. Run on simulator or physical device

---

## ðŸ¤– Gemini AI Setup

To enable AI-powered receipt scanning:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/)
2. Open the app â†’ **Scan Receipt** â†’ click **AI Configuration**
3. Paste your key and click **Save Key**

---

## ðŸ“¦ Tech Stack

- **Frontend**: React 19, Vite 8, React Router 7
- **Charts**: Recharts
- **Icons**: Lucide React
- **OCR Fallback**: Tesseract.js
- **Mobile**: Capacitor (Android + iOS)
- **AI**: Google Gemini 2.5 Flash
- **Auth & DB**: Firebase (mock layer for local dev)

---

## ðŸ”„ CI/CD

GitHub Actions automatically:
- Builds the web app on every push to `main`
- Compiles an Android Debug APK
- Creates a GitHub Release with downloadable artifacts

See [`.github/workflows/build.yml`](.github/workflows/build.yml)

---

## ðŸ‘¤ Author

**Sheraz Hussain** â€” [@SherazHussain546](https://github.com/SherazHussain546)
SYNC Tech Solutions

---

Â© 2026 Vaultr Inc. All rights reserved.

