import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Payments from "../services/iyzico/methods/payments";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";

export default (router) => {
    // YENİ BİR KARTLA ÖDEME OLUŞTUR VE KARTI KAYDETME
    router.post("/payments/:cartId/with-new-card", Session, async (req,res) => {
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
            }
        }


    })
}