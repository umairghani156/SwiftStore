
export const assignIssueMiddleware = (req, res, next) => {
    try {
    if(!req.user._id) return res.status(401).json({success: false, message: "Unauthorized"});

    if (req.user.role !== "Admin" && req.user.role !== "Office Manager") {
        return res.status(403).json({ success: false, message: "Forbidden: You do not have permission to assign issues" });
    }
    next(); 
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, message: "Unauthorized"});
    }
};