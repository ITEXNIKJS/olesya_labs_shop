import { FC } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

interface CartIconProps {
  count: number;
}

const CartIcon: FC<CartIconProps> = (props) => {
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
