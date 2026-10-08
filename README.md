# Rick and Morty | Multiverse Explorer

*A personal React project exploring the Rick and Morty universe.*

Multiverse Explorer is a responsive web application built with React, JavaScript, and the [Rick and Morty API](https://rickandmortyapi.com/).

The project started as a rebuild of one of my earlier React applications. What began as an opportunity to revisit my old code gradually turned into something more: a chance to rethink the structure, improve the user experience, and build a more complete application from the ground up.

My goal was to keep the project simple and enjoyable to use while paying attention to the details that make a difference.

## Preview

*Screenshots coming soon.*

## Features

### Characters
- Browse characters from the Rick and Morty universe.
- Search characters by name.
- Filter by status, species, and gender.
- Combine search and filters to narrow down results.
- Expand character cards to explore additional details.

### Locations
- Explore locations across the multiverse.
- Search locations by name.
- View location types, dimensions, and resident counts.

### Episodes
- Browse episodes from the series.
- Search episodes by name.
- View episode codes, air dates, and character counts.

### User Experience
- Responsive layouts for desktop, tablet, and mobile.
- Dynamic pagination based on API results.
- Loading, empty, and error states with retry functionality.
- Custom navigation, subtle animations, and interactive feedback.
- Keyboard accessibility and reduced-motion support.

## Tech Stack

- **React** — Component-based UI and state management
- **JavaScript** — Application logic and interactions
- **Vite** — Development environment and build tooling
- **CSS** — Responsive layouts, animations, and custom design tokens
- **Rick and Morty API** — Character, location, and episode data
- **ESLint** — Code quality checks

## What I Focused On

This project was not just about displaying data from an API.

I wanted to revisit the way I approach frontend development, especially how individual components fit together and how an application behaves beyond its initial appearance.

Some of the areas I spent the most time on were:

- Building reusable components without adding unnecessary complexity.
- Managing asynchronous API requests, loading states, and errors.
- Making search, filters, and pagination work together consistently.
- Designing responsive layouts that feel natural across different screen sizes.
- Refining small interactions, including hover states, focus behavior, and animations.
- Keeping the code organized and maintainable as the application grew.

There were plenty of small challenges along the way, particularly around responsive behavior and UI interactions. Working through those details became one of the most valuable parts of the project.

## Getting Started

To run the project locally, you'll need Node.js and npm.

**1. Clone the repository**

```bash
git clone https://github.com/FrankoM85/rick-and-morty-2026.git
cd rick-and-morty-2026
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

Open the local URL shown in your terminal.

To create a production build:

```bash
npm run build
```

## Project Structure

```text
src/
├── api/                 # API endpoints and data-fetching hooks
├── assets/              # Images and visual assets
├── components/
│   ├── LandingPage/
│   ├── Navbar/
│   ├── CharactersPage/
│   ├── CharacterCard/
│   ├── LocationsPage/
│   ├── LocationCard/
│   ├── EpisodesPage/
│   ├── EpisodeCard/
│   └── ResultsState/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## API & Credits

Character, location, and episode data is provided by the [Rick and Morty API](https://rickandmortyapi.com/).

Rick and Morty and its characters belong to their respective creators and rights holders.

This is an independent, non-commercial project created for learning and portfolio purposes.

---

*Built with curiosity, patience, and a lot of attention to detail.*
