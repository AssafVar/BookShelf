import express from 'express';
import {connection} from '../connection.js'
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

export default router;