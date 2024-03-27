import { Authenticator } from "remix-auth";
import { sessionStorage } from ".";
import { users } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import { db } from "../db";
import argon2 from "argon2";

// Создаём новый аутентификатор с помощью стратегии "user-pass"
export const authenticator = new Authenticator<Pick<users, "id">>(
  sessionStorage,
);


// Стратегия "user-pass" и её логика
authenticator.use(
  new FormStrategy(async ({ form }) => {
    // Логин и пароль из формы
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      throw new Error("Логин и пароль обязательны");
    }

    // Поиск пользователя в базе данных
    const user = await db.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Неверный логин или пароль");
    }

    // Проверка пароля
    const isPasswordMatch = argon2.verify(user.password, password);

    if (!isPasswordMatch) {
      throw new Error("Неверный логин или пароль");
    }

    return { id: user.id };
  }),
  "user-pass"
);
