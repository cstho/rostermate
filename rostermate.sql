-- MySQL dump 10.13  Distrib 5.7.30, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: rostermate
-- ------------------------------------------------------
-- Server version	5.7.30-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `rostermate`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `rostermate` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `rostermate`;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leaves` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `leave_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaves`
--

LOCK TABLES `leaves` WRITE;
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
INSERT INTO `leaves` VALUES (1,2,'2020-06-25'),(3,2,'2020-06-26'),(4,6,'2020-06-26'),(5,6,'2020-06-30'),(6,6,'2020-07-08'),(7,4,'2020-06-27');
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `userid` int(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `days` date NOT NULL,
  `complete` tinyint(1) DEFAULT '0',
  `category` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,6,'File Taxes 2020','Remember to file your taxes by the 29th!','2020-06-29',0,3),(2,6,'Publish website','Publish website after completing','2020-06-29',1,3),(3,2,'Sow Seeds','Sow the seeds for the cucumbers and the carrots.','2020-06-27',0,1),(4,4,'Cut down Tree','Cut down the grand old tree near the gate','2020-06-25',0,1),(5,4,'Plant 4 trees','plant 4 trees in the garden','2020-07-10',1,1),(6,4,'Feed the chickens','Feed the chickens for the day','2020-06-30',1,2),(7,4,'Pick the tomatoes','Pick the tomatoes from the tomato plant','2020-07-03',0,1),(8,6,'Get refund for tractor',' The tractor broke down. Need to get a refund soon. Warranty expires on Oct 7 2020','2020-10-07',0,3),(9,2,'Burn Weeds','Burn out the weeds to prevent bushfires. It\'s bushfire season!','2020-06-27',0,1);
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `manager` tinyint(4) DEFAULT '0',
  `email` varchar(255) NOT NULL,
  `pwordhash` varchar(64) NOT NULL,
  `pwordsalt` varchar(40) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `vegetable` tinyint(10) DEFAULT '0',
  `livestock` tinyint(10) DEFAULT '0',
  `office` tinyint(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'a1766862@student.adelaide.edu.au','7e53432b83ad83c5039e86e5f6dad46d8d6e5ca8263f5b6cb86a6c7d399872a9','026c9252b52edaa0','Christopher Ho','https://lh3.googleusercontent.com/a-/AOh14GhK8EVowLouq1mPCrk4btmkZU92wf8xy219JA1F=s96-c',NULL,0,0,0),(2,0,'joe@farm.com','db00b8aeb38fbbd12bc3ef59978a950e804c2eed0a311fac6f59c1b24df59c03','9b992e856c1c2453','Farmer Joe','/images/001.png',NULL,1,0,0),(4,0,'fred@farm.com','89525f80a3ea09360b2f15cf55e2ec11b0b9214b0056b414963892858087335f','1ce97210b117803e','Farmer Fred','/images/001.png',NULL,1,1,0),(5,1,'manager@farm.com','8875c21636358572ade130f7d20ad0f8384176d57f36d320c2ef655454cd1342','c9d21a17d97af636','Manager','/images/001.png',NULL,0,0,0),(6,0,'bob@office.com','3d5e3f1c14eff7ec9ea923eaa87cfba12765b4f012e7cf8abb915a98c5410972','cd4c0b49026427bd','Bob the Builder','/images/001.png',NULL,0,0,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-24 14:06:25
