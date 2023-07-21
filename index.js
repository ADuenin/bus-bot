import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { getBuses } from './getBuses.js';
import { getStopsInlineMenu, getStopsMenu } from './keyboards.js';
import cron from "node-cron";
import https from "https"

const key = process.env.SECRET_KEY
const bot = new Telegraf(key);

let stopId = ''

bot.start(async (ctx) => {
  const keyboard = getStopsMenu()

  await ctx.reply('Выбери маршрут:', keyboard.reply())
})

bot.help(async (ctx) => {
  const keyboard = getStopsInlineMenu()

  await ctx.reply('Выбери маршрут:', keyboard.resize())
});

bot.hears('Из Yesildere', ctx => {
  stopId = '14271'
  getResult(ctx, stopId)
})

bot.hears('С пляжа', ctx => {
  stopId = '13698'
  getResult(ctx, stopId)
})

bot.hears('Из Mark Antalya', ctx => {
  stopId = '10366'
  getResult(ctx, stopId)
})

bot.hears('От кладбища', ctx => {
  stopId = '13789'
  getResult(ctx, stopId)
})

bot.action('fromYesildere', (ctx) => {
  stopId = '14271'
  getResult(ctx, stopId)
})

bot.action('fromBeach', (ctx) => {
  stopId = '13698'
  getResult(ctx, stopId)
})

bot.on(message('text'), async (ctx) => {
  ctx.sendMessage('Не знаю такого маршрута')
});

cron.schedule("*/1 * * * *", () => {
  const options = {
    hostname: "www.w3.org",
    path: "/account/user-menu/",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      console.log(data + 'response');
    });
  });

  request.on("error", (error) => {
    console.error(`Произошла ошибка: ${error.message}`);
  });

  request.end();

});


bot.launch();

function getResult(ctx, stopId) {
  getBuses(stopId).then((res) => {
    console.log(res)
     if (typeof res == 'string') {
      ctx.sendMessage(res)
     }
     else {
      let resultList = []
      resultList.push(`Список автобусов, прибывающих на остановку *${res.selectedStop}*:\n`)
      for (let i = 0; i < res.busArr.length; i++) {
        resultList.push(`Автобус *${res.busArr[i].busCode}* будет через *${res.busArr[i].numberOfStops}* остановок. Ожидаемое время прибытия *${res.busArr[i].time}* минут\n`)
      }
      ctx.sendMessage(resultList.join('\n'), { parse_mode: "Markdown" })
     }
  })
};