const mongoose = require('mongoose');
//create schema
const AppointmentSchema = new mongoose.Schema({
    // appointmentId :{
    //     type:mongoose.Schema.Types.ObjectId,
    // },
    patientId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Patients',
        required : [true, "This "]
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctors',
        required: true
    },
    date:{
        type: Date,
        required :[true, 'Date is required.']
    },
    timeSlot :{
        type:String,
        required : [true, 'Time slot is required.'],
        trim:true
    },
    status: {
        type: String,
        enum: {
            values: ['Scheduled', 'Completed', 'Cancelled'],
            message: '{VALUE} is not a valid appointment status.'
        },
        default: 'Scheduled' 
    },
    reasonForVisit:{
        type : String,
        required : [true, "Reason for visit is required."],
        trim:true
    }
}, {timestamp: true});

module.exports = mongoose.model('Appointments', AppointmentSchema);