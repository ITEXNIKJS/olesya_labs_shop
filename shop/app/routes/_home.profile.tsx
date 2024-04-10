import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { authenticator } from "~/services/auth";
import { db } from "~/services/db";

// Получаем все необходимированные данные пользователя
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const dbUser = await db.users.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      middle_name: true,
      phone: true,
      birth_date: true,
      gender: true,
      email: true,
      createdAt: true,
      orders: {
        select: {
          id: true,
          total: true,
          products: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  return { user: dbUser };
};

const ProfilePage: FC = () => {
  // Получаем необходимые данные с сервера loader
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <Link to="/catalog">
        <IoIosArrowBack className="font-bold text-2xl" />
      </Link>

      <div className="flex flex-row grow items-center justify-center">
        <div className="flex flex-row gap-16 border border-slate-200 shadow-md p-4 rounded-md max-w-3xl">
          <div className="flex flex-col gap-2 border-r border-slate-200 p-4 shrink-0">
            <h1 className="space-x-1 text-lg font-semibold">
              <p className="inline-block">{user?.middle_name}</p>
              <p className="inline-block">{user?.first_name}</p>
              <p className="inline-block">{user?.last_name}</p>
            </h1>

            <p className="text-sm">
              Дата рождения: {new Date(user!.birth_date).toLocaleDateString()}
            </p>
            <p className="text-sm">Email: {user?.email}</p>
            <p className="text-sm">Гендер: {user?.gender}</p>
            <p className="text-sm">Телефон: {user?.phone}</p>
            <p className="text-sm">
              Зарегистрирован: {new Date(user!.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-center h-full justify-center w-full p-4">
            <h1>История заказов</h1>
            {user?.orders.length === 0 ? (
              <span>Заказы не найдены</span>
            ) : (
              // ПроNavigся по списку заказов и высвечиваем их
              user?.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-2 border border-slate-200 shadow-md p-4 rounded-md max-w-xl"
                >
                  <p className="text-sm">Заказ #{order.id}</p>
                  <p className="text-sm">Сумма: {order.total}</p>
                  <p className="text-sm">
                    Дата создания: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="flex flex-row gap-2">
                    {/* Проходимся по списку продуктов и высвечиваем картинки */}
                    {order.products.map((product) => (
                      <Link to={`/products/${product.id}`} key={product.id}>
                        <img
                          src={product.image || ""}
                          alt={product.name}
                          className="w-8 h-8 rounded-full"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
