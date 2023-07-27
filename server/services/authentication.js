import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['Authorization'];
    const token = authHeader.split(' ')[1];
    if (token === null) {
        res.status(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (error, response) => {
        if (error) res.status(403);
        res.locals = response;
        next();
    });
}

