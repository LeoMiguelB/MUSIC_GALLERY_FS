CREATE DATABASE audio_database;

CREATE TABLE audios (
    audio_id SERIAL PRIMARY KEY,
    audio_src VARCHAR,
    img_path VARCHAR
);


INSERT INTO contacts (audio_name, img_name, type) VALUES('text-1', 'image-1', ARRAY [ 'loop','piano', 'sad']);

UPDATE audios
SET username = 'miguel'
WHERE audio_id BETWEEN 9 AND 16;
