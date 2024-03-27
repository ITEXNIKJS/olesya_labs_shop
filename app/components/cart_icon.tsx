import { FC } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

// Интерфейс входных параметров компонента иконки корзины на вход принимает кол-во товаров
interface CartIconProps {
  count: number;
}

// Компонент иконки корзины отображает иконку и кол-во товаров в корзине
const CartIcon: FC<CartIconProps> = (props) => {
  // Поле count отображает кол-во товаров
  const { count } = props;

  return (
    <Button variant="ghost" asChild className="relative rounded-full p-2">
      <Link to="/profile/cart">
        <FaCartShopping className="text-3xl" />
        <div className="absolute -right-1 -top-1 flex items-center justify-center  p-1 rounded-full bg-red-600 text-white text-center font-bold text-[10px] w-5 h-5">
          {count}
        </div>
      </Link>
    </Button>
  );
};

export default CartIcon;
