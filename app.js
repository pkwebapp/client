// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import cardRoutes from './routes/cardRoutes.js';
// import path from 'path';
// import cors from 'cors';
// import { fileURLToPath } from 'url';
// import cloudinary from 'cloudinary';
// const app = express();

// dotenv.config({
//   path: './.env'
// });

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })
// const __filename = fileURLToPath(import.meta.url);


// app.use(cors(
//   {
//     origin: "https://pkphotography.io",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }
// ));
// app.use(express.json({
//   limit: '50mb'
// }));


// app.use('/api', cardRoutes);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// })

// connectDB();

// export default app;



import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cardRoutes from './routes/cardRoutes.js';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import cloudinary from 'cloudinary';
import morgan from 'morgan';
import moment from 'moment-timezone';
const app = express();

dotenv.config({
  path: './.env'
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const __filename = fileURLToPath(import.meta.url);


  // Custom format string with the IST timestamp token
  const morganFormat = '":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';
  

// Middleware to log HTTP requests using morgan
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      console.log(message); // Use console.log to output logs
    }
  }
}));


// Custom token to log timestamp in IST
morgan.token('istDate', (req, res) => {
  return moment().tz('Asia/Kolkata').format('DD/MMM/YYYY:HH:mm:ss ZZ');
});


// app.use(cors(
//   {
//     origin: "https://www.pkphotography.io",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }
// ));

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.pkphotography.io',
  'https://pkphotography.io/'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow sending cookies or other credentials
}));


app.use(express.json({
  limit: '50mb'
}));


app.use('/api', cardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
app.get('/', (req, res) => {
  res.send('Hello World!');
})

connectDB();

export default app;