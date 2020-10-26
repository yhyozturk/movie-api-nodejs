const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://try-movie-api:deneme1578++@cluster0.jl2ao.mongodb.net/movie-apiDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err);
    });

    mongoose.Promise = global.Promise;
};