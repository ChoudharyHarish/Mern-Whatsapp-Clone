const jwt = require('jsonwebtoken')

const authMiddleWare = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decodedData;
        decodedData = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedData);
        req.userId = decodedData?.id;
        next();
    }
    catch (error) {
        res.status(404).json("User not authenticated")
        console.log(error.message);
    }
}


module.exports = authMiddleWare;