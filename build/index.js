"use strict";

var _logs = require("./utils/logs");

var _nanoid = _interopRequireDefault(require("./utils/nanoid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _logs.logFile)("test1", {
  test: 2,
  name: "feza"
});
const id = (0, _nanoid.default)();
console.log(id);