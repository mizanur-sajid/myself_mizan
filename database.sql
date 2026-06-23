-- phpMyAdmin SQL Dump
-- Generation Time: Jun 23, 2026
-- Server version: 8.0
-- PHP Version: 8.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `Message`
--

CREATE TABLE `Message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `archived` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Skill`
--

CREATE TABLE `Skill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `level` int NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Technical Skills',
  `icon` varchar(255) NOT NULL DEFAULT 'code',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Skill` (`id`, `name`, `level`, `category`, `icon`, `description`) VALUES
(1, 'Python', 95, 'Technical Skills', 'python', NULL),
(2, 'JavaScript', 90, 'Technical Skills', 'javascript', NULL),
(3, 'React', 88, 'Technical Skills', 'monitor', NULL),
(4, 'Next.js', 86, 'Technical Skills', 'code', NULL),
(5, 'PHP', 84, 'Technical Skills', 'filetext', NULL),
(6, 'MySQL', 82, 'Technical Skills', 'network', NULL),
(7, 'IT Support', 92, 'Additional Skills', 'headset', NULL),
(8, 'Troubleshooting', 90, 'Additional Skills', 'wrench', NULL),
(9, 'Networking', 88, 'Additional Skills', 'network', NULL),
(10, 'Problem Solving', 94, 'Additional Skills', 'brain', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Publication`
--

CREATE TABLE `Publication` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `description` text,
  `fileUrl` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Certification`
--

CREATE TABLE `Certification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `issuer` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `description` text,
  `fileUrl` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Certification` (`id`, `name`, `issuer`, `year`, `description`, `fileUrl`) VALUES
(1, 'Professional Computing Certificate', 'Portfolio Training Record', 2026, 'Evidence of hands-on work across support, web, and portfolio maintenance tasks.', '/uploads/1782140312617-Certificate.pdf'),
(2, 'IT Support Readiness', 'Applied Systems Practice', 2025, 'Coverage of diagnostics, user support, and operational troubleshooting workflows.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `SiteStat`
--

CREATE TABLE `SiteStat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `views` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial stats row
INSERT INTO `SiteStat` (`id`, `views`) VALUES (1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE `Project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `link` varchar(255),
  `year` int NOT NULL,
  `description` text,
  `fileUrl` varchar(255),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Project` (`id`, `title`, `link`, `year`, `description`, `fileUrl`) VALUES
(1, 'Personal Portfolio CMS', 'https://mizanurrahman.site.je/', 2026, 'A polished public portfolio with admin-managed content sections, rich media support, and static deployment compatibility.', '/logo.png'),
(2, 'Support Workflow Dashboard', 'https://mizanurrahman.site.je/', 2025, 'A streamlined support-oriented dashboard concept for monitoring tasks, status updates, and quick response handling.', '/admin-avatar.png'),
(3, 'Technical Skills Showcase', NULL, 2025, 'A visual skills grid that keeps key competencies visible even when the live content source is unavailable.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Social`
--

CREATE TABLE `Social` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
