-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2025 at 09:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bookease`
--

-- --------------------------------------------------------

--
-- Table structure for table `amenities`
--

CREATE TABLE `amenities` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `amenities`
--

INSERT INTO `amenities` (`id`, `name`) VALUES
(2, 'kitchen'),
(3, 'tv'),
(1, 'wifi');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `listing_id` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('guesthouse','activity') NOT NULL,
  `check_in` date DEFAULT NULL,
  `check_out` date DEFAULT NULL,
  `guests` int(11) DEFAULT NULL,
  `activity_date` date DEFAULT NULL,
  `activity_time` time DEFAULT NULL,
  `participants` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hosts`
--

CREATE TABLE `hosts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_date` date DEFAULT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` varchar(20) NOT NULL,
  `host_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('guesthouse','activity') NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `reviews_count` int(11) DEFAULT 0,
  `max_guests` int(11) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `duration_hours` int(11) DEFAULT NULL,
  `group_size` int(11) DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `house_rules` text DEFAULT NULL,
  `status` enum('pending','approved','rejected','active','suspended') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `host_id`, `title`, `type`, `description`, `price`, `location`, `image_url`, `rating`, `reviews_count`, `max_guests`, `bedrooms`, `bathrooms`, `duration_hours`, `group_size`, `difficulty`, `created_at`, `updated_at`, `house_rules`, `status`) VALUES
('lst_kywr1sv32', 1, 'grfdhtdnhjtd', 'activity', 'hgffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 450.00, 'minieh dannieh, minieh, , 00000, DE', NULL, 0.0, 0, NULL, NULL, NULL, 1, 2, 'easy', '2025-05-18 17:48:25', '2025-05-18 17:48:25', NULL, 'pending'),
('lst_nrb7edly8', 1, 'new guesthouse', 'guesthouse', 'new one gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg', 22.00, 'minieh dannieh, minieh, , 00000, CA', NULL, 0.0, 0, 4, 3, 4, NULL, NULL, NULL, '2025-05-18 17:45:44', '2025-05-18 17:45:44', 'aaaaaaa', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `listing_amenities`
--

CREATE TABLE `listing_amenities` (
  `listing_id` varchar(20) NOT NULL,
  `amenity_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `listing_amenities`
--

INSERT INTO `listing_amenities` (`listing_id`, `amenity_id`) VALUES
('lst_nrb7edly8', 1),
('lst_nrb7edly8', 2),
('lst_nrb7edly8', 3);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `listing_id` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `role` enum('user','admin','host') DEFAULT 'user',
  `bio` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `profile_image`, `role`, `bio`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 'amjad', 'gh', 'amjad@gmail.com', '123123', NULL, 'user', NULL, NULL, NULL, '2025-05-17 21:37:57', '2025-05-17 21:37:57'),
(2, 'amjad', 'gh', 'kousaysayed@gmail.com', '$2b$10$gKKPzwVgm1x3WOckxI/fCO04zu6DoulvGibBt13VGFaiBUXsAXSKi', NULL, 'user', NULL, NULL, NULL, '2025-05-17 21:53:43', '2025-05-17 21:53:43'),
(3, 'kousay', 'sayed', 'kousaysayed40@gmail.com', '$2b$10$GknLd2p3PGklntGUUWKftesjf27diXJcIFhuygXkYTMTAW1UXXdnS', NULL, 'user', NULL, NULL, NULL, '2025-05-18 11:03:15', '2025-05-18 11:03:15'),
(4, 'ahmad', 'ahmad', 'ahmad1@gmail.com', '$2b$10$0Q8H7qtjCWFWPbieE30egu9QCmzpgFHwF5fIEKxS3Ndb/xaFERQaW', NULL, 'user', NULL, NULL, NULL, '2025-05-18 15:30:11', '2025-05-18 15:30:11'),
(5, 'a', 'a', 'a@gmail.com', '$2b$10$hn7ghCC4uyI2p5L.7KmjgeVnvAf9CPRjVG/XF4ij6B./T2Mf0TRYy', NULL, 'admin', NULL, NULL, NULL, '2025-05-18 16:05:18', '2025-05-18 19:30:34'),
(7, 'admin', 'admin', 'admin@gmail.com', '$2b$10$9rpNCcPUCDdHoivV6jLOWeb6PjOZJKoE4rgCnnIninAL06BcyaJVy', NULL, 'user', NULL, NULL, NULL, '2025-05-18 19:30:17', '2025-05-18 19:30:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `amenities`
--
ALTER TABLE `amenities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `hosts`
--
ALTER TABLE `hosts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listings_ibfk_1` (`host_id`);

--
-- Indexes for table `listing_amenities`
--
ALTER TABLE `listing_amenities`
  ADD PRIMARY KEY (`listing_id`,`amenity_id`),
  ADD KEY `amenity_id` (`amenity_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `listing_id` (`listing_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `amenities`
--
ALTER TABLE `amenities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hosts`
--
ALTER TABLE `hosts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hosts`
--
ALTER TABLE `hosts`
  ADD CONSTRAINT `hosts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listings`
--
ALTER TABLE `listings`
  ADD CONSTRAINT `listings_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listing_amenities`
--
ALTER TABLE `listing_amenities`
  ADD CONSTRAINT `listing_amenities_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `listing_amenities_ibfk_2` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
