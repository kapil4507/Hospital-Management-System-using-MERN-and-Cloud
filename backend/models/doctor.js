const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorId:{
        type: String, //D123
        required:[true, 'doctorId is not valid, it must be string.(eg: D111)'],
        minlength: [4, 'doctorId must be exactly 4 characters.'],
        maxlength: [4, 'doctorId must be exactly 4 characters.'],
        unique: true,
        validate : {
            validator : (v)=> /^D[0-9]{3}$/.test(v),
            message : props=> `${props.value} is not a valid id.(eg: D111)`
        }
    },
    doctorName:{
        type: String,
        required:[true, 'doctorName must be string.'],
    },
    specialization:{
        type:String,
        required:[true, 'Must enter a specialization.'],
    },
    password:{
        type:  String,
        required:[true, 'Password cannot be empty.']
    }
});

module.exports = mongoose.model('Doctors',doctorSchema);