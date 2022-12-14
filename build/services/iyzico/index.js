"use strict";

var _iyzipay = _interopRequireDefault(require("iyzipay"));

var Cards = _interopRequireWildcard(require("./methods/cards"));

var Installments = _interopRequireWildcard(require("./methods/installments"));

var PaymentsThreeDS = _interopRequireWildcard(require("./methods/threeds-payments"));

var Checkouts = _interopRequireWildcard(require("./methods/checkouts"));

var CancelPayments = _interopRequireWildcard(require("./methods/cancel-payments"));

var RefundPayments = _interopRequireWildcard(require("./methods/refund-payments"));

var _nanoid = _interopRequireDefault(require("../../utils/nanoid"));

var Logs = _interopRequireWildcard(require("../../utils/logs"));

var Payments = _interopRequireWildcard(require("./methods/payments"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ---------------------------------------------- */

/* a) Cards                                       */

/* ---------------------------------------------- */
const createUserAndCards = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    card: {
      cardAlias: "Kredi Kart??m",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("1-cards-kullan??c??-ve-kart-olu??tur", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("1-cards-kullan??c??-ve-kart-olu??tur", err);
  });
}; //createUserAndCards();
// bir kullan??c??ya yeni kart ekle


const createCardForUser = () => {
  Cards.createUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    email: "email@email.com",
    externalId: (0, _nanoid.default)(),
    cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
    card: {
      cardAlias: "Kredi Kart??m",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030"
    }
  }).then(result => {
    console.log(result);
    Logs.logFile("2-bir-kullan??c??ya-kart-ekle", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("2-bir-kullan??c??ya-kart-ekle-hata", err);
  });
}; //createCardForUser()
//bir kullan??c??n??n kartlar??n?? oku


const readCardsOfAUser = () => {
  Cards.getUserCards({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts="
  }).then(result => {
    console.log(result);
    Logs.logFile("3-cards-bir-kullan??c??n??n-kartlar??n??-oku", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("3-cards-bir-kullan??c??n??n-kartlar??n??-oku-hata", err);
  });
}; //readCardsOfAUser()
//bir kullan??c??n??n kart??n?? sil


const deleteCardsOfAUser = () => {
  Cards.deleteUserCard({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
    cardToken: "HFzhfVnIVgfR1SaFuPlUZ0KcmQg="
  }).then(result => {
    console.log(result);
    Logs.logFile("4-cards-bir-kullan??c??n??n-kart??n??-sil", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("4-cards-bir-kullan??c??n??n-kart??n??-sil-hata", err);
  });
}; //deleteCardsOfAUser()

/* ---------------------------------------------- */

/* b) Installments                                       */

/* ---------------------------------------------- */
// ??demede taksit kontrol??


const checkInstallments = () => {
  return Installments.checkInstallment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    binNumber: "55287900",
    price: "1000"
  }).then(result => {
    console.log(result);
    Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu-hata", err);
  });
}; //checkInstallments()

/* ---------------------------------------------- */

/* c) Normal Payments                                       */

/* ---------------------------------------------- */
// kay??tl?? olmayan kartla ??deme yapmak


const createPayment = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '0'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("6-payments-yeni-bir-kartla-odeme-al-ve-kart??-kaydetme", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("6-payments-yeni-bir-kartla-odeme-al-ve-kart??-kaydetme-hata", err);
  });
}; //createPayment()
//kart kay??t ederek ??deme yapmak


const createPaymentAndSaveCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
      cardAlias: "Kredi Kart??m ??demeden Sonra",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '1'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("7-payments-yeni-bir-kartla-odeme-al-ve-kart??-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("7-payments-yeni-bir-kartla-odeme-al-ve-kart??-kaydet-hata", err);
  });
}; //createPaymentAndSaveCard()
//readCardsOfAUser()
//Kay??tl?? bir kredi kart??yla ??deme yap


const createPaymentWithSavedCard = () => {
  return Payments.createPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    paymentCard: {
      cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
      cardToken: "ixB15GiHkDyLjqTEr+uq6QV4yOM="
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("8-payments-kay??tl??-bir-kartla-odeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("8-payments-kay??tl??-bir-kartla-odeme-al-hata", err);
  });
}; //createPaymentWithSavedCard()

/* ---------------------------------------------- */

/* e) 3D Secure Paments                           */

/* ---------------------------------------------- */


const initializeThreeDSPayments = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '0'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-odeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("9-threeds-payments-yeni-bir-kartla-odeme-al-hata", err);
  });
}; //initializeThreeDSPayments();
//sms onay?? geldikten sonra yap??lacak i??lemler


const completeThreeDSPayment = () => {
  PaymentsThreeDS.completePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "18225505",
    conversationData: "conversation data"
  }).then(result => {
    console.log(result);
    Logs.logFile("10-threeds-payments-odeme-tamamla", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("10-threeds-payments-odeme-tamamla-hata", err);
  });
}; //completeThreeDSPayment()
//kay??tl?? karttan 3d ile ??deme


const initializeThreeDSPaymentsWithRegisteredCard = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
      cardToken: "ixB15GiHkDyLjqTEr+uq6QV4yOM="
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("11-threeds-payments-kay??tl??-kartla-odeme-al", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("11-threeds-payments-kay??tl??-kartla-odeme-al-hata", err);
  });
}; //initializeThreeDSPaymentsWithRegisteredCard()
//yeni kartla 3d ??deme yap ve kart?? kaydet


const initializeThreeDSPaymentsWithNewCardAndRegister = () => {
  PaymentsThreeDS.initializePayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/payment/3ds/complete",
    paymentCard: {
      cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
      cardAlias: "Kredi Kart??m 3D",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: '123',
      registerCard: '1'
    },
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("12-threeds-payments-yeni-kart-kaydet", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("12-threeds-payments-yeni-kart-kaydet-hata", err);
  });
}; //initializeThreeDSPaymentsWithNewCardAndRegister()

/* ---------------------------------------------- */

/* f) Checkout Form                               */

/* ---------------------------------------------- */
//checkout Form i??erisinde ??deme ba??lat


const initializeCheckoutForm = () => {
  Checkouts.initialize({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    price: "300",
    paidPrice: "300",
    currency: _iyzipay.default.CURRENCY.TRY,
    installment: "1",
    basketId: "B67JDL",
    paymentChannel: _iyzipay.default.PAYMENT_CHANNEL.WEB,
    paymentGroup: _iyzipay.default.PAYMENT_GROUP.PRODUCT,
    callbackUrl: "https://localhost/api/checkout/complete/payment",
    cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
    enableInstallments: [1, 2, 3, 6, 9],
    buyer: {
      id: "SDFJKL",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: "743008664791",
      lastLoginDate: "2020-10-05 12:43:35",
      registrationDate: "2022-09-09 12:43:35",
      registrationAddress: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732"
    },
    shippingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    billingAddress: {
      contactName: "John Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule G??stepe, Merdivenkoy mah. Bora sk. No: 1",
      zipCode: "34732"
    },
    basketItems: [{
      id: "BT101",
      name: "Samsung s20",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 90
    }, {
      id: "BT102",
      name: "Iphone 12",
      category1: "Telefonlar",
      category2: "iOS Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 150
    }, {
      id: "BT103",
      name: "Samsung s10",
      category1: "Telefonlar",
      category2: "Android Telefonlar",
      itemType: _iyzipay.default.BASKET_ITEM_TYPE.PHYSICAL,
      price: 60
    }]
  }).then(result => {
    console.log(result);
    Logs.logFile("13-checkout-form-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("13-checkout-form-payments-hata", err);
  });
}; //initializeCheckoutForm()
//checkout form ??deme bilgisini g??sterir


const getFormPayment = () => {
  Checkouts.getFormPayment({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    token: "601c8274-57a6-44c6-8b13-8339d5d2282c"
  }).then(result => {
    console.log(result);
    Logs.logFile("14-checkout-form-payments-get-details", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("14-checkout-form-payments-get-details-hata", err);
  });
}; //getFormPayment()

/* ---------------------------------------------- */

/* g) Cancel Payments                             */

/* ---------------------------------------------- */
//??deme ipal etme testi


const cancelPayments = () => {
  CancelPayments.cancelPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "18217734",
    ip: "85.34.78.122"
  }).then(result => {
    console.log(result);
    Logs.logFile("15-cancel-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("15-cancel-payments-hata", err);
  });
}; //cancelPayments()
//A????klama ile ??deme ipal etme testi


const cancelPaymentsWithReason = () => {
  CancelPayments.cancelPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentId: "18217734",
    ip: "85.34.78.122",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullan??c?? iste??i ile iptal edildi"
  }).then(result => {
    console.log(result);
    Logs.logFile("16-cancel-payments-reason", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("16-cancel-payments-reason-hata", err);
  });
}; //cancelPaymentsWithReason()

/* ---------------------------------------------- */

/* h) Refund Payment                              */

/* ---------------------------------------------- */


const refundPayment = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "19440140",
    price: "50",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "85.34.78.112"
  }).then(result => {
    console.log(result);
    Logs.logFile("17-refund-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17-refund-payments-hata", err);
  });
};

refundPayment(); // ??demenin bir k??sm??n?? neden ve a????klama ile iade et

const refundPaymentWithReason = () => {
  RefundPayments.refundPayments({
    locale: _iyzipay.default.LOCALE.TR,
    conversationId: (0, _nanoid.default)(),
    paymentTransactionId: "19440140",
    price: "50",
    currency: _iyzipay.default.CURRENCY.TRY,
    ip: "85.34.78.112",
    reason: _iyzipay.default.REFUND_REASON.BUYER_REQUEST,
    description: "Kullan??c?? iade istedi"
  }).then(result => {
    console.log(result);
    Logs.logFile("17-refund-payments", result);
  }).catch(err => {
    console.log(err);
    Logs.logFile("17-refund-payments-hata", err);
  });
}; //createPayment()


refundPaymentWithReason();