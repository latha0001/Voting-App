# The Startup Idea Evaluator

A beautiful React Native mobile app built with Expo that allows users to submit startup ideas, get AI-powered feedback, vote on community ideas, and compete on leaderboards.

## Features

### Core Features
- **Idea Submission**: Submit startup ideas with name, tagline, and description
- **AI Evaluation**: Get instant AI-generated ratings (60-100) with personalized feedback
- **Community Voting**: Vote on ideas (one vote per idea with persistent tracking)
- **Leaderboard**: View top 5 ideas ranked by votes or AI ratings
- **Persistent Storage**: All data saved locally using AsyncStorage

### Bonus Features
- **Dark Mode Toggle**: Beautiful dark/light theme switching with system preference detection
- **Toast Notifications**: Enhanced feedback for all user actions (submission, voting, sharing)
- **Share Functionality**: Share ideas via social media or copy to clipboard
- **Premium UI/UX**: Gradient backgrounds, smooth animations, and micro-interactions
- **Responsive Design**: Optimized for all mobile screen sizes

## Tech Stack
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with tab-based navigation
- **State Management**: React Context API with custom hooks
- **Storage**: AsyncStorage for persistent data
- **UI Components**: Custom components with LinearGradient and Lucide icons
- **Animations**: React Native Reanimated for smooth interactions
- **Notifications**: React Native Toast Message
- **Sharing**: Expo Clipboard and Expo Sharing APIs

## How to Run Locally

1. **Prerequisites**:
   ```bash
   npm install -g expo-cli
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Test on Device**:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or run in web browser for quick testing

## App Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Idea submission screen
│   ├── ideas.tsx          # Browse ideas screen
│   ├── leaderboard.tsx    # Top ideas leaderboard
│   └── _layout.tsx        # Tab navigation setup
├── _layout.tsx            # Root layout with providers
└── +not-found.tsx         # 404 screen

components/
├── GradientButton.tsx     # Reusable gradient button
├── IdeaCard.tsx          # Individual idea display card
└── DarkModeToggle.tsx    # Theme switcher component

contexts/
└── AppContext.tsx        # Global state management
```

## Key Implementation Details

### AI Rating System
- Generates realistic ratings between 60-100 for positive bias
- 15 different AI feedback messages for variety
- Instant evaluation on submission

### Voting System
- One vote per idea restriction using AsyncStorage
- Real-time vote count updates
- Visual feedback for voted items

### Dark Mode
- System preference detection on first launch
- Persistent theme preference storage
- Comprehensive color scheme for all UI elements

### Data Persistence
- Ideas stored in AsyncStorage as JSON
- User votes tracked separately to prevent duplicate voting
- Theme preference saved for consistent experience

## Leaderboard Features
- **Dual Rankings**: Sort by community votes or AI ratings
- **Visual Hierarchy**: Gold, silver, bronze medals for top 3
- **Statistics**: Total ideas, votes, and average AI score
- **Real-time Updates**: Automatically reflects new submissions and votes

## Sharing Capabilities
- **Native Sharing**: Uses device's built-in share functionality
- **Clipboard Fallback**: Automatically copies to clipboard if sharing unavailable
- **Rich Content**: Includes idea name, tagline, rating, votes, and description

## Design Philosophy
The app follows Apple-level design aesthetics with:
- **Clean Typography**: Proper hierarchy with readable font sizes
- **Consistent Spacing**: 8px grid system throughout
- **Color Psychology**: Purple for innovation, blue for trust, gold for achievement
- **Micro-interactions**: Subtle animations for better user feedback
- **Accessibility**: High contrast ratios and touch-friendly targets

## Deployment Options

### Option 1: Expo Go (Recommended)
```bash
expo publish
```
Share the generated Expo link for instant testing on any device.

### Option 2: Standalone Build
```bash
expo build:android
expo build:ios
```
Generate APK/IPA files for distribution.

### Option 3: Web Preview
The app runs perfectly in web browsers for quick demonstrations.

## App Metrics
- **Performance**: Optimized for 60fps animations
- **Bundle Size**: Minimal dependencies for fast loading
- **Offline Support**: Full functionality without internet connection
- **Cross-Platform**: Works on iOS, Android, and web

## Demo Video

 Live LInk: https://the-startup-idea-eva-4ow8.bolt.host/

 Demo Video: https://drive.google.com/file/d/10KvsUwzDqcze03FZeVj5_iGHpqC9reSO/view?usp=drive_link

Built with ❤️ for the Mobile App Internship Assignment
