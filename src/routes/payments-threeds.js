import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as PaymentsThreeDS from "../services/iyzico/methods/threeds-payments";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import Iyzipay from "iyzipay";

export default (router) => {
    //Complete Payment
    router.post("/threeds/payments/complete", async (req, res) => {
        if(!req.body?.paymentId) {
            throw new ApiError("Payment id is required", 400, "paymentIdReqired");
        }
        if(req.body.status !== "success") {
            throw new ApiError("Payment cant be starred because initialization is failed", 400,"initializationFailed");
        }
        const data = {
            locale: "tr",
            conversationId: nanoid(),
            paymentId: req.body.paymentId,
            conversationData: req.body.conversationData
        }
        const result = await PaymentsThreeDS.completePayment(data);
        await CompletePayment(result);
        res.status(200).json(result);
    })
    // YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDETME - Threeds
    router.post("/threeds/payments/:cartId/with-new-card", Session, async (req,res) => {
        const { card } = req.body;
        if(!card) {
            throw new ApiError("Card is required", 400, "cardRequired")
        }
        if(!req.params?.cartId) {
            throw new ApiError("Card id is required", 400, "cardIdRequired")
        }
        const cart = await Carts.findOne({_id: req.params?.cartId}).populate("buyer").populate("products");
        if(!cart) {
            throw new ApiError("Cart not found", 400, "cartNotFound")
        }
        if(cart?.completed) {
            throw new ApiError("Cart is Completed", 400, "cartCompleted")
        }
        card.registerCard = "0"
        const paidPrice = cart.products.map((product) => product.price).reduce((a,b) => a+b, 0);

        const data = {
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: "1",
            basketId: String(cart?._id),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
            paymentCard: card,
            buyer: {
                id: String(req.user._id),
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress:{
                contactName: req.user?.name+" "+req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress:{
                contactName: req.user?.name+" "+req.user?.surname,
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
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }

        let result = await PaymentsThreeDS.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
        res.send(html);
    
    })
    // YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDET - Threeds
    router.post("/threeds/payments/:cartId/with-new-card/register-card", Session, async (req,res) => {
        const { card } = req.body;
        if(!card) {
            throw new ApiError("Card is required", 400, "cardRequired")
        }
        if(!req.params?.cartId) {
            throw new ApiError("Card id is required", 400, "cardIdRequired")
        }
        const cart = await Carts.findOne({_id: req.params?.cartId}).populate("buyer").populate("products");
        if(!cart) {
            throw new ApiError("Cart not found", 400, "cartNotFound")
        }
        if(cart?.completed) {
            throw new ApiError("Cart is Completed", 400, "cartCompleted")
        }
        if(req.user?.cardUserKey) {
            card.cardUserKey = req.user?.cardUserKey
        }
        card.registerCard = "1"
        const paidPrice = cart.products.map((product) => product.price).reduce((a,b) => a+b, 0);

        const data = {
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: "1",
            basketId: String(cart?._id),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
            paymentCard: card,
            buyer: {
                id: String(req.user._id),
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress:{
                contactName: req.user?.name+" "+req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress:{
                contactName: req.user?.name+" "+req.user?.surname,
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
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }

        let result = await PaymentsThreeDS.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
        res.send(html);
    
    })
    // VAROLAN BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDET - Threeds Card Index
    router.post("/threeds/payments/:cartId/:cartIndex/with-registered-card-index", Session, async (req,res) => {
        let { cardIndex } = req.params;
        if(!cardIndex) {
            throw new ApiError("Card index is required", 400, "cardIndexRequired")
        }
        if(!req.user?.cardUserKey) {
            throw new ApiError("No registred card available", 400, "cardUserKeyRequired")
        }
        const cards = await Cards.getUserCards({            
            locale: req.user.locale,
            conversationId: nanoid(),
            cardUserKey: req.user?.cardUserKey
        })
        const index = parseInt(cardIndex);
        if(index >= cards?.cardDetails?.length) {            
            throw new ApiError("Card doesn't exists", 400, "cardIndexInvalid")
        }
        const { cardToken } = cards?.cardDetails[index];
        
        const card = {            
            cardToken,
            cardUserKey: req.user?.cardUserKey
        }
        if(!req.params?.cartId) {
            throw new ApiError("Card id is required", 400, "cardIdRequired")
        }
        const cart = await Carts.findOne({_id: req.params?.cartId}).populate("buyer").populate("products");
        if(!cart) {
            throw new ApiError("Cart not found", 400, "cartNotFound")
        }
        if(cart?.completed) {
            throw new ApiError("Cart is Completed", 400, "cartCompleted")
        }
        if(req.user?.cardUserKey) {
            card.cardUserKey = req.user?.cardUserKey
        }
        const paidPrice = cart.products.map((product) => product.price).reduce((a,b) => a+b, 0);

        const data = {
            locale: req.user.locale,
            conversationId: nanoid(),
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            installment: "1",
            basketId: String(cart?._id),
            paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.END_POINT}/threeds/payments/:cartId/with-new-card`,
            paymentCard: card,
            buyer: {
                id: String(req.user._id),
                name: req.user?.name,
                surname: req.user?.surname,
                gsmNumber: req.user?.phoneNumber,
                email: req.user?.email,
                identityNumber: req.user?.identityNumber,
                lastLoginDate: moment(req.user?.updateAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationDate: moment(req.user?.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                registrationAddress: req.user?.address,
                ip: req.user?.ip,
                city: req.user?.city,
                country: req.user?.country,
                zipCode: req.user?.zipCode
            },
            shippingAddress:{
                contactName: req.user?.name+" "+req.user?.surname,
                city: req.user?.city,
                country: req.user?.country,
                address: req.user?.address,
                zipCode: req.user?.zipCode
            },
            billingAddress:{
                contactName: req.user?.name+" "+req.user?.surname,
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
                    itemType: Iyzipay.BASKET_ITEM_TYPE[product?.itemType],
                    price: product?.price
                }
            })
        }

        let result = await PaymentsThreeDS.initializePayment(data);
        const html = Buffer.from(result?.threeDSHtmlContent, 'base64').toString();
        res.send(html);
    
    })
}