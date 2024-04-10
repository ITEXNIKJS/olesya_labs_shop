import { users } from "@prisma/client";

import { FC } from "react";
import { Button } from "./ui/button";
import { Form, Link } from "@remix-run/react";
import { IoMdExit } from "react-icons/io";

// Интерфейс входных параметров компонента
export interface userButtonProps {
  user: null | Pick<users, "id">;
}

// Компонент кнопки пользователя в зависимости от состояния пользователя отображает кнопку профиля или логин
const UserButton: FC<userButtonProps> = (props) => {
  const { user } = props;

  // Если пользователь не залогинен, отображаем кнопку "Авторизоваться"

  if (!user)
    return (
      <Button asChild>
        <Link to="/login">Авторизоваться</Link>
      </Button>
    );

  // Если пользователь залогинен, отображаем кнопку "Профиль"
  return (
    <div className="flex flex-row gap-2">
      <Button asChild>
        <Link to={`/profile`}>Профиль</Link>
      </Button>
      <Form method="post" action="/logout">
        <Button
          type="submit"
          className="text-white cursor-pointer text-lg w-10 p-2.5"
          variant="destructive"
        >
          <IoMdExit size={24} />
        </Button>
      </Form>
    </div>
  );
};

export default UserButton;
