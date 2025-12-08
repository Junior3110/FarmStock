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
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `cargo` varchar(255) NOT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `numero_documento` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `numero_documento` (`numero_documento`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (22,'Andrés','Gómez','andres.gomez@email.com','3216549870','Instructor','CC','456123789','Cc321789!','2025-09-09 18:58:54'),(24,'miguel','torres','miguel.torres@email.com','3104567892','instructor','CC','789456123','Mt123789!','2025-09-09 19:12:40'),(25,'juan','pérez','juan.perez@example.com','3101234567','aprendiz','CC','123456789','Password@123','2025-09-10 19:11:00'),(26,'césar','díaz','cesardiazq10@gmail.com','3126082932','aprendiz','CC','1092525927','Password123*','2025-09-10 19:21:23'),(33,'laura','martínez','lauramartinez@example.com','3204567890','instructor','TI','1023456789','ClaveSegura2024*','2025-09-10 19:44:21'),(41,'César','Díaz','kaka@gmail.com','3126082932','aprendiz','CC','82432302302','Cesar1234!','2025-09-10 20:49:48'),(42,'carol','cardona','carol@gmail.com','239829382','instructor','CC','38293824833','Carol12345!','2025-09-10 20:52:04'),(43,'Anyelina','Ascanio','anyelina@gmail.com','3128938877','instructor','CC','2893938328','Anyelina123!','2025-09-11 02:21:20'),(44,'Freddy','Albarracin','fredddy12@gmial.com','3948284733','administrador','CC','009390293843','Freddy1234!','2025-09-11 12:51:51'),(45,'Luigui','benitez','luigui@gmail.com','849239823','aprendiz','CC','1127056627','Luigui123!','2025-09-18 14:50:10'),(46,'Eduardo','Diaz','eduardo@gmail.com','83923023893','administrador','CC','3903939390','Eduardo1234!','2025-10-24 12:09:36'),(47,'wadawd','dwadwad','dwadadwa@gmail.com','32132131','instructor','CC','3213132312','Mama1234!','2025-11-12 15:11:01'),(48,'Cesar','Diaz','juniordiazq10@gmail.com','3103550253','administrador','CC','556634212','Junior1234!','2025-11-13 20:54:38'),(51,'clifor','diaz','clifor@gmail.com','3120393821','administrador','CC','983293894223','Clifor1234!','2025-11-20 20:46:16'),(53,'Akaza','Muzan','akaza@gmail.com','281932811','instructor','CC','87382903','Akaza1234!','2025-11-25 01:52:18'),(54,'Tomioka','tanjiro','tomioka@gmail.com','21321322132','instructor','TI','8182913212','Tomioka1234!','2025-11-25 01:54:02'),(55,'Mario','Castro','mario@gmail.com','219281921','administrador','CC','902038219','Mario1234!','2025-11-29 14:16:18'),(56,'heidy daniela','rosas lizarazo','leepkimora@gmail.com','3208119728','administrador','CC','1091355580','Daniela1234!','2025-12-02 13:11:07'),(57,'meliodas','csfsdfds','meliodas@gmail.com','73823923923','instructor','CC','1092525922','Meliodas1234@','2025-12-08 15:10:58'),(58,'cdsfsdf','dcsfsdf','melascula@gmail.com','344534534','celador','CC','5434543534','Melascula1234@','2025-12-08 15:14:38');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
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
