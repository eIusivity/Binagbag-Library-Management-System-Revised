-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: binagbag_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` varchar(36) NOT NULL,
  `accountId` text NOT NULL,
  `providerId` text NOT NULL,
  `userId` varchar(36) NOT NULL,
  `accessToken` text,
  `refreshToken` text,
  `idToken` text,
  `accessTokenExpiresAt` timestamp(3) NULL DEFAULT NULL,
  `refreshTokenExpiresAt` timestamp(3) NULL DEFAULT NULL,
  `scope` text,
  `password` text,
  `createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` timestamp(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `book_id` varchar(7) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `publication_year` smallint DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `description` text,
  `isbn` varchar(20) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `book_copy`
--

DROP TABLE IF EXISTS `book_copy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_copy` (
  `copy_id` varchar(11) NOT NULL,
  `book_id` varchar(7) DEFAULT NULL,
  `shelf` varchar(25) DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`copy_id`),
  KEY `fk_book_copy_book` (`book_id`),
  CONSTRAINT `fk_book_copy_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `book_info`
--

DROP TABLE IF EXISTS `book_info`;
/*!50001 DROP VIEW IF EXISTS `book_info`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `book_info` AS SELECT 
 1 AS `book_id`,
 1 AS `title`,
 1 AS `author`,
 1 AS `genre`,
 1 AS `isbn`,
 1 AS `publisher`,
 1 AS `publication_year`,
 1 AS `language`,
 1 AS `description`,
 1 AS `total_copies`,
 1 AS `available_copies`,
 1 AS `shelves`,
 1 AS `deleted_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `loan`
--

DROP TABLE IF EXISTS `loan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loan` (
  `loan_id` int NOT NULL AUTO_INCREMENT,
  `library_id` varchar(20) NOT NULL,
  `copy_id` varchar(20) NOT NULL,
  `borrow_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `due_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `status` enum('Borrowed','Returned','Overdue') DEFAULT 'Borrowed',
  `is_return_late` tinyint(1) DEFAULT '0',
  `processed_by` varchar(255) NOT NULL,
  `returned_by` varchar(255) DEFAULT NULL,
  `return_condition` enum('Good','Defective') DEFAULT NULL,
  `fine_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`loan_id`),
  KEY `library_id` (`library_id`),
  KEY `copy_id` (`copy_id`),
  KEY `processed_by` (`processed_by`),
  KEY `returned_by` (`returned_by`),
  CONSTRAINT `loan_ibfk_1` FOREIGN KEY (`library_id`) REFERENCES `user` (`library_id`),
  CONSTRAINT `loan_ibfk_2` FOREIGN KEY (`copy_id`) REFERENCES `book_copy` (`copy_id`),
  CONSTRAINT `loan_ibfk_3` FOREIGN KEY (`processed_by`) REFERENCES `user` (`id`),
  CONSTRAINT `loan_ibfk_4` FOREIGN KEY (`returned_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `notification_type` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(255) NOT NULL,
  `action` varchar(255) DEFAULT NULL,
  `reference_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_audience`
--

DROP TABLE IF EXISTS `notification_audience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_audience` (
  `notification_audience_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `recipient_user_id` varchar(36) DEFAULT NULL,
  `recipient_role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`notification_audience_id`),
  KEY `notification_id` (`notification_id`),
  KEY `recipient_user_id` (`recipient_user_id`),
  CONSTRAINT `notification_audience_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_audience_ibfk_2` FOREIGN KEY (`recipient_user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification_receipt`
--

DROP TABLE IF EXISTS `notification_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_receipt` (
  `notification_receipt_id` int NOT NULL AUTO_INCREMENT,
  `notification_id` int NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notification_receipt_id`),
  UNIQUE KEY `notification_id` (`notification_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notification_receipt_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`) ON DELETE CASCADE,
  CONSTRAINT `notification_receipt_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `reservation_id` int NOT NULL AUTO_INCREMENT,
  `library_id` varchar(255) NOT NULL,
  `book_id` varchar(255) NOT NULL,
  `reservation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `queue_position` int DEFAULT NULL,
  `expiry_date` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `fulfilled_on` datetime DEFAULT NULL,
  `fulfilled_by` varchar(255) DEFAULT NULL,
  `processed_by` varchar(255) NOT NULL,
  `ready_date` datetime DEFAULT NULL,
  `cancel_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reservation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` varchar(36) NOT NULL,
  `expiresAt` timestamp(3) NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` timestamp(3) NOT NULL,
  `ipAddress` text,
  `userAgent` text,
  `userId` varchar(36) NOT NULL,
  `impersonatedBy` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `session_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shelf`
--

DROP TABLE IF EXISTS `shelf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelf` (
  `shelf_code` varchar(20) NOT NULL,
  PRIMARY KEY (`shelf_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `emailVerified` tinyint(1) NOT NULL,
  `image` text,
  `createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `role` enum('Patron','Librarian','Administrator') NOT NULL DEFAULT 'Patron',
  `user_type` enum('Student','Faculty','Non-Faculty') NOT NULL,
  `status` enum('Pending','Active','Closed','Canceled','Blacklisted') NOT NULL DEFAULT 'Pending',
  `banned` tinyint(1) DEFAULT '0',
  `banReason` text,
  `banExpires` timestamp(3) NULL DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` text,
  `last_name` varchar(255) NOT NULL,
  `status_reason` text,
  `library_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `index_user` (`library_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `close_banned_user` BEFORE UPDATE ON `user` FOR EACH ROW SET NEW.status = CASE
    WHEN NEW.banned = 1 THEN 'Closed'
    ELSE NEW.status
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=CURRENT_USER*/ /*!50003 TRIGGER `activate_unbanned_user` BEFORE UPDATE ON `user` FOR EACH ROW SET NEW.status = CASE
    WHEN OLD.banned = 1 AND NEW.banned = 0 THEN 'Active'
    ELSE NEW.status
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `users_old`
--

DROP TABLE IF EXISTS `users_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_old` (
  `user_record_id` int unsigned NOT NULL AUTO_INCREMENT,
  `patron_id` varchar(20) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `school_identifier` varchar(50) DEFAULT NULL,
  `role` enum('Patron','Librarian','Administrator') NOT NULL DEFAULT 'Patron',
  `user_type` enum('Student','Faculty','Non-Faculty') NOT NULL,
  `status` enum('Pending','Active','Rejected','Inactive') NOT NULL DEFAULT 'Pending',
  `registration_source` enum('Self-Registration','External System','Librarian Assisted') NOT NULL DEFAULT 'Self-Registration',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_record_id`),
  UNIQUE KEY `school_identifier` (`school_identifier`),
  UNIQUE KEY `school_identifier_2` (`school_identifier`),
  UNIQUE KEY `patron_id` (`patron_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `school_identifier_3` (`school_identifier`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `id` varchar(36) NOT NULL,
  `identifier` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `expiresAt` timestamp(3) NOT NULL,
  `createdAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `verification_identifier_idx` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visits` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `total_visits` int DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_visit_date` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'binagbag_db'
--

--
-- Dumping routines for database 'binagbag_db'
--

--
-- Final view structure for view `book_info`
--

/*!50001 DROP VIEW IF EXISTS `book_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=CURRENT_USER SQL SECURITY DEFINER */
/*!50001 VIEW `book_info` AS select `b`.`book_id` AS `book_id`,`b`.`title` AS `title`,`b`.`author` AS `author`,`b`.`genre` AS `genre`,`b`.`isbn` AS `isbn`,`b`.`publisher` AS `publisher`,`b`.`publication_year` AS `publication_year`,`b`.`language` AS `language`,`b`.`description` AS `description`,count(`bc`.`copy_id`) AS `total_copies`,coalesce(sum((`bc`.`status` = 'available')),0) AS `available_copies`,group_concat(distinct `bc`.`shelf` order by `bc`.`shelf` ASC separator ', ') AS `shelves`,`b`.`deleted_at` AS `deleted_at` from (`book` `b` left join `book_copy` `bc` on((`b`.`book_id` = `bc`.`book_id`))) group by `b`.`book_id`,`b`.`title`,`b`.`author`,`b`.`genre`,`b`.`publisher`,`b`.`publication_year`,`b`.`language`,`b`.`description`,`b`.`deleted_at` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-20 14:59:06
