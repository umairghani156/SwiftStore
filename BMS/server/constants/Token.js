import pkg from "jsonwebtoken";

const {sign, verify} = pkg;

export const GenerateToken = ({data, expiresIn})=>{
    return sign({result: data}, process.env.JWT_SECRET_KEY, {expiresIn: expiresIn});
}