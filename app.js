const express = require('express');
const cookieSession = require('cookie-session');
const auth = require('./routes/auth');
const csvRoutes = require('./routes/csv');
const currentUser = require('./middlewares/currentUser');
const resultsRoute = require('./routes/results');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('swagger-jsdoc');

const options = {
    definition:{
        openapi:  '3.0.0',
        info:{
            title: 'Courses Results',
            version: '1.0.0',
            description: 'An api for uploading results and showing it'
        },
        servers:[{
            url: 'http://localhost:5000'
        }]
    },
    apis: ['./routes/auth.js', './routes/csv.js', './routes/results.js', './models/*.js']
}

const specs = swaggerDoc(options);
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(cookieSession({
    secure: false,
    signed: false
}));
app.use(currentUser);


app.use(auth);
app.use(csvRoutes);
app.use(resultsRoute);

module.exports = app ;