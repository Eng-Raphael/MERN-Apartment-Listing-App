import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Nawy_DB',
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    }
    catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map