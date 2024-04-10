"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const conversations_1 = require("@grammyjs/conversations");
dotenv_1.default.config();
const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
const prisma = new client_1.PrismaClient();
const start_message = `
Добро пожаловать в Онлайн магазин

Выберите одно из действий
`;
const start_keyboard = new grammy_1.Keyboard()
    .text("Поиск товара")
    .row()
    .text("Оформить заказ")
    .row()
    .text("Найти мои заказы")
    .resized();
const end_keyboard = new grammy_1.Keyboard().text("Назад").row();
bot.use((0, grammy_1.session)({ initial: () => ({}) }));
bot.use((0, conversations_1.conversations)());
function searching(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("Введите наименование товара для поиска:", {
            reply_markup: end_keyboard,
        });
        const { message } = yield conversation.wait();
        if ((message === null || message === void 0 ? void 0 : message.text) === "Назад") {
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        const product = yield prisma.products.findFirst({
            where: {
                name: {
                    contains: message === null || message === void 0 ? void 0 : message.text,
                },
            },
        });
        if (product) {
            yield ctx.replyWithPhoto(product.image, {
                reply_markup: start_keyboard,
                caption: `
${product.name}

${product.description}
`,
            });
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        yield ctx.reply("Товар не найден", { reply_markup: start_keyboard });
        return;
    });
}
function user_order(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.reply("Введите номер телефона или email для поиска:", {
            reply_markup: end_keyboard,
        });
        const { message } = yield conversation.wait();
        if ((message === null || message === void 0 ? void 0 : message.text) === "Назад") {
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        const orders = yield prisma.orders.findMany({
            where: {
                OR: [
                    {
                        users: {
                            phone: message === null || message === void 0 ? void 0 : message.text,
                        },
                    },
                    {
                        users: {
                            email: message === null || message === void 0 ? void 0 : message.text,
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
            yield ctx.reply("Заказы не найдены", { reply_markup: start_keyboard });
            return;
        }
        for (const order of orders) {
            yield ctx.reply(`
Заказ #${order.id}

Товары:
${order.products.map((product) => product.name).join("\n")}

Общая цена: ${order.total}
Адресс доставки: ${order.adress}
Почтовый индекс: ${order.index}
Заказ создан: ${new Date(order.createdAt).toLocaleDateString("ru")}
`);
        }
        yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
        return;
    });
}
function make_an_order(conversation, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        yield ctx.reply("Введите артикул корзины для заказа:", {
            reply_markup: end_keyboard,
        });
        const { message } = yield conversation.wait();
        if ((message === null || message === void 0 ? void 0 : message.text) === "Назад") {
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        const cart = yield prisma.cart.findUnique({
            where: {
                id: message === null || message === void 0 ? void 0 : message.text,
            },
            include: {
                products: true,
            },
        });
        if (!cart) {
            yield ctx.reply("Корзина не найдена", { reply_markup: start_keyboard });
            return;
        }
        yield ctx.reply("Введите адрес доставки:", {
            reply_markup: end_keyboard,
        });
        const conv_msg_address = yield conversation.wait();
        if (((_a = conv_msg_address.message) === null || _a === void 0 ? void 0 : _a.text) === "Назад") {
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        yield ctx.reply("Введите почтовый индекс доставки:", {
            reply_markup: end_keyboard,
        });
        const conv_index_address = yield conversation.wait();
        if (((_b = conv_index_address.message) === null || _b === void 0 ? void 0 : _b.text) === "Назад") {
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        const accept_keyboard = new grammy_1.Keyboard()
            .text("Подтвердить заказ")
            .row()
            .text("Назад")
            .row();
        yield ctx.reply(`
Товары:
${cart.products.map((item) => item.name).join("\n")}

Адресс доставки:
${(_c = conv_msg_address.message) === null || _c === void 0 ? void 0 : _c.text}
Почтовый индекс:
${(_d = conv_index_address.message) === null || _d === void 0 ? void 0 : _d.text}
  `, { reply_markup: accept_keyboard });
        const conv_result = yield conversation.wait();
        if (((_e = conv_result.message) === null || _e === void 0 ? void 0 : _e.text) === "Назад") {
            yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
            return;
        }
        const order = yield prisma.orders.create({
            data: {
                adress: (_f = conv_msg_address.message) === null || _f === void 0 ? void 0 : _f.text,
                index: (_g = conv_index_address.message) === null || _g === void 0 ? void 0 : _g.text,
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
        yield ctx.reply(`
Заказ #${order.id} успешко создан

Товары:
${order.products.map((product) => product.name).join("\n")}

Общая цена: ${order.total}
Адресс доставки: ${order.adress}
Почтовый индекс: ${order.index}
Заказ создан: ${new Date(order.createdAt).toLocaleDateString("ru")}
  `);
        yield ctx.reply("Главное меню", { reply_markup: start_keyboard });
        return;
    });
}
bot.use((0, conversations_1.createConversation)(searching));
bot.use((0, conversations_1.createConversation)(user_order));
bot.use((0, conversations_1.createConversation)(make_an_order));
bot.command("start", (ctx) => ctx.reply(start_message, { reply_markup: start_keyboard }));
bot.on("message:text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = ctx.message;
    switch (text) {
        case "Поиск товара":
            yield ctx.conversation.enter("searching", { overwrite: true });
            break;
        case "Оформить заказ":
            yield ctx.conversation.enter("make_an_order", { overwrite: true });
            break;
        case "Найти мои заказы":
            yield ctx.conversation.enter("user_order", { overwrite: true });
            break;
        default:
            return yield ctx.reply(start_message, { reply_markup: start_keyboard });
    }
}));
bot.start({ onStart: () => console.log("Бот запущен") });
bot.catch((err) => console.log(err));
