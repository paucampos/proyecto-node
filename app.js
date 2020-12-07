const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
require("dotenv").config();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connectionUrl = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;

// Routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");


const app = express();

// connection to db
const db = async() => {
    try {
        const success = await mongoose.connect(connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log(`DB Connection \x1b[32m%s\x1b[0m`, 'OK');

    } catch (error) {
        console.log('DB Connection Error', error);
    }
}

// execute db connection
db();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Routes middlewares
app.use("/api", userRoutes);
app.use("/api", authRoutes);


const port = process.env.PORT || 3001;

// Listen port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})