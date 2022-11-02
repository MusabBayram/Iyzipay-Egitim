import moment from "moment";
import Carts from "../db/carts";
import Users from "../db/users";
import ApiError from "../error/ApiError";
import Session from "../middlewares/Session";
import * as Checkout from "../services/iyzico/methods/checkouts";
import * as Cards from "../services/iyzico/methods/cards";
import nanoid from "../utils/nanoid";
import { CompletePayment } from "../utils/payments";
import Iyzipay from "iyzipay";

export default (router) => {
    //CHECKOUT FORM COMPLETE
    router.post("/checkout/complete/payment", async (req, res) => {
        let result = await Checkout.getFormPayment({
            locale: "tr",
            conversationId: nanoid(),
            token: req.body.token
        });
        await CompletePayment(result);
        res.json(result);
    })
}