import https from "https";

export function getBuses(stopId) {
  return new Promise((resolve, reject) => {
    let host = "service.kentkart.com";
    let path =
      `/rl1//web/nearest/bus?region=026&lang=tr&authType=4&busStopId=${stopId}`;

    const options = {
      hostname: host,
      path: path,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const result = JSON.parse(data);
        if(result.busList.length == 0) {
          resolve('На горизонте нет автобусов')
        }
        else{
          let resData = {selectedStop: result.stopInfo.busStopName}
          let busArr = [];
          for (let i = 0; i < result.busList.length; i++) {
            let bus = {
              busCode: result.busList[i].displayRouteCode,
              numberOfStops: result.busList[i].stopDiff,
              time: result.busList[i].timeDiff
            }
            busArr.push(bus)
          }
          resData.busArr = busArr
          resolve(resData);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
}