const express = require('express');
// const app = express();
const router = express.Router();
const Patients = require('../models/patient.js');
const bcrypt = require('bcrypt');
const auth= require('../middlewares/auth.js');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res)=>{
    try{
        const {email, password} = req.body;

        const patient = await Patients.findOne({email});
        if(!patient){
            return res.status(400).json({message:"Email does not exist."});
        }
        const isMatch = await bcrypt.compare(password, patient.password);

        if(!isMatch){
            return res.status(400).json({message: 'Invalid Email or Password.'});
        }

        //create payload(data to hide in token)
        const payload =  {
            user :{
                id: patient._id, //only id is stored not the password
                role: 'patient' 
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn : '2h'},
            (err,token)=>{
                if(err) throw err;
            
                res.status(200).json({
                    message:"Login successful.",
                    token:token,
                    patientName: patient.patientName,
                    email:patient.email,
                    role:'patient'
                });
            }
        );
    }
    catch(error){
        console.error(error.message);
        return res.status(500).json({message: "Server error while login."});
    }
});

router.post('/' ,async (req, res)=>{
    try {
        const { patientId, patientName, mobile, email, gender, allergies, password } = req.body;
        //check if already exist
        const existingPatient = await Patients.findOne({
            $or : [{email : email},{patientId : patientId}]
        });
        if(existingPatient){
            return res.status(400).json({message: 'Patient with this ID or Email already exists!'});
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newPatient  = await Patients.create({
            patientId,
            patientName,
            mobile,
            email,
            gender,
            allergies,
            password : hashedPass
        });
        //success response
        return res.status(201).json({
            message:'Patient registration successfull.',
            patient: {
                _id : newPatient._id,
                patientId : newPatient.patientId,
                patientName: newPatient.patientName
            }
        })

    }
    catch(error) {
        return res.status(500).json({message: 'Validation error.', error : error.message});
    }
});

module.exports = router;

