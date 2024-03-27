import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  await prisma.users
    .create({
      data: {
        email: "evgeniy.suprun@mail.ru",
        password: await argon2.hash("test"),
        birth_date: new Date("2000-11-12"),
        gender: "Мужской",
        first_name: "Евгений",
        last_name: "Александрович",
        middle_name: "Супрун",
        phone: "+79903201188",
        cart: {
          create: {},
        },
      },
    })
    .catch((err) => err);
  await prisma.products.createMany({
    data: [
      {
        name: "Смартфон Samsung Galaxy A15 4G 8/256 ГБ",
        description: "Отсутствует",
        price: 16850,
        image:
          "https://avatars.mds.yandex.net/get-mpic/11401947/img_id9136763524528275110.png/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C53 6/128 ГБ RU",
        description: `Общие характеристики
      Стандарт: 4G LTE, 3G, 2G
      Версия ОС на начало продаж: Android 13
      Тип корпуса: классический
      Количество SIM-карт: 2
      Тип SIM-карт: Nano-SIM
      Размеры (ВхШхГ): 16.72х7.67х0.8 см
      Вес: 186 г`,
        price: 8900,
        image:
          "https://avatars.mds.yandex.net/get-mpic/4580925/img_id930155541902228638.jpeg/600x800",
        os_version: "Android 13",
        ram: 4,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "IP52, IP53, нет",
        sim_count: "Dual nano SIM",
        weight: "182г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme 11 4G 8",
        description: "Отсутствует",
        price: 16325,
        image:
          "https://avatars.mds.yandex.net/get-mpic/6409980/img_id557673501978300709.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон Samsung Galaxy A14 4/128 ГБ",
        description: `PartNumber/Артикул Производителя: SM-A145FZKVCAU
      Вес: 201
      Цвет: черный
      Материал корпуса: пластик
      Емкость аккумулятора: 5000`,
        price: 10780,
        image:
          "https://avatars.mds.yandex.net/get-mpic/6219218/img_id7535348823868562519.png/600x800",
        os_version: "Android 14",
        ram: 4,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "201г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C53 8/256 ГБ RU",
        description: `Цвет: черный; Материал корпуса: пластик; Тип устройства: Смартфон;`,
        price: 10239,
        image:
          "https://avatars.mds.yandex.net/get-mpic/11483862/img_id5573677693941992459.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C67 4G 8/256 ГБ RU, 2 nano SIM, черный камень",
        description: "Отсутствует",
        price: 14840,
        image:
          "https://avatars.mds.yandex.net/get-mpic/12520491/img_id8687390208476000387.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme 11 4G 8/128 ГБ RU, 2 nano SIM, золотой",
        description: `Экстремальная производительность. Непринужденная съемка. Элегантный стиль. Эпический прорыв в производительности.`,
        price: 15328,
        image:
          "https://avatars.mds.yandex.net/get-mpic/11401947/img_id8403876166576592568.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C53 128 ГБ ядер - 8x(1.82 ГГц), 6 ГБ, ",
        description:
          "Аппаратной основой realme C53 послужил чипсет Unisoc T612 с двумя ядрами Cortex-A75, шестью Cortex-A55 и GPU Mali-G57.",
        price: 10780,
        image:
          "https://avatars.mds.yandex.net/get-mpic/11918420/img_id3768355839183089584.jpeg/600x800",
        os_version: "Android 14",
        ram: 6,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон Samsung Galaxy S24 Ultra 12/256 ГБ",
        description: `Откройте для себя новый уровень возможностей для творчества и продуктивности вместе с самым важным устройством в вашей жизни — новым смартфоном Galaxy S24 Ultra.`,
        price: 92208,
        image:
          "https://avatars.mds.yandex.net/get-mpic/1673800/img_id5017665342670813212.png/optimize",
        os_version: "Android 14",
        ram: 12,
        case_type: "классический",
        case_material: "металл",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C67 4G 8/256 ГБ RU",
        description: `Realme C67
      Лучшие фотографии c камерой 108 Мп.
      Лучшая производительность с процессором Snapdragon.
      Лучший пользовательский опыт и дизайн флагманского уровня.`,
        price: 14840,
        image:
          "https://avatars.mds.yandex.net/get-mpic/4303532/img_id8363326562141904817.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme Note 50 4/128 ГБ RMX3834",
        description: `Смартфон realme Note 50 4/128 ГБ RMX3834 полуночно-черного цвета предлагает пользователям мощный процессор, емкую память и множество функций для комфортного использования.`,
        price: 6721,
        image:
          "https://avatars.mds.yandex.net/get-mpic/11379035/2a0000018d3f8379fdef68f2ac7c93aa390c/600x800",
        os_version: "Android 14",
        ram: 4,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: `Смартфон realme C55 6.72" ядер - 8x(2 ГГц), 2 SIM, IPS, 2400x1080, камера 64+2 Мп`,
        description: `Смартфон realme C55 - это надежный и удобный инструмент для работы и развлечений. Он оснащен 8 ядрами процессора, которые обеспечивают быструю работу даже в режиме многозадачности, и 6 ГБ оперативной памяти, что позволяет запускать несколько приложений одновременно без задержек.`,
        price: 14740,
        image:
          "https://avatars.mds.yandex.net/get-mpic/12222123/img_id3435872598677597902.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C51 4/128Gb",
        description:
          "Смартфон realme C51 4/128Gb, черный производства компании realme. Артикул модели: 631011000369. Артикул магазина: 00375603",
        price: 7790,
        image:
          "https://avatars.mds.yandex.net/get-mpic/11532558/2a0000018b93c6ebc39503a00049c7225c8d/600x800",
        os_version: "Android 14",
        ram: 4,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон Realme C51, 128ГБ, 8 ядер",
        description: `Смартфон realme C51 - это идеальное сочетание передовых технологий, производительности и дизайна. Он оснащен большим экраном с частотой обновления 90 Гц, что обеспечивает расширенные возможности для захватывающих игр.`,
        price: 8800,
        image:
          "https://avatars.mds.yandex.net/get-mpic/12225808/2a0000018d310110b70c30989bbb78b621a7/600x800",
        os_version: "Android 14",
        ram: 4,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
      {
        name: "Смартфон realme C55 8/256GB RU Sunshower",
        description: `процессор: MediaTek Helio G88  экран: 6.72" (2400x1080), Full HD, IPS  память: 256 Гб  оперативная память: 8 ГБ  cтандарт: 2G, 3G, 4G LTE`,
        price: 13789,
        image:
          "https://avatars.mds.yandex.net/get-mpic/5207084/img_id9192054020562005084.jpeg/600x800",
        os_version: "Android 14",
        ram: 8,
        case_type: "классический",
        case_material: "пластик",
        protection_type: "Нету",
        sim_count: "Dual nano SIM",
        weight: "200г",
        size: "76.8x160.1x8.4 мм",
        display: `"6.5" (2340×1080), AMOLED"`,
        display_herz: "90 Гц",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
