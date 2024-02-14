const express = require("express");
require("express-async-errors");
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const logger = require("./config/logger.config");

const errorHandler = require("./middleware/errorHandler");

const routing = require("./routes/index.route");

const app = express();
const PORT = process.env.PORT || 3001;


app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);



app.use("/", routing);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`App connected successfully at http://localhost:${PORT}`);
});

