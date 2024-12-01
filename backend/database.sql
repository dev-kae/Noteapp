CREATE DATABASE notes_app;
USE notes_app;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_title_per_user (user_id, title)
);

INSERT INTO users (email, password) VALUES ('admin@teste.com', 'admin');
INSERT INTO notes (user_id, title, content) VALUES (1, 'Lorem Ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
SELECT * FROM notes