import dotenv from 'dotenv';
dotenv.config();


export function checkRole(req, res, next) {
    if (res.locals.role === process.env.USER){
        res.status(401);
    }else{
        next();
    }
}
