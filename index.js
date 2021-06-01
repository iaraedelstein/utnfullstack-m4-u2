const express = require('express');

const restaurantRouter = require('./api/restaurant');
const reviewRouter = require('./api/review');

var app = express();
const port = process.env.PORT || 3000;

//middleware
//app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded());

//Mapeo de peticion a object js
app.use(express.json());

// Desarrollo API lógica de negocio
app.use('/api/restaurant', restaurantRouter);
app.use('/api/review', reviewRouter);

//Pages
app.get('/', (req, res) => {
    res.status(200).sendFile('public/index.html', { root: __dirname });
});
app.get('/success', (req, res) => {
    res.status(200).sendFile('public/success.html', { root: __dirname });
});
app.get('/reviews', (req, res) => {
    res.status(200).sendFile('public/reviews.html', { root: __dirname });
});
//Error page
app.get('*', (req, res) => {
    res.status(404).sendFile('public/404.html', { root: __dirname });
});

app.listen(port, () => {
    console.log('Servidor escuchando en el puerto ', port);
});