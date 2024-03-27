import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.create({
    data: {
      email: "admin@example.com",
      password: await argon2.hash("admin"),
      birth_date: new Date("2000-01-01"),
      first_name: "Admin",
      gender: "MALE",
      last_name: "Admin",
      middle_name: "Admin",
      phone: "1234567890",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
