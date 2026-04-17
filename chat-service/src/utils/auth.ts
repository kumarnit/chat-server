import jwt from "jsonwebtoken";
import config from "../config/config";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}


const jwtSecret = config.JWT_SECRET as string;

export const detokenizeToken = async (token: string) : Promise<IUser> => {
    const decoded = jwt.verify(token, jwtSecret) as any;

    return {
        _id: decoded.id,
        email: decoded.email,
        createdAt: new Date(decoded.iat * 1000),
        updatedAt: new Date(decoded.exp * 1000),
        name: decoded.name,
        password: "",
    };
}