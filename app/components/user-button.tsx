import { users } from "@prisma/client";

import { FC } from "react";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

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
    <Button asChild>
      <Link to={`/profile`}>Профиль</Link>
    </Button>
  );
};

export default UserButton;
