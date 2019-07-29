const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();


// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);


// Setup directory to serve
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Wather App',
        name: 'Sergio'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About me",
        name: 'Sergio'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Sergio',
        message: 'tru tru truuuu tru trutrutru trrrururru tur trutru tru'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide and address'
        });
    }

    geocode(req.query.search, (error, { latitude, longitude, location } = {} ) => {
        if(error) {
            return res.send({ error });
        } 

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.search
            });
        });
    });


    // res.send({
    //     forecast: 'It is 50 degrees out there',
    //     location: 'Monterrey, NL.',
    //     address: 'Monterrey'
    // });

});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        });
    }

    console.log(req.query.search);
    res.send({
        products: []
    });
});


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404', 
        errorMessage: 'Help article not found.',
        name: 'Sergio'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404', 
        errorMessage: 'Page not found!'});
        name: 'Sergio'
});



app.listen(3000, () => {
    console.log('Server is up on Port 3000');
});