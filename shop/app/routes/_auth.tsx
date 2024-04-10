import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";
import { FC } from "react";
import { authenticator, destroySession, getSession } from "~/services/auth";

// Функция для защиты роутов которая выполняется перед отрисовкой страницы и проверяет аутентефикацию пользователя
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  const session = await getSession(request.headers.get("Cookie"));
  if (user === null && session.has("id")) {

    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return user;
};

const AuthLayout: FC = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
