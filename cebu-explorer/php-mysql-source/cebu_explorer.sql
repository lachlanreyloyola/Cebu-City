-- ==========================================
-- CEBU EXPLORER DATABASE SCHEMA
-- Relational MySQL database design
-- ==========================================

CREATE DATABASE IF NOT EXISTS cebu_explorer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cebu_explorer_db;

-- --------------------------------------------------
-- Table structure for table `users`
-- Contains account and authentication details
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- Table structure for table `destinations`
-- Contains details for attractions and adventure spots
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS `destinations` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `category` ENUM('falls', 'islands', 'beaches', 'mountains', 'attract') NOT NULL,
  `badge` VARCHAR(50) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `maps_url` TEXT NOT NULL,
  `description` TEXT NOT NULL,
  `why_visit` TEXT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 4.5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- Table structure for table `bookings`
-- Records travel and tour reservations by users
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `destination_id` VARCHAR(50) NOT NULL,
  `booking_date` DATE NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `guest_count` INT NOT NULL CHECK (`guest_count` > 0),
  `special_requests` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`destination_id`) REFERENCES `destinations` (`id`) ON DELETE CASCADE,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_booking_date` (`booking_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------
-- SEED DATA - Destinations Table
-- Populate tables with sample cebu travel spots
-- --------------------------------------------------
INSERT INTO `destinations` (`id`, `name`, `category`, `badge`, `location`, `maps_url`, `description`, `why_visit`, `image_url`, `rating`) VALUES
('kawasan-falls', 'Kawasan Falls', 'falls', 'Waterfall', 'Badian, South Cebu', 'https://www.google.com/maps/search/?api=1&query=Kawasan+Falls+Badian+Cebu', 'A multi-tiered waterfall famous for its turquoise water and canyoneering route from Alegria.', 'Swim in jade pools, take a bamboo raft under cascading falls, or join the iconic canyoneering adventure.', 'https://images.unsplash.com/photo-1544085311-11a028465b03?w=800&q=80', 4.9),
('aguinid-falls', 'Aguinid Falls', 'falls', 'Waterfall', 'Samboan, South Cebu', 'https://www.google.com/maps/place/Aguinid+Falls/@9.507662,123.3019219,17z/', 'An eight-tier limestone waterfall you can actually climb up barefoot with local guides.', 'A unique climbing experience over flowing tiers — fun, safe, and incredibly photogenic.', 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80', 4.7),
('inambakan-falls', 'Inambakan Falls', 'falls', 'Waterfall', 'Ginatilan, Cebu', 'https://maps.app.goo.gl/2NWFgfvv5pjeyDG19', 'A serene, jade-blue plunge pool tucked away in southern Cebu''s quiet forest.', 'Quieter than Kawasan, perfect for a peaceful swim in cool clear water.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80', 4.6),
('bantayan-island', 'Bantayan Island', 'islands', 'Island', 'Northern Cebu', 'https://maps.app.goo.gl/XtapnGVDMM6dpew89', 'Powder-white sand, swaying palms, and a laid-back island lifestyle.', 'The Maldives feel of Cebu — endless white beaches and crystal water.', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80', 4.8),
('malapascua-island', 'Malapascua Island', 'islands', 'Island', 'Daanbantayan, Cebu', 'https://maps.app.goo.gl/wkVs6PuFp7pAWYtD8', 'A world-famous dive paradise known for daily thresher shark sightings.', 'One of the only places on Earth to reliably dive with thresher sharks.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', 4.9),
('basdaku-beach', 'Basdaku White Beach', 'beaches', 'Beach', 'Moalboal, Cebu', 'https://maps.app.goo.gl/7PWcjh6uRM3M1ged7', 'A long stretch of powder-white sand and a vibrant backpacker scene.', 'Best base for the sardine run and turtle snorkeling at Panagsama.', 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800&q=80', 4.7),
('osmena-peak', 'Osmeña Peak', 'mountains', 'Hike', 'Mantalongon, Dalaguete, Cebu', 'https://maps.app.goo.gl/LwRzrEn1NncHJJKcA', 'The highest point in Cebu — a beginner-friendly hike with jagged hilltop views.', 'Sunrise above the clouds and 360° views of mountains and sea.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', 4.9),
('magellans-cross', 'Magellan''s Cross', 'attract', 'Heritage', 'Plaza Sugbu, Cebu City', 'https://maps.app.goo.gl/iY48R2i8LGgY6i5f6', 'A historic cross planted by Magellan in 1521, symbolizing Christianity in the Philippines.', 'Walk through 500 years of Filipino history in a single spot.', 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=800&q=80', 4.8),
('basilica-santo-nino', 'Basilica Minore del Santo Niño', 'attract', 'Church', 'Osmeña Blvd., Cebu City', 'https://maps.app.goo.gl/x2PLaVs4X4MaaLoR6', 'The oldest Roman Catholic church in the Philippines, home of the Santo Niño.', 'Spiritual heart of Cebu — especially during the Sinulog Festival.', 'https://images.unsplash.com/photo-1548625361-155deee223d0?w=800&q=80', 4.9),
('temple-of-leah', 'Temple of Leah', 'attract', 'Landmark', 'Busay, Cebu City, Cebu', 'https://maps.app.goo.gl/EveMiNSQF17tFWUd7', 'A Roman-inspired temple built as a symbol of undying love.', 'Grand architecture and breathtaking views of Cebu City.', 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?w=800&q=80', 4.7);

-- --------------------------------------------------
-- SEED DATA - Users Table
-- Default credentials for testing local environment:
-- Admin: admin@cebuexplorer.com | password: AdminPassword123
-- User: user@cebuexplorer.com | password: UserPassword123
-- --------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES
('Cebu Admin', 'admin@cebuexplorer.com', '$2y$10$w66XjHh4Sj6G1yq6gJ550OfK8K9YQv48MAnrP1O420eCgZzZ.G3d6', 'admin'),
('Maria Santos', 'user@cebuexplorer.com', '$2y$10$EwU88U7pD0V7Z8xUjZ6C/eG9VzU8B38v05U648G/xGz8Z8c/fGZ/G', 'user');

-- --------------------------------------------------
-- SEED DATA - Bookings Table
-- --------------------------------------------------
INSERT INTO `bookings` (`user_id`, `destination_id`, `booking_date`, `time_slot`, `guest_count`, `special_requests`, `status`) VALUES
(2, 'kawasan-falls', DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), '08:00 AM - 12:00 PM', 3, 'Requesting local canyoneering guide registration.', 'approved'),
(2, 'osmena-peak', DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), '05:00 AM - 08:00 AM', 2, 'Sunrise camping hike preferences.', 'pending');
