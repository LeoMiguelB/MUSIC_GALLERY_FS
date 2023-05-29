const path = require('path');
const fs = require('fs');


//checks if there are duplicates in respective directory 
const filePreventDuplicate = (req, res, next) => {
    const { username } = req.params;

    const { audioName } = JSON.parse(req.body.filenames);

    const AudioFolderCheck = path.join(__dirname, "..", "files", username, "audio");


    // for now assuming error means user is first time uploading
    try {
        // another solutions would be to query the DB
        const fileNamesInFolder = fs.readdirSync(AudioFolderCheck);

        if (fileNamesInFolder.includes(audioName)) {
            const message = `${audioName} exists please select another file`
            return res.status(409).json({ status: 'error', message });
        }
    } catch (error) {
        console.log(error);
    }
    next();
}

module.exports = filePreventDuplicate;