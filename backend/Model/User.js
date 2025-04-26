const mongoose = require('mongoose');  //for db modeling
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs'); //pw hashing

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["ADMIN", "DRIVER","CUSTOMER"],
        required: true
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

