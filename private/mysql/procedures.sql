-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DELIMITER ;;

<<<<<<< HEAD
DROP PROCEDURE IF EXISTS `PageGetIndex`;;
CREATE PROCEDURE `PageGetIndex`(IN `_params` json)
BEGIN
  DECLARE _dateBegin DATETIME;
  DECLARE _dateEnd DATETIME;
  DECLARE _title VARCHAR(32);
  DECLARE _user TINYINT(3) UNSIGNED;
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _orderField VARCHAR(32) DEFAULT 'id';
  DECLARE _orderDirection INTEGER DEFAULT 1;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(_params->'$.dateBegin') <> 'NULL') THEN
    SET _dateBegin = CONCAT(_params->>'$.dateBegin', ' 00:00:00');
  END IF;
  IF (JSON_TYPE(_params->'$.dateEnd') <> 'NULL') THEN
    SET _dateEnd = CONCAT(_params->>'$.dateEnd', ' 23:59:59');
  END IF;
  IF (JSON_TYPE(_params->'$.title') <> 'NULL') THEN
    SET _title = _params->>'$.title';
  END IF;
  IF (JSON_TYPE(_params->'$.user') <> 'NULL') THEN
    SET _user = _params->>'$.user';
  END IF;
  IF (JSON_TYPE(_params->'$.status') <> 'NULL') THEN
    SET _status = _params->'$.status';
  END IF;
  SET _orderField = _params->>'$.orderField';
  SET _orderDirection = _params->'$.orderDirection';
  SET _rowsOffset = _params->'$.rowsOffset';
  SET _rowsLimit = _params->'$.rowsLimit';

  SELECT SQL_CALC_FOUND_ROWS 
    `p`.`id`, `p`.`time`, `p`.`title`, `p`.`description`, `u`.`id` AS 'userID', `u`.`title` AS 'userTitle', `p`.`status`
    FROM `page` AS `p`
    INNER JOIN `user` AS `u` ON `u`.`id` = `p`.`user`
    WHERE `p`.`id` > 0
      AND (_dateBegin IS NULL OR `p`.`time` >= _dateBegin)
      AND (_dateEnd   IS NULL OR `p`.`time` <= _dateEnd)
      AND (_title     IS NULL OR `p`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_user      IS NULL OR `p`.`user` = _user)
      AND (_status    IS NULL OR `p`.`status` = _status)
    ORDER BY
      CASE WHEN _orderField = 'id'          AND _orderDirection = 1 THEN `p`.`id`     END ASC,
      CASE WHEN _orderField = 'id'          AND _orderDirection = 0 THEN `p`.`id`     END DESC,
      CASE WHEN _orderField = 'time'        AND _orderDirection = 1 THEN `p`.`time`   END ASC,
      CASE WHEN _orderField = 'time'        AND _orderDirection = 0 THEN `p`.`time`   END DESC,
      CASE WHEN _orderField = 'title'       AND _orderDirection = 1 THEN `p`.`title`  END ASC,
      CASE WHEN _orderField = 'title'       AND _orderDirection = 0 THEN `p`.`title`  END DESC,
      CASE WHEN _orderField = 'user'        AND _orderDirection = 1 THEN `u`.`id`     END ASC,
      CASE WHEN _orderField = 'user'        AND _orderDirection = 0 THEN `u`.`id`     END DESC,
      CASE WHEN _orderField = 'status'      AND _orderDirection = 1 THEN `p`.`status` END ASC,
      CASE WHEN _orderField = 'status'      AND _orderDirection = 0 THEN `p`.`status` END DESC
    LIMIT _rowsOffset, _rowsLimit; 
END;;

=======
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
DROP PROCEDURE IF EXISTS `RoleGetIndex`;;
CREATE PROCEDURE `RoleGetIndex`()
BEGIN 
  SELECT `id`, `title`, `description` FROM `role` ORDER BY `id` DESC;
END;;

DROP PROCEDURE IF EXISTS `UserAuthorize`;;
CREATE PROCEDURE `UserAuthorize`(IN `params` json)
BEGIN 
  DECLARE _login VARCHAR(32);
  DECLARE _password VARCHAR(32);
  DECLARE _id INTEGER UNSIGNED;
  DECLARE _count INTEGER UNSIGNED;
  DECLARE _token VARCHAR(32);

  SET _login = params->>'$.login';
  SET _password = params->>'$.password';

  SELECT SQL_CALC_FOUND_ROWS `id` INTO _id FROM `user` WHERE `email` = _login AND `password` = _password;

  SELECT FOUND_ROWS() INTO _count;

  IF (_count = 1) THEN
    SET _token = MD5(CONCAT(_id, NOW(), _login, _password));
    UPDATE `user` SET `token` = _token WHERE `id` = _id;
    SELECT _token AS 'token';
  END IF;
END;;

DROP PROCEDURE IF EXISTS `UserGet`;;
CREATE PROCEDURE `UserGet`(IN `_id` int unsigned)
BEGIN 
<<<<<<< HEAD
  SELECT `u`.`id`, `u`.`time`, `u`.`title`, `u`.`description`, `u`.`phone`, `u`.`skype`, `u`.`email`,
         `u`.`image`, `r`.`id` AS 'roleID', `r`.`title` AS 'roleTitle', `u`.`status`
=======
  SELECT `u`.`id`, `u`.`time`, `u`.`title`, `u`.`email`, `r`.`id` AS 'roleID', `r`.`title` AS 'roleTitle', `u`.`status`
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
    FROM `user` `u`
    INNER JOIN `role` `r` ON  `u`.`role` = `r`.`id`
    WHERE `u`.`id` = _id;
END;;

DROP PROCEDURE IF EXISTS `UserGetIndex`;;
CREATE PROCEDURE `UserGetIndex`(IN `params` json)
BEGIN
  DECLARE _dateBegin DATETIME DEFAULT NULL;
  DECLARE _dateEnd DATETIME DEFAULT NULL;
  DECLARE _title VARCHAR(32) DEFAULT NULL;
  DECLARE _email VARCHAR(32) DEFAULT NULL;
<<<<<<< HEAD
  DECLARE _phone VARCHAR(32) DEFAULT NULL;
  DECLARE _skype VARCHAR(32) DEFAULT NULL;
=======
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
  DECLARE _roleID INTEGER UNSIGNED DEFAULT NULL;
  DECLARE _status TINYINT(1) UNSIGNED DEFAULT NULL;
  DECLARE _orderField VARCHAR(32) DEFAULT 'id';
  DECLARE _orderDirection INTEGER DEFAULT 1;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.dateBegin') <> 'NULL') THEN
    SET _dateBegin = CONCAT(params->>'$.dateBegin', ' 00:00:00');
  END IF;
  IF (JSON_TYPE(params->'$.dateEnd') <> 'NULL') THEN
    SET _dateEnd = CONCAT(params->>'$.dateEnd', ' 23:59:59');
  END IF;
  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN
    SET _title = params->>'$.title';
  END IF;
<<<<<<< HEAD
  IF (JSON_TYPE(params->'$.phone') <> 'NULL') THEN
    SET _phone = params->>'$.phone';
  END IF;
  IF (JSON_TYPE(params->'$.skype') <> 'NULL') THEN
    SET _skype = params->>'$.skype';
  END IF;
=======
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
  IF (JSON_TYPE(params->'$.email') <> 'NULL') THEN
    SET _email = params->>'$.email';
  END IF;
  IF (JSON_TYPE(params->'$.roleID') <> 'NULL') THEN
    SET _roleID = params->'$.roleID';
  END IF;
  IF (JSON_TYPE(params->'$.status') <> 'NULL') THEN
    SET _status = params->'$.status';
  END IF;
  SET _orderField = params->>'$.orderField';
  SET _orderDirection = params->'$.orderDirection';
  SET _rowsOffset = params->'$.rowsOffset';
  SET _rowsLimit = params->'$.rowsLimit';

<<<<<<< HEAD
  SELECT SQL_CALC_FOUND_ROWS
         `u`.`id`, `u`.`time`, `u`.`title`, `u`.`phone`, `u`.`skype`, `u`.`email`,
         `u`.`image`, `r`.`id` AS 'roleID', `r`.`title` AS 'roleTitle', `u`.`status`
=======
  SELECT SQL_CALC_FOUND_ROWS `u`.`id`, `u`.`time`, `u`.`title`, `u`.`email`, `r`.`id` AS 'roleID', `r`.`title` AS 'roleTitle', `u`.`status`
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
    FROM `user` AS `u`
    INNER JOIN `role` AS `r` ON `r`.`id` = `u`.`role`
    WHERE `u`.`id` > 0
      AND (_dateBegin IS NULL OR `u`.`time` >= _dateBegin)
      AND (_dateEnd   IS NULL OR `u`.`time` <= _dateEnd)
      AND (_title     IS NULL OR `u`.`title` LIKE CONCAT('%', _title, '%'))
<<<<<<< HEAD
      AND (_phone     IS NULL OR `u`.`phone` LIKE CONCAT('%', _phone, '%'))
      AND (_skype     IS NULL OR `u`.`skype` LIKE CONCAT('%', _skype, '%'))
=======
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
      AND (_email     IS NULL OR `u`.`email` LIKE CONCAT('%', _email, '%'))
      AND (_roleID    IS NULL OR `r`.`id` = _roleID)
      AND (_status    IS NULL OR `u`.`status` = _status)
    ORDER BY
      CASE WHEN _orderField = 'id'     AND _orderDirection = 1 THEN `u`.`id`     END ASC,
      CASE WHEN _orderField = 'id'     AND _orderDirection = 0 THEN `u`.`id`     END DESC,
      CASE WHEN _orderField = 'time'   AND _orderDirection = 1 THEN `u`.`time`   END ASC,
      CASE WHEN _orderField = 'time'   AND _orderDirection = 0 THEN `u`.`time`   END DESC,
      CASE WHEN _orderField = 'title'  AND _orderDirection = 1 THEN `u`.`title`  END ASC,
      CASE WHEN _orderField = 'title'  AND _orderDirection = 0 THEN `u`.`title`  END DESC,
<<<<<<< HEAD
=======
      CASE WHEN _orderField = 'email'  AND _orderDirection = 1 THEN `u`.`email`  END ASC,
      CASE WHEN _orderField = 'email'  AND _orderDirection = 0 THEN `u`.`email`  END DESC,
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
      CASE WHEN _orderField = 'roleID' AND _orderDirection = 1 THEN `r`.`id`     END ASC,
      CASE WHEN _orderField = 'roleID' AND _orderDirection = 0 THEN `r`.`id`     END DESC,
      CASE WHEN _orderField = 'status' AND _orderDirection = 1 THEN `u`.`status` END ASC,
      CASE WHEN _orderField = 'status' AND _orderDirection = 0 THEN `u`.`status` END DESC
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `UserSet`;;
CREATE PROCEDURE `UserSet`(IN `params` json)
<<<<<<< HEAD
BEGIN
  DECLARE _id INTEGER UNSIGNED;
  DECLARE _time DATETIME;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(128);
  DECLARE _phone VARCHAR(32);
  DECLARE _skype VARCHAR(32);
  DECLARE _email VARCHAR(32);
  DECLARE _password VARCHAR(32);
  DECLARE _image VARCHAR(32);
=======
BEGIN 
  DECLARE _id INTEGER UNSIGNED;
  DECLARE _time DATETIME;
  DECLARE _title VARCHAR(32);
  DECLARE _email VARCHAR(32);
  DECLARE _password VARCHAR(32);
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
  DECLARE _roleID TINYINT(1) UNSIGNED;

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
    SET _id = params->'$.id';
  END IF;
  SET _time = params->>'$.time';
  SET _title = params->>'$.title';
<<<<<<< HEAD
  IF (JSON_TYPE(params->'$.description') <> 'NULL') THEN
    SET _description = params->>'$.description';
  END IF;
  IF (JSON_TYPE(params->'$.phone') <> 'NULL') THEN
    SET _phone = params->>'$.phone';
  END IF;
  IF (JSON_TYPE(params->'$.skype') <> 'NULL') THEN
    SET _skype = params->>'$.skype';
  END IF;
=======
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
  SET _email = params->>'$.email';
  IF (JSON_TYPE(params->'$.password') <> 'NULL') THEN
    SET _password = params->>'$.password';
  END IF;
<<<<<<< HEAD
  IF (JSON_TYPE(params->'$.image') <> 'NULL') THEN
    SET _image = params->>'$.image';
  END IF;
  SET _roleID = params->'$.roleID';

  IF (_id IS NOT NULL) THEN
    UPDATE  `user` 
      SET   `time` = _time, `title` = _title, `description` = _description, `phone` = _phone,
            `skype` = _skype, `email` = _email, `image` = _image, `role` = _roleID
      WHERE `id` = _id;
  ELSE
    INSERT INTO `user` (`time`, `title`, `description`, `phone`, `skype`, `email`, `image`, `role`) 
      VALUES (_time, _title, _description, _phone, _skype, email,  image, _roleID, 1);
=======
  SET _roleID = params->'$.roleID';

  IF (_id IS NOT NULL) THEN
    UPDATE `user` 
      SET `time` = _time, `title` = _title, `email` = _email, `role` = _roleID, `status` = 1
      WHERE `id` = _id;
  ELSE
    INSERT INTO `user` (`time`, `title`, `email`, `role`, `status`) 
      VALUES (_time, _title, _email, _roleID, 1);
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
    SET _id = LAST_INSERT_ID();
  END IF;

  IF (_password IS NOT NULL) THEN
    UPDATE `user` SET `password` = _password WHERE `id` = _id;
  END IF;
END;;

DROP PROCEDURE IF EXISTS `UserUnset`;;
CREATE PROCEDURE `UserUnset`(IN `_id` tinyint unsigned)
<<<<<<< HEAD
BEGIN
  DECLARE _count INTEGER UNSIGNED DEFAULT 0;

  SELECT COUNT(*) FROM `page` INTO _count;

  IF (_count = 0) THEN
    DELETE FROM `user` WHERE `id` = _id;
  ELSE
    UPDATE `user` SET `status` = (1 - `status`) WHERE `id` = _id;
  END IF;

=======
BEGIN 
  UPDATE `user` SET `status` = (1 - `status`) WHERE `id` = _id;
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
END;;

DROP PROCEDURE IF EXISTS `_Get`;;
CREATE PROCEDURE `_Get`(IN `_table` varchar(32) CHARACTER SET 'latin1', IN `_id` int unsigned)
BEGIN 
  SELECT * FROM _table WHERE `id` = _id;
END;;

DROP PROCEDURE IF EXISTS `_GetFoundRows`;;
CREATE PROCEDURE `_GetFoundRows`()
BEGIN 
  SELECT FOUND_ROWS() AS 'foundRows';
END;;

DROP PROCEDURE IF EXISTS `_GetIndex`;;
CREATE PROCEDURE `_GetIndex`(IN `filter` json)
BEGIN
END;;

DROP PROCEDURE IF EXISTS `_Set`;;
CREATE PROCEDURE `_Set`(IN `_table` varchar(32) CHARACTER SET 'latin1', IN `_data` json)
BEGIN
<<<<<<< HEAD
  DECLARE _type VARCHAR(32) DEFAULT 'insert';
=======
  DECLARE _type TINYINT(1) DEFAULT 0; /* 0 - insert, 1 - update*/
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
  DECLARE _i INT DEFAULT 0;
  DECLARE _field_name VARCHAR(32) DEFAULT '';
  DECLARE _field_names JSON DEFAULT '{}';
  DECLARE _field_value VARCHAR(32) DEFAULT '';
  DECLARE _query VARCHAR(256) DEFAULT '';
  DECLARE _query_field_names VARCHAR(256) DEFAULT '';
  DECLARE _query_field_values VARCHAR(256) DEFAULT '';

<<<<<<< HEAD
  IF (JSON_TYPE(_data->'$.id') <> 'NULL') THEN SET _type = 'update'; END IF;
=======
  IF (JSON_TYPE(_data->'$.id') <> 'NULL') THEN SET _type = 1; END IF;
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b

  SET _field_names = JSON_KEYS(_data);

  WHILE _i < JSON_LENGTH(_field_names) DO
    SET _field_name = JSON_UNQUOTE(JSON_EXTRACT(_field_names, CONCAT('$[', _i, ']')));
    SET _field_value = JSON_UNQUOTE(JSON_EXTRACT(_data, CONCAT('$.', _field_name)));
<<<<<<< HEAD
    IF (_type = 'insert') THEN
=======
    IF (_type = 0) THEN
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
      SET _query_field_names = CONCAT(_query_field_names, '`', _field_name, '`, ');
      SET _query_field_values = CONCAT(_query_field_values, '"', _field_value, '", ');
    ELSE
      SET _query = CONCAT(_query, '`', _field_name, '` = "', _field_value, '", ');
    END IF;
    SELECT _i + 1 INTO _i;
  END WHILE;
 
<<<<<<< HEAD
  IF (_type = 'insert') THEN
=======
  IF (_type = 0) THEN
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
    SET _query_field_names = SUBSTRING(_query_field_names, 1, LENGTH(_query_field_names) - 2);
    SET _query_field_values = SUBSTRING(_query_field_values, 1, LENGTH(_query_field_values) - 2);
    SET @query = CONCAT('INSERT INTO `', _table, '` (', _query_field_names, ') VALUES (', _query_field_values, ');');
    SELECT LAST_INSERT_ID();
  ELSE
   SET _query = SUBSTRING(_query, 1, LENGTH(_query) - 2);
   SET @query = CONCAT('UPDATE `', _table, '` SET ', _query, ' WHERE `id` = ', _data->'$.id', ';');
  END IF;

<<<<<<< HEAD
#SELECT @query;
=======
SELECT @query;
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b

  PREPARE stmt FROM @query;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt; 

END;;

DROP PROCEDURE IF EXISTS `_Unset`;;
CREATE PROCEDURE `_Unset`(IN `_table` varchar(32) CHARACTER SET 'latin1', IN `_id` int unsigned)
BEGIN 
  UPDATE _table SET `status` = (1 - `status`) WHERE `id` = _id;
END;;

DELIMITER ;

<<<<<<< HEAD
-- 2018-07-17 16:22:51
=======
-- 2018-07-14 13:43:44
>>>>>>> 162af4d0a352363d3b384a95705bfbf39a55fb6b
