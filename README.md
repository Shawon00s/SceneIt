# 🎬 SceneIt

SceneIt is a modern movie discovery mobile application built with React Native, Expo, and Node.js. Di   ├── components/                  # Reusable UI components
   │   ├── MovieCard.tsx           # Movie card component
   │   ├── SaveButton.tsx          # Save movie button
   │   ├── SearchBar.tsx           # Search input component
   │   └── StarRating.tsx          # 5-star rating componenter popular movies, search for your favorites, save movies to watch later, and get personalized recommendations.

## 📱 Features

- **🔍 Movie Search**: Search through thousands of movies with real-time results
- **💾 Save Movies**: Save movies to your personal watchlist
- **🎭 Movie Details**: View detailed information including cast, ratings, and synopsis
- **⭐ Movie Rating**: Interactive 5-star rating system with persistent storage
- **� User Profiles**: Profile management with Dicebear avatars
- **�📱 Cross-Platform**: Available on iOS, Android, and Web
- **🎨 Modern UI**: Beautiful interface with NativeWind (Tailwind CSS for React Native)
- **🔐 User Authentication**: Secure user accounts with JWT and bcrypt encryption
- **🌈 Gradient Design**: Elegant black gradient containers and visual effects
- **🚀 Real-time Data**: Powered by The Movie Database (TMDB) API
- **⚡ Performance Optimized**: Infinite scroll, image optimization, and smooth animations

## 🏗️ Architecture

This project follows a full-stack architecture:

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand, React Context API, AsyncStorage
- **API Integration**: Custom hooks with TypeScript
- **UI Components**: StarRating, MovieCard, SaveButton, SearchBar
- **Authentication**: JWT with secure token storage

### Backend (API Server)
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Profile Images**: Dicebear API integration for user avatars
- **External APIs**: The Movie Database (TMDB) API integration

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
   ```

   **For the backend** (`backend/.env`):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/sceneit
   JWT_SECRET=your_jwt_secret_here
   TMDB_API_KEY=your_tmdb_api_key_here
   NODE_ENV=development
   ```

4. **Start the development servers**

   **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

   **Start the mobile app:**
   ```bash
   cd mobile
   npm start
   ```

5. **Run the app**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📁 Project Structure

```
SceneIt/
├── mobile/                          # React Native mobile app
│   ├── app/                         # App screens (file-based routing)
│   │   ├── (tabs)/                  # Tab navigation screens
│   │   │   ├── index.tsx           # Home screen (popular movies)
│   │   │   ├── search.tsx          # Search screen
│   │   │   ├── saved.tsx           # Saved movies screen
│   │   │   └── profile.tsx         # User profile screen
│   │   ├── movies/[id].tsx         # Movie details screen
│   │   └── _layout.tsx             # Root layout
│   ├── components/                  # Reusable UI components
│   │   ├── MovieCard.tsx           # Movie card component
│   │   ├── SaveButton.tsx          # Save movie button
│   │   └── SearchBar.tsx           # Search input component
│   ├── services/                    # API services and custom hooks
│   │   ├── api.ts                  # TMDB API integration
│   │   ├── chatApi.ts              # Backend API integration
│   │   ├── useFetch.ts             # Data fetching hook
│   │   └── useInfiniteScroll.ts    # Infinite scroll hook
│   ├── contexts/                    # React Context providers
│   │   └── SavedMoviesContext.tsx  # Saved movies state management
│   ├── constants/                   # App constants
│   │   ├── icons.ts                # Icon constants
│   │   └── images.ts               # Image constants
│   └── interfaces/                  # TypeScript type definitions
│       └── interfaces.d.ts         # Movie and API interfaces
├── backend/                         # Node.js API server
│   ├── src/
│   │   ├── controllers/            # Route controllers
│   │   ├── models/                 # MongoDB models
│   │   │   ├── User.js            # User model
│   │   │   └── MovieSearch.js     # Movie search tracking
│   │   ├── routes/                 # API routes
│   │   │   └── authRoutes.js      # Authentication routes
│   │   ├── lib/
│   │   │   └── db.js              # Database connection
│   │   └── index.js               # Server entry point
│   └── package.json
└── README.md
```

## 🔧 Available Scripts

### Mobile App (`mobile/`)
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
npm run lint       # Run ESLint
```

### Backend (`backend/`)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

## 🛠️ Technology Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe JavaScript
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based navigation
- **Zustand** - Lightweight state management
- **React Context** - Additional state management
- **AsyncStorage** - Local data persistence
- **Expo Image** - Optimized image component
- **Expo Linear Gradient** - Gradient effects

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### External APIs
- **The Movie Database (TMDB)** - Movie data and images
- **Dicebear API** - User avatar generation

## 🔐 Authentication

SceneIt implements secure user authentication with:
- JWT token-based authentication
- Password encryption using bcrypt
- Automatic profile image generation via Dicebear API
- Protected routes for saved movies and user profiles
- Secure token storage using AsyncStorage
- Session persistence across app restarts

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for all screen sizes
- **Dark Theme**: Modern dark interface with gradient effects
- **Fixed Logo Headers**: Consistent branding across all screens
- **Smooth Animations**: Using React Native Reanimated
- **Infinite Scroll**: Seamless movie browsing experience
- **Image Optimization**: Fast loading with Expo Image
- **Search Debouncing**: Optimized search performance
- **Interactive Ratings**: 5-star rating system with visual feedback
- **Gradient Containers**: Elegant black gradient designs
- **Professional Styling**: Clean, modern interface elements

## 📱 App Screens

1. **Home Tab**: Browse popular movies with infinite scroll
2. **Search Tab**: Search for specific movies with real-time results
3. **Saved Tab**: View your saved watchlist with easy management
4. **Profile Tab**: User account management with avatar display
5. **Movie Details**: Detailed movie information with ratings, reviews, and 5-star rating system
6. **Authentication**: Login and signup screens with gradient design

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

## 🚀 Deployment

### Mobile App
The mobile app can be deployed using:
- **Expo Application Services (EAS)** for app store deployment
- **Expo Web** for web deployment

### Backend
The backend can be deployed to:
- **Heroku** - Easy deployment with Git
- **Railway** - Modern deployment platform
- **DigitalOcean** - Cloud infrastructure
- **AWS** - Amazon Web Services

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Dicebear](https://dicebear.com/) for avatar generation API
- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) for cross-platform mobile development
- [NativeWind](https://www.nativewind.dev/) for Tailwind CSS integration

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub or contact the development team.

---

Made with ❤️ by the SceneIt Team