const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id:{type:String},
    site:{type:String},
    date:{type:String},
    debut:{type:Number},
    fin:{type:Number},
    reservations:{type:Number}
});


module.exports = mongoose.model('Creneau', userSchema);