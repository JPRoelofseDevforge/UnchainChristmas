# Unchain Christmas

A fun, kid-friendly web app for Christmas parties for children in need. People can view parties, see children's wishlists, and pledge to buy gifts.

## Features

- View Christmas parties with details
- See children attending each party with their wishlists
- Pledge to buy gifts for children
- Admin panel for managing parties, children, and wishlists
- Mobile-responsive design with cheerful colors

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Azure App Service + Azure Database for PostgreSQL

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://rx:qwe12345_@rxg.postgres.database.azure.com:5432/Unchain?sslmode=require"
   ADMIN_EMAIL="admin@unchain.org"
   ADMIN_PASSWORD="admin123"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

- **Party**: id, name, date, location, description
- **Child**: id, name, age, partyId, pledged
- **WishlistItem**: id, childId, text
- **Pledge**: id, childId, donorName, donorEmail, message
- **AdminUser**: id, email, password (hashed)

## API Routes

- `GET /api/parties` - List all parties
- `GET /api/parties/[id]` - Get party details with children
- `POST /api/pledge` - Create a pledge for a child
- `POST /api/admin/party` - Create a new party (admin only)
- `POST /api/admin/child` - Add a child to a party (admin only)
- `POST /api/admin/wishlist` - Add wishlist item (admin only)

## Deployment to Azure

### 1. Azure Database for PostgreSQL

The database is already set up with the connection string provided.

### 2. Azure App Service

1. Create a new App Service in Azure Portal
2. Set the runtime stack to Node.js 18 LTS
3. Configure environment variables in App Service settings:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Deploy using GitHub Actions or Azure CLI:

```bash
az webapp up --name unchain-christmas --resource-group your-resource-group --runtime "NODE:18-lts"
```

### 3. Build and Deploy

```bash
npm run build
```

The app will be optimized for production and ready for deployment.

## Admin Access

Access the admin panel at `/admin` with:
- Email: admin@unchain.org
- Password: admin123

## Colors

The app uses Unchain Our Children's brand colors:
- Red: #e53e3e
- Green: #38a169
- Blue: #3182ce
- Yellow: #d69e2e
- Orange: #dd6b20

## License

This project is built for Unchain Our Children organization.