import { faker } from "@faker-js/faker";
import { Genre, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = Array.from({ length: 15 }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: "demo@123",
  }));

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        password: hashedPassword,
      },
    });
  }
  console.log(`${users.length} users created`);

  const books = Array.from({ length: 30 }).map(() => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(30),
    genre: faker.helpers.arrayElement(Object.values(Genre)),
    author: faker.person.fullName(),
  }));

  const createdBooks = await prisma.book.createMany({
    data: books,
  });
  console.log(`${createdBooks.count} books created`);

  // Get all users from the database (for creating reviews)
  const allUsers = await prisma.user.findMany();

  // Create random reviews for each book
  for (const book of await prisma.book.findMany()) {
    const reviewCount = faker.number.int({ min: 1, max: 5 });

    const reviews = Array.from({ length: reviewCount }).map(() => ({
      rating: faker.number.int({ min: 1, max: 5 }),
      content: faker.lorem.sentence(6),
      bookId: book.id,
      userId: faker.helpers.arrayElement(allUsers).id,
    }));

    await prisma.review.createMany({
      data: reviews,
      skipDuplicates: true,
    });

    console.log(`${reviewCount} reviews created for book "${book.title}"`);
  }

  console.log("Seeding completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
