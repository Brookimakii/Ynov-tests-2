USE ynov_ci;
CREATE TABLE utilisateur
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(255),
    birthDate DATE,
    city VARCHAR(255),
    postalCode VARCHAR(5)
);
DESCRIBE utilisateur;
