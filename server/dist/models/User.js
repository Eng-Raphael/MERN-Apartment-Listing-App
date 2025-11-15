import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please add your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please add your last name'],
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true,
    },
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.getSignedJwtToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined');
    }
    const payload = { id: this._id };
    const options = {
        expiresIn: (process.env.JWT_EXPIRE || '1h'),
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
};
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map