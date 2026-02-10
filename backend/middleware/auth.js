import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const {token} = req.headers;
    if(!token){
        return res.json({success: false, message: "Not Authorized login again"});
    }
    try {
        const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decoded.id;
        next();
    } catch (error) {
        return res.json({success: false, message: "Error"});
    }
}
export default authMiddleware;