const express = require('express');
const { count } = require('../models/Movie');
const router = express.Router();

//Models
const Movie = require('../models/Movie');

//Tüm filmleri getirir.
router.get('/', (req, res) => {
  const promise = Movie.find({});
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

//belirlenen id ye sahip olan filmi görüntüler.
router.get('/getMovie/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);

  promise.then((movie) => {
    if (!movie)
      next({ message: 'The movie was not found', code: 99 }); // bu satır ile app.js te bulunan res.json({error}) kısmına iletim yapılıyor.
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

//belirlenen id'ye sahip filmi body de verilen verilere göre günceller.
router.put('/updateMovie/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new: true // bu eklenti güncelleme işleminden sonra yeni halini mi yoksa güncellemeden önceki halini mi geri döndüreceğini belirler.
    },
  );

  promise.then((movie) => {
    if (!movie)
      next({ message: 'The movie was not found', code: 99 }); // bu satır ile app.js te bulunan res.json({error}) kısmına iletim yapılıyor.
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});

//belirlenen id'ye sahip olan filmi veritabanından siler.
router.delete('/deleteMovie/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise.then((movie) => {
    if (!movie)
      next({ message: 'The movie was not found', code: 99 }); // bu satır ile app.js te bulunan res.json({error}) kısmına iletim yapılıyor.
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });
});

//body'de verilen bilgilere göre veritabanına yeni film insert eder.
router.post('/addMovie', (req, res, next) => {
  //const { title, imdb_score, category, country, year } = req.body;

  const movie = new Movie(req.body);

  /* movie.save((err, data) => {
     if (err)
       res.json(err);
 
     res.json(data);
   }); */
  const promise = movie.save();
  promise.then((data) => {
    res.json({ status: 1 });
  }).catch((err) => {
    res.json(err);
  });

});

// Filmler arasından imdb puanına göre top 10 filmi listeler.
router.get('/top10', (req, res) => {
  const promise = Movie.find({}).limit(10).sort({ imdb_score: -1 });
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
    {
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) },
    }
  );
  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});


module.exports = router;
