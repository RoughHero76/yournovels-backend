import express from 'express';
import router from './routes/routes.js';

const app = express();
const port = process.env.PORT || 6000;

app.use('/', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});