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
}