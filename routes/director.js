const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Models
const Director = require('../models/Director');

router.post('/', (req, res, next) => {
    const director = new Director(req.body);
    const promise = director.save();

    promise.then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json(err);
    });
});

//Yönetmenleri ve o yönetmenlerin filmlerini listeyen endpoint.
router.get('/getAllDirectors', (req, res) => {
    const promise = Director.aggregate([
        {
            //join işlemini yapıyoruz
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies' // join sonucunu burada belirlenen isimle kullanıcaz.
            },
        },
        {
            $unwind: {
                path: '$movies', // join sonucunu dışarı aktarıyoruz.
                preserveNullAndEmptyArrays: true //bir yönetmenin hiç filmi yoksa onunda sonuçlar arasında sergilenebilmesi için gerekli kod.
            }
        },
        {
            //bir yönetmenin birden fazla filmi olabileceği için mükerrer kayıt gibi çift göstermesin diye gruplama yapılmaktadırç
            $group: {
                //gruplama işleminde hangi verilerin kullanılacağını belirliyoruz
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies' // dışa aktarılan join sonucunu pushluyoruz
                }
            }
        },
        {
            //gruplama işleminden sonra hangi alanın hangi isimle görüneceğini veya görünmeyeceğini bu kısımda ayarlıyoruz.
            //yukarıda bio ile gruplama yapmamıza rağmen, project içerisinde yazmadığımız için sonuçlarda görünmeyecektir.
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ]);

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
});

router.get('/getDirectorByID/:director_id', (req, res) => {
    const promise = Director.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.director_id),
            }
        },
        {
            //join işlemini yapıyoruz
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies' // join sonucunu burada belirlenen isimle kullanıcaz.
            },
        },
        {
            $unwind: {
                path: '$movies', // join sonucunu dışarı aktarıyoruz.
                preserveNullAndEmptyArrays: true //bir yönetmenin hiç filmi yoksa onunda sonuçlar arasında sergilenebilmesi için gerekli kod.
            }
        },
        {
            //bir yönetmenin birden fazla filmi olabileceği için mükerrer kayıt gibi çift göstermesin diye gruplama yapılmaktadırç
            $group: {
                //gruplama işleminde hangi verilerin kullanılacağını belirliyoruz
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies' // dışa aktarılan join sonucunu pushluyoruz
                }
            }
        },
        {
            //gruplama işleminden sonra hangi alanın hangi isimle görüneceğini veya görünmeyeceğini bu kısımda ayarlıyoruz.
            //yukarıda bio ile gruplama yapmamıza rağmen, project içerisinde yazmadığımız için sonuçlarda görünmeyecektir.
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ]);

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
});

router.put('/updateDirector/:director_id', (req, res, next) => {
    const promise = Director.findByIdAndUpdate(
        req.params.director_id,
        req.body,
        {
            new: true // bu eklenti güncelleme işleminden sonra yeni halini mi yoksa güncellemeden önceki halini mi geri döndüreceğini belirler.
        },
    );

    promise.then((director) => {
        if (!director)
            next({ message: 'The director was not found', code: 99 }); // bu satır ile app.js te bulunan res.json({error}) kısmına iletim yapılıyor.
        res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

router.delete('/deleteDirector/:director_id', (req, res, next) => {
    const promise = Director.findByIdAndRemove(req.params.director_id);

    promise.then((director) => {
        if (!director)
            next({ message: 'The director was not found', code: 99 }); // bu satır ile app.js te bulunan res.json({error}) kısmına iletim yapılıyor.
        res.json({ status: 1 });
    }).catch((err) => {
        res.json(err);
    });
});
module.exports = router;
