"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _carts = _interopRequireDefault(require("../db/carts"));

var _users = _interopRequireDefault(require("../db/users"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _Session = _interopRequireDefault(require("../middlewares/Session"));

var PaymentsThreeDS = _interopRequireWildcard(require("../services/iyzico/methods/threeds-payments"));

var Cards = _interopRequireWildcard(require("../services/iyzico/methods/cards"));

var _nanoid = _interopRequireDefault(require("../utils/nanoid"));

var _payments = require("../utils/payments");

var _iyzipay = _interopRequireDefault(require("iyzipay"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = router => {
  //Complete Payment
  router.post("/threeds/payments/complete", async (req, res) => {
    if (!req.body?.paymentId) {
      throw new _ApiError.default("Payment id is required", 400, "paymentIdReqired");
    }

    if (req.body.status !== "success") {
      throw new _ApiError.default("Payment cant be starred because initialization is failed", 400, "initializationFailed");
    }

    const data = {
      locale: "tr",
      conversationId: (0, _nanoid.default)(),
      paymentId: req.body.paymentId,
      conversationData: req.body.conversationData
    };
    const result = await PaymentsThreeDS.completePayment(data);
    await (0, _payments.CompletePayment)(result);
    res.status(200).json(result);
  }); // YEN?? B??R KARTLA ??DEME OLU??TUR VE KARTI KAYDETME - Threeds

  router.post("/threeds/payments/:cartId/with-new-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;

    if (!card) {
      throw new _ApiError.default("Card is required", 400, "cardRequired");
    }

    if (!req.params?.cartId) {
      throw new _ApiError.default("Card id is required", 400, "cardIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 400, "cartNotFound");
    }

    if (cart?.completed) {
      throw new _ApiError.default("Cart is Completed", 400, "cartCompleted");
    }

    card.registerCard = "0";
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installment: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
      paymentCard: card,
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  }); // YEN?? B??R KARTLA ??DEME OLU??TUR VE KARTI KAYDET - Threeds

  router.post("/threeds/payments/:cartId/with-new-card/register-card", _Session.default, async (req, res) => {
    const {
      card
    } = req.body;

    if (!card) {
      throw new _ApiError.default("Card is required", 400, "cardRequired");
    }

    if (!req.params?.cartId) {
      throw new _ApiError.default("Card id is required", 400, "cardIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 400, "cartNotFound");
    }

    if (cart?.completed) {
      throw new _ApiError.default("Cart is Completed", 400, "cartCompleted");
    }

    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }

    card.registerCard = "1";
    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installment: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
      paymentCard: card,
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  }); // VAROLAN B??R KARTLA ??DEME OLU??TUR VE KARTI KAYDET - Threeds Card Index

  router.post("/threeds/payments/:cartId/:cartIndex/with-registered-card-index", _Session.default, async (req, res) => {
    let {
      cardIndex
    } = req.params;

    if (!cardIndex) {
      throw new _ApiError.default("Card index is required", 400, "cardIndexRequired");
    }

    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registred card available", 400, "cardUserKeyRequired");
    }

    const cards = await Cards.getUserCards({
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      cardUserKey: req.user?.cardUserKey
    });
    const index = parseInt(cardIndex);

    if (index >= cards?.cardDetails?.length) {
      throw new _ApiError.default("Card doesn't exists", 400, "cardIndexInvalid");
    }

    const {
      cardToken
    } = cards?.cardDetails[index];
    const card = {
      cardToken,
      cardUserKey: req.user?.cardUserKey
    };

    if (!req.params?.cartId) {
      throw new _ApiError.default("Card id is required", 400, "cardIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 400, "cartNotFound");
    }

    if (cart?.completed) {
      throw new _ApiError.default("Cart is Completed", 400, "cartCompleted");
    }

    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }

    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installment: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
      paymentCard: card,
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  }); // VAROLAN B??R KARTLA ??DEME OLU??TUR VE KARTI KAYDET - Threeds Card Token

  router.post("/threeds/payments/:cartId/with-registered-card-token", _Session.default, async (req, res) => {
    let {
      cardToken
    } = req.body;

    if (!cardToken) {
      throw new _ApiError.default("Card Token is required", 400, "cardTokenRequired");
    }

    if (!req.user?.cardUserKey) {
      throw new _ApiError.default("No registred card available", 400, "cardUserKeyRequired");
    }

    const card = {
      cardToken,
      cardUserKey: req.user?.cardUserKey
    };

    if (!req.params?.cartId) {
      throw new _ApiError.default("Card id is required", 400, "cardIdRequired");
    }

    const cart = await _carts.default.findOne({
      _id: req.params?.cartId
    }).populate("buyer").populate("products");

    if (!cart) {
      throw new _ApiError.default("Cart not found", 400, "cartNotFound");
    }

    if (cart?.completed) {
      throw new _ApiError.default("Cart is Completed", 400, "cartCompleted");
    }

    if (req.user?.cardUserKey) {
      card.cardUserKey = req.user?.cardUserKey;
    }

    const paidPrice = cart.products.map(product => product.price).reduce((a, b) => a + b, 0);
    const data = {
      locale: req.user.locale,
      conversationId: (0, _nanoid.default)(),
      price: paidPrice,
      paidPrice: paidPrice,
      currency: _iyzipay.default.CURRENCY.TRY,
      installment: "1",
      basketId: String(cart?._id),
      paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
      paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
      paymentCard: card,
      buyer: {
        id: String(req.user._id),
        name: req.user?.name,
        surname: req.user?.surname,
        gsmNumber: req.user?.phoneNumber,
        email: req.user?.email,
        identityNumber: req.user?.identityNumber,
        lastLoginDate: (0, _moment.default)(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationDate: (0, _moment.default)(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        registrationAddress: req.user?.address,
        ip: req.user?.ip,
        city: req.user?.city,
        country: req.user?.country,
        zipCode: req.user?.zipCode
      },
      shippingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      billingAddress: {
        contactName: req.user?.name + " " + req.user?.surname,
        city: req.user?.city,
        country: req.user?.country,
        address: req.user?.address,
        zipCode: req.user?.zipCode
      },
      basketItems: cart.products.map((product, index) => {
        return {
          id: String(product?._id),
          name: product?.name,
          category1: product?.categories[0],
          category2: product?.categories[1],
          itemType: _iyzipay.default.BASKET_ITEM_TYPE[product?.itemType],
          price: product?.price
        };
      })
    };
    let result = await PaymentsThreeDS.initializePayment(data);
    const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
    res.send(html);
  });
};

exports.default = _default;