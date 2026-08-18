/**
 * Optional dev seed script. Run with `npm run db:seed` after
 * `npm run prisma:migrate`. Creates one demo user so you can sign in
 * immediately without going through the sign-up form.
 *
 * Demo login: demo@mochamovies.tv / password123
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@mochamovies.tv" },
    update: {},
    create: {
      email: "demo@mochamovies.tv",
      username: "demo",
      name: "Demo User",
      passwordHash,
      bio: "Just here to watch movies.",
    },
  });

  console.log(`Seeded demo user: ${user.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
