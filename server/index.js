const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const filesExtLimiter = require('./middleware/fileExtLimiter');

const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const filesPayloadExists = require('./middleware/filesPayloadExist');

const fs = require('fs');

const PORT = 4000;

const app = express();

const pool = require('./db');

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});


// get's info about all of the audio's 
app.get('/audio/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const allAudioInfo = await pool.query("SELECT * FROM audios WHERE username = ($1)", [username]);

        res.json(allAudioInfo.rows);
    } catch (error) {
        console.error(error)
    }
});

// getting the images for the audio 
app.get('/images/:imgName/:username', (req, res) => {
    const { imgName, username } = req.params;
    const filePath = path.join(__dirname, "files", username, "images", imgName);

    const fileStream = fs.createReadStream(filePath);

    // copy binary into the res
    fileStream.pipe(res);
})

//getting the audio 
app.get('/audio/:audioName/:username', (req, res) => {
    const { audioName, username } = req.params;

    const filePath = path.join(__dirname, "files", username, "audio", audioName);

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
})

app.post('/upload/:username', fileUpload({ createParentPath: true }),
    filesPayloadExists,
    filesExtLimiter(['.png', '.jpg', '.jpeg', '.mp3']),
    fileSizeLimiter,
    async (req, res) => {
        const files = req.files;

        const tags = JSON.parse(req.body.tags);

        const { username } = req.params;

        let audioName;
        let imgName;

        Object.keys(files).forEach(key => {

            // if it's an image (restricted to jpg and jpeg in the client side already)
            if (key.toLowerCase().endsWith('.jpg') || key.toLowerCase().endsWith('.jpeg') || key.toLowerCase().endsWith('.png')) {
                const filePath = path.join(__dirname, "files", username, "images", files[key].name);

                imgName = key;

                files[key].mv(filePath, (err) => {
                    if (err) return res.status(500).json({ status: "error", message: err });

                })
            }
            else if (key === "tags") {

            }
            else {

                audioName = key;

                const filePath = path.join(__dirname, "files", username, "audio", files[key].name);

                files[key].mv(filePath, (err) => {
                    if (err) return res.status(500).json({ status: "error", message: err });

                })
            }


        })

        // now we can upload it to the database
        const uploadAudioInfo = await pool.query("INSERT INTO audios (audio_name, img_name, username, type) VALUES($1, $2, $3, $4) RETURNING *", [audioName, imgName, username, tags]);


        return res.json({ status: "success", message: Object.keys(files).toString() })
    })

app.listen(PORT, () => console.log(`server running on port ${PORT}`));