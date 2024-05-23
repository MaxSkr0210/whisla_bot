import TelegramBot from "node-telegram-bot-api";
import { prisma } from "./prisma/prisma";
import { Prisma } from '@prisma/client';
import { SupplieType } from "./types";

const token = '7037051428:AAFoT_GqWR-5864SKYPQ86gqi_wXQEysHi0';

const bot = new TelegramBot(token, {polling: true});

const commands = [
  {
    command: "start",
    description: "Запуск бота"
  },
  {
    command: "report",
    description: "Получить отчет"
  },
]

bot.setMyCommands(commands);

const start = async () => {
  try {
    const res = await fetch("https://statistics-api-sandbox.wb.ru/api/v1/supplier/incomes?dateFrom=2024-02-10", {
      headers: {
        Authorization: "Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQwNTA2djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTczMjE2MjYzNiwiaWQiOiJiMjdkZGYzYi1mZjFjLTQ0NzEtYjQ4Yy0xOGExNTBhZWU2Y2EiLCJpaWQiOjQ2OTkyNzAsIm9pZCI6MTg0MDIsInMiOjAsInNpZCI6ImYyMzI3ZjVkLTViMDEtNWQ1MC05NjI5LTkyMTgwOTkzZDUxNCIsInQiOnRydWUsInVpZCI6NDY5OTI3MH0.Rx8HMupyWGYXhoIoqUffQKPRJKTW7-FrFljvgOk7SRfnGG82PLCLEEFhUcQHaskZir_k0nESgUwCQOHj2VZ77w"
      }
    })
    const data:SupplieType = await res.json()

    await prisma.supplie.createMany({
      data,
      skipDuplicates: true,
    })
  } catch (error) {
    console.log(error);
  }
}

const groupBy = async (by: Prisma.SupplieScalarFieldEnum | Prisma.SupplieScalarFieldEnum[]) => {
  return await prisma.supplie.groupBy({
    by,
    _count: true,
  });
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  
  if(msg.text === '/start') {
    await start();
    
    bot.sendMessage(chatId, "Данные загружены в базу данных")
  } else if (msg.text === "/report") {
    await bot.sendMessage(msg.chat.id, `Меню бота`, {
      reply_markup: {
        keyboard: [
          [{text: "Артикул продавца"}, {text: "Размер товара"}],
          [{text: "Название склада"}]
        ],
        resize_keyboard: true
      }
    })
  }
  else if (msg.text === "Артикул продавца") {
    const supplieGroup = await groupBy("supplierArticle");

    let result = "";

    for (const supplie of supplieGroup){
      result += `Артикул ${supplie.supplierArticle} - ${supplie._count}\n`
    }

    bot.sendMessage(chatId, result);

  }
  else if (msg.text === "Размер товара") {
    const supplieGroup = await groupBy("techSize");

    let result = "";

    for (const supplie of supplieGroup){
      result += `Размер ${supplie.techSize} - ${supplie._count}\n`
    }

    bot.sendMessage(chatId, result);
  }
  else if (msg.text === "Название склада") {
    const supplieGroup = await groupBy("warehouseName")

    let result = "";

    for (const supplie of supplieGroup){
      result += `Артикул ${supplie.warehouseName} - ${supplie._count}\n`
    }

    bot.sendMessage(chatId, result);
  }
  else {
    bot.sendMessage(chatId, "Я вас не понимаю");
  }
})

bot.on("polling_error", err => console.log(err));
