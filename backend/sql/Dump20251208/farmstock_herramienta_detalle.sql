-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: farmstock
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `herramienta_detalle`
--

DROP TABLE IF EXISTS `herramienta_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `herramienta_detalle` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `id_herramienta` int NOT NULL,
  `codigo_unico` varchar(50) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT '1',
  `fecha_ingreso` date DEFAULT NULL,
  `comentario` varchar(255) DEFAULT NULL,
  `contador_prestamos` int DEFAULT '0',
  PRIMARY KEY (`id_detalle`),
  UNIQUE KEY `codigo_unico` (`codigo_unico`),
  KEY `id_herramienta` (`id_herramienta`),
  CONSTRAINT `herramienta_detalle_ibfk_1` FOREIGN KEY (`id_herramienta`) REFERENCES `herramienta` (`id_herramienta`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `herramienta_detalle`
--

LOCK TABLES `herramienta_detalle` WRITE;
/*!40000 ALTER TABLE `herramienta_detalle` DISABLE KEYS */;
INSERT INTO `herramienta_detalle` VALUES (105,35,'ASCAED-35-023','Disponible',1,'2025-10-25','Sxas',0),(120,39,'FREDDY-39-001','Mantenimiento',0,'2025-10-28',NULL,0),(122,39,'HDYSIO-39-003','Disponible',1,'2025-10-28',NULL,0),(123,40,'HACHA-40-001','Mantenimiento',1,'2025-10-29',NULL,0),(124,40,'HACHA-40-002','Mantenimiento',1,'2025-10-29',NULL,0),(125,40,'HACHA-40-003','Disponible',1,'2025-10-29',NULL,2),(130,44,'MARTILLO-44-002','Disponible',1,'2025-11-05',NULL,0),(132,45,'MIA-45-002','Disponible',1,'2025-11-05',NULL,0),(133,45,'MIA-45-003','Disponible',1,'2025-11-05',NULL,0),(176,64,'METRO-64-001','Disponible',1,'2025-11-12','',0),(219,83,'CUCHILLO-83-001','Disponible',1,'2025-11-15',NULL,0),(220,83,'CUCHILLO-83-002','Disponible',1,'2025-11-15',NULL,1),(221,83,'CUCHILLO-83-003','Disponible',1,'2025-11-06',NULL,0),(222,83,'CUCHILLO-83-004','Disponible',1,'2025-11-15',NULL,0),(223,84,'MAI-84-001','Mantenimiento',0,'2025-11-18',NULL,5),(247,84,'MAI-84-004','Mantenimiento',0,'2025-11-18',NULL,0),(269,84,'MAI-84-006','Mantenimiento',0,'2025-11-18',NULL,0),(270,84,'MAI-84-007','Mantenimiento',0,'2025-11-18',NULL,0),(271,84,'MAI-84-002','Disponible',1,'2025-11-18',NULL,0),(272,84,'MAI-84-003','Disponible',1,'2025-11-18',NULL,0),(273,84,'MAI-84-005','Disponible',1,'2025-11-18',NULL,0),(275,44,'MARTILLO-44-004','Disponible',1,'2025-11-05',NULL,0),(276,44,'MARTILLO-44-003','Disponible',1,'2025-11-05',NULL,0),(278,94,'CUHCIO-94-002','Disponible',1,'2025-11-24','',5),(279,95,'PALA-95-001','Disponible',1,'2025-11-25',NULL,1),(280,95,'PALA-95-002','Disponible',1,'2025-11-25',NULL,0),(281,95,'PALA-95-003','Disponible',1,'2025-11-25',NULL,1),(282,95,'PALA-95-004','Disponible',1,'2025-11-25',NULL,2),(283,95,'PALA-95-005','Mantenimiento',0,'2025-11-25',NULL,0),(284,94,'CUHCIO-94-001','Disponible',1,'2025-11-24',NULL,0),(285,94,'CUHCIO-94-003','Disponible',1,'2025-11-24',NULL,0),(286,96,'CALI-96-001','Disponible',1,'2025-11-27',NULL,0),(287,96,'CALI-96-002','Disponible',1,'2025-11-27',NULL,0),(288,96,'CALI-96-003','Disponible',1,'2025-11-27',NULL,0),(289,96,'CALI-96-004','Disponible',1,'2025-11-27',NULL,0),(296,45,'MIA-45-001','Disponible',1,'2025-11-05',NULL,0),(297,99,'MARTILLO-99-001','Disponible',1,'2025-12-01',NULL,0),(298,99,'MARTILLO-99-002','Disponible',1,'2025-12-01',NULL,0),(299,99,'MARTILLO-99-003','Disponible',1,'2025-12-01',NULL,0),(300,99,'MARTILLO-99-004','Disponible',1,'2025-12-01',NULL,0),(301,99,'MARTILLO-99-005','Disponible',1,'2025-12-01',NULL,0),(302,99,'MARTILLO-99-006','Disponible',1,'2025-12-01',NULL,0),(303,99,'MARTILLO-99-007','Disponible',1,'2025-12-01',NULL,0),(304,99,'MARTILLO-99-008','Disponible',1,'2025-12-01',NULL,0),(305,99,'MARTILLO-99-009','Disponible',1,'2025-12-01',NULL,0),(306,99,'MARTILLO-99-010','Disponible',1,'2025-12-01',NULL,0),(307,100,'SAS-100-001','Disponible',1,'2025-12-01',NULL,0),(308,100,'SAS-100-002','Disponible',1,'2025-12-01',NULL,0),(309,100,'SAS-100-003','Disponible',1,'2025-12-01',NULL,0),(310,101,'MAI-101-001','Mantenimiento',0,'2025-12-01',NULL,0),(311,101,'MAI-101-002','Disponible',1,'2025-12-01',NULL,0),(312,101,'MAI-101-003','Disponible',1,'2025-12-01',NULL,0),(313,101,'MAI-101-004','Mantenimiento',0,'2025-12-01',NULL,0),(314,102,'CAJA-102-001','Disponible',1,'2025-12-04',NULL,1),(315,102,'CAJA-102-002','Disponible',1,'2025-12-04',NULL,0),(316,102,'CAJA-102-003','Disponible',1,'2025-12-04',NULL,0),(317,102,'CAJA-102-004','Disponible',1,'2025-12-04',NULL,0),(318,103,'DASD-103-001','Disponible',1,'2025-12-04',NULL,0),(319,103,'DASD-103-002','Disponible',1,'2025-12-04',NULL,0),(324,105,'DCZDC-105-001','Disponible',1,'2025-12-04',NULL,1),(325,105,'DCZDC-105-002','Disponible',1,'2025-12-04',NULL,0),(326,105,'DCZDC-105-003','Disponible',1,'2025-12-04',NULL,0),(327,106,'FFGH-106-001','Disponible',1,'2025-12-04',NULL,0),(328,106,'FFGH-106-002','Disponible',1,'2025-12-04',NULL,0),(329,106,'FFGH-106-003','Disponible',1,'2025-12-04',NULL,0),(330,106,'FFGH-106-004','Disponible',1,'2025-12-04',NULL,0),(334,108,'AA-108-001','Disponible',1,'2025-12-04',NULL,0),(335,108,'AA-108-002','Disponible',1,'2025-12-04',NULL,0),(350,114,'FF-114-001','Disponible',1,'2025-12-04',NULL,1),(351,114,'FF-114-002','Disponible',1,'2025-12-04',NULL,0),(352,114,'FF-114-003','Disponible',1,'2025-12-04',NULL,0),(354,116,'RFFF-116-001','Disponible',1,'2025-12-05',NULL,0),(355,116,'RFFF-116-002','Disponible',1,'2025-12-05',NULL,0),(356,117,'TIJERAS-117-001','Disponible',1,'2025-12-05',NULL,0),(357,117,'TIJERAS-117-002','Disponible',1,'2025-12-05',NULL,0),(358,117,'TIJERAS-117-003','Disponible',1,'2025-12-05',NULL,0),(359,118,'MACHETE-118-001','Disponible',1,'2025-12-05',NULL,2),(360,118,'MACHETE-118-002','Disponible',1,'2025-12-05',NULL,0),(361,118,'MACHETE-118-003','Disponible',1,'2025-12-05',NULL,0),(362,119,'PAA-119-001','Disponible',1,'2025-12-07','',3),(363,119,'PAA-119-002','Disponible',1,'2025-12-07','',1),(364,119,'PAA-119-003','Disponible',1,'2025-12-07',NULL,0),(365,120,'SXA-120-001','Disponible',1,'2025-12-07','',0),(366,121,'SFS-121-001','Disponible',1,'2025-12-08',NULL,1),(367,121,'SFS-121-002','Disponible',1,'2025-12-08',NULL,0);
/*!40000 ALTER TABLE `herramienta_detalle` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 15:35:09
