-- Ludo Pro Tournament Database Schema (Optimized for cPanel)

CREATE DATABASE IF NOT EXISTS ludo_tournament;
USE ludo_tournament;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    level INT DEFAULT 1,
    rank_name VARCHAR(20) DEFAULT 'Bronze',
    balance DECIMAL(10, 2) DEFAULT 100.00,
    bonus_balance DECIMAL(10, 2) DEFAULT 50.00,
    win_balance DECIMAL(10, 2) DEFAULT 0.00,
    gulla_balance DECIMAL(10, 2) DEFAULT 0.00,
    fair_play_score INT DEFAULT 100,
    -- Stats columns
    stats_played INT DEFAULT 0,
    stats_wins INT DEFAULT 0,
    stats_losses INT DEFAULT 0,
    stats_win_rate INT DEFAULT 0,
    stats_tournament_wins INT DEFAULT 0,
    stats_best_streak INT DEFAULT 0,
    country VARCHAR(50) DEFAULT 'Global',
    country_code VARCHAR(5) DEFAULT 'UN',
    status ENUM('Online', 'Offline') DEFAULT 'Offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournaments Table
CREATE TABLE IF NOT EXISTS tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    type ENUM('Pro', 'Blitz', 'Grand', 'Classic') DEFAULT 'Classic',
    entry_fee VARCHAR(20) DEFAULT 'FREE',
    prize_pool VARCHAR(20) DEFAULT '$100',
    max_participants INT NOT NULL,
    current_participants INT DEFAULT 0,
    start_time BIGINT NOT NULL, -- Unix timestamp in milliseconds
    status ENUM('UPCOMING', 'RUNNING', 'FINISHED') DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournament Participants
CREATE TABLE IF NOT EXISTS tournament_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT,
    user_id INT,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('Deposit', 'Withdraw', 'Win', 'EntryFee', 'Bonus', 'Gulla') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Success', 'Failed') DEFAULT 'Success',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);