const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs-extra');


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp/')
    },
    filename: function (req, file, cb) {

        let filename = file.originalname;
        let fileExtension = filename.split(".")[1];
        let nm = filename.split('.')[0];

        //additional random bytes to make sure the name truly unique
        crypto.randomBytes(8, function(err,raw) {

            //filename . extension
            //cb(null, filename)

            //filename + date . extension
            //cb(null, nm + '_' + Date.now() + "." + fileExtension);

            //filename + date + random . extension
            cb(null, nm + '__' + Date.now() + '__' + raw.toString('hex')+ "." + fileExtension);

        });
    }
});

const upload = multer({storage: storage});


const app = express();
const port = process.env.PORT || 5000;

//to support JSON-encoded bodies
app.use(bodyParser.json());

//to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.get('/', (req,res) => {
   res.sendFile('/index.html');
});
app.post('/', upload.single('file-to-upload'), (req,res ) => {
    console.log(req.file.filename);



    const {spawn} =require('child_process');
    //let program ='python segmentation/testProgram/colorsClassification.py';
    let program ='python segmentation/testProgram/v.py';
    let inputPath = 'tmp/' + req.file.filename;

    let result = spawn(program, [inputPath], {
        shell: true
    });

    result.stdout.on('data', (data) =>{
        console.log('stdout: ' + data);
    });

    result.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
    });



    //Callback when the process finish
    result.on('close', (code) => {
        if (code !== 0) {
            console.log('Exit with code' + code);
        }


        //delete the image in the tmp folder
        fs.unlink('tmp/' + req.file.filename, (err) => {
            if (err){
                 console.log("failed to delete:" + err);
            }else {
                 console.log("delete the image:   ");
             }
         });
    });





    res.redirect('/');
});


app.listen(port, () => console.log(`Listening on port ${port}`));