import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import bookCopyRoutes from './routes/bookCopyRoutes.js';
import shelfRoutes from './routes/shelfRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//Routers
app.use('/books',bookRoutes);
app.use('/shelf', shelfRoutes);
app.use('/bookCopy', bookCopyRoutes);
const PORT = process.env.PORT || 3000;

app.get('/',(req,res) => {
    res.send("Binagbag LMS API is Running!");
})
app.listen(PORT, () => {
    console.log('Server is running on port'+PORT)
})