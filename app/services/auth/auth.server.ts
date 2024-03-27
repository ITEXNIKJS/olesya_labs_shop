import { Authenticator } from "remix-auth";
import { sessionStorage } from ".";
import { users } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import { db } from "../db";
import argon2 from "argon2";

export const authenticator = new Authenticator<Pick<users, "id">>(
  sessionStorage,
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Логин и пароль обязательны");
    }

    const user = await db.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Неверный логин или пароль");
    }

    const isPasswordMatch = argon2.verify(user.password, password);

    if (!isPasswordMatch) {
      throw new Error("Неверный логин или пароль");
    }

    return { id: user.id };
  }),
  "user-pass"
);
