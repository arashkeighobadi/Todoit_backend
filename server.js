const express = require('express');
const router = require('./src/routes');

const app = express();

app.use(express.json());

app.use(router);

app.listen('3000', () => {
    console.log('server started on port 3000...');
})
