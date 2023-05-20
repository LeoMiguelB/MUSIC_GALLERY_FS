const path = require('path');
const fs = require('fs');


//checks if there are duplicates in respective directory 
const filePreventDuplicate = (req, res, next) => {
    const { username } = req.params;

    const { audioName } = JSON.parse(req.body.filenames);

    const AudioFolderCheck = path.join(__dirname, "..", "files", username, "audio");


    // another solutions would be to query the DB
    const fileNamesInFolder = fs.readdirSync(AudioFolderCheck);



    if (fileNamesInFolder.includes(audioName)) {
        const message = `${audioName} exists please select another file`
        return res.status(409).json({ status: 'error', message });

    }


    next();
}

module.exports = filePreventDuplicate;