import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { authenticator } from "~/services/auth";
import { db } from "~/services/db";

//  Функция для получения данных с сервера о корзине
export const loader = async ({ request }: LoaderFunctionArgs) => {
  //  Проверка аутентификации пользователя
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  //  Получаем данные о корзине
  const cart = await db.cart.findFirst({
    where: { usersId: user.id },
    include: { products: true },
  });

  return json({ cart });
};

const ProfileCartPage: FC = () => {
  // Получаем данные с сервера loader
  const { cart } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <Link to="/catalog">
        <IoIosArrowBack className="font-bold text-2xl" />
      </Link>
      <div className="flex flex-row grow items-center justify-center">
        <div className="flex flex-row gap-16 border border-slate-200 shadow-md p-4 pl-0 rounded-md h-[500px]">
          <div
            className={cn(
              `flex h-full justify-between flex flex-col grow border-r border-slate-200 px-4 pt-4 shrink-0`,
              { "border-none pr-0": cart?.products.length === 0 }
            )}
          >
            <div>
              <h1 className="space-x-2 text-lg font-semibold">
                <p className="inline-block">{cart?.products.length}</p>
                <p className="inline-block">товаров</p>
              </h1>

              <p className="text-sm">
                Общая стоимость:{" "}
                {cart?.products.reduce(
                  (acc, product) => acc + product.price,
                  0
                )}
              </p>
            </div>
            <Button>
              <Link to={"/profile/new-order"}>Перейти к оформлению заказа</Link>
            </Button>
          </div>

          {cart?.products.length === 0 ? null : (
            <div className="flex flex-col gap-2 p-4 overflow-y-scroll w-full grow">
              {cart?.products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-row gap-4 border border-slate-200 shadow-md p-4 rounded-md max-w-xl"
                >
                  <img
                    src={product.image || ""}
                    alt={product.name}
                    className="w-12 h-12"
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p>{product.description}</p>
                    <p>Цена: {product.price} руб.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCartPage;
