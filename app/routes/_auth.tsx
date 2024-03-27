import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { FC } from "react";
import { authenticator } from "~/services/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, { successRedirect: "/" });
};

const AuthLayout: FC = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
