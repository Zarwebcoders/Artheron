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
const allowedOrigins = [
    'https://artheron.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

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

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);

// --- Automatic Protocol Heartbeat ---
const { distributeROI } = require('./controllers/assetController');
const DISTRIBUTION_INTERVAL = 24 * 60 * 60 * 1000; // 24 Hours

setInterval(async () => {
    console.log("--- Executing Automatic ROI Distribution ---");
    const count = await distributeROI();
    console.log(`--- Distributed to ${count} operators ---`);
}, DISTRIBUTION_INTERVAL);

// For testing: distributeROI(); // Uncomment to run on startup
