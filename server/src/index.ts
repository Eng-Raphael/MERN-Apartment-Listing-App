import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import xss from 'xss-clean';
import connectDB from './config/db.ts';
import errorHandler from "./middleware/error.ts";

//routes
import authRoutes from './routes/authRoutes.ts';


dotenv.config();
connectDB();
const app: Application = express();

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
    max: 100,
});

app.use(limiter);
app.use(hpp());

const corsOptions = {
    origin: [
        'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
            'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token',
    });
    next();
});


app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${err.message}`.red.bold);
    res.status(500).json({ success: false, error: err.message });
});

//routes middle ware will be here soon :)
app.use('/api/auth', authRoutes);

//error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    );
});


process.on('unhandledRejection', (err: Error) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
});
