import { FC } from "react";

const Statistics: FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <h1 className="text-xl font-semibold">Статистика продаж</h1>
      <div className="flex flex-row gap-4 flex-wrap w-full text-lg font-semibold">
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Всего продаж</h1>
          <span className="self-end">100</span>
        </div>
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Проданно на сумму</h1>
          <span className="self-end">100000</span>
        </div>
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Средняя цена заказа</h1>
          <span className="self-end">10000</span>
        </div>
        <div className="shadow-md border-slate-200 border p-4 h-[120px] grow flex flex-col justify-between rounded-md">
          <h1>Последняя продажа</h1>
          <span className="self-end text-lg font-semibold">
            {new Date().toUTCString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
