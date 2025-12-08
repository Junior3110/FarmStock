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
-- Table structure for table `prestamo`
--

DROP TABLE IF EXISTS `prestamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prestamo` (
  `id_prestamo` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_herramienta` int NOT NULL,
  `fecha_prestamo` datetime(6) NOT NULL,
  `fecha_devolucion` datetime(6) DEFAULT NULL,
  `estado` varchar(255) NOT NULL,
  `id_detalle` int DEFAULT NULL,
  `id_aprendiz` int DEFAULT NULL,
  PRIMARY KEY (`id_prestamo`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_herramienta` (`id_herramienta`),
  KEY `id_detalle` (`id_detalle`),
  KEY `fk_prestamo_aprendiz` (`id_aprendiz`),
  CONSTRAINT `fk_prestamo_aprendiz` FOREIGN KEY (`id_aprendiz`) REFERENCES `aprendiz` (`id_aprendiz`),
  CONSTRAINT `prestamo_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `prestamo_ibfk_2` FOREIGN KEY (`id_herramienta`) REFERENCES `herramienta` (`id_herramienta`),
  CONSTRAINT `prestamo_ibfk_3` FOREIGN KEY (`id_detalle`) REFERENCES `herramienta_detalle` (`id_detalle`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestamo`
--

LOCK TABLES `prestamo` WRITE;
/*!40000 ALTER TABLE `prestamo` DISABLE KEYS */;
INSERT INTO `prestamo` VALUES (1,22,39,'2025-11-04 00:00:00.000000','2025-11-10 00:00:00.000000','Vencido',120,NULL),(2,22,40,'2025-11-03 00:00:00.000000','2025-11-10 00:00:00.000000','Activo',123,NULL),(6,48,40,'2025-11-03 15:30:00.000000','2025-11-13 22:36:10.687114','Finalizado',125,8),(19,48,94,'2025-11-25 13:02:02.000000','2025-11-25 13:06:13.521342','Finalizado',278,14),(20,48,95,'2025-11-25 14:57:16.000000','2025-11-25 15:00:14.556878','Finalizado',282,14),(22,48,95,'2025-11-25 15:22:28.000000','2025-12-05 01:52:14.074745','Finalizado',282,16),(24,48,84,'2025-12-02 00:03:36.000000','2025-12-02 00:58:53.267532','Finalizado',223,17),(25,48,84,'2025-12-02 01:00:12.000000','2025-12-02 01:00:31.997466','Finalizado',223,17),(26,48,114,'2025-12-04 23:23:29.000000','2025-12-05 01:50:49.455538','Finalizado',350,21),(27,48,105,'2025-12-05 01:53:14.000000','2025-12-05 01:58:21.869368','Finalizado',324,21),(28,48,102,'2025-12-05 02:39:06.000000','2025-12-05 02:41:32.242322','Finalizado',314,21),(29,48,118,'2025-12-05 10:20:53.000000','2025-12-05 10:20:58.535007','Finalizado',359,21),(30,48,118,'2025-12-05 14:04:05.000000','2025-12-05 14:06:33.270734','Finalizado',359,21),(31,48,119,'2025-12-07 13:42:01.000000','2025-12-07 22:59:24.692708','Finalizado',362,22),(32,48,119,'2025-12-07 23:00:19.000000','2025-12-07 23:28:50.680279','Finalizado',363,22),(33,48,119,'2025-12-07 23:02:07.000000','2025-12-07 23:28:45.977402','Finalizado',362,21),(34,48,119,'2025-12-07 23:57:07.000000',NULL,'Activo',362,22),(35,48,121,'2025-12-08 20:23:22.000000','2025-12-08 20:23:52.444106','Finalizado',366,9);
/*!40000 ALTER TABLE `prestamo` ENABLE KEYS */;
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
