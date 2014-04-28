var crypto = require('crypto');
var base64url = require('base64url');
var fs = require('fs');
var pubKey = fs.readFileSync(__dirname +'/gu_prod_key.pub');

module.exports = function(cookieValue) {
    var cookieDataBase64 = base64url.toBase64(cookieValue.split('.')[0]);
    var cookieSigBase64 = base64url.toBase64(cookieValue.split('.')[1]);
    var verifier = crypto.createVerify('sha256');
    var buffer = new Buffer(cookieDataBase64, 'base64');

    verifier.update(buffer);
    return verifier.verify(pubKey, cookieSigBase64, 'base64');
};

