import { useLoaderData } from "@remix-run/react";
import { FC } from "react";
import { db } from "~/services/db";

export const loader = async () => {
  return await db.statistic.findMany({});
};

const Statistics: FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <h1 className="text-xl font-semibold">Статистика продаж</h1>
      <div className="flex flex-row gap-4 flex-wrap w-full text-lg font-semibold">
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Всего продаж</h1>
          <span className="self-end">{data[0].orders_count}</span>
        </div>
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Проданно на сумму</h1>
          <span className="self-end">{data[0].orders_sum}</span>
        </div>
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Средняя цена заказа</h1>
          <span className="self-end">{data[0].average_price}</span>
        </div>
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Последняя продажа</h1>
          <span className="self-end text-lg font-semibold">
            {new Date(data[0].updatedAt).toUTCString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
