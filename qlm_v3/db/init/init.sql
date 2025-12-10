-- MySQL dump 10.13  Distrib 8.0.43, for Linux (aarch64)
--
-- Host: localhost    Database: qlm_jasslin
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Current Database: `qlm_jasslin`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `qlm_jasslin` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `qlm_jasslin`;

--
-- Table structure for table `Company`
--

DROP TABLE IF EXISTS `Company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `taxId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remark` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `deletedById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Company_companyCode_key` (`companyCode`),
  KEY `Company_deletedAt_idx` (`deletedAt`),
  KEY `Company_deletedAt_companyCode_idx` (`deletedAt`,`companyCode`),
  KEY `Company_deletedById_fkey` (`deletedById`),
  CONSTRAINT `Company_deletedById_fkey` FOREIGN KEY (`deletedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Company`
--

LOCK TABLES `Company` WRITE;
/*!40000 ALTER TABLE `Company` DISABLE KEYS */;
INSERT INTO `Company` VALUES (1,'jsl','捷世林科技股份有限公司','13091876','0229030688','新北市泰山區新北大道六段411號10樓','{\"2025-09-24_22_34\": \"建立新公司資料 - 捷世林科技股份有限公司\"}','2025-09-24 14:34:15.311','2025-09-24 14:34:15.311',NULL,NULL),(2,'yym','裕益汽車','11112345','0229067131','新北市泰山區貴和里明志路三段523號',NULL,'2025-09-26 03:37:18.652','2025-11-11 02:56:54.092',NULL,NULL);
/*!40000 ALTER TABLE `Company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CrtfData`
--

DROP TABLE IF EXISTS `CrtfData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CrtfData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `crtfNo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `crtfField` json NOT NULL,
  `category` enum('ISSUE','RENEW','REPLACE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ISSUE',
  `companyId` int NOT NULL,
  `createdById` int NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `deletedById` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `remark` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CrtfData_crtfNo_key` (`crtfNo`),
  KEY `CrtfData_createdById_deletedAt_idx` (`createdById`,`deletedAt`),
  KEY `CrtfData_companyId_deletedAt_idx` (`companyId`,`deletedAt`),
  KEY `CrtfData_deletedById_fkey` (`deletedById`),
  CONSTRAINT `CrtfData_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CrtfData_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `CrtfData_deletedById_fkey` FOREIGN KEY (`deletedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CrtfData`
--

LOCK TABLES `CrtfData` WRITE;
/*!40000 ALTER TABLE `CrtfData` DISABLE KEYS */;
INSERT INTO `CrtfData` VALUES (1,'J106S-1234-1234_LV7-079_ecb4e96d-684d-4b31-8e85-af51148edab6','{\"BUS_ID\": \"LV7-079\", \"BUS_SN\": \"J106S-1234-1234\", \"CRTF_SN\": \"１２３１３２\", \"BUS_NAME\": \"Jacob Lin\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 17:18:49 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 17:18:49 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"地球地球地球地球地球地球地球\", \"CONTACT_NAME\": \"Jacob Lin\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 17:18:49 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"0960332283\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"阿滴\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"1234-0389143*1324\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 09:52:53.208','2025-10-09 09:52:53.208','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"今天的註解啦～～\"}'),(2,'J208U-3456-3456_LV9-123_d1f19098-4d69-40ff-a111-87916c39302c','{\"BUS_ID\": \"LV9-123\", \"BUS_SN\": \"J208U-3456-3456\", \"CRTF_SN\": \"ADFASDF4359084375891\", \"BUS_NAME\": \"周星星\", \"BUS_VSCC\": \"0C20320002161-04\", \"NEXT_DATE\": \"Sat Oct 09 2027 19:26:59 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 19:26:59 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"火星火星火星火星\", \"CONTACT_NAME\": \"周星星\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 19:26:59 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"0806449449\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"AAAAA\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"ASDF345908094-*JALDS\"}','ISSUE',2,4,'2025-11-07 08:27:49.974',4,'2025-10-09 11:31:47.479','2025-11-07 08:27:49.976','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"周星星的備注～～\"}'),(3,'J208U-3456-3456_345-33LL_58b6b546-071c-4225-8edf-31067f92585b','{\"BUS_ID\": \"345-33LL\", \"BUS_SN\": \"J208U-3456-3456\", \"CRTF_SN\": \"ASD-1234534\", \"BUS_NAME\": \"海獅寶寶\", \"BUS_VSCC\": \"0C20322003161-03\", \"NEXT_DATE\": \"Sat Oct 09 2027 19:52:09 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 19:52:09 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"AAAAAAAAA\", \"CONTACT_NAME\": \"海獅寶寶\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 19:52:09 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"0960332283\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"嗡嗡大叔\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"ASD344-ASDFASD8823R0\"}','ISSUE',2,4,'2025-11-07 08:40:01.263',4,'2025-10-09 12:09:07.412','2025-11-07 08:40:01.264','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"海獅寶寶的註解～～\"}'),(4,'J306U-7897-8903_XXYY-Y333_4a00d5e7-d83d-4acb-83dc-3f0d1c675bcb','{\"BUS_ID\": \"XXYY-Y333\", \"BUS_SN\": \"J306U-7897-8903\", \"CRTF_SN\": \"DFS-45435432\", \"BUS_NAME\": \"無助大大\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 20:09:45 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 20:09:45 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"jasd;lkfj;aslkdf;lkasjf;lkasdjf;lkj;lk\", \"CONTACT_NAME\": \"無助大大\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 20:09:45 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"999999999999\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"嗡嗡\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"DE54902439582*34231\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 12:11:03.603','2025-10-09 12:11:03.603','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"無助大大的註解～～～\"}'),(5,'J306U-4567-8765_RR0-1234_fb412dac-cba1-4645-b692-3259f5cfac91','{\"BUS_ID\": \"RR0-1234\", \"BUS_SN\": \"J306U-4567-8765\", \"CRTF_SN\": \"JDKJF-0-234IOSF\", \"BUS_NAME\": \"林特助\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 20:11:59 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 20:11:59 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"傷心酒店傷心酒店傷心酒店\", \"CONTACT_NAME\": \"林特助\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 20:11:59 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"00009999909090\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"嗡嗡\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"AJJDKFG898-39**\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 12:13:42.914','2025-10-09 12:13:42.914','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"林特助的備注～～\"}'),(6,'J306U-4567-8765_RR0-1234_53bcfe7d-a650-4991-8a81-b013620b9432','{\"BUS_ID\": \"RR0-1234\", \"BUS_SN\": \"J306U-4567-8765\", \"CRTF_SN\": \"JDKJF-0-234IOSF\", \"BUS_NAME\": \"林特助大大\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Oct 24 2027 20:11:59 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 20:11:59 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"歡喜酒店歡喜酒店歡喜酒店\", \"CONTACT_NAME\": \"林特助大大\", \"PUBLISH_DATE\": \"Fri Oct 24 2025 20:11:59 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"00009999909090\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"嗡嗡\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"AJJDKFG898-39**\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 12:19:44.048','2025-10-09 12:19:44.048','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-24\": \"林特助的歡喜酒店備注～～\"}'),(7,'J106S-1234-1234_KKA-1234_9f7ffad9-1f3d-4e10-a269-02844ed144ef','{\"BUS_ID\": \"KKA-1234\", \"BUS_SN\": \"J106S-1234-1234\", \"CRTF_SN\": \"AAA\", \"BUS_NAME\": \"aaaaa\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 22:09:12 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 22:09:12 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"aaa\", \"CONTACT_NAME\": \"aaa\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 22:09:12 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"aaa\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"aaa\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"AADFA\"}','ISSUE',2,4,'2025-10-27 09:29:00.000',4,'2025-10-09 14:10:46.525','2025-10-09 14:10:46.525','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"ASDFASF\"}'),(8,'J106S-1234-1234_KKA-1234_49c88349-3970-4258-b555-a6b164305851','{\"BUS_ID\": \"KKA-1234\", \"BUS_SN\": \"J106S-1234-1234\", \"CRTF_SN\": \"AAA\", \"BUS_NAME\": \"aaaaa\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 22:09:12 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 22:09:12 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"aaa\", \"CONTACT_NAME\": \"aaa\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 22:09:12 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"aaa\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"aaa\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"AADFA\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 14:12:28.350','2025-10-09 14:12:28.350','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"ASDFASF\"}'),(9,'J106S-1234-1234_LV9-00_c4f0fc37-d5f2-4da9-8f45-334379b18e9a','{\"BUS_ID\": \"LV9-00\", \"BUS_SN\": \"J106S-1234-1234\", \"CRTF_SN\": \"ASDFASDF\", \"BUS_NAME\": \"aaa\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 22:13:11 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 22:13:11 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"asfdasdfa\", \"CONTACT_NAME\": \"asdfasdf\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 22:13:11 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"asdfsdaf\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"asdfsadf\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"ASDFA4\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 14:13:39.509','2025-10-09 14:13:39.509','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"FASDFASDF\"}'),(10,'J106S-2345-2345_LLL-KK1233_6ffd2001-07a5-4e30-9b81-c3094687da0d','{\"BUS_ID\": \"LLL-KK1233\", \"BUS_SN\": \"J106S-2345-2345\", \"CRTF_SN\": \"ASFASDFASDF\", \"BUS_NAME\": \"aaaaff\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sat Oct 09 2027 22:17:47 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Thu Oct 09 2025 22:17:47 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"dfasdfasdfasdf\", \"CONTACT_NAME\": \"fffsdff\", \"PUBLISH_DATE\": \"Thu Oct 09 2025 22:17:47 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"safasdfasdfas\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"sadfasdfasdfasdf\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"FFFF\"}','ISSUE',2,4,NULL,NULL,'2025-10-09 14:18:41.079','2025-10-09 14:18:41.079','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"ASDFASDFASDF\"}'),(11,'J208U-2345-2345_LL-0918_1ba4e31c-de02-42f8-884b-be4803bf48a5','{\"BUS_ID\": \"LL-0918\", \"BUS_SN\": \"J208U-2345-2345\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"Jacob Lin\", \"BUS_VSCC\": \"0C20320002161-04\", \"NEXT_DATE\": \"Mon Oct 11 2027 16:27:15 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Sat Oct 11 2025 16:27:15 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"fdskljf;lads\", \"CONTACT_NAME\": \"Jacob Lin\", \"PUBLISH_DATE\": \"Sat Oct 11 2025 16:27:15 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"12321321\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"ASDF-*468\"}','ISSUE',2,4,NULL,NULL,'2025-10-11 08:43:52.319','2025-10-11 08:43:52.319','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-11\": \"\"}'),(12,'J208U-3456-3456_KKA-1234_0256e0c6-d7cd-4c2b-8234-d826ecd90882','{\"BUS_ID\": \"KKA-1234\", \"BUS_SN\": \"J208U-3456-3456\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"JAcobbbbbbb\", \"BUS_VSCC\": \"0C20322003161-03\", \"NEXT_DATE\": \"Mon Oct 11 2027 16:53:41 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Sat Oct 11 2025 16:53:41 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"\", \"CONTACT_NAME\": \"JAcobbbbbbb\", \"PUBLISH_DATE\": \"Sat Oct 11 2025 16:53:41 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"ADSF-**465464\"}','ISSUE',2,4,'2025-11-07 08:40:01.263',4,'2025-10-11 08:59:40.949','2025-11-07 08:40:01.264','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-11\": \"\"}'),(13,'J106S-1235-1234_KKA-4567_a5921543-7add-4c0a-933b-eb64636121b1','{\"BUS_ID\": \"KKA-4567\", \"BUS_SN\": \"J106S-1235-1234\", \"CRTF_SN\": \"JACOB\", \"BUS_NAME\": \"Jacob\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Thu Nov 04 2027 17:46:54 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Tue Nov 04 2025 17:46:54 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"Jacob\", \"CONTACT_NAME\": \"Jacob\", \"PUBLISH_DATE\": \"Tue Nov 04 2025 17:46:54 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"Jacob\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"Jacob\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"709857093*093-9128\"}','ISSUE',2,4,NULL,NULL,'2025-11-04 09:58:15.054','2025-11-04 09:58:15.054','{\"2025-11-04_05\": \"46_*進行存檔*\", \"2025-11-04_05:46:54\": \"\"}'),(14,'J306U-1234-1234_KKK-4321_ce33ae88-9b47-437a-afc2-994c63c46796','{\"BUS_ID\": \"KKK-4321\", \"BUS_SN\": \"J306U-1234-1234\", \"CRTF_SN\": \"HEINZ-123123\", \"BUS_NAME\": \"Heinz\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Nov 07 2027 19:34:48 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Tue Nov 04 2025 19:34:48 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"新北大道新北大道新北大道\", \"CONTACT_NAME\": \"Heinz\", \"PUBLISH_DATE\": \"Fri Nov 07 2025 19:34:48 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"0805466\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"Heinzzz\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"12343-345*-345\"}','ISSUE',2,4,NULL,NULL,'2025-11-04 11:37:27.474','2025-11-04 11:37:27.474','{\"2025-11-07_07-34-48\": \"這是新的合格證**進行存檔**\"}'),(15,'J208U-1111-2222_JJJ-1234_2aa06e0c-f45f-4aa9-958d-5dea6fea200f','{\"BUS_ID\": \"JJJ-1234\", \"BUS_SN\": \"J208U-1111-2222\", \"CRTF_SN\": \"ASDF1234325\", \"BUS_NAME\": \"Gary\", \"BUS_VSCC\": \"0C20322003161-03\", \"NEXT_DATE\": \"Mon Nov 22 2027 19:45:48 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Tue Nov 04 2025 19:45:48 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"捷世林捷世林\", \"CONTACT_NAME\": \"Gary\", \"PUBLISH_DATE\": \"Sat Nov 22 2025 19:45:48 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"2231358541\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"DSF78743*AS-1234\"}','ISSUE',2,4,NULL,NULL,'2025-11-04 11:48:13.311','2025-11-04 11:48:13.311','{\"2025-11-22_07-45-48\": \"這是一張合格證，GARY發送\"}'),(16,'J106U-5678-8473_HK-1234_5207f728-6ecc-4196-b322-bc233523da34','{\"BUS_ID\": \"HK-1234\", \"BUS_SN\": \"J106U-5678-8473\", \"CRTF_SN\": \"2313215\", \"BUS_NAME\": \"盧媽媽\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Thu Nov 04 2027 20:04:55 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Tue Nov 04 2025 20:04:55 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"\", \"CONTACT_NAME\": \"盧媽媽\", \"PUBLISH_DATE\": \"Tue Nov 04 2025 20:04:55 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"DIEJJW2985-03289\"}','ISSUE',2,4,NULL,NULL,'2025-11-04 12:06:26.753','2025-11-04 12:06:26.753','{\"2025-11-04_08-04-55\": \"盧媽媽還我豬豬！\"}'),(17,'J306U-3456-9874_LUMA-MA_738b3d3b-f04e-44ec-aceb-2b21779e8720','{\"BUS_ID\": \"LUMA-MA\", \"BUS_SN\": \"J306U-3456-9874\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"盧媽媽\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Thu Nov 04 2027 20:08:47 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Tue Nov 04 2025 20:08:47 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"\", \"CONTACT_NAME\": \"盧媽媽\", \"PUBLISH_DATE\": \"Tue Nov 04 2025 20:08:47 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"020354315\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"\", \"VEH_ENGINE_CODE\": \"DJFK9883-*2234\", \"VEH_CHASSIS_CODE\": \"\"}','ISSUE',2,4,NULL,NULL,'2025-11-04 12:10:01.742','2025-11-04 12:10:01.742','{\"2025-11-04_08-08-47\": \"盧媽媽豬豬呢？**進行存檔**\"}'),(18,'J208U-3456-3456_LV9-123_9bce17cf-818b-4e15-8c0b-65fdb24594fe','{\"BUS_ID\": \"LV9-123\", \"BUS_SN\": \"J208U-3456-3456\", \"CRTF_SN\": \"ADFASDF4359084375891\", \"BUS_NAME\": \"周星星(改)\", \"BUS_VSCC\": \"0C20320002161-04\", \"NEXT_DATE\": \"Sat Oct 09 2027 08:00:00 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"2025-10-09\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"火星火星火星火星（改）\", \"CONTACT_NAME\": \"周星星\", \"PUBLISH_DATE\": \"2025-10-09\", \"CONTACT_PHONE\": \"0806449449\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"AAAAA\", \"VEH_ENGINE_CODE\": \"\", \"VEH_CHASSIS_CODE\": \"ASDF345908094-*JALDS\"}','RENEW',2,4,NULL,NULL,'2025-11-07 08:40:01.279','2025-11-07 08:40:01.279','{\"2025-10-01\": \"AAAAA\", \"2025-10-02\": \"BBBBBB\", \"2025-10-03\": \"CCCC\", \"2025-10-04\": \"DDDD\", \"2025-10-05\": \"EEEEEE\", \"2025-10-06\": \"QQQQQQQQ\", \"2025-10-09\": \"周星星的備注～～\", \"2025-10-09_08-00-00\": \"（改改改）_**進行存檔**\"}'),(19,'J106U-1234-0007_KKK-123445_6a721f7f-d398-4c9b-88c5-4d7a5fc705e0','{\"BUS_ID\": \"KKK-123445\", \"BUS_SN\": \"J106U-1234-0007\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"哈哈Jacob\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Nov 14 2027 20:36:56 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"哈哈Jacob哈哈Jacob\", \"CONTACT_NAME\": \"哈哈Jacob\", \"PUBLISH_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"1231321321\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"哈哈Jacob\", \"VEH_ENGINE_CODE\": \"1234-**123455KD\", \"VEH_CHASSIS_CODE\": \"1234-**123455KD\"}','ISSUE',2,4,'2025-11-14 12:43:02.446',4,'2025-11-14 12:39:10.034','2025-11-14 12:43:02.447','{\"2025-11-14_08-36-56\": \"哈哈JACOB~~_**進行存檔**\"}'),(20,'J106U-1234-0008_KKK-123445_13292076-e08a-4a37-bcb5-35efbfe7dc07','{\"BUS_ID\": \"KKK-123445\", \"BUS_SN\": \"J106U-1234-0008\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"哈哈Jacob2\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Nov 14 2027 20:36:56 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"哈哈Jacob2哈哈Jacob2\", \"CONTACT_NAME\": \"哈哈Jacob\", \"PUBLISH_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"1231321321\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"哈哈Jacob\", \"VEH_ENGINE_CODE\": \"1234-**123455KD\", \"VEH_CHASSIS_CODE\": \"1234-**123455KD\"}','ISSUE',2,4,'2025-11-14 13:04:21.580',4,'2025-11-14 12:43:02.459','2025-11-14 13:04:21.581','{\"2025-11-14_08-36-56\": \"哈哈JACOB22~~_**進行存檔**\"}'),(21,'J106U-1234-0009_KKK-1234_45b800b3-70f4-48ca-a503-a6347288a4ec','{\"BUS_ID\": \"KKK-1234\", \"BUS_SN\": \"J106U-1234-0009\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"哈哈Jacob3\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Nov 14 2027 20:36:56 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"哈哈Jacob3\", \"CONTACT_NAME\": \"哈哈Jacob3\", \"PUBLISH_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"1231321321\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"哈哈Jacob3\", \"VEH_ENGINE_CODE\": \"1234-**123455KD\", \"VEH_CHASSIS_CODE\": \"1234-**123455KD\"}','ISSUE',2,4,'2025-11-14 13:05:12.146',4,'2025-11-14 13:04:21.594','2025-11-14 13:05:12.147','{\"2025-11-14_08-36-56\": \"哈哈JACOB3~~_**進行存檔**\"}'),(22,'J106U-1234-0009_KKK-1234_b7bb35ee-eabc-4bba-b3a2-f8435668311e','{\"BUS_ID\": \"KKK-1234\", \"BUS_SN\": \"J106U-1234-0009\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"哈哈Jacob3\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Nov 14 2027 20:36:56 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"哈哈Jacob3\", \"CONTACT_NAME\": \"哈哈Jacob3\", \"PUBLISH_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"1231321321\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"哈哈Jacob3\", \"VEH_ENGINE_CODE\": \"1234-**123455KD\", \"VEH_CHASSIS_CODE\": \"1234-**123455KD\"}','ISSUE',2,4,'2025-11-14 13:06:18.145',4,'2025-11-14 13:05:12.166','2025-11-14 13:06:18.147','{\"2025-11-14_08-36-56\": \"哈哈JACOB3~~_**進行存檔**\"}'),(23,'J106U-1234-0009_KKK-1234_42211e62-9f08-40da-99d0-3702efbcb9fd','{\"BUS_ID\": \"KKK-1234\", \"BUS_SN\": \"J106U-1234-0009\", \"CRTF_SN\": \"\", \"BUS_NAME\": \"哈哈Jacob3\", \"BUS_VSCC\": \"0C20318002160-01\", \"NEXT_DATE\": \"Sun Nov 14 2027 20:36:56 GMT+0800 (Taipei Standard Time)\", \"UNIT_NAME\": \"yym\", \"BUILD_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CLERK_NAME\": \"Jacob123\", \"CONTACT_ADDR\": \"哈哈Jacob3\", \"CONTACT_NAME\": \"哈哈Jacob3\", \"PUBLISH_DATE\": \"Fri Nov 14 2025 20:36:56 GMT+0800 (Taipei Standard Time)\", \"CONTACT_PHONE\": \"1231321321\", \"VEH_BODY_CODE\": \"\", \"TECHNICIAN_NAME\": \"哈哈Jacob3\", \"VEH_ENGINE_CODE\": \"1234-**123455KD\", \"VEH_CHASSIS_CODE\": \"1234-**123455KD\"}','ISSUE',2,4,NULL,NULL,'2025-11-14 13:06:18.163','2025-11-14 13:06:18.163','{\"2025-11-14_08-36-56\": \"哈哈JACOB3~~_**進行存檔**\"}');
/*!40000 ALTER TABLE `CrtfData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userRole` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `companyId` int NOT NULL,
  `deletedById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  KEY `User_deletedAt_idx` (`deletedAt`),
  KEY `User_companyId_deletedAt_idx` (`companyId`,`deletedAt`),
  KEY `User_deletedById_fkey` (`deletedById`),
  CONSTRAINT `User_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `User_deletedById_fkey` FOREIGN KEY (`deletedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'ADMIN','jasslin01','$2b$10$/dH/W/sT5ym/HoMX9SzOv.bIQm5ix8Xu60vmA1R20h6zCkveFx0P2','2025-09-24 14:34:15.401','2025-09-24 14:34:15.401',NULL,1,NULL),(2,'USER','Jacob','$2b$10$iELfVXkEpuOQAO6wI./NTOUTNUwdNVuU.xA3/BqicKej9YRYwjipi','2025-09-26 11:53:01.441','2025-09-26 11:53:01.441',NULL,2,NULL),(4,'ADMIN','Jacob123','$2b$10$jElzZh/yHZAwXCcaYEW0RugI1nu9h8TscKKWfUOidasWa879uERo.','2025-09-26 14:20:07.171','2025-11-11 03:48:32.262',NULL,2,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserInfo`
--

DROP TABLE IF EXISTS `UserInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserInfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `functionality` json NOT NULL,
  `printTune` json NOT NULL,
  `remark` json DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserInfo_userId_key` (`userId`),
  CONSTRAINT `UserInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserInfo`
--

LOCK TABLES `UserInfo` WRITE;
/*!40000 ALTER TABLE `UserInfo` DISABLE KEYS */;
INSERT INTO `UserInfo` VALUES (1,'{\"ISSUE\": true, \"RENEW\": true, \"FIELDS\": {\"BUS_ID\": true, \"BUS_SN\": true, \"CRTF_SN\": true, \"BUS_NAME\": true, \"BUS_VSCC\": true, \"NEXT_DATE\": true, \"UNIT_NAME\": true, \"BUILD_DATE\": true, \"CLERK_NAME\": true, \"CONTACT_ADDR\": true, \"CONTACT_NAME\": true, \"PUBLISH_DATE\": true, \"PUBLISH_MODE\": true, \"CONTACT_PHONE\": true, \"VEH_BODY_CODE\": true, \"TECHNICIAN_NAME\": true, \"VEH_ENGINE_CODE\": true, \"VEH_CHASSIS_CODE\": true}, \"REPLACE\": true, \"STATISTIC\": false, \"PRINT_TUNE\": true, \"USER_MANAGMENT\": {\"NEW_USER\": true, \"FUNC_TUNE\": true, \"USER_DATA\": true, \"USER_INFO\": false}, \"ADMIN_MANAGMENT\": {\"VEH_SEARCH\": true, \"BATCH_PRINT\": true, \"DATA_IMPORT\": true, \"PRINT_CRTF_SN\": true, \"PUBLISH_STATISTIC\": true}, \"USER_MANAGMENT_OPEN\": true, \"ADMIN_MANAGMENT_OPEN\": true}','{\"BUS_ID\": [0, 0], \"BUS_NAME\": [0, 0], \"BUS_VSCC\": [0, 0], \"MODEL_SN\": [0, 0], \"VEH_CODE\": [0, 0], \"NEXT_DATE\": [0, 0], \"PUBLISH_DATE\": [0, 0]}','{\"2025-09-24_22-34-34\": \"建立使用者\"}',1,'2025-09-24 14:34:15.401','2025-09-24 14:34:15.401'),(2,'{\"ISSUE\": true, \"RENEW\": true, \"FIELDS\": {\"BUS_ID\": true, \"BUS_SN\": true, \"CRTF_SN\": false, \"BUS_NAME\": true, \"BUS_VSCC\": true, \"NEXT_DATE\": true, \"UNIT_NAME\": false, \"BUILD_DATE\": true, \"CLERK_NAME\": true, \"CONTACT_ADDR\": false, \"CONTACT_NAME\": true, \"PUBLISH_DATE\": true, \"PUBLISH_MODE\": true, \"CONTACT_PHONE\": true, \"VEH_BODY_CODE\": true, \"TECHNICIAN_NAME\": false, \"VEH_ENGINE_CODE\": true, \"VEH_CHASSIS_CODE\": true}, \"REPLACE\": true, \"STATISTIC\": false, \"PRINT_TUNE\": true, \"USER_MANAGMENT\": {\"NEW_USER\": true, \"FUNC_TUNE\": true, \"USER_DATA\": true, \"USER_INFO\": false}, \"ADMIN_MANAGMENT\": {\"VEH_SEARCH\": true, \"BATCH_PRINT\": true, \"DATA_IMPORT\": true, \"PRINT_CRTF_SN\": true, \"PUBLISH_STATISTIC\": true}, \"USER_MANAGMENT_OPEN\": true, \"ADMIN_MANAGMENT_OPEN\": true}','{\"BUS_ID\": [0, 0], \"BUS_NAME\": [0, 0], \"BUS_VSCC\": [0, 0], \"MODEL_SN\": [0, 0], \"VEH_CODE\": [0, 0], \"NEXT_DATE\": [0, 0], \"PUBLISH_DATE\": [0, 0]}','{\"2025-09-26_19-52-62\": \"建立使用者 - Jacob\"}',2,'2025-09-26 11:53:01.441','2025-11-15 05:26:41.442'),(3,'{\"ISSUE\": true, \"RENEW\": true, \"FIELDS\": {\"BUS_ID\": true, \"BUS_SN\": true, \"CRTF_SN\": true, \"BUS_NAME\": true, \"BUS_VSCC\": true, \"NEXT_DATE\": true, \"UNIT_NAME\": true, \"BUILD_DATE\": true, \"CLERK_NAME\": true, \"CONTACT_ADDR\": true, \"CONTACT_NAME\": true, \"PUBLISH_DATE\": true, \"PUBLISH_MODE\": true, \"CONTACT_PHONE\": true, \"VEH_BODY_CODE\": true, \"TECHNICIAN_NAME\": true, \"VEH_ENGINE_CODE\": true, \"VEH_CHASSIS_CODE\": true}, \"REPLACE\": true, \"STATISTIC\": false, \"PRINT_TUNE\": true, \"USER_MANAGMENT\": {\"NEW_USER\": true, \"FUNC_TUNE\": true, \"USER_DATA\": true, \"USER_INFO\": false}, \"ADMIN_MANAGMENT\": {\"VEH_SEARCH\": true, \"BATCH_PRINT\": true, \"DATA_IMPORT\": true, \"PRINT_CRTF_SN\": true, \"PUBLISH_STATISTIC\": true}, \"USER_MANAGMENT_OPEN\": true, \"ADMIN_MANAGMENT_OPEN\": true}','{\"BUS_ID\": [0, 0], \"BUS_NAME\": [0, 0], \"BUS_VSCC\": [0, 0], \"MODEL_SN\": [0, 0], \"VEH_CODE\": [0, 0], \"NEXT_DATE\": [0, 0], \"PUBLISH_DATE\": [0, 0]}','{\"2025-09-26_22-19-19\": \"建立使用者 - Jacob123\", \"2025-11-11_10-56-54\": \"隨便改個統編逃稅一下～～\"}',4,'2025-09-26 14:20:07.171','2025-11-16 12:24:59.744');
/*!40000 ALTER TABLE `UserInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('8a132cbe-8805-4cab-8aa5-7fa459496511','f91b1a0dd4c822f05e91996841da485bba1023944c80462da6da1b3a52531531','2025-09-24 14:16:03.343','20250924141603_init',NULL,NULL,'2025-09-24 14:16:03.127',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-19  7:45:19
