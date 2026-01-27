# Clarity - Focused Learning Platform

A minimal, distraction-free video learning platform built with Next.js, Supabase, and YouTube Data API.

## Features

- 🎯 **Focused Video Player** - Minimal interface with integrated note-taking
- 📚 **Collections** - Save and organize videos
- 📝 **Smart Notes** - Take notes with AI-powered summaries
- 🎨 **Visual Whiteboard** - Sketch ideas while learning
- 🔍 **Smart Search** - Search across approved channels and videos
- 📊 **Watch History** - Track your learning progress
- 🌓 **Dark Mode** - Easy on the eyes

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini API
- **Video**: YouTube Data API v3

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud account (for YouTube API & Gemini)

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# YouTube Data API
YOUTUBE_API_KEY=your_youtube_api_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup

Run the SQL migrations in your Supabase SQL editor:

1. `supabase/videos_schema.sql`
2. `supabase/collections_schema.sql`
3. `supabase/history_schema.sql`
4. `supabase/notes_schema.sql`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Performance Optimizations

- ✅ Server-side rendering for fast initial loads
- ✅ Image optimization with Next.js Image
- ✅ Database indexing on frequently queried columns
- ✅ YouTube API response caching (1 hour)
- ✅ Lazy loading for heavy components
- ✅ Production console.log removal

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Project Structure

```
clarity/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Home feed
│   ├── watch/            # Video player
│   ├── collections/      # Saved videos
│   ├── search/           # Search results
│   └── settings/         # User settings
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # UI primitives
│   └── auth/             # Auth components
├── lib/                   # Utilities and helpers
│   ├── actions/          # Server actions
│   ├── supabase/         # Supabase client
│   └── youtube-utils.ts  # YouTube API logic
└── supabase/             # Database schemas
```

## License

MIT

## Contact

For feedback or support: shuzaifah02@gmail.com
