import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { FC } from "react";
import { AuthorizationError } from "remix-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { authenticator } from "~/services/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json({ error: "Неверный логин или пароль" }, { status: 401 });
    }
  }
};

const Login: FC = () => {
  const data = useActionData<typeof action>();

  return (
    <Form method="post" className="bg-white p-6 rounded shadow-md w-72">
      <h1 className="text-2xl font-bold mb-4 text-center">Авторизация</h1>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Почта
        </label>
        <Input
          type="email"
          name="email"
          id="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {data?.error ? <p className="text-red-500 mt-2">{data.error}</p> : null}
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Пароль
        </label>
        <Input
          type="password"
          name="password"
          id="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <Button className="w-full" type="submit">
          Авторизоваться
        </Button>
      </div>
    </Form>
  );
};

export default Login;
