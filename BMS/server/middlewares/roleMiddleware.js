import pkg from 'jsonwebtoken';
const { verify } = pkg;

 const roleMiddleware = async (req, res, next) => {
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
        if (req.user.role !== "Admin" && req.user.role !== "Office Manager") {
            return res.status(403).json({ success: false, message: "Forbidden: You do not have permission to access this route" });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

export default roleMiddleware;