const sanitize = require('sanitize-filename');
const multer = require('multer');
const crypto = require('crypto');


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/tmp/')
    },
    filename: function (req, file, cb) {

        let filename = sanitize(file.originalname);
        filename = filename.replace(/ /g, '_');

        let filenameSplit = filename.split('.');
        let filenameBeforeExt = filenameSplit[0];
        let fileExtension = filenameSplit[1];

        //additional random bytes to make sure the name truly unique
        crypto.randomBytes(8, function (err, raw) {

            cb(null, filenameBeforeExt + '__' + Date.now() + '__' + raw.toString('hex') + "." + fileExtension);

        });
    }
});

const upload = multer({storage: storage});

module.exports = upload;