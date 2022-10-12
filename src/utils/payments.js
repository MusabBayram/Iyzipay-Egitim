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
        await PaymentsSuccess.create({
            status: result.status,
            cartId: result?.basketId,
            conversationId: result?.conversationId,
            currency: result?.currency,
            paymentId: result?.paymentId,
            price: result?.price,
            paidPrice: result?.paidPrice,
            ItemTransactions: result?.ItemTransactions.map(item =>{
                return{
                    itemId: item?.itemId,
                    paymentTransactionId: item?.paymentTransactionId,
                    price: item?.price,
                    paidPrice: item?.paidPrice
                }
            })
        })
    }
}