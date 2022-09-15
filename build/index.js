"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./config"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev";

_dotenv.default.config({
  path: envPath
});

const app = (0, _express.default)();
app.use((0, _morgan.default)(process.env.LOGGER));
app.use(_express.default.json({
  limit: "1mb"
}));
app.use(_express.default.urlencoded({
  extended: true
}));

if (process.env.HTTPS_ENABLED === "true") {
  const key = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/key.pem")).toString();

  const cert = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/cert.pem")).toString();

  const server = _https.default.createServer({
    key: key,
    cert: cert
  }, app);

  server.listen(process.env.PORT, () => {
    console.log("Express Uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır");
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log("Express Uygulamamız " + process.env.PORT + " üzerinden çalışmaktadır");
  });
}