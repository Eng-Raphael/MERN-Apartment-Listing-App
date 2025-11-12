import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
    getSignedJwtToken(): string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
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

UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.getSignedJwtToken = function (): string {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not defined');
    }

    const payload = { id: this._id };

    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRE || '1h') as any,
    };

    return jwt.sign(payload, process.env.JWT_SECRET as Secret, options);
};

UserSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
