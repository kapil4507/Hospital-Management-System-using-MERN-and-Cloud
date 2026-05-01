const express = require('express');
const router = express.Router();
const Doctors = require('../models/doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post('/', async (req, res) => {
    try {
        if(req.body.adminSecret !== "admin123") {
        return res.status(403).json({ message: "You are not authorized to register doctors." });
        }
        const { doctorId, doctorName, specialization, password } = req.body;

        //check if doctor already exist
        const existingDoctor = await Doctors.findOne({ doctorId });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor ID already exists!' });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newDoctor = await Doctors.create({
            doctorId,
            doctorName,
            specialization,
            password : hashedPass
        })

        res.status(201).json({
            message: 'Doctor added successfully!',
            doctor: {
                _id:newDoctor._id,
                doctorName:newDoctor.doctorName,
                doctorId:newDoctor.doctorId,
                specialization:newDoctor.specialization,
            }
        });

    } catch (error) {
        //if validation error
        res.status(400).json({ message: 'Validation Error', error: error.message });
    }
});

router.get('/', async (req,res)=>{
    try{
        const doctors = await Doctors.find().select('-password');
        return res.status(200).json(doctors);
    }
    catch(err){
        return res.status(500).json({message:'Server error.', err: err.message});
    }
});

router.post('/login', async (req,res)=>{
    try{
        const {doctorId, password }= req.body;

        const doctor = await Doctors.findOne({doctorId});
        if(!doctor){
            return res.status(404).json({ message: 'Doctor not found. Please check your ID.' });
        }
        const isaMatch = await bcrypt.compare(password, doctor.password);
        if(!isaMatch){
            return res.status(401).json({ message: 'Wrong Password' });
        }

        const payload ={
            user:{
                id :doctor._id,
                role:'doctor'
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn :'2h'},
            (err, token)=>{
                if(err) throw err;
                res.status(200).json({
                    message:'Doctor login successful.',
                    token:token,
                    doctorName:doctor.doctorName,
                    role:'doctor'
                });
            }
        );
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

module.exports = router;