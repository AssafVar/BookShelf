import express from 'express';
import {connection} from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { authenticateToken} from '../services/authentication.js';
import { checkRole } from '../services/checkRole.js'
const router = express.Router();

router.post('/signup', (req, res)=>{
    const {name, email, contactNumber, password} = req.body;
    let query = "SELECT * FROM user WHERE email = ?";
    connection.query(query,[email],(err, results)=>{
        if(!err){
            if (Array.isArray(results) && results.length>0){
                res.status(400).json({message:'Email Already In Use'})
            }else {
                query = "insert into user (name, email, contact_number, password, status, role) values (?,?,?,?,'false','user')";
                connection.query(query, [name, email, contactNumber, password],(err, results)=>{
                    if(!err){
                        res.status(200).json({message:"Successfully Registered"});
                    }else{
                        res.status(500).json(err);
                    }
                });
            }
        }else{
            res.status(500).json(err);
        }   
    })
})
router.post('/login', (req, res) => {
   const {email, password} = req.body;
   const query = 'select email, password, role, status from user where email= ?';
   connection.query(query,[email], (err,response)=>{
    if(!err){
        if ((Array.isArray(response) && response.length === 0) || response[0].password !== password){
            res.status(401).json({message:'Incorrect user or password'});
        }else if( response[0].status === 'false' ){
            res.status(401).json({message:'You are not authorized yet. Please wait for admin approval'});
        }else if ( response[0].password === password){
            const result = {email:response[0].email, role:response[0].role}
            const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN, {expiresIn:'8h'});
            res.status(200).json({token:accessToken});
        }else{
            res.status(400).json({message:'Something went wrong. Please try again'});
        }
    }else{
        res.status(500).json(err);
    }
    
   });
});

router.get('/get', authenticateToken, (req, res) => {
    const query = "SELECT id, name, contact_number, email, status FROM user where role='user'";
    connection.query(query, (err,results)=>{
        if (!err){
            res.status(200).send(results);
        }else{
            res.status(500).json(err);
        }
    });
});
export default router;