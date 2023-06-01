DROP DATABASE IF EXISTS tb;

create database tb;

use tb;

CREATE TABLE `tb` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `status` int(1) NOT NULL,
  `username` varchar(20) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MYISAM DEFAULT CHARSET=utf8;

DELIMITER $$

DROP PROCEDURE IF EXISTS addData;$$

CREATE  PROCEDURE `addData`(IN n int) 
BEGIN
  DECLARE i INT DEFAULT 1;
	WHILE (i <= n/2) DO
		INSERT into tb.tb(id,title,status,username,date) values(i,'这是文本',1,'admin','2022-12-01');
		set i=i+1;
	END WHILE;
  WHILE (i <= n) DO
		INSERT into tb.tb(id,title,status,username,date) values(i,'这是文本',0,'admin','2022-12-01');
		set i=i+1;
	END WHILE;
END; $$

CALL addData(200);$$