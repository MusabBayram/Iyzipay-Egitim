import Iyzipay from 'iyzipay';
import * as Cards from './methods/cards';
import * as Installments from './methods/installments';
import * as PaymentsThreeDS from './methods/threeds-payments';
import nanoid from '../../utils/nanoid';
import * as Logs from '../../utils/logs';
import  * as Payments from './methods/payments'


/* ---------------------------------------------- */
/* a) Cards                                       */
/* ---------------------------------------------- */
const createUserAndCards = () => {

    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email: "email@email.com",
        externalId: nanoid(),
        card: {
            cardAlias: "Kredi Kartım",
            cardHolderName: "John Doe",
            cardNumber: "5528790000000008",
            expireMonth: "12",
            expireYear: "2030",
        }

    }).then((result) => {
        console.log(result);
        Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("1-cards-kullanıcı-ve-kart-oluştur", err)
    })
}

 //createUserAndCards();
// bir kullanıcıya yeni kart ekle

const createCardForUser = () => {

    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        email: "email@email.com",
        externalId: nanoid(),        
        cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
        card: {
            cardAlias: "Kredi Kartım",
            cardHolderName: "John Doe",
            cardNumber: "5528790000000008",
            expireMonth: "12",
            expireYear: "2030",
        }

    }).then((result) => {
        console.log(result);
        Logs.logFile("2-bir-kullanıcıya-kart-ekle", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("2-bir-kullanıcıya-kart-ekle-hata", err)
    })
}

//createCardForUser()

//bir kullanıcının kartlarını oku

const readCardsOfAUser = () => {

    Cards.getUserCards({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
    }).then((result) => {
        console.log(result);
        Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", err)
    })
}

//readCardsOfAUser()

//bir kullanıcının kartını sil
const deleteCardsOfAUser = () => {

    Cards.deleteUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
        cardToken: "HFzhfVnIVgfR1SaFuPlUZ0KcmQg=",
    }).then((result) => {
        console.log(result);
        Logs.logFile("4-cards-bir-kullanıcının-kartını-sil", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("4-cards-bir-kullanıcının-kartını-sil-hata", err)
    })
}

//deleteCardsOfAUser()


/* ---------------------------------------------- */
/* b) Installments                                       */
/* ---------------------------------------------- */

// ödemede taksit kontrolü

const checkInstallments = () => {
    return Installments.checkInstallment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        binNumber: "55287900",
        price: "1000"
    }).then((result) => {
        console.log(result);
        Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu", result)
    }).catch((err) => {
    console.log(err);
        Logs.logFile("5-installments-bir-kart-ve-ucret-taksit-kontrolu-hata", err)
    })
}

//checkInstallments()


/* ---------------------------------------------- */
/* c) Normal Payments                                       */
/* ---------------------------------------------- */

// kayıtlı olmayan kartla ödeme yapmak

const createPayment = () => {
    return Payments.createPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price: "300",
        paidPrice: "300",
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67JDL",
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
            registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: "BT101",
                name: "Samsung s20",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id: "BT102",
                name: "Iphone 12",
                category1: "Telefonlar",
                category2: "iOS Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 150
            },
            {
                id: "BT103",
                name: "Samsung s10",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 60
            }
        ]

    }).then((result) => {
        console.log(result);
        Logs.logFile("6-paments-yeni-bir-kartla-odeme-al-ve-kartı-kaydetme", result)
    }).catch((err) => {
    console.log(err);
        Logs.logFile("6-paments-yeni-bir-kartla-odeme-al-ve-kartı-kaydetme-hata", err)
    })
}

//createPayment()

//kart kayıt ederek ödeme yapmak

const createPaymentAndSaveCard = () => {
    return Payments.createPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price: "300",
        paidPrice: "300",
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67JDL",
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
            cardAlias: "Kredi Kartım Ödemeden Sonra",
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
            registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: "BT101",
                name: "Samsung s20",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id: "BT102",
                name: "Iphone 12",
                category1: "Telefonlar",
                category2: "iOS Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 150
            },
            {
                id: "BT103",
                name: "Samsung s10",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 60
            }
        ]

    }).then((result) => {
        console.log(result);
        Logs.logFile("7-paments-yeni-bir-kartla-odeme-al-ve-kartı-kaydet", result)
    }).catch((err) => {
    console.log(err);
        Logs.logFile("7-paments-yeni-bir-kartla-odeme-al-ve-kartı-kaydet-hata", err)
    })
}

//createPaymentAndSaveCard()
//readCardsOfAUser()

//Kayıtlı bir kredi kartıyla ödeme yap

const createPaymentWithSavedCard = () => {
    return Payments.createPayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price: "300",
        paidPrice: "300",
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67JDL",
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
            registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: "BT101",
                name: "Samsung s20",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id: "BT102",
                name: "Iphone 12",
                category1: "Telefonlar",
                category2: "iOS Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 150
            },
            {
                id: "BT103",
                name: "Samsung s10",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 60
            }
        ]

    }).then((result) => {
        console.log(result);
        Logs.logFile("8-paments-kayıtlı-bir-kartla-odeme-al", result)
    }).catch((err) => {
    console.log(err);
        Logs.logFile("8-paments-kayıtlı-bir-kartla-odeme-al-hata", err)
    })
}

//createPaymentWithSavedCard()


/* ---------------------------------------------- */
/* e) 3D Secure Paments                           */
/* ---------------------------------------------- */


const initializeThreeDSPayments = () => {
    PaymentsThreeDS.initializePayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price: "300",
        paidPrice: "300",
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67JDL",
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
            registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: "BT101",
                name: "Samsung s20",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id: "BT102",
                name: "Iphone 12",
                category1: "Telefonlar",
                category2: "iOS Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 150
            },
            {
                id: "BT103",
                name: "Samsung s10",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 60
            }
        ]
    }).then((result) => {
        console.log(result);        
        Logs.logFile("9-threeds-patments-yeni-bir-kartla-odeme-al", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("9-threeds-patments-yeni-bir-kartla-odeme-al-hata", err)
    })
}

//initializeThreeDSPayments();

//sms onayı geldikten sonra yapılacak işlemler

const completeThreeDSPayment = () => {
    PaymentsThreeDS.completePayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        paymentId: "18225505",
        conversationData: "conversation data"
    }).then((result) => {
        console.log(result);        
        Logs.logFile("10-threeds-patments-odeme-tamamla", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("10-threeds-patments-odeme-tamamla-hata", err)
    })
}

//completeThreeDSPayment()


//kayıtlı karttan 3d ile ödeme
const initializeThreeDSPaymentsWithRegisteredCard = () => {
    PaymentsThreeDS.initializePayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price: "300",
        paidPrice: "300",
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67JDL",
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
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
            registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: "BT101",
                name: "Samsung s20",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id: "BT102",
                name: "Iphone 12",
                category1: "Telefonlar",
                category2: "iOS Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 150
            },
            {
                id: "BT103",
                name: "Samsung s10",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 60
            }
        ]
    }).then((result) => {
        console.log(result);        
        Logs.logFile("11-threeds-patments-kayıtlı-kartla-odeme-al", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("11-threeds-patments-kayıtlı-kartla-odeme-al-hata", err)
    })
}

//initializeThreeDSPaymentsWithRegisteredCard()

//yeni kartla 3d ödeme yap ve kartı kaydet
const initializeThreeDSPaymentsWithNewCardAndRegister = () => {
    PaymentsThreeDS.initializePayment({
        locale: Iyzipay.LOCALE.TR,
        conversationId: nanoid(),
        price: "300",
        paidPrice: "300",
        currency: Iyzipay.CURRENCY.TRY,
        installment: "1",
        basketId: "B67JDL",
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: "https://localhost/api/payment/3ds/complete",
        paymentCard: {
            cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
            cardAlias: "Kredi Kartım 3D",
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
            registrationAddress: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            ip: "85.34.78.112",
            city: "Istanbul",
            country: "Turkey",
            zipCode: "34732"
        },
        shippingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        billingAddress: {
            contactName: "John Doe",
            city: "Istanbul",
            country: "Turkey",
            address: "Nidakule Göstepe, Merdivenkoy mah. Bora sk. No: 1",
            zipCode: "34732"
        },
        basketItems: [
            {
                id: "BT101",
                name: "Samsung s20",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 90
            },
            {
                id: "BT102",
                name: "Iphone 12",
                category1: "Telefonlar",
                category2: "iOS Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 150
            },
            {
                id: "BT103",
                name: "Samsung s10",
                category1: "Telefonlar",
                category2: "Android Telefonlar",
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: 60
            }
        ]
    }).then((result) => {
        console.log(result);        
        Logs.logFile("11-threeds-patments-kayıtlı-kartla-odeme-al", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("11-threeds-patments-kayıtlı-kartla-odeme-al-hata", err)
    })
}

//initializeThreeDSPaymentsWithNewCardAndRegister()
