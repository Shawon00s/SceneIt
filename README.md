# 🎬 SceneIt

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Shawon00s/SceneIt/ci.yml?branch=main)](https://github.com/Shawon00s/SceneIt/actions)
[![Expo](https://img.shields.io/badge/built%20with-expo-4630eb.svg?logo=expo&logoColor=white)](https://expo.dev/)

> **A modern movie discovery mobile application.**

---

## ✨ Overview

SceneIt is a modern movie discovery mobile application built with React Native, Expo, and Node.js. Discover popular movies, search for your favorites, save movies to watch later, and get personalized recommendations.

---

## 📥 Quick Links

- [Mobile App README](mobile/README.md)
- [Backend API README](backend/README.md)
- [Code of Conduct](CODE_OF_CONDUCT.md) <!-- If exists -->
- [Open an Issue](https://github.com/Shawon00s/SceneIt/issues)
- [Contributing Guide](#-contributing)

---

## 📱 Features

- **Movie Search**: Search through thousands of movies with real-time results
- **💾 Save Movies**: Save movies to your personal watchlist
- **🎭 Movie Details**: View detailed information including cast, ratings, and synopsis
- **📱 Cross-Platform**: Available on iOS, Android, and Web
- **🎨 Modern UI**: Beautiful interface with NativeWind (Tailwind CSS for React Native)
- **🔐 User Authentication**: Secure user accounts and personalized experience
- **🚀 Real-time Data**: Powered by The Movie Database (TMDB) API

---

## 🏗️ Architecture

This project follows a full-stack architecture:

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Context API
- **API Integration**: Custom hooks with TypeScript

### Backend (API Server)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **External APIs**: The Movie Database (TMDB) API integration

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))
- Expo CLI (optional, for additional features)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/Shawon00s/SceneIt.git
    cd SceneIt
    ```

2. **Install dependencies for both frontend and backend**
    ```bash
    # Install mobile app dependencies
    cd mobile
    npm install

    # Install backend dependencies
    cd ../backend
    npm install
    ```

3. **Set up environment variables**

   **For the mobile app** (`mobile/.env`):
   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key_here
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
