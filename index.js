const WebSocket = require("ws");
const WebSocketServer = require("ws").Server;

let finnihubdata = {};

const sServer = new WebSocketServer({ port: process.env.PORT || 1027 });

let socket = new WebSocket("wss://ws.finnhub.io?token=btg5pp748v6r32agac1g");

function subscribe(symbol) {
  return JSON.stringify({ type: "subscribe", symbol });
}

// Connection opened -> Subscribe
socket.addEventListener("open", function (event) {
  // cryptos
  socket.send(subscribe("BINANCE:BTCUSDT"));
  socket.send(subscribe("BINANCE:ETHUSDT"));
  socket.send(subscribe("BINANCE:TRXUSDT"));
  socket.send(subscribe("BINANCE:XRPUSDT"));
  socket.send(subscribe("BINANCE:ZECUSDT"));
  socket.send(subscribe("BINANCE:LTCUSDT"));
  socket.send(subscribe("BINANCE:DASHUSDT"));
  socket.send(subscribe("BINANCE:NEOUSDT"));
  socket.send(subscribe("BINANCE:QTUMUSDT"));
  socket.send(subscribe("BINANCE:IOTAUSDT"));
  socket.send(subscribe("BINANCE:ADAUSDT"));
  socket.send(subscribe("BINANCE:ONTUSDT"));
  socket.send(subscribe("BINANCE:OMGUSDT"));
  socket.send(subscribe("BINANCE:BNBUSDT"));
  socket.send(subscribe("BINANCE:XLMUSDT"));
  //

  // stocks
  socket.send(subscribe("V"));
  socket.send(subscribe("MA"));
  socket.send(subscribe("FB"));
  socket.send(subscribe("ZM"));
  socket.send(subscribe("NKE"));
  socket.send(subscribe("AMD"));
  socket.send(subscribe("ADBE"));
  socket.send(subscribe("AMZN"));
  socket.send(subscribe("AAPL"));
  socket.send(subscribe("TSLA"));
  socket.send(subscribe("NVDA"));
  socket.send(subscribe("NLFX"));
  socket.send(subscribe("TWTR"));
  socket.send(subscribe("PYPL"));
  socket.send(subscribe("MSFT"));
  socket.send(subscribe("GOOGL"));

  // forex - aud
  socket.send(subscribe("OANDA:AUD_USD"));
  socket.send(subscribe("OANDA:AUD_JPY"));
  socket.send(subscribe("OANDA:AUD_CHF"));
  socket.send(subscribe("OANDA:AUD_CAD"));

  // forex - eur
  socket.send(subscribe("OANDA:EUR_USD"));
  socket.send(subscribe("OANDA:EUR_JPY"));
  socket.send(subscribe("OANDA:EUR_CHF"));
  socket.send(subscribe("OANDA:EUR_CAD"));

  //   forex - gbp
  socket.send(subscribe("OANDA:GBP_USD"));
  socket.send(subscribe("OANDA:GBP_JPY"));
  socket.send(subscribe("OANDA:GBP_CHF"));
  socket.send(subscribe("OANDA:GBP_CAD"));

  // forex - usd
  socket.send(subscribe("OANDA:USD_JPY"));
  socket.send(subscribe("OANDA:NZD_CHF"));
  socket.send(subscribe("OANDA:USD_CAD"));
  socket.send(subscribe("OANDA:NZD_CAD"));
});

// Listen for messages
socket.addEventListener("message", function ({ data }) {
  data = JSON.parse(data);

  if (data.type == "trade") {
    const { s } = data.data[0];

    if (s.startsWith("BINANCE")) {
      const symbol = s.substring(8, s.length);
      finnihubdata[symbol] = data.data[0].p;
      console.log(symbol, data.data[0].p);
    } else if (s.startsWith("OANDA")) {
      const symbol = s.substring(6, s.length).replace("_", "");
      finnihubdata[symbol] = data.data[0].p;
      console.log(symbol, data.data[0].p);
    } else {
      finnihubdata[s] = data.data[0].p;
      console.log(s, data.data[0].p);
    }

    sServer.clients.forEach((client) => {
      client.send(JSON.stringify(finnihubdata));
    });
  }
});

// disconnect
socket.addEventListener("close", () => {
  console.log("connection to finihub closed");
  socket = new WebSocket("wss://ws.finnhub.io?token=btg5pp748v6r32agac1g");
});

// error
socket.addEventListener("error", (e) => {
  console.log("error occured ", e);
  socket = new WebSocket("wss://ws.finnhub.io?token=btg5pp748v6r32agac1g");
});
