import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401).json({ error: 'Unauthorized' });
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN, (error, response) => {
            if (error) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            res.locals = response;
            next();
        });
    }
}
