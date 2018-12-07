const fs = require('fs-extra');
const rimraf = require('rimraf');
const path = require('path');
const cron = require('node-cron');


function cleanDir(dirPath, time) {
    fs.readdir(dirPath, function (err, files) {
        files.forEach(function (file, index) {
            fs.stat(path.join(dirPath, file), function (err, stat) {
                let endTime, now;
                if (err) {
                    return console.error(err);
                }
                now = new Date().getTime();
                endTime = new Date(stat.ctime).getTime() + time; //1000 * 60 * 60; //hour
                if (now > endTime) {
                    return rimraf(path.join(dirPath, file), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
            });
        });
    });
}





function cleanDirScheduler(dirPath, timeRerun, oldTime){

    cron.schedule(timeRerun, () => {
        cleanDir(dirPath, oldTime);
    });
}



module.exports = cleanDirScheduler;