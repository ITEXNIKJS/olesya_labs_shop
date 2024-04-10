import { createCookieSessionStorage } from "@remix-run/node";

//  Сессионное хранилище cookie для аутентификации
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cr3t"],
    secure: false,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
