const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const assets = require('./routes/assetRoutes');
const transactions = require('./routes/transactionRoutes');
const admin = require('./routes/adminRoutes');

const app = express();

// Body parser
app.use(express.json());

// Set static folder for uploads
app.use('/uploads', express.static('uploads'));

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/assets', assets);
app.use('/api/tx', transactions);
app.use('/api/admin', admin);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
