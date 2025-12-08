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
-- Table structure for table `equipos_computos`
--

DROP TABLE IF EXISTS `equipos_computos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_computos` (
  `id_equipo` int NOT NULL AUTO_INCREMENT,
  `nombre_persona` varchar(255) NOT NULL,
  `cedula` varchar(50) NOT NULL,
  `nombre_equipo` varchar(255) NOT NULL,
  `codigo_equipo` varchar(50) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_equipo`),
  UNIQUE KEY `codigo_equipo` (`codigo_equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_computos`
--

LOCK TABLES `equipos_computos` WRITE;
/*!40000 ALTER TABLE `equipos_computos` DISABLE KEYS */;
INSERT INTO `equipos_computos` VALUES (1,'Cesar','1092525927','ASUS','Asus2409','2025-12-03 18:09:00'),(2,'alex','88204050','iphone','iphone050','2025-12-03 20:08:00'),(3,'mafer','60369093','Mac','mac093','2025-12-04 01:31:00'),(4,'sebastian','48348923493','laptop','839238','2025-12-08 01:31:00'),(5,'sadas','4535656','bvcxv','4534534','2025-12-08 19:13:00'),(6,'dgfdvcvc','44434556677','svdsfdf','57986787','2025-12-08 19:13:00'),(7,'vbcbnhbnvb','7654756775','ggbfdb','7687876787867','2025-12-08 19:14:00'),(8,'bvcbgn','5587686898798','gcvgbnbvn','nvnvcbvngnh','2025-12-08 19:14:00'),(9,'dcsfdsd','56867565444','cscdcsd','5898797','2025-12-08 19:18:00'),(10,'sada','342343243','dsdfsa','4576576555','2025-12-08 20:27:00');
/*!40000 ALTER TABLE `equipos_computos` ENABLE KEYS */;
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
