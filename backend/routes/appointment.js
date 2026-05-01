const express = require('express');
const router = express.Router();
const Appointments = require('../models/appointment.js');
const auth = require('../middlewares/auth.js');
router.post('/',auth, async (req, res)=>{
    try{
        const { doctorId, date, timeSlot, status, reasonForVisit } = req.body;
        //take id from jwt token (from auth middleware) because user can give wrong id
        const patientId = req.user.id;
        //if doctor already have an appointment at the same time
        const already = await Appointments.findOne({
            doctorId : doctorId,
            timeSlot : timeSlot,
            date: date,
            status: "Scheduled" //only if scheduled
        });
        if(already){
            return res.status(400).json({message :'This doctor is booked for this time slot.'});
        }
        //Daily limit
        const dailyCount = await Appointments.countDocuments({
            doctorId,
            date,
            status : "Scheduled"
        });

        if(dailyCount > 15){
            return res.status(400).json({message: "This doctor have reached maximum appointments for selected date."});
        }

        const newAppoint = await Appointments.create({
            patientId, doctorId, date, timeSlot, status, reasonForVisit
        });
        return res.status(201).json({message: 'Appointment added successfully.', appointment : newAppoint});
    }
    catch(error){
        return res.status(500).json({message: 'Validation error.', error : error.message});
    }
});

// router.get('/', async (req,res)=>{
//     try{
//         //populate() to replace ids by actual names
//         const appoints = await Appointments.find().populate('patientId', 'patientName mobile email').populate('doctorId', 'doctorName specialization');
//         return res.status(200).json(appoints);
//     }
//     catch(error){
//         return res.status(500).json({message: 'Server error.', error : error.message});
//     }
// });


// POST /api/appointments/admin/all
// Protected by Admin Secret Key
router.post('/admin/all', async (req, res) => {
    try {
        const { adminSecret } = req.body;
        
        const HOSPITAL_SECRET = "admin123";
        if (adminSecret !== HOSPITAL_SECRET) {
            return res.status(403).json({ message: 'Forbidden: Invalid Admin Secret Key.' });
        }
        const appoints = await Appointments.find()
            .populate('patientId', 'patientName mobile email')
            .populate('doctorId', 'doctorName specialization')
            .sort({ date: -1 }); //sort by newest first

        return res.status(200).json(appoints);
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

// Protected by 'auth' middleware to know WHO is asking
router.get('/', auth, async (req, res) => {
    try {
        let query = {};

        // 1. If it is a patient, ONLY fetch appointments matching their ID
        if (req.user.role === 'patient') {
            query = { patientId: req.user.id };
        } 
        // (You can change this to { doctorId: req.user.id } later if doctors should only see their own)
        else if (req.user.role === 'doctor') {
            query = {doctorId: req.user.id}; 
        }

        // 3. Run the filtered query
        const appoints = await Appointments.find(query).sort({ date: -1 })
            .populate('patientId', 'patientName mobile email')
            .populate('doctorId', 'doctorName specialization');
            
        return res.status(200).json(appoints);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

router.put('/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const {status} = req.body;
        const validSt = ['Scheduled', 'Completed', 'Cancelled'];
        if(!validSt.includes(status)){
            return res.status(400).json({message: "Not a valid status. Please enter status from : ", validSt});
        }
        const updatedAppoint = await Appointments.findByIdAndUpdate(id, {status : status},{
            new: true, runValidators: true //force to check schema again and return updated value, not the old one
        }).populate('patientId', 'patientName').populate('doctorId', 'doctorName');

        if(!updatedAppoint){
            return res.status(404).json({message: "Appointment not found."});
        }

        return res.status(200).json({message: 'Appointmnet updated succesfully.', updatedAppointment: updatedAppoint});
    }
    catch(error){
        return res.status(500).json({message: 'Server error.', error : error.message});
    }
});
module.exports = router;