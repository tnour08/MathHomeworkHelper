# Math Homework Helper

A mobile app that uses AI to help students solve and understand math problems. Take a photo of any math problem and get a step-by-step explanation powered by Google Gemini.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app installed on your phone (for running on a physical device), or an Android/iOS emulator
- An [OpenRouter](https://openrouter.ai/) API key

### Installation

1. Clone the repo and navigate into the project:

   ```bash
   cd MathHomeworkHelper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your OpenRouter API key:

   ```
   OPENROUTER_API_KEY=your_key_here
   ```

### Running the App

```bash
npm start          # Start the Expo development server
npm run android    # Run on Android emulator or device
npm run ios        # Run on iOS simulator or device
npm run web        # Run in a browser
```

After running `npm start`, scan the QR code with Expo Go (Android) or the Camera app (iOS) to open the app on your phone.

---

## What the App Does

The app has five main tabs:

- **Dashboard** — Take or upload a photo of a math problem. The AI analyzes it and returns a step-by-step solution including the topic, difficulty level, and a helpful tip.
- **Saved** — Browse problems you've saved from the Dashboard for later review.
- **Learn** — Explore a library of 50+ structured math courses organized by topic and difficulty.
- **Quiz** — Practice with multiple-choice quizzes to test your knowledge.
- **Settings** — Configure your profile, learning preferences, theme, and notifications.

---

## How the Code Works

### Project Structure

```
MathHomeworkHelper/
├── App.js                    # App root
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js   # Bottom-tab navigator
│   ├── screens/              # One file per tab
│   │   ├── DashboardScreen.js
│   │   ├── SavedScreen.js
│   │   ├── LearnScreen.js
│   │   ├── QuizScreen.js
│   │   └── SettingsScreen.js
│   ├── components/           # Reusable UI pieces
│   │   ├── ProgressBar.js
│   │   ├── DifficultyPill.js
│   │   ├── TopicBadge.js
│   │   └── StatCard.js
│   ├── services/             # Business logic
│   │   ├── openrouter.js     # AI API integration
│   │   └── storage.js        # Local persistence
│   ├── context/
│   │   └── SavedContext.js   # Global saved-problems state
│   ├── data/
│   │   ├── courses.js        # Static course catalogue
│   │   └── placeholder.js    # Sample data
│   └── theme/
│       └── colors.js         # Color palette and tokens
├── .env                      # API key (not committed)
├── app.json                  # Expo configuration
└── babel.config.js           # Babel config (dotenv plugin)
```

### Architecture

The app uses a straightforward layered architecture:

**Navigation → Screens → Services → Storage/API**

`App.js` renders a `SafeAreaProvider` wrapping `AppNavigator`, which sets up the bottom-tab navigator and wraps everything in `SavedProvider` so all screens can access saved problems.

Each screen is self-contained and handles its own local UI state with `useState`. Shared state (the list of saved problems) lives in `SavedContext`.

---

### AI Problem Solving (`src/services/openrouter.js`)

This is the core of the app. When a user picks or photographs a math problem:

1. The image is read from the filesystem and converted to a base64 string using `expo-file-system`.
2. A POST request is sent to the OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`) using the `google/gemini-2.0-flash-001` model.
3. The request includes the base64 image and a system prompt that instructs the model to return a specific JSON structure.
4. The response is parsed and returned to `DashboardScreen` as an object with these fields:

```js
{
  problem: string,       // Restated problem text
  answer: string,        // Final answer
  topic: string,         // e.g. "Algebra", "Geometry"
  difficulty: string,    // "Easy" | "Medium" | "Hard"
  steps: [               // Array of solution steps
    {
      step: number,
      title: string,
      explanation: string,
      expression: string
    }
  ],
  tip: string            // A helpful learning tip
}
```

The API is called with `temperature: 0.1` to keep responses deterministic and consistent.

---

### Saving Problems (`src/services/storage.js` + `src/context/SavedContext.js`)

Solved problems can be saved locally using `AsyncStorage` (device storage that persists across app restarts).

`storage.js` is a thin wrapper around `AsyncStorage` that handles reading, writing, and deleting the saved problems list (stored as a JSON array under a single key).

`SavedContext.js` creates a React Context that loads the saved list on startup and exposes three things to any screen:

- `savedItems` — the current list
- `addSaved(problem)` — saves a problem and updates state
- `removeSaved(id)` — deletes a problem and updates state

Any screen can access this via the `useSaved()` hook.

---

### Navigation (`src/navigation/AppNavigator.js`)

Uses React Navigation's `createBottomTabNavigator` with five tabs. Icons come from `@expo/vector-icons` (Feather set). The `SavedProvider` wraps the navigator so context is available to all screens.

---

### Screens

**`DashboardScreen.js`**
The main screen. Handles image picking (camera or gallery) via `expo-image-picker`, shows a preview, calls `analyzeMathImage()` from `openrouter.js`, and displays the result. Steps are expandable/collapsible via `expandedStep` state. A save button calls `addSaved()` from context.

**`SavedScreen.js`**
Reads `savedItems` from context and renders a scrollable list. Each card is expandable to show the full step-by-step solution. Delete triggers a confirmation alert before calling `removeSaved()`.

**`LearnScreen.js`**
Loads the static `COURSES` array from `src/data/courses.js` and renders a searchable, filterable course catalogue. Selecting a course shows a detail view with the lesson list. All navigation within this screen is handled with local state (no separate route).

**`QuizScreen.js`**
Displays a list of practice quizzes. Selecting one shows sample questions with multiple-choice answers. Answer checking and score state are managed locally.

**`SettingsScreen.js`**
Static settings UI with toggles for notifications, a difficulty preference picker, and links. No backend — preference state is local only.

---

### Components (`src/components/`)

Small, focused presentational components used across screens:

| Component | Purpose |
|---|---|
| `DifficultyPill` | Colored badge showing Easy / Medium / Hard |
| `TopicBadge` | Tag showing the math topic (Algebra, Geometry, etc.) |
| `ProgressBar` | Horizontal progress indicator |
| `StatCard` | Card for displaying a stat with a label and value |

---

### Theming (`src/theme/colors.js`)

All colors are defined here as named constants and semantic tokens (e.g., `primary`, `background`, `textSecondary`). Screens import from this file rather than hardcoding hex values, making it straightforward to update the color scheme in one place.

---

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Language | JavaScript (React 19) |
| Navigation | React Navigation v7 (bottom tabs) |
| AI API | OpenRouter + Google Gemini 2.0 Flash |
| Local Storage | AsyncStorage |
| Image Handling | expo-image-picker, expo-file-system |
| Icons | @expo/vector-icons (Feather) |
| Env Variables | react-native-dotenv (via Babel) |
