Simple [Next.js](https://nextjs.org/) app to demonstrate how to use [SQLite](https://sqlite.org) in server components using [Prisma](https://www.prisma.io/) as ORM, [shadcn/ui](https://ui.shadcn.com) components and [Lucia](https://lucia-auth.com) for authentication (username and hashed password stored in local SQLite db).

After cloning the repo and installing dependencies (`npm install`) follow these steps to run the app:

- Create `.env` and specify where SQLite should store its data, e.g. `DATABASE_URL="file:./dev.db"`
- Run `npx prisma db push` to create the SQLite database file (e.g. `./prisma/dev.db`) and to load the schema into it
- `npm run dev` to start the development server.

The app will be available at [http://localhost:3000](http://localhost:3000) where you can sign up with a new user which is stored locally. To inspect the SQLite database, you can use Prisma studio by running `npx prisma studio` and opening [http://localhost:5555](http://localhost:5555).
