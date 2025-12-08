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
-- Table structure for table `mantenimiento`
--

DROP TABLE IF EXISTS `mantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mantenimiento` (
  `id_mantenimiento` int NOT NULL AUTO_INCREMENT,
  `id_herramienta` int NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_mantenimiento` date NOT NULL,
  `realizado_por` int DEFAULT NULL,
  `id_detalle` int DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `tipo` varchar(255) NOT NULL,
  PRIMARY KEY (`id_mantenimiento`),
  KEY `id_herramienta` (`id_herramienta`),
  KEY `realizado_por` (`realizado_por`),
  KEY `id_detalle` (`id_detalle`),
  CONSTRAINT `mantenimiento_ibfk_1` FOREIGN KEY (`id_herramienta`) REFERENCES `herramienta` (`id_herramienta`),
  CONSTRAINT `mantenimiento_ibfk_2` FOREIGN KEY (`realizado_por`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `mantenimiento_ibfk_3` FOREIGN KEY (`id_detalle`) REFERENCES `herramienta_detalle` (`id_detalle`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenimiento`
--

LOCK TABLES `mantenimiento` WRITE;
/*!40000 ALTER TABLE `mantenimiento` DISABLE KEYS */;
INSERT INTO `mantenimiento` VALUES (1,40,'Filo desgastado','2025-11-17',48,NULL,'PENDIENTE','DAÑO'),(2,35,'Filo reparado completamente','2025-11-17',48,105,'COMPLETADO','DAÑO'),(3,35,'Filo reparado completamente','2025-11-17',48,105,'COMPLETADO','MANTENIMIENTO'),(4,35,'Filo desgastado','2025-11-17',48,105,'COMPLETADO','MANTENIMIENTO'),(5,35,'Filo desgastado','2025-11-21',48,105,'COMPLETADO','MANTENIMIENTO'),(6,84,'sasa','2025-11-21',48,270,'PENDIENTE','MANTENIMIENTO'),(7,94,'por sapo','2025-11-24',54,278,'COMPLETADO','MANTENIMIENTO'),(8,94,'skmnas','2025-11-25',54,278,'PENDIENTE','MANTENIMIENTO'),(9,95,'por fea','2025-11-25',54,283,'EN_PROCESO','DAÑO'),(10,45,'sa','2025-12-01',55,296,'COMPLETADO','MANTENIMIENTO'),(11,45,'w','2025-12-01',55,296,'COMPLETADO','MANTENIMIENTO'),(12,45,'sa','2025-12-01',55,296,'COMPLETADO','MANTENIMIENTO'),(13,84,'assw','2025-12-01',55,223,'EN_PROCESO','MANTENIMIENTO'),(14,45,'qa','2025-12-01',55,133,'COMPLETADO','MANTENIMIENTO'),(15,84,'wasa','2025-12-01',55,247,'PENDIENTE','MANTENIMIENTO'),(16,45,'xas','2025-12-01',55,133,'COMPLETADO','DAÑO'),(17,84,'aa','2025-12-01',55,269,'PENDIENTE','DAÑO'),(18,101,'sas','2025-12-01',55,310,'PENDIENTE','MANTENIMIENTO'),(19,101,'wsasd','2025-12-01',55,313,'PENDIENTE','DAÑO'),(20,119,'ajjs','2025-12-07',55,362,'COMPLETADO','MANTENIMIENTO'),(21,119,'ddfs','2025-12-07',55,363,'COMPLETADO','DAÑO'),(22,119,'xs','2025-12-07',55,364,'COMPLETADO','MANTENIMIENTO'),(23,119,'ss','2025-12-07',55,363,'COMPLETADO','MANTENIMIENTO'),(24,119,'sa','2025-12-07',55,364,'COMPLETADO','MANTENIMIENTO');
/*!40000 ALTER TABLE `mantenimiento` ENABLE KEYS */;
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
