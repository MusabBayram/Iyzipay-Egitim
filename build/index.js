"use strict";

require("express-async-errors");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _config = _interopRequireDefault(require("./config"));

var _express = _interopRequireWildcard(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _https = _interopRequireDefault(require("https"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = require("passport-jwt");

var _db = _interopRequireDefault(require("./db"));

var _GenericErrorHandler = _interopRequireDefault(require("./middlewares/GenericErrorHandler"));

var _ApiError = _interopRequireDefault(require("./error/ApiError"));

var _Session = _interopRequireDefault(require("./middlewares/Session"));

var _users = _interopRequireDefault(require("./db/users"));

var _routes = _interopRequireDefault(require("./routes"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const envPath = _config.default?.production ? "./env/.prod" : "./env/.dev";

_dotenv.default.config({
  path: envPath
}); //BEGIN MONGODB CONNECTION


_mongoose.default.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.log(err);
}); //END MONGODB CONNECTION


const app = (0, _express.default)();

const router = _express.default.Router();

app.use((0, _morgan.default)(process.env.LOGGER));
app.use((0, _helmet.default)());
app.use((0, _cors.default)({
  origin: "*"
}));
app.use(_express.default.json({
  limit: "1mb"
}));
app.use(_express.default.urlencoded({
  extended: true
}));

_passport.default.serializeUser((user, done) => {
  done(null, user);
});

_passport.default.deserializeUser((id, done) => {
  done(null, id);
});

app.use(_passport.default.initialize());
const jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

_passport.default.use(new _passportJwt.Strategy(jwtOpts, async (jwtPayload, done) => {
  try {
    const user = await _users.default.findOne({
      _id: jwtPayload._id
    });

    if (user) {
      done(null, user.toJSON());
    } else {
      done(new _ApiError.default("Autorization is not valid", 401, "authorizationInvalid"), false);
    }
  } catch (err) {
    return done(err, false);
  }
})); // app.use("/", (req, res) => {
//     throw new ApiError("Bir hata olu??tu", 404, "somethingWrong")
//     res.json({
//         test: 1
//     })
// })


_routes.default.forEach((routeFn, index) => {
  routeFn(router);
});

app.use("/api", router);
app.all("/test-auth", _Session.default, (req, res) => {
  res.json({
    test: true
  });
});
app.use(_GenericErrorHandler.default);

if (process.env.HTTPS_ENABLED === "true") {
  const key = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/key.pem")).toString();

  const cert = _fs.default.readFileSync(_path.default.join(__dirname, "./certs/cert.pem")).toString();

  const server = _https.default.createServer({
    key: key,
    cert: cert
  }, app);

  server.listen(process.env.PORT, () => {
    console.log("Express Uygulamam??z " + process.env.PORT + " ??zerinden ??al????maktad??r");
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log("Express Uygulamam??z " + process.env.PORT + " ??zerinden ??al????maktad??r");
  });
}