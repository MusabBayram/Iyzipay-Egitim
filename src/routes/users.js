import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../db/users";
import ApiError from "../error/ApiError";

export default (router) => {
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const user = await Users.findOne({ email: email });
        if(!user) {
            throw new ApiError("Incorrect password or email", 401, "userOrPasswordIncorrect")
        }
    })
}