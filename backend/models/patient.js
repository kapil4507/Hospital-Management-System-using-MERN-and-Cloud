const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId:{
        type: String, //P123
        minlength: [4, 'pateintId must be exactly 4 characters.'],
        maxlength: [4, 'patientId must be exactly 4 characters.'],
        unique: true,
        required :[true, "pateintId can't be empty."],
        trim:true,
        validate:{
            validator: (v) => /^P[0-9]{3}$/.test(v),
            message: props=> `${props.value} is not a valid Id. Enter a valid Id (eg: P111).`,
        }
    },
    patientName :{
        type : String,
        required: [true, "Patient name is required."],
    },
    mobile :{
        type: String,
        required: [true, "Patient mobile number is required."],
        unique : true,
        validate:{
            validator : (v) => /^[0-9]{10}$/.test(v),
            message:props=> `${props.value} is not a valid mobile number.`
        }
    },
    email :{
        type: String,
        required: [true, "Patient email is required."],
        unique : true,
        validate:{
            validator : (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message:props=> `${props.value} is not a valid email Id.`
        }
    },
    gender:{
        type:String,
        enum:{
           values : ["Male", "Female", "Other"],
           message: '{VALUE} is not a valid gender option.'
        },
        required:[true, 'Gender is required.']
    },
    password :{
        type : String,
        required : [true, 'Password is required.'],
    },
    allergies:{
        type : String
    }
    
}, {timestamps:true});

module.exports = mongoose.model('Patients', patientSchema);