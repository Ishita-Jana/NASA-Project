const mongoose = require('mongoose');
const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required:true
    },
    
    launchDate: {
        type: Date,
        required:true
    },

    mission: {
        type: String,
        required:true
    },
    rocket: {
        type: String,
        required:true
    },
    target: {
        type: String,
        // required:true
    },
    customer: [String],

    upcoming: {
        type: Boolean,
        required:true
    },
    success: {
        type: Boolean,
        required:true,
        default:true,
    },
    
   

});

module.exports = mongoose.model('Launch', launchSchema);

//ref refers to the Planet collection
//it is tough to relate since it is not sequel
/*  target: {
        type: mongoose.ObjectId,
        ref: 'Planet',
        required:true
    },
*/
