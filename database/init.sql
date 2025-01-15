CREATE DATABASE IF NOT EXISTS job_tracker;

USE job_tracker;

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255),
    position VARCHAR(255),
    status VARCHAR(255)
);
