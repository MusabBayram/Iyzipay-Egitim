import { Types } from "mongoose";
import PaymentsSuccess from "../db/payment-success";
import PaymentsFailed from "../db/payment-failed";
import Carts from "../db/carts";

const { ObjectId } = Types;

export const CompletePayment = async (result) => {
    if(result?.status === "success"){
        await Carts.updateOne({_id:ObjectId(result?.basketId)}, {$set:{
            completed: true
        }})
    }
}