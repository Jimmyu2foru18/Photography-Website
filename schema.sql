-- Database Schema for J&W Creative Studio

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client', -- 'admin', 'photographer', 'client'
    name VARCHAR(255) NOT NULL,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    linkedin VARCHAR(255),
    bio TEXT,
    pricing_rules TEXT,
    equipment TEXT,
    availability VARCHAR(255),
    profile_image MEDIUMTEXT,
    cover_image MEDIUMTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    photographer_id VARCHAR(50) NOT NULL,
    budget_offer VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (photographer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert initial photographers if they don't exist
INSERT INTO users (id, email, password_hash, role, name, instagram, facebook, availability, equipment, profile_image) 
VALUES 
('james-mcguigan', 'jimmyu2foru18@gmail.com', '$2y$10$wT0lq2c.f6e..m0FIfmYue8e.1XvG45T7/qK5hH/1R..m6hQj0C8.', 'admin', 'James McGuigan Jr', 'jimmyu2foru18', 'https://www.facebook.com/jimmyu2foru18/', 'Available Weekends', 'Nikon D3400, D5600, Canon Rebel T3, Polaroid', '/jamesprofile/profile.jpg'),
('waleed-bhatti', 'waleedb219@gmail.com', '$2y$10$wT0lq2c.f6e..m0FIfmYue8e.1XvG45T7/qK5hH/1R..m6hQj0C8.', 'photographer', 'Waleed Bhatti', 'waleedb219', 'https://www.facebook.com/profile.php?id=100067090366463', 'Flexible Schedule', 'Nikon D40X, Nikon D50 with audio/visual editing', '/waleedprofile/profile.jpg')
ON DUPLICATE KEY UPDATE 
    email = VALUES(email),
    role = VALUES(role),
    name = VALUES(name);
-- Note: The password hash above is an example (e.g. for 'password123' if using PHP password_hash or bcrypt)

