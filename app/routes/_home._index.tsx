import { Link } from "@remix-run/react";
import React, { FC } from "react";
import { Button } from "~/components/ui/button";

const MainPage: FC = () => {
  return (
    <div className="flex grow items-center justify-center">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold">
          Онлайн магазин мобильных устройств
        </h1>
        <h3>Всё продукты в одном месте. Быстро и качественно.</h3>
        <p>Для тех, кто любит свои мобильные устройства</p>
        <Button asChild>
          <Link to={"/catalog"}>Перейти в каталог</Link>
        </Button>
      </div>
    </div>
  );
};

export default MainPage;
