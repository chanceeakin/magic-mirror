CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(120),
    email VARCHAR(100)
);

CREATE TABLE tokens(
  id INT NOT NULL AUTO_INCREMENT,
  token VARCHAR(100) NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY(`id`),
  FOREIGN KEY(`user_id`)
    REFERENCES users(id)
);
