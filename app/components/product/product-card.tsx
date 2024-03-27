import { products } from "@prisma/client";
import { FC } from "react";
import { Button } from "../ui/button";
import { Link } from "@remix-run/react";

// Интерфейс входных параметров компонента карточки продукта
export type ProductCard = Omit<products, "created_at" | "updated_at">;

// Компонент карточки продукта
export const ProductCard: FC<ProductCard> = (props) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-slate-300 rounded-md min-w-min w-[24%] h-[550px]">
      <img src={props.image || ""} alt={props.name} className="w-48 h-48" />
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{props.name}</h3>
        <p className="text-sm font-light">
          {props.description === "Отсутствует"
            ? "Нет описания"
            : props.description}
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <p className="text-lg font-bold">{props.price}₽</p>
      </div>
      <Link to={`/products/${props.id}`}>
        <Button className="mt-auto w-full">Просмотреть</Button>
      </Link>
    </div>
  );
};
