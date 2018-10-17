-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DELIMITER ;;

DROP PROCEDURE IF EXISTS `CommentGet`;;
CREATE PROCEDURE `CommentGet`(IN `_id` int unsigned)
BEGIN
  SELECT      `c`.`id`, `c`.`time`, `c`.`text`, `u`.`title` AS `user`, `a`.`title` AS `article`, `c`.`status`
  FROM        `comment` AS `c`
  INNER JOIN  `article` AS `a` ON `a`.`id` = `c`.`article`
  INNER JOIN  `user` AS `u` ON `u`.`id` = `c`.`user`
  WHERE       `c`.`id` = _id;
END;;

DROP PROCEDURE IF EXISTS `CommentGetIndex`;;
CREATE PROCEDURE `CommentGetIndex`(IN `params` json)
BEGIN
  DECLARE _dateBegin DATETIME;
  DECLARE _dateEnd DATETIME;
  DECLARE _text VARCHAR(16);
  DECLARE _article VARCHAR(16);
  DECLARE _user VARCHAR(16);
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _orderField VARCHAR(32) DEFAULT 'id';
  DECLARE _orderDirection INTEGER DEFAULT 1;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.dateBegin') <> 'NULL') THEN SET _dateBegin = CONCAT(params->>'$.dateBegin', ' 00:00:00'); END IF;
  IF (JSON_TYPE(params->'$.dateEnd') <> 'NULL')   THEN SET _dateEnd = CONCAT(params->>'$.dateEnd', ' 23:59:59'); END IF;
  IF (JSON_TYPE(params->'$.text') <> 'NULL')      THEN SET _text = params->>'$.text'; END IF;
  IF (JSON_TYPE(params->'$.article') <> 'NULL')   THEN SET _article = params->>'$.article'; END IF;
  IF (JSON_TYPE(params->'$.user') <> 'NULL')      THEN SET _user = params->>'$.user'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL')   THEN SET _status = params->'$._status'; END IF;
  SET _orderField = params->>'$._orderField';
  SET _orderDirection = params->'$._orderDirection';
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS
         `c`.`id`, `c`.`time`, `c`.`text`, `a`.`title` AS 'article', `u`.`title` AS 'user', `c`.`status`
    FROM `comment` AS `c`
    INNER JOIN `article` AS `a` ON `a`.`id` = `c`.`article`
    INNER JOIN `user` AS `u` ON `u`.`id` = `c`.`user`
    WHERE `c`.`id` > 0
      AND (_dateBegin IS NULL OR `c`.`time`  >= _dateBegin)
      AND (_dateEnd   IS NULL OR `c`.`time`  <= _dateEnd)
      AND (_text      IS NULL OR `c`.`text`  LIKE CONCAT('%', _text, '%'))
      AND (_article   IS NULL OR `a`.`title` LIKE CONCAT('%', _article, '%'))
      AND (_user      IS NULL OR `u`.`title` LIKE CONCAT('%', _user, '%'))
      AND (_status    IS NULL OR `c`.`status` = _status)
    ORDER BY
      CASE WHEN _orderField = 'time' AND _orderDirection = 1 THEN `c`.`time` END ASC,
      CASE WHEN _orderField = 'time' AND _orderDirection = 0 THEN `c`.`time` END DESC
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `CommentSet`;;
CREATE PROCEDURE `CommentSet`(IN `params` json)
BEGIN
  DECLARE _id INT(3) UNSIGNED;
  DECLARE _text VARCHAR(256);

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
    SET _id = params->'$.id';
  END IF;
  SET _text = params->>'$.text';

  IF (_id IS NOT NULL) THEN
    UPDATE `comment` SET `text` = _text WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `comment` (`text`) VALUES (_text);
  END IF;
END;;

DROP PROCEDURE IF EXISTS `CommentUnset`;;
CREATE PROCEDURE `CommentUnset`(IN `_id` tinyint unsigned)
BEGIN
  #DELETE FROM `comment` WHERE `id` = _id;
  UPDATE `comment` SET `status` = (1 - `status`) WHERE `id` = _id;
END;;

DROP PROCEDURE IF EXISTS `PageGet`;;
CREATE PROCEDURE `PageGet`(IN `_id` int unsigned)
BEGIN
  SELECT      `p`.`id`, `p`.`time`, `p`.`title`, `p`.`description`, `p`.`text`, `p`.`image`, `p`.`alias`,
              `u`.`title` AS `user`, `p`.`status`
  FROM        `page` AS `p`
  INNER JOIN  `user` AS `u` ON `u`.`id` = `p`.`user`
  WHERE       `p`.`id` = _id;
END;;

DROP PROCEDURE IF EXISTS `PageGetIndex`;;
CREATE PROCEDURE `PageGetIndex`(IN `params` json)
BEGIN
  DECLARE _title VARCHAR(32);
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN SET _status = params->'$._status'; END IF;
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS
         `p`.`id`, `p`.`time`, `p`.`title`, `p`.`description`, `p`.`text`, `p`.`image`,
         `u`.`title` AS 'user', `p`.`status`
    FROM `page` AS `p`
    INNER JOIN `user` AS `u` ON `u`.`id` = `p`.`user`
    WHERE `p`.`id` > 0
      AND (_title       IS NULL OR `p`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_status      IS NULL OR `p`.`status` = _status)
    ORDER BY `p`.`title`
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `PageSet`;;
CREATE PROCEDURE `PageSet`(IN `params` json)
BEGIN
  DECLARE _id TINYINT(3) UNSIGNED;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(128);
  DECLARE _text TEXT;
  DECLARE _image VARCHAR(32);
  DECLARE _alias VARCHAR(32);
  DECLARE _user TINYINT(3) UNSIGNED;

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
    SET _id = params->'$.id';
  END IF;
  SET _title = params->>'$.title';
  IF (JSON_TYPE(params->'$.description') <> 'NULL') THEN
    SET _description = params->>'$.description';
  END IF;
  IF (JSON_TYPE(params->'$.text') <> 'NULL') THEN
    SET _text = params->>'$.text';
  END IF;
  IF (JSON_TYPE(params->'$.image') <> 'NULL') THEN
    SET _image = params->>'$.image';
  END IF;
  SET _alias = params->>'$.alias';
  SET _user = params->'$.user';

  IF (_id IS NOT NULL) THEN
    UPDATE  `page` 
      SET   `title` = _title, `description` = _description, `text` = _text,
            `image` = _image, `alias` = _alias, `user` = _user
      WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `page` (`title`, `description`, `text`, `image`, `alias`, `user`) 
      VALUES (_title, _description, _text, _image, _alias, _user);
  END IF;
END;;

DROP PROCEDURE IF EXISTS `PageUnset`;;
CREATE PROCEDURE `PageUnset`(IN `_id` tinyint unsigned)
BEGIN
  #DELETE FROM `page` WHERE `id` = _id;
  UPDATE `page` SET `status` = (1 - `status`) WHERE `id` = _id;
END;;

DROP PROCEDURE IF EXISTS `RoleGetIndex`;;
CREATE PROCEDURE `RoleGetIndex`()
BEGIN 
  SELECT `id`, `title`, `description` FROM `role` ORDER BY `id` DESC;
END;;

DROP PROCEDURE IF EXISTS `UserAuthorize`;;
CREATE PROCEDURE `UserAuthorize`(IN `_email` varchar(32) CHARACTER SET 'utf8mb4', IN `_password` varchar(32) CHARACTER SET 'utf8mb4')
BEGIN 
  DECLARE _id INTEGER UNSIGNED DEFAULT NULL;
  DECLARE _count INTEGER UNSIGNED;
  DECLARE _token VARCHAR(32);


  SELECT `id` INTO _id FROM `user` WHERE `email` = _email AND `password` = _password;

  IF (_id IS NOT NULL) THEN
    SET _token = MD5(CONCAT(_id, NOW(), _email, _password));
    UPDATE `user` SET `token` = _token WHERE `id` = _id;
    SELECT _id AS 'id', _token AS 'token';
  END IF;
END;;

DROP PROCEDURE IF EXISTS `UserGet`;;
CREATE PROCEDURE `UserGet`(IN `_id` int unsigned)
BEGIN 
  SELECT `id`, `time`, `title`, `description`, `phone`, `skype`, `email`, `image`, `role`, `alias`, `status`
  FROM `user` WHERE `id` = _id;
END;;

DROP PROCEDURE IF EXISTS `UserGetIndex`;;
CREATE PROCEDURE `UserGetIndex`(IN `params` json)
BEGIN
  DECLARE _dateBegin DATETIME;
  DECLARE _dateEnd DATETIME;
  DECLARE _title VARCHAR(32);
  DECLARE _roleID INTEGER UNSIGNED;
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _orderField VARCHAR(32) DEFAULT 'id';
  DECLARE _orderDirection INTEGER DEFAULT 1;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.dateBegin') <> 'NULL') THEN SET _dateBegin = CONCAT(params->>'$.dateBegin', ' 00:00:00'); END IF;
  IF (JSON_TYPE(params->'$.dateEnd') <> 'NULL') THEN SET _dateEnd = CONCAT(params->>'$.dateEnd', ' 23:59:59'); END IF;
  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$.roleID') <> 'NULL') THEN SET _roleID = params->'$.roleID'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN SET _status = params->'$._status'; END IF;
  SET _orderField = params->>'$._orderField';
  SET _orderDirection = params->'$._orderDirection';
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS
         `u`.`id`, `u`.`time`, `u`.`title`, `u`.`phone`, `u`.`skype`, `u`.`email`,
         `u`.`image`, `r`.`title` AS 'role', `u`.`status`
    FROM `user` AS `u`
    INNER JOIN `role` AS `r` ON `r`.`id` = `u`.`role`
    WHERE `u`.`id` > 0
      AND (_dateBegin IS NULL OR `u`.`time` >= _dateBegin)
      AND (_dateEnd   IS NULL OR `u`.`time` <= _dateEnd)
      AND (_title     IS NULL OR `u`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_roleID    IS NULL OR `r`.`id` = _roleID)
      AND (_status    IS NULL OR `u`.`status` = _status)
    ORDER BY
      CASE WHEN _orderField = 'time'   AND _orderDirection = 1 THEN `u`.`time`   END ASC,
      CASE WHEN _orderField = 'time'   AND _orderDirection = 0 THEN `u`.`time`   END DESC,
      CASE WHEN _orderField = 'title'  AND _orderDirection = 1 THEN `u`.`title`  END ASC,
      CASE WHEN _orderField = 'title'  AND _orderDirection = 0 THEN `u`.`title`  END DESC,
      CASE WHEN _orderField = 'roleID' AND _orderDirection = 1 THEN `r`.`id`     END ASC, `u`.`title` ASC,
      CASE WHEN _orderField = 'roleID' AND _orderDirection = 0 THEN `r`.`id`     END DESC, `u`.`title` ASC
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `UserSet`;;
CREATE PROCEDURE `UserSet`(IN `params` json)
BEGIN
  DECLARE _id INTEGER UNSIGNED;
  #DECLARE _time DATETIME;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(128);
  DECLARE _phone VARCHAR(32);
  DECLARE _skype VARCHAR(32);
  DECLARE _email VARCHAR(32);
  DECLARE _password VARCHAR(32);
  DECLARE _image VARCHAR(32);
  DECLARE _role TINYINT(1) UNSIGNED;
  DECLARE _alias VARCHAR(32);

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
    SET _id = params->'$.id';
  END IF;
  #SET _time = params->>'$.time';
  SET _title = params->>'$.title';
  IF (JSON_TYPE(params->'$.description') <> 'NULL') THEN
    SET _description = params->>'$.description';
  END IF;
  IF (JSON_TYPE(params->'$.phone') <> 'NULL') THEN
    SET _phone = params->>'$.phone';
  END IF;
  IF (JSON_TYPE(params->'$.skype') <> 'NULL') THEN
    SET _skype = params->>'$.skype';
  END IF;
  SET _email = params->>'$.email';
  IF (JSON_TYPE(params->'$.password') <> 'NULL') THEN
    SET _password = params->>'$.password';
  END IF;
  IF (JSON_TYPE(params->'$.image') <> 'NULL') THEN
    SET _image = params->>'$.image';
  END IF;
  SET _role = params->'$.role';
  SET _alias = params->>'$.alias';

  IF (_id IS NOT NULL) THEN
    UPDATE  `user` 
      SET   `title` = _title, `description` = _description, `phone` = _phone, `skype` = _skype,
            `email` = _email, `image` = _image, `role` = _role, `alias` = _alias
      WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `user` (`title`, `description`, `phone`, `skype`, `email`, `image`, `role`, `alias`) 
      VALUES (_title, _description, _phone, _skype, _email,  _image, _role, _alias);
    SET _id = LAST_INSERT_ID();
  END IF;

  IF (_password IS NOT NULL) THEN
    UPDATE `user` SET `password` = MD5(_password) WHERE `id` = _id;
  END IF;
END;;

DROP PROCEDURE IF EXISTS `UserUnset`;;
CREATE PROCEDURE `UserUnset`(IN `_id` tinyint unsigned)
BEGIN
  DECLARE _count INTEGER UNSIGNED DEFAULT 0;

  SELECT COUNT(*) INTO _count FROM `article` WHERE `user` = _id;
  SELECT COUNT(*) + _count INTO _count FROM `tag` WHERE `user` = _id;
  SELECT COUNT(*) + _count INTO _count FROM `comment` WHERE `user` = _id;
  SELECT COUNT(*) + _count INTO _count FROM `page` WHERE `user` = _id;

  IF (_count = 0) THEN
    DELETE FROM `user` WHERE `id` = _id;
  ELSE
    UPDATE `user` SET `status` = (1 - `status`) WHERE `id` = _id;
  END IF;

END;;

DROP PROCEDURE IF EXISTS `_GetFoundRows`;;
CREATE PROCEDURE `_GetFoundRows`()
BEGIN 
  SELECT FOUND_ROWS() AS 'foundRows';
END;;

DELIMITER ;

-- 2018-10-17 20:50:59