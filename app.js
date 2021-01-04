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
const hospitalRoutes = require("./routes/hospital");
const doctorlRoutes = require("./routes/doctor");

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
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: "1.0.0",
            title: "Hospital API",
            description: "Hospital API Information",
            contact: {
                name: "pau_campos"
            },
            servers: ["http://localhost:3000"]
        }
    },
    // definition the apis with swagger 
    apis: ['./routes/*.js']
};

// final definitions with swagger-express
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes middlewares
app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", hospitalRoutes);
app.use("/api", doctorlRoutes);

// port
const port = process.env.PORT || 3001;

// Listen port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});