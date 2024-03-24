const express = require('express');
const router = require('../routes/routes.js');
const serverless = require('serverless-http');
const app = express();
const port = process.env.PORT || 6000;



app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);


/* app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); */
