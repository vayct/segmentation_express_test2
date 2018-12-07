const express = require('express');
const upload = require('../../utilities/upload');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();


//the absolute path to the directory in which the image is uploaded
const dir = path.join(__dirname, '../../client/public/tmp/');


//the shell command to execute the segmentation algorithm code,
//the path is relative to root directory
//const program = './segmentation/colorsClassification/a.out';
//example for executing python program
const program = 'python routes/colorsClassification/colorsClassification.py';

//other images files based based on the segmentation process
const files = [];

router.post('/', upload.single('selectedFile'), (req, res) => {
    //console.log(req.file.filename);
    //console.log(req.body.description);
    //console.log(dir);

    //child process is the node_process that will execute the shell and run the program
    const spawn = require('child_process').spawn;



    //creating a new directory based on the name of the image to store
    //the outputs of the algorithm
    let imageFilename = req.file.filename;

    //absolute path of the working directory of the algorithm
    let newDirectoryPath = path.join(dir, imageFilename.split('.')[0]);

    //the absolute path of the image uploaded
    let imageInputPath = path.join(dir, imageFilename);

    //the absolute oath of the image after moving to the newDirectoryPath
    let newImageInputPath = path.join(newDirectoryPath, imageFilename);


    //output name of the image, MIGHT be different based on the algorithm used
    //this part here appends '_output' to the name of the output file,
    //since this is how the colorsClassification output the name
    let imageFilenamePeriod = imageFilename.lastIndexOf('.');
    let imageFilenameOutput = imageFilename.substring(0, imageFilenamePeriod) + '_output' + imageFilename.substring(imageFilenamePeriod);


    //creating a new directory based on the modified name of the image
    // for the current segmentation algorithm
    fs.mkdir(newDirectoryPath, function (err) {

        if (err) {
            console.log('Failed to create a directory', err);
        } else {
            //moving the image to the new directory,
            //so that it is easier to change the working directory of the program
            fs.move(imageInputPath, newImageInputPath, (err) => {
                if (err) return console.error(err);

                //adding single quote around the input of the image to be safe
                let newImageInputPathSanitized = '\'' + newImageInputPath + '\'';

                let result = spawn(
                    program,
                    [newImageInputPathSanitized], {
                        shell: true,
                    });

                result.stdout.on('data', (data) => {
                    console.log(`stdout:  ${data}`);
                });

                result.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });


                //Callback when the process finish
                result.on('close', (code) => {
                    if (code !== 0) {
                        console.log('Cannot execute process. Exit with code' + code);
                    }

                    //TODO should send array of image resources

                    res.send({
                        segmentationResultDir: path.join('./tmp/', path.basename(newDirectoryPath), '/'),
                        segmentationResultFiles: files,
                        segmentationResultOutput: imageFilenameOutput
                    });

                });
            });


        }

    });


    //   res.redirect('/');
});

module.exports = router;

