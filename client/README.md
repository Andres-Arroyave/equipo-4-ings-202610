# Antojos UPB - Frontend (Client)

This is the mobile app for the **Antojos UPB** project, developed with **React Native** using the **Expo**-managed environment.

## 📋 Prerequisites

1. **Node.js** (LTS version installed on the system).
2. *(Optional but recommended)* The **Expo Go** app installed on your iOS or Android mobile device.

## ⚙️ Installing Dependencies

1. Open a terminal and navigate to the `client` folder.
2. Install the libraries and dependencies by running:
   ```bash
   npm install
   ```

## 🔌 Connecting to the Backend Server

Before running the app, remember to check your network settings.
If you’re testing the app **on a physical mobile device**, be aware that using `http://localhost:8080/` for your API calls **will not work**, as the device will look for a server within itself.

**Solution:** Go to the configuration or service files (for example, `src/services/authService.js`) and replace `localhost` with the **local IP address** of your computer connected to Wi-Fi (use the `ipconfig` command in Windows).
> Example: `http://192.168.1.15:8080/api/auth`

## 🚀 Running the Frontend

To start the Metro bundler and generate the QR code, run:
```bash
npx expo start
```

## 📱 Launching the Viewer
- **Physical device (Expo Go):** Scan the QR code using the app on Android, or with the camera on iOS.
- **Android Emulator:** Press the `a` key in the Expo terminal (requires Android Studio).
- **iOS Simulator:** Press the `i` key (requires macOS and Xcode).
- **Web Browser:** Press the `w` key in the Expo terminal.

  > ***Note on the Web version:*** If this is your first time running it in the browser, the project may display a message requesting additional libraries. If so, stop the server (`Ctrl + C`) and run:
  > ```bash
  > npx expo install react-native-web react-dom @expo/metro-runtime
  > ```
  > Then, restart with `npx expo start`.
