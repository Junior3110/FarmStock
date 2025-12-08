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
-- Table structure for table `herramienta`
--

DROP TABLE IF EXISTS `herramienta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `herramienta` (
  `id_herramienta` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `numero_lote` varchar(255) NOT NULL,
  `cantidad` int DEFAULT '1',
  `fecha_registro` date NOT NULL,
  `contador_prestamos` int DEFAULT '0',
  `codigo_informe` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_herramienta`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `herramienta`
--

LOCK TABLES `herramienta` WRITE;
/*!40000 ALTER TABLE `herramienta` DISABLE KEYS */;
INSERT INTO `herramienta` VALUES (35,'ascaed','sddas','Disponible','Manual','Bodega','Lote 1',1,'2025-10-25',0,NULL),(39,'hdysio','ss','Disponible','Manual','Bodega','Lote 1',2,'2025-10-28',0,NULL),(40,'hacha','madera','Disponible','Manual','Bodega','Lote 1',3,'2025-10-29',2,NULL),(44,'Martillo','Martillo de acero con mango antideslizante','Disponible','Manual','Bodega','Lote 1',3,'2025-11-05',0,NULL),(45,'Mia','Ingresa en buen estado','Disponible','Manual','Bodega','Lote 1',3,'2025-11-05',0,NULL),(64,'Metro','metro de 100 mtross','Disponible','Manual','Bodega','Lote 1',1,'2025-11-12',0,NULL),(83,'cuchillo','ss','Disponible','Manual','Bodega','Lote 1',4,'2025-11-15',1,NULL),(84,'mai','','Mantenimiento','Manual','Bodega','Lote 1',7,'2025-11-18',5,NULL),(94,'cuhcio','','Disponible','Manual','Bodega','Lote 1',3,'2025-11-24',6,NULL),(95,'pala','dn','Disponible','Manual','Bodega','Lote 1',5,'2025-11-25',4,NULL),(96,'cali','sxa','Mantenimiento','Manual','Bodega','Lote 1',4,'2025-11-27',0,NULL),(99,'MARTILLO','Martillo de acero forjado','Activo','Manual','Bodega A','LOTE-001',10,'2025-12-01',0,NULL),(100,'sas','asas','Disponible','Manual','Bodega','Lote 2',3,'2025-12-01',0,NULL),(101,'Mai','','Disponible','Manual','Bodega','Lote 2',4,'2025-12-01',0,NULL),(102,'caja','s','Disponible','Manual','Taller','Lote 2',4,'2025-12-04',1,'23232424'),(103,'dasd','sada','Disponible','Manual','Bodega','Lote 2',2,'2025-12-04',0,'03992323'),(105,'dczdc','dsfcs','Mantenimiento','Manual','Bodega','Lote 1',3,'2025-12-04',1,'564677'),(106,'ffgh','f','Mantenimiento','Manual','Bodega','Lote 1',4,'2025-12-04',0,'353454'),(108,'aa','f','Disponible','Manual','Bodega','Lote 2',2,'2025-12-04',0,'6575675'),(114,'ff','ws','Disponible','Manual','Bodega','Lote 1',3,'2025-12-04',1,'44232'),(116,'rfff','ss','Disponible','Manual','Bodega','Lote 1',2,'2025-12-05',0,'435434234333'),(117,'tijeras','xc','Disponible','Manual','Bodega','Lote 1',3,'2025-12-05',0,'3243232'),(118,'machete','sss','Disponible','Manual','Taller','Lote 1',3,'2025-12-05',2,'4352343'),(119,'paa','edas','Disponible','Manual','Bodega','Lote 1',3,'2025-12-07',4,'939238923'),(120,'sxa','vdf','No_disponible','Manual','Taller','Lote 1',1,'2025-12-07',0,'45654565'),(121,'sfs','vv','Disponible','Manual','Bodega','Lote 1',2,'2025-12-08',1,'43453454');
/*!40000 ALTER TABLE `herramienta` ENABLE KEYS */;
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
