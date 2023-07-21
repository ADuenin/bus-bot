var cron = require("node-cron");

cron.schedule("*/10 * * * *", () => {
  const https = require("https");

  // Настройки запроса
  const options = {
    hostname: "www.w3.org",
    path: "/account/user-menu/",
    method: "GET",
  };

  // Создание HTTPS-запроса
  const request = https.request(options, (response) => {
    let data = "";

    // Обработка частей данных, поступающих в ответ
    response.on("data", (chunk) => {
      data += chunk;
    });

    // Обработка завершения ответа
    response.on("end", () => {
      console.log(data); // Вывод ответа от w3.org
    });
  });

  // Обработка ошибок запроса
  request.on("error", (error) => {
    console.error(`Произошла ошибка: ${error.message}`);
  });

  // Отправка запроса
  request.end();
});
