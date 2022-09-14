"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev";

_dotenv.default.config({
  path: envPath
});

console.log(process.env.DEPLOYMENT);
console.log(process.env.HTTPS_ENABLED);