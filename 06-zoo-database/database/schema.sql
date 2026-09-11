-- Extracted structure only; no original rows or routines.
CREATE DATABASE IF NOT EXISTS zoo;
USE zoo;
SET FOREIGN_KEY_CHECKS=0;
CREATE TABLE `animal_care` (
  `AnimalID` int(11) NOT NULL,
  `EmployeeID` int(11) NOT NULL,
  `DateOfCare` date NOT NULL,
  `ZoneID` int(11) NOT NULL,
  PRIMARY KEY (`AnimalID`,`EmployeeID`),
  KEY `fk_animal` (`AnimalID`,`ZoneID`),
  KEY `fk_employee` (`EmployeeID`,`ZoneID`),
  CONSTRAINT `fk_animal` FOREIGN KEY (`AnimalID`, `ZoneID`) REFERENCES `animals` (`AnimalID`, `ZoneID`) ON UPDATE CASCADE,
  CONSTRAINT `fk_employee` FOREIGN KEY (`EmployeeID`, `ZoneID`) REFERENCES `employees` (`EmployeeID`, `ZoneID`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `animals` (
  `AnimalID` int(11) NOT NULL AUTO_INCREMENT,
  `Species` varchar(50) NOT NULL,
  `Nickname` varchar(50) DEFAULT NULL,
  `Subspecies` varchar(50) DEFAULT NULL,
  `Gender` enum('Male','Female') NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Origin` varchar(100) NOT NULL,
  `Details` text NOT NULL,
  `Image` longblob,
  `CategoryID` int(11) NOT NULL,
  `ZoneID` int(11) NOT NULL,
  PRIMARY KEY (`AnimalID`),
  UNIQUE KEY `AnimalID` (`AnimalID`,`ZoneID`),
  UNIQUE KEY `Nickname_UNIQUE` (`Nickname`),
  KEY `animal_ibfk_1` (`CategoryID`),
  KEY `animal_ibfk_2` (`ZoneID`),
  CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`),
  CONSTRAINT `animals_ibfk_2` FOREIGN KEY (`ZoneID`) REFERENCES `zones` (`ZoneID`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8;

CREATE TABLE `audit_log` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `TableName` varchar(50) NOT NULL,
  `OperationType` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `ActionDetails` text NOT NULL,
  `ActionTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ActionType` varchar(50) NOT NULL DEFAULT 'GENERAL',
  PRIMARY KEY (`LogID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `DietType` varchar(50) NOT NULL,
  `HabitatType` varchar(50) NOT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL DEFAULT 'Unknown',
  `LastName` varchar(50) NOT NULL,
  `Position` varchar(50) NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Address` text NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `Nationality` varchar(30) NOT NULL,
  `ZoneID` int(11) NOT NULL,
  PRIMARY KEY (`EmployeeID`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `PhoneNumber_UNIQUE` (`PhoneNumber`),
  UNIQUE KEY `FirstName` (`FirstName`,`LastName`),
  UNIQUE KEY `EmployeeID` (`EmployeeID`,`ZoneID`),
  KEY `fk_zone` (`ZoneID`),
  CONSTRAINT `fk_zone` FOREIGN KEY (`ZoneID`) REFERENCES `zones` (`ZoneID`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

CREATE TABLE `favorite` (
  `UserID` int(11) NOT NULL,
  `AnimalID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`,`AnimalID`),
  KEY `AnimalID` (`AnimalID`),
  CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`AnimalID`) REFERENCES `animals` (`AnimalID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Firstname` varchar(50) NOT NULL,
  `Lastname` varchar(50) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `Role` enum('Admin','User') NOT NULL DEFAULT 'User',
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `unique_name` (`Firstname`,`Lastname`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

CREATE TABLE `zones` (
  `ZoneID` int(11) NOT NULL AUTO_INCREMENT,
  `ZoneName` varchar(50) NOT NULL,
  `AnimalCapacity` int(11) NOT NULL,
  `EmployeeCapacity` int(11) NOT NULL,
  PRIMARY KEY (`ZoneID`),
  UNIQUE KEY `ZoneName_UNIQUE` (`ZoneName`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS=1;
