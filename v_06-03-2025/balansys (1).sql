-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2025 at 11:42 AM
-- Server version: 8.0.27
-- PHP Version: 8.1.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `balansys`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `account` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(10) NOT NULL,
  `child_of` int NOT NULL COMMENT 'this key is for helping us establish a heirachical relationship'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business`
--

CREATE TABLE `business` (
  `business` int NOT NULL COMMENT 'primary key of business',
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Short business id entifier, e.g.,  mutall, beehope',
  `pin` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'KRA pin number',
  `title` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Long version of a bsuiness name, e.g., Mutall Investment Company Ltd',
  `tel` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Main business telephone number',
  `email` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Business email',
  `address` varchar(30) DEFAULT NULL COMMENT 'Business address'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `consumer`
--

CREATE TABLE `consumer` (
  `consumer` int NOT NULL COMMENT 'Primary key of business.',
  `business` int DEFAULT NULL,
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credit`
--

CREATE TABLE `credit` (
  `credit` int NOT NULL,
  `account` int NOT NULL,
  `journal entry` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `debit`
--

CREATE TABLE `debit` (
  `debit` int NOT NULL,
  `journal entries` int NOT NULL,
  `account` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `etr`
--

CREATE TABLE `etr` (
  `etr` int NOT NULL,
  `staff_name` varchar(12) NOT NULL COMMENT 'Supermarket staff name that served you',
  `teller_num` varchar(20) NOT NULL COMMENT 'This is a KRA number that is unique to the ETR used by a supermarket teller, e.g., KRAMW0123456789012345',
  `invoice_num` varchar(19) NOT NULL COMMENT 'This is the (CU?) invoice number that is recognized by KRA and is associated with the receipt (as opposed to the supplier reference number)',
  `supplier` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `folder`
--

CREATE TABLE `folder` (
  `folder` int NOT NULL,
  `full_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'the name of the source folder where the image is stored',
  `short_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `image` int NOT NULL COMMENT 'The primary key.',
  `full_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'The name of the actual image, e.g.,  CamScanner 08-31-2023 11.59_page-0001.jpg.\r\n .',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The actual time when the image was loaded.',
  `picture` mediumblob COMMENT 'The actual image',
  `folder` int DEFAULT NULL,
  `short_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `intern`
--

CREATE TABLE `intern` (
  `intern` int NOT NULL,
  `name` varchar(10) NOT NULL,
  `user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice` int NOT NULL,
  `je` int DEFAULT NULL,
  `num` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(50) NOT NULL,
  `amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `je`
--

CREATE TABLE `je` (
  `je` int NOT NULL,
  `date` date NOT NULL,
  `description` varchar(100) NOT NULL,
  `amount` double NOT NULL,
  `debit` int DEFAULT NULL,
  `credit` int DEFAULT NULL,
  `ref` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment` int NOT NULL,
  `ref` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `details` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` double NOT NULL,
  `je` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product` int NOT NULL COMMENT 'Primary key of an item',
  `code` varchar(15) DEFAULT NULL COMMENT 'Supermarket item code',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Name of the invoice item, e.g., cement,nails, mabati',
  `unit` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'Unit of measuring the item, e.g.,meter, piece,  kilo, ',
  `price` double DEFAULT NULL COMMENT 'Unit price of the item in Ks, e.g., 700 sh/bag, 1000 per she per piece, 200 sh/kg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `purchase` int NOT NULL,
  `ref` int NOT NULL COMMENT 'Local counter for this purchase',
  `qty` double DEFAULT NULL COMMENT 'The value of a quantity.',
  `product` int DEFAULT NULL,
  `receipt` int DEFAULT NULL,
  `unit` varchar(10) NOT NULL,
  `price` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `receipt`
--

CREATE TABLE `receipt` (
  `receipt` int NOT NULL,
  `date` date DEFAULT NULL COMMENT 'The date when goods were received',
  `ref` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'The invoice number of the receipt',
  `image` int DEFAULT NULL,
  `consumer` int NOT NULL,
  `supplier` int DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `description` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `je` int DEFAULT NULL,
  `vat` double DEFAULT NULL COMMENT 'VAT amount at 16% of the total sale',
  `etr` int DEFAULT NULL,
  `intern` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `supplier` int NOT NULL COMMENT 'Primary key ofsupplier.',
  `business` int DEFAULT NULL,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`account`),
  ADD UNIQUE KEY `id` (`code`),
  ADD KEY `account.child_of` (`child_of`);

--
-- Indexes for table `business`
--
ALTER TABLE `business`
  ADD PRIMARY KEY (`business`),
  ADD UNIQUE KEY `id` (`name`);

--
-- Indexes for table `consumer`
--
ALTER TABLE `consumer`
  ADD PRIMARY KEY (`consumer`),
  ADD UNIQUE KEY `id` (`name`) USING BTREE,
  ADD KEY `business` (`business`);

--
-- Indexes for table `credit`
--
ALTER TABLE `credit`
  ADD PRIMARY KEY (`credit`),
  ADD UNIQUE KEY `id` (`account`,`journal entry`),
  ADD KEY `credit.journal entries` (`journal entry`);

--
-- Indexes for table `debit`
--
ALTER TABLE `debit`
  ADD PRIMARY KEY (`debit`),
  ADD UNIQUE KEY `id` (`journal entries`,`account`),
  ADD KEY `debit.account` (`account`);

--
-- Indexes for table `etr`
--
ALTER TABLE `etr`
  ADD PRIMARY KEY (`etr`),
  ADD UNIQUE KEY `id` (`teller_num`),
  ADD KEY `etr_ibfk_1` (`supplier`);

--
-- Indexes for table `folder`
--
ALTER TABLE `folder`
  ADD PRIMARY KEY (`folder`),
  ADD UNIQUE KEY `id` (`full_name`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`image`),
  ADD UNIQUE KEY `id` (`full_name`),
  ADD KEY `folder` (`folder`);

--
-- Indexes for table `intern`
--
ALTER TABLE `intern`
  ADD PRIMARY KEY (`intern`),
  ADD UNIQUE KEY `id` (`name`),
  ADD KEY `user` (`user`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice`),
  ADD UNIQUE KEY `id` (`num`),
  ADD KEY `je` (`je`);

--
-- Indexes for table `je`
--
ALTER TABLE `je`
  ADD PRIMARY KEY (`je`),
  ADD UNIQUE KEY `id` (`ref`) USING BTREE,
  ADD KEY `journal_entries.debit` (`debit`),
  ADD KEY `journal_entries.credit` (`credit`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment`),
  ADD UNIQUE KEY `id` (`ref`),
  ADD KEY `je` (`je`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product`),
  ADD UNIQUE KEY `id` (`name`,`unit`) USING BTREE COMMENT 'kimbo/2k is a different item from kimbo/500g as they have diffrent prices',
  ADD UNIQUE KEY `id2` (`code`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`purchase`),
  ADD UNIQUE KEY `id` (`receipt`,`product`),
  ADD KEY `item` (`product`);

--
-- Indexes for table `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`receipt`),
  ADD UNIQUE KEY `id` (`image`) USING BTREE,
  ADD KEY `image` (`image`),
  ADD KEY `consumer` (`consumer`),
  ADD KEY `supplier` (`supplier`),
  ADD KEY `je` (`je`),
  ADD KEY `etr` (`etr`),
  ADD KEY `intern` (`intern`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`supplier`),
  ADD UNIQUE KEY `id` (`name`) USING BTREE,
  ADD KEY `business` (`business`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `account` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business`
--
ALTER TABLE `business`
  MODIFY `business` int NOT NULL AUTO_INCREMENT COMMENT 'primary key of business';

--
-- AUTO_INCREMENT for table `consumer`
--
ALTER TABLE `consumer`
  MODIFY `consumer` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key of business.';

--
-- AUTO_INCREMENT for table `credit`
--
ALTER TABLE `credit`
  MODIFY `credit` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `debit`
--
ALTER TABLE `debit`
  MODIFY `debit` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `etr`
--
ALTER TABLE `etr`
  MODIFY `etr` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `folder`
--
ALTER TABLE `folder`
  MODIFY `folder` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `image` int NOT NULL AUTO_INCREMENT COMMENT 'The primary key.';

--
-- AUTO_INCREMENT for table `intern`
--
ALTER TABLE `intern`
  MODIFY `intern` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `je`
--
ALTER TABLE `je`
  MODIFY `je` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key of an item';

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `purchase` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `receipt`
--
ALTER TABLE `receipt`
  MODIFY `receipt` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `supplier` int NOT NULL AUTO_INCREMENT COMMENT 'Primary key ofsupplier.';

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `account.child_of` FOREIGN KEY (`child_of`) REFERENCES `account` (`account`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `consumer`
--
ALTER TABLE `consumer`
  ADD CONSTRAINT `consumer_ibfk_1` FOREIGN KEY (`business`) REFERENCES `business` (`business`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `credit`
--
ALTER TABLE `credit`
  ADD CONSTRAINT `credit.account` FOREIGN KEY (`account`) REFERENCES `account` (`account`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `credit.journal entries` FOREIGN KEY (`journal entry`) REFERENCES `je` (`je`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `debit`
--
ALTER TABLE `debit`
  ADD CONSTRAINT `debit.account` FOREIGN KEY (`account`) REFERENCES `account` (`account`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `debit.journal entry` FOREIGN KEY (`journal entries`) REFERENCES `je` (`je`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `etr`
--
ALTER TABLE `etr`
  ADD CONSTRAINT `etr_ibfk_1` FOREIGN KEY (`supplier`) REFERENCES `supplier` (`supplier`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_ibfk_1` FOREIGN KEY (`folder`) REFERENCES `folder` (`folder`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `intern`
--
ALTER TABLE `intern`
  ADD CONSTRAINT `intern_ibfk_1` FOREIGN KEY (`user`) REFERENCES `mutall_users`.`user` (`user`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`je`) REFERENCES `je` (`je`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `je`
--
ALTER TABLE `je`
  ADD CONSTRAINT `journal_entries.credit` FOREIGN KEY (`credit`) REFERENCES `credit` (`credit`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `journal_entries.debit` FOREIGN KEY (`debit`) REFERENCES `debit` (`debit`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`je`) REFERENCES `je` (`je`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`product`) REFERENCES `product` (`product`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `purchase_ibfk_2` FOREIGN KEY (`receipt`) REFERENCES `receipt` (`receipt`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `receipt_ibfk_1` FOREIGN KEY (`image`) REFERENCES `image` (`image`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `receipt_ibfk_3` FOREIGN KEY (`consumer`) REFERENCES `consumer` (`consumer`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `receipt_ibfk_4` FOREIGN KEY (`supplier`) REFERENCES `supplier` (`supplier`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `receipt_ibfk_5` FOREIGN KEY (`je`) REFERENCES `je` (`je`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `receipt_ibfk_6` FOREIGN KEY (`etr`) REFERENCES `etr` (`etr`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `receipt_ibfk_7` FOREIGN KEY (`intern`) REFERENCES `intern` (`intern`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `supplier`
--
ALTER TABLE `supplier`
  ADD CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`business`) REFERENCES `business` (`business`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
