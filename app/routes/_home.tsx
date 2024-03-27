import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { authenticator } from "~/services/auth";
import { FaStoreAlt } from "react-icons/fa";
import UserButton from "~/components/user-button";
import { db } from "~/services/db";
import CartIcon from "~/components/cart_icon";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return json({ user: null, cart_count: 0 });
  }

  const dbUser = await db.users.findUnique({
    where: { id: user?.id },
    include: { cart: true },
  });

  if (!dbUser) {
    return json({ user: null, cart_count: 0 });
  }

  const cart_products_count = await db.products.count({
    where: { cart: { some: { usersId: user.id } } },
  });

  return json({ user: { id: dbUser?.id }, cart_count: cart_products_count });
};

const HomeLayout: FC = () => {
  const { user, cart_count } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between min-h-12 p-4 border-slate-300 border-b shrink-0">
        <div className="flex flex-row gap-2 items-center">
          <FaStoreAlt size={24} />
          <h1 className="text-lg font-bold">Online Shop</h1>
        </div>
        {/* User button component */}
        <div className="flex flex-row gap-4 items-center">
          <UserButton user={user} />
          {user?.id ? <CartIcon count={cart_count} /> : null}
        </div>
      </div>

      <main className="flex flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
