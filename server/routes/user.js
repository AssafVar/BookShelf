import express from 'express';
import { connection } from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { authenticateToken } from '../services/authentication.js';
import { checkRole } from '../services/checkRole.js'
//import { ResultSetHeader } from 'mysql2';
const router = express.Router();

router.post('/signup', (req, res) => {
    const { name, email, contactNumber, password } = req.body;
    let query = "SELECT * FROM user WHERE email = ?";
    connection.query(query, [email], (err, results) => {
        if (!err) {
            if (Array.isArray(results) && results.length > 0) {
                res.status(400).json({ message: 'Email Already In Use' })
            } else {
                query = "insert into user (name, email, contact_number, password, status, role) values (?,?,?,?,'false','user')";
                connection.query(query, [name, email, contactNumber, password], (err, results) => {
                    if (!err) {
                        res.status(200).json({ message: "Successfully Registered" });
                    } else {
                        res.status(500).json(err);
                    }
                });
            }
        } else {
            res.status(500).json(err);
        }
    })
})
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'select email, password, role, status from user where email= ?';
    connection.query(query, [email], (err, response) => {
        if (!err) {
            if ((Array.isArray(response) && response.length === 0) || response[0].password !== password) {
                res.status(401).json({ message: 'Incorrect user or password' });
            } else if (response[0].status === 'false') {
                res.status(401).json({ message: 'You are not authorized yet. Please wait for admin approval' });
            } else if (response[0].password === password) {
                const result = { email: response[0].email, role: response[0].role }
                const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });
            } else {
                res.status(400).json({ message: 'Something went wrong. Please try again' });
            }
        } else {
            res.status(500).json(err);
        }

    });
});

router.get('/get', authenticateToken, (req, res) => {
    const query = "SELECT id, name, contact_number, email, status FROM user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            res.status(200).send(results);
        } else {
            res.status(500).json(err);
        }
    });
});

router.get('/checkToken', authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" })
});

router.post('/changePassword', authenticateToken, (res, req) => {
    const user = req.body;
    const email = res.locals.email;
    let query = 'SELECT * FROM user WHERE email=? AND password=?';
    connection.query(query, [email, user.password], (err, results) => {
        if (!err) {
            if (Array.isArray(results) && results.length == 0) {
                res.status(400).json({ message: "Incorrect old password" });
            } else if (results[0].password == user.oldPassword) {
                query = 'UPDATE user SET password =? WHERE email =?';
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        res(200).json({ message: 'Password changed successfully' })
                    } else {
                        res.status(500).json(err);
                    }
                });
            }
        } else {
            res.status(500).json(err);
        }
    });
});

router.patch('/update', authenticateToken, checkRole, (req, res) => {
    const user = req.body;
    const query = 'UPDATE user SET status =? WHERE id =?';
    connection.query(query,[user.status, user.id], (err, results)=>{
        if (!err) {
            if (results?.affectedRows == 0){
                res.status(404).json({message:'User id does not exist'})
            }
            res.status(200).json({message:'User updated successfully'});
        }else {
            res.status(500).json(err);
        }
    });
});
export default router;