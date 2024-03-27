import type { ActionFunctionArgs } from "@remix-run/node";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { db } from "~/services/db";
import { IoIosArrowBack } from "react-icons/io";
import { authenticator, destroySession, getSession } from "~/services/auth";

// Действия для получения данных о продукте реагирует на первую загрузку страницы
export const loader = async (request: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request.request);

  if (!request.params.product_id) {
    return redirect("/", {
      status: 303,
    });
  }

  const product = await db.products.findUnique({
    where: {
      id: request.params.product_id,
    },
  });

  const already_in_cart = await db.cart.findFirst({
    where: {
      AND: [
        {
          usersId: user?.id,
        },
        {
          products: {
            some: {
              id: product?.id,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  return json({ product, is_in_cart: already_in_cart ? true : false });
};

// Действия для добавления или удаления продукта из корзины реагирует на кнопку
export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const session = await getSession(request.headers.get("Cookie"));
  if (user === null && session.has("id")) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  const formData = await request.formData();
  const product_id = formData.get("id") as string;

  if (!product_id) {
    return json(
      { ok: false, errors: { id: "Продукт не выбран" } },
      { status: 400 }
    );
  }

  await db.$transaction(async (tx) => {
    const dbUser = await tx.users.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        cart: {
          select: {
            id: true,
            products: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser?.cart) {
      await tx.cart.create({
        data: {
          usersId: user.id,
        },
      });
    }

    if (dbUser?.cart?.products.some((product) => product.id === product_id)) {
      await tx.cart.update({
        where: {
          usersId: user.id,
        },
        data: {
          products: {
            disconnect: {
              id: product_id,
            },
          },
        },
      });
    } else {
      await tx.cart.update({
        where: {
          usersId: user.id,
        },
        data: {
          products: {
            connect: {
              id: product_id,
            },
          },
        },
      });
    }
  });

  return json({
    ok: true,
  });
};

const ProductItemPage = () => {
  const { product, is_in_cart } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const fetcher = useFetcher<typeof action>();

  if (!product) {
    return <div>Продукт не найден</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <Link to="/">
        <IoIosArrowBack className="font-bold text-2xl" />
      </Link>
      <div className="flex flex-col items-center justify-center h-full ">
        <div className="flex flex-row gap-16 max-w-3xl">
          <img
            src={product.image || ""}
            alt={product.name}
            className="max-h-96"
          />
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p>
                {product.description === "Отсутствует"
                  ? "Нет описания"
                  : product.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <p>Артикул: {product.id}</p>
              <p>Материал кейса: {product.case_material}</p>
              <p>Тип кейса: {product.case_type}</p>
              <p>Размер: {product.size}</p>
              <p>Дисплей: {product.display}</p>
              <p>Герцовка дисплея: {product.display_herz}</p>
              <p>Вес: {product.weight}</p>
              <p>Версия ОС: {product.os_version}</p>
              <p>Влагозащита: {product.protection_type}</p>
              <p>Количество SIM: {product.sim_count}</p>
              <p>RAM: {product.ram}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-bold flex flex-row justify-between">
                <span>В наличии</span>
                <span>{product.price}₽</span>
              </p>
              <fetcher.Form method="post">
                <input type="hidden" name="id" value={product.id} />
                <Button
                  variant={data?.ok || is_in_cart ? "destructive" : "default"}
                  type="submit"
                  className="mt-auto w-full"
                >
                  {data?.ok || is_in_cart
                    ? "Удалить из корзины"
                    : "Добавить в корзину"}
                </Button>
              </fetcher.Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItemPage;
