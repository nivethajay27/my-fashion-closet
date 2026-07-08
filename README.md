# Fashion Closet

Fashion Closet is a full-stack virtual wardrobe app with an intelligent outfit stylist, a simulated try-on preview, daily recommendations, trip packing, wishlist gap analysis, and inspiration-based outfit recreation. The interface is built around a modern editorial fashion aesthetic with soft pink, lavender, charcoal, and periwinkle styling.

## Screenshots

### Home / Virtual Closet

![Fashion Closet home page](./client/public/screenshots/home.jpg)

### AI Stylist / Try-On Preview

![Fashion Closet stylist page](./client/public/screenshots/stylist.jpg)

### Saved Outfits

![Fashion Closet saved outfits page](./client/public/screenshots/outfits.jpg)

### Upload / Metadata Confirmation

![Fashion Closet upload page](./client/public/screenshots/upload.jpg)

### Trip Packing Planner

![Fashion Closet trips page](./client/public/screenshots/trips.jpg)

### Wishlist / Closet Gap Analysis

![Fashion Closet wishlist page](./client/public/screenshots/wishlist.jpg)

### Inspiration / Recreate With My Closet

![Fashion Closet inspiration page](./client/public/screenshots/inspiration.jpg)

## Features

- Virtual closet with rich clothing metadata: category, color, material, season, occasion, image URL, and tags.
- Clothing image upload with suggested metadata and manual confirmation before saving to the closet.
- Closet filtering by category, occasion, season/weather, and color compatibility.
- Style-goal onboarding for preferred aesthetics, lifestyle context, disliked colors, dress code, climate, and confidence notes.
- Daily stylist page that recommends an outfit for the current occasion, weather, time of day, and saved style profile.
- Rule-based outfit generation that creates valid outfit combinations:
  - one top plus one bottom, or one dress
  - one pair of shoes
  - optional outerwear and accessory
  - no duplicate core categories
  - season-aware matching
- Outfit scoring for color harmony, occasion match, season match, and style consistency.
- AI stylist logic through `generateStyledOutfit(userPreferences, wardrobeItems, context)`.
- Simulated virtual try-on with layered clothing images over an avatar or uploaded user image.
- Swap, regenerate, lock item, and save outfit controls.
- Outfit planner with a 7-day calendar, saved-look scheduling, and worn-status tracking.
- Trip packing planner that generates day-by-day outfits and a deduplicated packing list.
- Wishlist with closet fit scoring, category gap analysis, and matching pieces from the existing wardrobe.
- Community inspiration page that recreates look moods from the user's own closet and highlights missing categories.
- Demo wardrobe fallback when the backend API is not available.

## App Routes

```text
/              Smart closet and wardrobe filters
/today         Daily stylist recommendation
/style-goals   Personal style onboarding
/upload        Clothing image upload and metadata confirmation
/builder       Try-on stylist and outfit generator
/outfits       Saved outfits and 7-day planner
/trips         Trip packing planner
/wishlist      Wishlist and closet gap analysis
/inspiration   Inspiration looks and recreate-with-my-closet
```

## Tech Stack

- Frontend: React, React Router, CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Data access: `pg`

## Project Structure

```text
client/
  public/screenshots/       App screenshots used by this README
  src/components/           Closet, stylist, try-on, and outfit components
  src/pages/                Closet, Today, Goals, Upload, Stylist, Planner, Trips, Wishlist, and Inspiration pages
  src/closetStorage.js      Local wardrobe and wishlist persistence helpers
  src/styleProfile.js       Style-goal and outfit-calendar persistence helpers
  src/stylingEngine.js      Outfit generation and scoring logic
server/
  sql/schema.sql            PostgreSQL schema
  sql/seed.sql              Seed wardrobe data
  src/routes/               Items and outfits API routes
```

## Getting Started

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Create a server environment file with your PostgreSQL URL:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/fashion_closet
PORT=4000
```

Set up the database:

```bash
psql "$DATABASE_URL" -f server/sql/schema.sql
psql "$DATABASE_URL" -f server/sql/seed.sql
```

Run the backend:

```bash
cd server
npm start
```

Run the frontend:

```bash
cd client
npm start
```

The app opens at:

```text
http://localhost:3000
```

## Frontend Scripts

```bash
npm start
npm run build
npm test -- --watchAll=false
```

## API Overview

```text
GET    /api/health
GET    /api/items
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
GET    /api/outfits
POST   /api/outfits
DELETE /api/outfits/:id
```

## Notes

The frontend includes local demo fallbacks, so the closet, stylist, upload, trip, wishlist, inspiration, and planner flows remain usable even if the API or database is not running. Saved outfits are persisted to the backend when available, and fall back to browser local storage during demo mode.
