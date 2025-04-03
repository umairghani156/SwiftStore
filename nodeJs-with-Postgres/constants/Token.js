import pkg from "jsonwebtoken";
import "dotenv/config.js";

const { sign, verify } = pkg;


export const GenerateAccessToken = ({data, expiresIn} ) => {
    return sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
};

export const GenerateRefreshToken = ({data, expiresIn} ) => {
    return sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: expiresIn });
}

export const verifyAccessToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("Token:", token);  // Log the token for debugging

    if (!token) {
        return res.status(403).json({ message: 'Access token required' });
    }

    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token' });
        }
        req.user = decoded.user;  
        next();  
    });
};
  
  export const VerifyRefreshToken = (token) => {
    return verify(token, process.env.REFRESH_TOKEN_SECRET);
  };