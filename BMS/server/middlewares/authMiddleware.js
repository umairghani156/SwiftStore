import pkg from "jsonwebtoken";

const {verify} = pkg;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token provided",
        })
    };
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded.result;
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
              success: false,
              message: "Token expired. Please log in again.",
            });
          }
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

export default authMiddleware;
