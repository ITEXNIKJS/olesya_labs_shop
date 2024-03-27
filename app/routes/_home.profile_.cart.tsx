import type { ActionFunctionArgs } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { FC } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { authenticator } from "~/services/auth";
import { db } from "~/services/db";

// Действия для подтверждения заказа
export const action = async ({ request }: ActionFunctionArgs) => {
  //  Проверка аутентификации пользователя
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  const adress = formData.get("address") as string;
  const index = formData.get("index") as string;

  // Валидируем данные формы
  if (!adress) {
    return json(
      { ok: false, errors: { adress: "Нужно заполнить адрес", index: null } },
      { status: 400 }
    );
  }

  if (!index) {
    return json(
      { ok: false, errors: { index: "Нужно заполнить индекс", adress: null } },
      { status: 400 }
    );
  }

  // Получаем кол-во продуктов в корзине
  const cart_count = await db.products.count({
    where: {
      cart: { some: { usersId: user.id } },
    },
  });

  if (cart_count === 0) {
    return json(
      { ok: false, errors: { index: "Корзина пуста", adress: null } },
      { status: 400 }
    );
  }

  // Выполняем действия в виде транзакций чтобы не засорять базу
  await db.$transaction(async (tx) => {
    //  Получаем все продукты в корзине
    const cart_product = await tx.products.findMany({
      where: { cart: { some: { usersId: user.id } } },
      select: {
        id: true,
        price: true,
      },
    });

    //  Считаем общую стоимость
    const total = cart_product.reduce((acc, product) => acc + product.price, 0);

    //  Сохраняем заказ
    const order = await tx.orders.create({
      data: {
        total,
        userId: user.id,
        adress: adress,
        index: index,
      },
      select: {
        id: true,
      },
    });

    //  Подключаем продукты в заказ
    await tx.orders.update({
      where: { id: order.id },
      data: {
        products: {
          connect: cart_product,
        },
      },
    });

    //  Очищаем корзину
    await tx.cart.update({
      where: { usersId: user.id },
      data: {
        products: {
          disconnect: cart_product,
        },
      },
    });
  });

  return json({ ok: true, errors: null });
};

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

  //  Получаем результат выполнения action
  const data = useActionData<typeof action>();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <IoIosArrowBack
        onClick={() => navigate(-1)}
        className="font-bold text-2xl"
      />
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

            <Form method="post" className="flex flex-col gap-2">
              <Input
                type="text"
                name="address"
                id="address"
                placeholder="Адрес доставки"
                className="w-full"
              />

              {data?.errors?.adress && (
                <p className="text-sm text-red-500">{data?.errors.adress}</p>
              )}

              <Input
                type="text"
                name="index"
                id="index"
                placeholder="Индекс"
                className="w-full"
              />

              {data?.errors?.index && (
                <p className="text-sm text-red-500">{data?.errors.index}</p>
              )}

              <Button
                disabled={cart?.products.length === 0}
                variant={
                  cart?.products.length === 0 ? "destructive" : "default"
                }
                type="submit"
              >
                Оформить заказ
              </Button>
            </Form>
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
