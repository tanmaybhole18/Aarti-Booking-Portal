# Navratri Aarti Booking System

A modern web application for booking Navratri Aarti slots built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Slot Management**: 20 Navratri Aarti slots (22/09/2025 to 01/10/2025)
- **Capacity Control**: 2 bookings per slot maximum
- **Real-time Booking**: First-come-first-serve booking system
- **Admin Panel**: Manage bookings with edit/delete functionality
- **Responsive Design**: Modern UI with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd navratri-aarti
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your database URL in `.env`
```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

5. Set up the database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

6. Start the development server
```bash
npm run dev
```

## Deployment on Netlify

### Method 1: Connect GitHub Repository

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

### Method 2: Deploy from Local Build

1. Build the project locally
```bash
npm run build
```

2. Install Netlify CLI
```bash
npm install -g netlify-cli
```

3. Deploy to Netlify
```bash
netlify deploy --prod --dir=.next
```

### Environment Variables on Netlify

1. Go to Site settings > Environment variables
2. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `ADMIN_PASSWORD`: Admin panel password (optional)

### Database Setup

1. Create a PostgreSQL database (recommend Neon or Supabase)
2. Get the connection string
3. Add it to Netlify environment variables
4. The database will be automatically set up on first deployment

## Project Structure

```
navratri-aarti/
├── app/
│   ├── admin/           # Admin panel
│   ├── book/            # Booking pages
│   ├── view-aarti/      # View all bookings
│   └── page.tsx         # Homepage
├── lib/
│   ├── actions.ts       # Server actions
│   ├── admin-actions.ts # Admin server actions
│   └── prisma.ts        # Prisma client
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Database seeding
└── public/
    └── UtsavAnand.svg   # Logo
```

## Admin Access

- **URL**: `/admin`
- **Password**: `admin123` (or set `ADMIN_PASSWORD` env var)

## API Routes

- `GET /` - Homepage with slot listings
- `GET /view-aarti` - View all bookings table
- `GET /book/[slotId]` - Booking form
- `POST /book/[slotId]` - Submit booking
- `GET /admin` - Admin panel (password protected)

## Database Schema

### AartiSlot
- `id`: String (Primary Key)
- `date`: String (Date in YYYY-MM-DD format)
- `time`: String ("First Aarti" or "Second Aarti")
- `capacity`: Int (default: 2)
- `bookings`: Booking[] (One-to-many)

### Booking
- `id`: String (Primary Key)
- `name`: String (Resident name)
- `flat`: String (Flat number)
- `phone`: String (Phone number)
- `slotId`: String (Foreign Key)
- `createdAt`: DateTime

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational/personal use.

## Support

For issues or questions, please create an issue in the repository.