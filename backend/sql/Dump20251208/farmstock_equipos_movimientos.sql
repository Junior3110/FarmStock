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
-- Table structure for table `equipos_movimientos`
--

DROP TABLE IF EXISTS `equipos_movimientos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_movimientos` (
  `id_movimiento` int NOT NULL AUTO_INCREMENT,
  `codigo_equipo` varchar(50) NOT NULL,
  `tipo_movimiento` enum('ENTRADA','SALIDA') NOT NULL,
  `fecha_movimiento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `registrado_por` int DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_movimiento`),
  KEY `fk_mov_equipo` (`codigo_equipo`),
  CONSTRAINT `fk_mov_equipo` FOREIGN KEY (`codigo_equipo`) REFERENCES `equipos_computos` (`codigo_equipo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_movimientos`
--

LOCK TABLES `equipos_movimientos` WRITE;
/*!40000 ALTER TABLE `equipos_movimientos` DISABLE KEYS */;
INSERT INTO `equipos_movimientos` VALUES (1,'Asus2409','SALIDA','2025-12-03 18:10:43',1092525927,''),(2,'Asus2409','ENTRADA','2025-12-03 18:11:53',1092525927,''),(3,'Asus2409','SALIDA','2025-12-03 18:12:10',1092525927,''),(4,'Asus2409','ENTRADA','2025-12-03 18:13:35',1092525929,''),(5,'Asus2409','SALIDA','2025-12-03 19:39:10',26,''),(6,'Asus2409','ENTRADA','2025-12-03 19:39:15',26,''),(7,'Asus2409','SALIDA','2025-12-03 19:39:59',26,''),(8,'Asus2409','ENTRADA','2025-12-03 19:54:41',26,''),(9,'Asus2409','SALIDA','2025-12-03 19:54:49',26,''),(10,'Asus2409','ENTRADA','2025-12-03 20:05:56',26,''),(11,'Asus2409','SALIDA','2025-12-03 20:06:04',26,''),(12,'Asus2409','ENTRADA','2025-12-03 20:10:20',26,''),(13,'Asus2409','SALIDA','2025-12-03 20:10:31',26,''),(14,'Asus2409','ENTRADA','2025-12-03 20:21:55',1,'Fin de clase'),(15,'Asus2409','SALIDA','2025-12-03 20:22:26',1,'Clase de programación'),(16,'iphone050','SALIDA','2025-12-03 20:27:47',2,'Clase'),(17,'iphone050','ENTRADA','2025-12-03 20:27:52',2,'Fin clase'),(18,'iphone050','SALIDA','2025-12-03 20:29:01',2,''),(19,'iphone050','ENTRADA','2025-12-03 20:29:07',2,''),(20,'mac093','ENTRADA','2025-12-04 01:43:26',3,''),(21,'mac093','SALIDA','2025-12-04 03:25:34',3,'bre'),(22,'mac093','ENTRADA','2025-12-04 03:31:52',3,''),(23,'mac093','SALIDA','2025-12-04 03:33:36',3,''),(24,'iphone050','SALIDA','2025-12-04 05:43:14',2,'c'),(25,'iphone050','ENTRADA','2025-12-04 05:44:04',2,''),(26,'iphone050','SALIDA','2025-12-04 05:44:53',2,'salio'),(27,'mac093','ENTRADA','2025-12-08 01:32:21',3,''),(28,'mac093','SALIDA','2025-12-08 01:35:31',3,''),(29,'Asus2409','ENTRADA','2025-12-08 20:28:15',1,''),(30,'Asus2409','SALIDA','2025-12-08 20:28:37',1,'');
/*!40000 ALTER TABLE `equipos_movimientos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-08 15:35:10
