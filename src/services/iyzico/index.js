import Iyzipay from 'iyzipay';
import * as Cards from './methods/cards';
import nanoid from '../../utils/nanoid';
import * as Logs from '../../utils/logs';


/* ---------------------------------------------- */
/* a) Cards                                       */
/* ---------------------------------------------- */
const createUserAndCards = () => {

    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversetionId: nanoid(),
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

// createUserAndCards();
// bir kullanıcıya yeni kart ekle

const createCardForUser = () => {

    Cards.createUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversetionId: nanoid(),
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
        conversetionId: nanoid(),
        cardUserKey: "GNsqxvMEP3ecW+SW2BJVqvgS5ts=",
    }).then((result) => {
        console.log(result);
        Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku", result)
    }).catch((err) => {
        console.log(err);
        Logs.logFile("3-cards-bir-kullanıcının-kartlarını-oku-hata", err)
    })
}

readCardsOfAUser()

//bir kullanıcının kartını sil
const deleteCardsOfAUser = () => {

    Cards.deleteUserCard({
        locale: Iyzipay.LOCALE.TR,
        conversetionId: nanoid(),
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
