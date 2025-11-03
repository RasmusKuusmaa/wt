CREATE DATABASE IF NOT EXISTS wellnesstracker;
USE wellnesstracker;

CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    exercise_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workouts (
    workout_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date)
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_exercise_id INT PRIMARY KEY AUTO_INCREMENT,
    workout_id INT NOT NULL,
    exercise_id INT NOT NULL,
    set_number INT NOT NULL DEFAULT 1,
    weight DECIMAL(6,2) NOT NULL,
    reps INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(workout_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    INDEX idx_workout (workout_id)
);

CREATE TABLE IF NOT EXISTS user_weights (
    weight_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date),
    UNIQUE KEY unique_user_date (user_id, date)
);

CREATE TABLE IF NOT EXISTS user_goals (
    goal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    goal_weight DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
);

INSERT INTO categories (name) VALUES
('Chest'),
('Back'),
('Legs'),
('Shoulders'),
('Arms'),
('Abs'),
('Cardio');

INSERT INTO exercises (name, category_id) VALUES
('Bench Press', 1),
('Incline Bench Press', 1),
('Dumbbell Flyes', 1),
('Push-ups', 1),
('Pull-ups', 2),
('Barbell Rows', 2),
('Lat Pulldown', 2),
('Deadlift', 2),
('Squats', 3),
('Leg Press', 3),
('Lunges', 3),
('Leg Curls', 3),
('Overhead Press', 4),
('Lateral Raises', 4),
('Front Raises', 4),
('Shrugs', 4),
('Bicep Curls', 5),
('Hammer Curls', 5),
('Tricep Extensions', 5),
('Dips', 5),
('Crunches', 6),
('Planks', 6),
('Russian Twists', 6),
('Leg Raises', 6),
('Running', 7),
('Cycling', 7),
('Jump Rope', 7),
('Rowing', 7);

INSERT INTO users (username, password) VALUES
('demo_user', '$2b$10$rKJ1qZ9QZ9vZ9vZ9vZ9vZeN3Z9vZ9vZ9vZ9vZ9vZ9vZ9vZ9vZ9vZe');

INSERT INTO user_weights (user_id, weight, date) VALUES
(1, 85.5, DATE_SUB(CURDATE(), INTERVAL 56 DAY)),
(1, 85.2, DATE_SUB(CURDATE(), INTERVAL 49 DAY)),
(1, 84.8, DATE_SUB(CURDATE(), INTERVAL 42 DAY)),
(1, 84.5, DATE_SUB(CURDATE(), INTERVAL 35 DAY)),
(1, 84.0, DATE_SUB(CURDATE(), INTERVAL 28 DAY)),
(1, 83.7, DATE_SUB(CURDATE(), INTERVAL 21 DAY)),
(1, 83.3, DATE_SUB(CURDATE(), INTERVAL 14 DAY)),
(1, 83.0, DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(1, 82.5, CURDATE());

INSERT INTO user_goals (user_id, goal_weight) VALUES
(1, 75.0);

INSERT INTO workouts (user_id, date) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 56 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 54 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 52 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 49 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 47 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 45 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 42 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 40 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 38 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 35 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 33 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 31 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 28 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 26 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 24 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 21 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 19 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 17 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 14 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(1, DATE_SUB(CURDATE(), INTERVAL 3 DAY));

INSERT INTO workout_exercises (workout_id, exercise_id, set_number, weight, reps) VALUES
(1, 1, 1, 60.0, 10), (1, 1, 2, 60.0, 8), (1, 1, 3, 60.0, 8),
(1, 2, 1, 50.0, 10), (1, 2, 2, 50.0, 9), (1, 2, 3, 50.0, 8),
(2, 5, 1, 0.0, 10), (2, 5, 2, 0.0, 9), (2, 5, 3, 0.0, 8),
(2, 6, 1, 70.0, 10), (2, 6, 2, 70.0, 10), (2, 6, 3, 70.0, 9),
(3, 9, 1, 80.0, 12), (3, 9, 2, 80.0, 11), (3, 9, 3, 80.0, 10),
(3, 10, 1, 120.0, 12), (3, 10, 2, 120.0, 11), (3, 10, 3, 120.0, 10),
(4, 1, 1, 62.5, 10), (4, 1, 2, 62.5, 9), (4, 1, 3, 62.5, 8),
(4, 2, 1, 52.5, 10), (4, 2, 2, 52.5, 9), (4, 2, 3, 52.5, 8),
(5, 5, 1, 0.0, 11), (5, 5, 2, 0.0, 10), (5, 5, 3, 0.0, 9),
(5, 6, 1, 72.5, 10), (5, 6, 2, 72.5, 10), (5, 6, 3, 72.5, 9),
(6, 9, 1, 82.5, 12), (6, 9, 2, 82.5, 11), (6, 9, 3, 82.5, 10),
(6, 10, 1, 125.0, 12), (6, 10, 2, 125.0, 11), (6, 10, 3, 125.0, 10),
(7, 1, 1, 65.0, 10), (7, 1, 2, 65.0, 9), (7, 1, 3, 65.0, 8),
(7, 2, 1, 55.0, 10), (7, 2, 2, 55.0, 9), (7, 2, 3, 55.0, 8),
(8, 5, 1, 0.0, 12), (8, 5, 2, 0.0, 11), (8, 5, 3, 0.0, 10),
(8, 6, 1, 75.0, 10), (8, 6, 2, 75.0, 10), (8, 6, 3, 75.0, 9),
(9, 9, 1, 85.0, 12), (9, 9, 2, 85.0, 11), (9, 9, 3, 85.0, 10),
(9, 10, 1, 130.0, 12), (9, 10, 2, 130.0, 11), (9, 10, 3, 130.0, 10),
(10, 1, 1, 67.5, 10), (10, 1, 2, 67.5, 9), (10, 1, 3, 67.5, 8),
(10, 2, 1, 57.5, 10), (10, 2, 2, 57.5, 9), (10, 2, 3, 57.5, 8),
(11, 5, 1, 0.0, 12), (11, 5, 2, 0.0, 11), (11, 5, 3, 0.0, 10),
(11, 6, 1, 77.5, 10), (11, 6, 2, 77.5, 10), (11, 6, 3, 77.5, 9),
(12, 9, 1, 87.5, 12), (12, 9, 2, 87.5, 11), (12, 9, 3, 87.5, 10),
(12, 10, 1, 135.0, 12), (12, 10, 2, 135.0, 11), (12, 10, 3, 135.0, 10),
(13, 1, 1, 70.0, 10), (13, 1, 2, 70.0, 9), (13, 1, 3, 70.0, 8),
(13, 2, 1, 60.0, 10), (13, 2, 2, 60.0, 9), (13, 2, 3, 60.0, 8),
(14, 5, 1, 0.0, 13), (14, 5, 2, 0.0, 12), (14, 5, 3, 0.0, 11),
(14, 6, 1, 80.0, 10), (14, 6, 2, 80.0, 10), (14, 6, 3, 80.0, 9),
(15, 9, 1, 90.0, 12), (15, 9, 2, 90.0, 11), (15, 9, 3, 90.0, 10),
(15, 10, 1, 140.0, 12), (15, 10, 2, 140.0, 11), (15, 10, 3, 140.0, 10),
(16, 1, 1, 72.5, 10), (16, 1, 2, 72.5, 9), (16, 1, 3, 72.5, 8),
(16, 2, 1, 62.5, 10), (16, 2, 2, 62.5, 9), (16, 2, 3, 62.5, 8),
(17, 5, 1, 0.0, 13), (17, 5, 2, 0.0, 12), (17, 5, 3, 0.0, 11),
(17, 6, 1, 82.5, 10), (17, 6, 2, 82.5, 10), (17, 6, 3, 82.5, 9),
(18, 9, 1, 92.5, 12), (18, 9, 2, 92.5, 11), (18, 9, 3, 92.5, 10),
(18, 10, 1, 145.0, 12), (18, 10, 2, 145.0, 11), (18, 10, 3, 145.0, 10),
(19, 1, 1, 75.0, 10), (19, 1, 2, 75.0, 9), (19, 1, 3, 75.0, 8),
(19, 2, 1, 65.0, 10), (19, 2, 2, 65.0, 9), (19, 2, 3, 65.0, 8),
(20, 5, 1, 0.0, 14), (20, 5, 2, 0.0, 13), (20, 5, 3, 0.0, 12),
(20, 6, 1, 85.0, 10), (20, 6, 2, 85.0, 10), (20, 6, 3, 85.0, 9),
(21, 9, 1, 95.0, 12), (21, 9, 2, 95.0, 11), (21, 9, 3, 95.0, 10),
(21, 10, 1, 150.0, 12), (21, 10, 2, 150.0, 11), (21, 10, 3, 150.0, 10),
(22, 1, 1, 77.5, 10), (22, 1, 2, 77.5, 9), (22, 1, 3, 77.5, 8),
(22, 2, 1, 67.5, 10), (22, 2, 2, 67.5, 9), (22, 2, 3, 67.5, 8),
(23, 5, 1, 0.0, 14), (23, 5, 2, 0.0, 13), (23, 5, 3, 0.0, 12),
(23, 6, 1, 87.5, 10), (23, 6, 2, 87.5, 10), (23, 6, 3, 87.5, 9),
(24, 9, 1, 97.5, 12), (24, 9, 2, 97.5, 11), (24, 9, 3, 97.5, 10),
(24, 10, 1, 155.0, 12), (24, 10, 2, 155.0, 11), (24, 10, 3, 155.0, 10);
