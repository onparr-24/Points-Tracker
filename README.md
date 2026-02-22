# Points Tracker

A mobile-friendly web app for tracking player points across multiple games. Built with React, Firebase, and MUI.

## Features

- **Create a Game** — Set a game name and your player name to start a new game
- **Join a Game** — Enter a game name and your player name to join an existing game (up to 4 players)
- **View Games** — Browse your locally saved games and open the scoreboard for any of them
- **Leave a Game** — Remove a game from your local saved list
- **Live Scoreboard** — See all players ranked by points with gold/silver/bronze ranking
- **Add / Subtract Points** — Tap + or − on any player row to update their score (supports up to 3 decimal places)
- **Persistent Storage** — Games are saved to `localStorage` for instant access and synced to Firestore for cross-device sharing

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| UI Components | Material UI (MUI) |
| Routing | React Router v6 |
| Backend / Database | Firebase Firestore |
| Auth | Firebase Anonymous Auth |
| Hosting | Netlify |

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page with action buttons
│   └── Game.jsx          # Scoreboard page for a single game
├── Components/
│   ├── Create Game.jsx   # Modal to create a new game
│   ├── Join Game.jsx     # Modal to join an existing game
│   ├── View Game.jsx     # Modal listing locally saved games
│   └── Leave Game.jsx    # Modal to remove a game from local storage
└── services/
    ├── firebase.js       # Firebase init, auth, and anonymous sign-in
    ├── games.js          # Firestore helpers (create, join, update points)
    └── localGames.js     # localStorage helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Anonymous Auth enabled

### Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

### Firestore Security Rules

Publish these rules in the Firebase Console under **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow get: if request.auth != null;
      allow list: if request.auth != null && resource.data.owner == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.owner == request.auth.uid;
      allow update: if request.auth != null
                    && (
                      resource.data.owner == request.auth.uid
                      || (
                        request.resource.data.owner == resource.data.owner
                        && request.resource.data.gameName == resource.data.gameName
                      )
                    );
      allow delete: if request.auth != null && resource.data.owner == request.auth.uid;
    }
  }
}
```

## Deployment

The app is hosted on Netlify and deploys automatically on every push to `main`. The `public/_redirects` file ensures React Router works correctly on direct URL access.
