import { users } from "@prisma/client";

import { FC } from "react";
import { Button } from "./ui/button";
import { Link } from "@remix-run/react";

export interface userButtonProps {
  user: null | Pick<users, "id">;
}

const UserButton: FC<userButtonProps> = (props) => {
  const { user } = props;

  if (!user)
    return (
      <Button asChild>
        <Link to="/login">Авторизоваться</Link>
      </Button>
    );

  return (
    <Button asChild>
      <Link to={`/profile`}>Профиль</Link>
    </Button>
  );
};

export default UserButton;
