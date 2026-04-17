import { Request, Response } from "express";
import { User } from "../database";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password"); // exclude password

        return res.json({
            status: 200,
            message: "Users fetched successfully!",
            data: users,
        });
    } catch (error: any) {
        return res.json({
            status: 500,
            message: error.message,
        });
    }
};

export default {
    getAllUsers
}; 