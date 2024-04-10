import { products } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { FC, useEffect, useState } from "react";
import { ProductCard } from "~/components/product";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Slider } from "~/components/ui/slider";

import { db } from "~/services/db";

// Функция для получения данных с сервера реагирует на первую загрузку страницы а так же на изменение параметров URL
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const model = search.get("model");
  const price = search.get("price");
  const ram = search.get("ram");
  const q = search.get("q");

  const products = await db.products.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      case_material: true,
    },
    where: {
      AND: [
        {
          price: price ? { gte: parseInt(price) } : undefined,
        },
        {
          ram: ram ? { equals: parseInt(ram) } : undefined,
        },
        {
          AND: [
            {
              name: {
                contains: q ?? "",
                mode: "insensitive",
              },
            },
            {
              name: { contains: model ?? "", mode: "insensitive" },
            },
          ],
        },
      ],
    },
  });

  return json({ products, model, price, ram, q });
};

const IndexHome: FC = () => {
  // Переменная для хранения данных о результате выполнения формы
  const data = useLoaderData<typeof loader>();

  //  Хуки и функции для навигации и подтверждения формы
  const navigate = useNavigate();
  const submit = useSubmit();

  // Переменные состояния для хранения данных формы
  const [q, setQ] = useState<string>(data.q || "");
  const [model, setModel] = useState<string>(data.model || "");
  const [price, setPrice] = useState<string>(data.price || "0");
  const [ram, setRam] = useState<string>(data.ram || "");

  // Синхронизация данных формы с URL
  useEffect(() => {
    setQ(data.q || "");
    setModel(data.model || "");
    setPrice(data.price || "0");
    setRam(data.ram || "");
  }, [data.model, data.price, data.q, data.ram]);

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col gap-4 p-4 w-60 border-r border-r-slate-300">
          <Form
            id="search-form"
            role="search"
            className="flex flex-col gap-4 whitespace-nowrap w-full"
            onChange={(event) => submit(event.currentTarget)}
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">Модель устройства</h3>
              <RadioGroup
                id="model"
                name="model"
                role="search"
                onValueChange={(value) => setModel(value)}
                value={model}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Samsung" id="option-one" />
                  <Label htmlFor="option-one">Samsung</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Nothing" id="option-two" />
                  <Label htmlFor="option-two">Nothing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="realme" id="option-two" />
                  <Label htmlFor="option-two">Realme</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold flex flex-row justify-between">
                <p>Мин цена</p>
                <p>{price}</p>
              </h3>
              <Slider
                id="price"
                name="price"
                role="search"
                max={200000}
                step={500}
                onValueChange={(value) => setPrice(value[0].toString())}
                value={[parseInt(price)]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold flex flex-row justify-between">
                Объём памяти
              </h3>
              <RadioGroup
                id="ram"
                name="ram"
                role="search"
                onValueChange={(value) => setRam(value)}
                value={ram}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="option-one" />
                  <Label htmlFor="option-one">4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6" id="option-two" />
                  <Label htmlFor="option-two">6</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="8" id="option-two" />
                  <Label htmlFor="option-two">8</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12" id="option-two" />
                  <Label htmlFor="option-two">12</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="16" id="option-two" />
                  <Label htmlFor="option-two">16</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold flex flex-row justify-between">
                Поиск
              </h3>
              <Input
                type="text"
                role="search"
                id="q"
                name="q"
                placeholder="Поиск..."
                onChange={(e) => setQ(e.target.value)}
                value={q}
              />
            </div>
            <Button
              className="w-full"
              type="reset"
              onClick={() => {
                navigate("/");
              }}
            >
              Сбросить
            </Button>
          </Form>
          <Button asChild>
            <Link to="/statistics">Статистика продаж</Link>
          </Button>
        </div>

        <div className="p-4 flex flex-wrap gap-4">
          {data.products.map((product) => (
            <ProductCard
              key={product.id}
              {...(product as Omit<products, "created_at" | "updated_at">)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default IndexHome;
