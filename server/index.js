const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const filesExtLimiter = require('./middleware/fileExtLimiter');

const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const filesPayloadExists = require('./middleware/filesPayloadExist');

const filePreventDuplicate = require('./middleware/filePreventDuplicate');

const authenticateToken = require('./middleware/authenticateToken');

const fs = require('fs');

const jwt = require("jsonwebtoken");

const PORT = 4000;

const app = express();

const pool = require('./db');

require('dotenv').config();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});


app.post('/token', async (req, res) => {
    const { username, refreshToken } = req.body;

    const userId = await pool.query('SELECT user_id FROM users WHERE username = $1 AND refreshToken = $2', [username, refreshToken]);

    if (refreshToken === null) {
        return res.status(401).json({ status: "error", message: "token does not exists" });
    }
    if (userId.rowCount === 0) {
        return res.status(403).json({ status: "error", message: "invalid token" });
    }

    jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH, (err, user) => {
        if (err) return res.status(403).json({ status: "error" });

        const accessToken = jwt.sign(
            { username },
            process.env.SECRET_KEY_ACCESS,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            data: {
                userId: user.id,
                username,
                accessToken,
            }
        })
    })

})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;


    // check if user exists
    const userExists = await pool.query('SELECT user_id FROM users WHERE username = ($1) AND password = crypt(($2),password)', [username, password]);

    console.log(userExists.rows);

    if (userExists.rowCount === 0) {
        return res.status(404).json({ status: "error", message: "account does not exist" });
    } else {
        let accessToken;
        let refreshToken;
        try {
            accessToken = jwt.sign(
                {
                    userId: userExists,
                    username
                },
                process.env.SECRET_KEY_ACCESS,
                { expiresIn: "1h" }
            )

            refreshToken = jwt.sign(
                {
                    userId: userExists,
                    username
                },
                process.env.SECRET_KEY_REFRESH,
            )
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: "error", message: "problem with accessToken" });
        }


        return res.status(200).json({
            success: true,
            data: {
                userId: userExists,
                username,
                accessToken,
                refreshToken,
            }
        })
    }
})

app.post('/signup', async (req, res, next) => {

    const { username, password, refreshToken } = req.body;

    let createUser;

    const checkUserExists = await pool.query("SELECT username FROM users WHERE username = ($1)", [username]);

    if (checkUserExists.rowCount === 0) {

        let accessToken;
        let refreshToken;
        try {
            accessToken = jwt.sign(
                { username },
                process.env.SECRET_KEY_ACCESS,
                { expiresIn: "1h" }
            );

            refreshToken = jwt.sign(
                { username },
                process.env.SECRET_KEY_REFRESH,
            );
        } catch (err) {
            return res.status(401);
        }

        try {

            // encrypt the password 
            createUser = await pool.query("INSERT INTO users (username, password, refreshToken) VALUES (($1), crypt(($2), gen_salt('bf')), ($3)) RETURNING *", [username, password, refreshToken]);
        } catch {
            return res.status(401)
        }

        res.status(201).json({
            success: true,
            data: {
                userId: createUser.rows.user_id,
                username,
                accessToken,
                refreshToken,
            }
        })
    } else {
        return res.status(409).json({ status: "error", message: "username already exists" });
    }
})


// get's info about all of the audio's 
app.get('/audio/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const allAudioInfo = await pool.query("SELECT * FROM audios WHERE username = ($1)", [username]);

        return res.json(allAudioInfo.rows);
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
    filePreventDuplicate,
    filesExtLimiter(['.png', '.jpg', '.jpeg', '.mp3']),
    fileSizeLimiter,
    async (req, res) => {
        const files = req.files;

        const tags = JSON.parse(req.body.tags);

        const { audioName, imgName } = JSON.parse(req.body.filenames);

        const { username } = req.params;

        const imageFilePath = path.join(__dirname, "files", username, "images", imgName);

        files[imgName].mv(imageFilePath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err });
        })

        const audioFilePath = path.join(__dirname, "files", username, "audio", audioName);

        files[audioName].mv(audioFilePath, (err) => {
            if (err) return res.status(500).json({ status: "error", message: err });
        })

        // now we can upload it to the database
        const uploadAudioInfo = await pool.query("INSERT INTO audios (audio_name, img_name, username, type) VALUES($1, $2, $3, $4) RETURNING *", [audioName, imgName, username, tags]);


        return res.json({ status: "success", message: `${audioName}, ${imgName}` })
    })

app.listen(PORT, () => console.log(`server running on port ${PORT}`));