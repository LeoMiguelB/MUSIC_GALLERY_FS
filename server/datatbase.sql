CREATE DATABASE audio_database;

-- table for audios
CREATE TABLE audios (
    audio_id SERIAL PRIMARY KEY,
    audio_src VARCHAR,
    img_path VARCHAR
);

-- table for users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    refreshToken TEXT UNIQUE
);


INSERT INTO contacts (audio_name, img_name, type) VALUES('text-1', 'image-1', ARRAY [ 'loop','piano', 'sad']);

UPDATE audios
SET username = 'miguel'
WHERE audio_id BETWEEN 9 AND 16;


SELECT user_id 
FROM users
WHERE username = 'putusername' 
AND password = crypt('putPasswordHere', password);