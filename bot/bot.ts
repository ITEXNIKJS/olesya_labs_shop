import { Bot, Context, Keyboard, session } from "grammy";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";

dotenv.config();

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>(process.env.BOT_TOKEN as string);

const prisma = new PrismaClient();

const start_message = `
Добро пожаловать в Онлайн магазин

Выберите одно из действий
`;

const start_keyboard = new Keyboard()
  .text("Поиск товара")
  .row()
  .text("Оформить заказ")
  .row()
  .text("Найти мои заказы")
  .resized();

const end_keyboard = new Keyboard().text("Назад").row();

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

async function searching(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Введите наименование товара для поиска:", {
    reply_markup: end_keyboard,
  });
  const { message } = await conversation.wait();

  if (message?.text === "Назад") {
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  const product = await prisma.products.findFirst({
    where: {
      name: {
        contains: message?.text,
      },
    },
  });

  if (product) {
    await ctx.replyWithPhoto(product.image as string, {
      reply_markup: start_keyboard,
      caption: `
${product.name}

${product.description}
`,
    });
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  await ctx.reply("Товар не найден", { reply_markup: start_keyboard });
  return;
}

async function user_order(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Введите номер телефона или email для поиска:", {
    reply_markup: end_keyboard,
  });
  const { message } = await conversation.wait();

  if (message?.text === "Назад") {
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  const orders = await prisma.orders.findMany({
    where: {
      OR: [
        {
          users: {
            phone: message?.text as string,
          },
        },
        {
          users: {
            email: message?.text as string,
          },
        },
      ],
    },
    include: {
      products: {
        select: {
          name: true,
        },
      },
    },
  });

  if (orders.length === 0) {
    await ctx.reply("Заказы не найдены", { reply_markup: start_keyboard });
    return;
  }

  for (const order of orders) {
    await ctx.reply(`
Заказ #${order.id}

Товары:
${order.products.map((product) => product.name).join("\n")}

Общая цена: ${order.total}
Адресс доставки: ${order.adress}
Почтовый индекс: ${order.index}
Заказ создан: ${new Date(order.createdAt).toLocaleDateString("ru")}
`);
  }

  await ctx.reply("Главное меню", { reply_markup: start_keyboard });
  return;
}

async function make_an_order(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("Введите артикул корзины для заказа:", {
    reply_markup: end_keyboard,
  });

  const { message } = await conversation.wait();

  if (message?.text === "Назад") {
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  const cart = await prisma.cart.findUnique({
    where: {
      id: message?.text as string,
    },
    include: {
      products: true,
    },
  });

  if (!cart) {
    await ctx.reply("Корзина не найдена", { reply_markup: start_keyboard });
    return;
  }

  await ctx.reply("Введите адрес доставки:", {
    reply_markup: end_keyboard,
  });

  const conv_msg_address = await conversation.wait();

  if (conv_msg_address.message?.text === "Назад") {
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  await ctx.reply("Введите почтовый индекс доставки:", {
    reply_markup: end_keyboard,
  });

  const conv_index_address = await conversation.wait();

  if (conv_index_address.message?.text === "Назад") {
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  const accept_keyboard = new Keyboard()
    .text("Подтвердить заказ")
    .row()
    .text("Назад")
    .row();

  await ctx.reply(
    `
Товары:
${cart.products.map((item) => item.name).join("\n")}

Адресс доставки:
${conv_msg_address.message?.text}
Почтовый индекс:
${conv_index_address.message?.text}
  `,
    { reply_markup: accept_keyboard }
  );

  const conv_result = await conversation.wait();

  if (conv_result.message?.text === "Назад") {
    await ctx.reply("Главное меню", { reply_markup: start_keyboard });
    return;
  }

  const order = await prisma.orders.create({
    data: {
      adress: conv_msg_address.message?.text as string,
      index: conv_index_address.message?.text as string,
      total: cart.products.reduce((total, item) => (total += item.price), 0),
      userId: cart.usersId,
    },
    include: {
      products: {
        select: {
          name: true,
        },
      },
    },
  });

  await ctx.reply(`
Заказ #${order.id} успешко создан

Товары:
${order.products.map((product) => product.name).join("\n")}

Общая цена: ${order.total}
Адресс доставки: ${order.adress}
Почтовый индекс: ${order.index}
Заказ создан: ${new Date(order.createdAt).toLocaleDateString("ru")}
  `);

  await ctx.reply("Главное меню", { reply_markup: start_keyboard });
  return;
}

bot.use(createConversation(searching));
bot.use(createConversation(user_order));
bot.use(createConversation(make_an_order));

bot.command("start", (ctx) =>
  ctx.reply(start_message, { reply_markup: start_keyboard })
);

bot.on("message:text", async (ctx) => {
  const { text } = ctx.message;

  switch (text) {
    case "Поиск товара":
      await ctx.conversation.enter("searching", { overwrite: true });
      break;
    case "Оформить заказ":
      await ctx.conversation.enter("make_an_order", { overwrite: true });
      break;
    case "Найти мои заказы":
      await ctx.conversation.enter("user_order", { overwrite: true });
      break;
    default:
      return await ctx.reply(start_message, { reply_markup: start_keyboard });
  }
});

bot.start({ onStart: () => console.log("Бот запущен") });

bot.catch((err) => console.log(err));
