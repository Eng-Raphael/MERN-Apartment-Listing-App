import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import xss from 'xss-clean';
import connectDB from './config/db.js';
import errorHandler from "./middleware/error.js";
//routes
import authRoutes from './routes/authRoutes.js';
import apartmentRoutes from "./routes/apartmentRoutes.js";
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5000,
});
app.use(limiter);
app.use(hpp());
const corsOptions = {
    origin: [
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors());
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`.red.bold);
    res.status(500).json({ success: false, error: err.message });
});
//routes middle ware will be here soon :)
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
//error middleware
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map