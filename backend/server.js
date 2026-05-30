const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { json } = require('body-parser');
const DBconnect = require('./config/db');
const router = require('./routes/userRoutes');
const incomeRouter = require('./routes/incomeRoutes');
const expenseRouter = require('./routes/expenseRoute');
const dashboardRouter = require('./routes/dashboardRoutes');
const aiRouter = require('./routes/aiRoutes');

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    if (req.path.startsWith('/api/income')) {
        console.log('Incoming income request:', req.method, req.path);
        console.log('Headers:', {
            authorization: req.headers.authorization,
            'content-type': req.headers['content-type'],
        });
        console.log('Body:', req.body);
    }
    next();
});


// DB connection

const dbconnection = DBconnect;
dbconnection();

// mounting 
app.use("/api/user",router);
app.use("/api/income",incomeRouter);
app.use("/api/expense",expenseRouter);
app.use("/api/dashboard",dashboardRouter);
app.use("/api/ai", aiRouter);

//routes
app.get('/',(req,res) => {
    res.send("Its working");
});

app.listen(port,() => {
    console.log(`Server started on http://localhost:${port}`);
});


