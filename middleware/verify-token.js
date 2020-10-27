const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // token bize request başlığında, post body içerisinde veya url ile query içerisinde gelebilir.
    const token = req.headers['x-access-token'] || req.body.token || req.query.token

    if (token) {
        // eğer token null değilse,
        jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
            // 1. parametre gelen token, 2. parametre secret key, 3. parametre callback fonksiyonu
            if (err) {
                //eğer token doğrulama işleminden hata dönerse
                res.json({
                    status: false,
                    message: "Failed to authenticate token."
                });
            } else {
                //token doğrulama işleminden hata dönmezse
                //gelen token ı decode et ve devam et
                req.decode = decoded;
                console.log(decoded);
                next();
            }
        });
    } else {
        //eğer token= null sa, yani hiç token bilgisi gönderilmemişse
        res.json({
            status: false,
            message: 'No token provided'
        });
    }
};