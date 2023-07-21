import { Markup } from 'telegraf'
import { Keyboard } from 'telegram-keyboard'
//import * as data from './helpers/stopNames.json' assert { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require('./helpers/stopNames.json')

export function getStopsMenu() {
    const keyboard = Keyboard.make([
        ['Из Yesildere'],
        ['С пляжа'],
      ])
      console.log(data.default)
    return keyboard
}

export function getStopsInlineMenu() {
    let stop = data.default.stopList
    let buttonsArray = []
    for (let i = 0; i < stop.length; i++) {
        buttonsArray.push(Markup.button.callback(stop[i].name, stop[i].stopId)) 
    }
    const keyboard = Markup.inlineKeyboard([buttonsArray], { columns: 2 })
    return keyboard
}