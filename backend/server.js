import * as dotenv from 'dotenv';
import express from 'express';
import morgan, { format } from 'morgan';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import cors from 'cors'; // Import cors

//Data-base
import connectDB from './config/db.js';
//Routes
import registerRouter from './routes/register.js'
import loginRouter from './routes/login.js'
import logoutRouter from './routes/logout.js';
import getQuoteRouter from './routes/getQuote.js'
import createQuoteRouter from './routes/createQuote.js'
import deleteQuoteRouter from './routes/deleteQuote.js'
import getAllQuotesRouter from './routes/getAllQuotes.js'
import editQuoteRouter from './routes/editQuote.js'
const app = express();
dotenv.config();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser to parse cookies

connectDB();

//Api
app.use('/api/register' ,registerRouter);
app.use('/api/login' ,loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/get-quote', getQuoteRouter);
app.use('/api/create-quote',createQuoteRouter);
app.use('/api/delete-quote',deleteQuoteRouter);
app.use('/api/get-all-quotes', getAllQuotesRouter);
app.use('/api/edit-quote',editQuoteRouter)
const port = process.env.PORT || 5000
app.listen( port, ()=>{
    console.log(`Server is running on ${port}`)
})