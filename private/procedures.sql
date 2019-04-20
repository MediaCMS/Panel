-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DELIMITER ;;

DROP PROCEDURE IF EXISTS `ArticleGet`;;
CREATE PROCEDURE `ArticleGet`(IN `_id` int unsigned)
BEGIN
  SELECT      `a`.*, `u`.`title` AS `user`, GROUP_CONCAT(DISTINCT `at`.`tag` SEPARATOR ',') AS 'tags'
  FROM        `article` AS `a`
  INNER JOIN  `user` AS `u` ON `u`.`id` = `a`.`user`
  INNER JOIN  `article_tag` AS `at` ON `at`.`article` = `a`.`id`
  WHERE       `a`.`id` = _id
  GROUP BY    `a`.`id`;
END;;

DROP PROCEDURE IF EXISTS `ArticleGetIndex`;;
CREATE PROCEDURE `ArticleGetIndex`(IN `params` json)
BEGIN
  DECLARE _dateBegin DATETIME;
  DECLARE _dateEnd DATETIME;
  DECLARE _title VARCHAR(32);
  DECLARE _category VARCHAR(32);
  DECLARE _tag VARCHAR(32);
  DECLARE _userID TINYINT(3);
  DECLARE _userTitle VARCHAR(32);
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _orderField VARCHAR(32) DEFAULT 'id';
  DECLARE _orderDirection INTEGER DEFAULT 1;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.dateBegin') <> 'NULL') THEN
    SET _dateBegin = CONCAT(params->>'$.dateBegin', ' 00:00:00'); END IF;
  IF (JSON_TYPE(params->'$.dateEnd') <> 'NULL') THEN
    SET _dateEnd = CONCAT(params->>'$.dateEnd', ' 23:59:59'); END IF;
  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN
    SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$.category') <> 'NULL') THEN
    SET _category = params->>'$.category'; END IF;
  IF (JSON_TYPE(params->'$.tag') <> 'NULL') THEN
    SET _tag = params->>'$.tag'; END IF;
  IF (JSON_TYPE(params->'$.userID') <> 'NULL') THEN
    SET _userID = params->'$.userID'; END IF;
  IF (JSON_TYPE(params->'$.userTitle') <> 'NULL') THEN
    SET _userTitle = params->>'$.userTitle'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN
    SET _status = params->'$._status'; END IF;
  SET _orderField = params->>'$._orderField';
  SET _orderDirection = params->'$._orderDirection';
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS 
         `a`.`id`, `a`.`time`, `a`.`title`, `a`.`status`,
         `c`.`title` AS 'category', `u`.`title` AS 'user',
         GROUP_CONCAT(DISTINCT `t`.`title` ORDER BY `t`.`title` ASC SEPARATOR ', ') AS 'tags'
    FROM `article` AS `a`
    INNER JOIN `category` AS `c` ON `c`.`id` = `a`.`category`
    LEFT JOIN `article_tag` AS `at` ON `at`.`article` = `a`.`id`
    LEFT JOIN `tag` AS `t` ON `t`.`id` = `at`.`tag`
    INNER JOIN `user` AS `u` ON `u`.`id` = `a`.`user`
    WHERE `a`.`id` > 0
      AND (_tag       IS NULL OR 'tags' LIKE CONCAT('%', _tag, '%'))
      AND (_dateBegin IS NULL OR `a`.`time` >= _dateBegin)
      AND (_dateEnd   IS NULL OR `a`.`time` <= _dateEnd)
      AND (_title     IS NULL OR `a`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_userID    IS NULL OR `a`.`user` = _userID)
      AND (_status    IS NULL OR `a`.`status` = _status)
      AND (_category  IS NULL OR `c`.`title` LIKE CONCAT('%', _category, '%'))
      AND (_userTitle IS NULL OR `u`.`title` LIKE CONCAT('%', _userTitle, '%'))
    GROUP BY `a`.`id`
    ORDER BY
      CASE WHEN _orderField = 'time'     AND _orderDirection = 1 THEN `a`.`time`  END ASC,
      CASE WHEN _orderField = 'time'     AND _orderDirection = 0 THEN `a`.`time`  END DESC,
      CASE WHEN _orderField = 'title'    AND _orderDirection = 1 THEN `a`.`title` END ASC,
      CASE WHEN _orderField = 'title'    AND _orderDirection = 0 THEN `a`.`title` END DESC,
      CASE WHEN _orderField = 'category' AND _orderDirection = 1 THEN `a`.`category` END ASC,
      CASE WHEN _orderField = 'category' AND _orderDirection = 0 THEN `a`.`category` END DESC,
      CASE WHEN _orderField = 'user'     AND _orderDirection = 1 THEN `a`.`user` END ASC,
      CASE WHEN _orderField = 'user'     AND _orderDirection = 0 THEN `a`.`user` END DESC
    LIMIT _rowsOffset, _rowsLimit;
END;;

DROP PROCEDURE IF EXISTS `ArticleSet`;;
CREATE PROCEDURE `ArticleSet`(IN `params` json)
BEGIN
  DECLARE _i TINYINT(3) DEFAULT 0;
  DECLARE _id TINYINT(3) UNSIGNED;
  DECLARE _title VARCHAR(128);
  DECLARE _description VARCHAR(256);
  DECLARE _text TEXT;
  DECLARE _image VARCHAR(48);
  DECLARE _alias VARCHAR(128);
  DECLARE _category TINYINT(3) UNSIGNED;
  DECLARE _tag SMALLINT(5) UNSIGNED;
  DECLARE _tags JSON;
  DECLARE _tags2 JSON DEFAULT '[]';
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
  SET _category = params->'$.category';
  SET _user = params->'$.user';

  IF (_id IS NOT NULL) THEN
    UPDATE  `article` 
      SET   `title` = _title, `description` = _description, `text` = _text,
            `image` = _image, `alias` = _alias, `category` = _category, `user` = _user
      WHERE `id` = _id AND `status` = 1;
    DELETE FROM `article_tag` WHERE `article` = _id;
  ELSE
    INSERT INTO `article` (`title`, `description`, `text`, `image`, `alias`, `category`, `user`) 
      VALUES (_title, _description, _text, _image, _alias, _category, _user);
    SELECT LAST_INSERT_ID() INTO _id;
  END IF;

  IF (JSON_TYPE(params->'$.tags') <> 'NULL') THEN
    SET _tags = params->'$.tags';
    WHILE _i < JSON_LENGTH(_tags) DO
      SELECT JSON_EXTRACT(_tags,CONCAT('$[',_i,']')) INTO _tag;
      IF (JSON_CONTAINS(_tags2, CAST(_tag AS CHAR)) = 0) THEN
        INSERT INTO `article_tag` (`article`, `tag`) VALUES (_id, _tag);
        SELECT JSON_ARRAY_APPEND(_tags2, '$', _tag) INTO _tags2;
      END IF;
      SELECT _i + 1 INTO _i;
    END WHILE;
  END IF;
END;;

DROP PROCEDURE IF EXISTS `ArticleUnset`;;
CREATE PROCEDURE `ArticleUnset`(IN `_id` int unsigned)
BEGIN
  #DELETE FROM `comment` WHERE `article` = _id;
  #DELETE FROM `article_tag` WHERE `article` = _id;
  #DELETE FROM `article` WHERE `id` = _id;
  UPDATE `article` SET `status` = (1 - `status`) WHERE `id` = _id; #cut
END;;

DROP PROCEDURE IF EXISTS `CategoryGet`;;
CREATE PROCEDURE `CategoryGet`(IN `_id` tinyint unsigned)
BEGIN
  SELECT      `c`.*, `u`.`title` AS `user`
  FROM        `category` AS `c`
  INNER JOIN  `user` AS `u` ON `u`.`id` = `c`.`user`
  WHERE       `c`.`id` = _id;
END;;

DROP PROCEDURE IF EXISTS `CategoryGetIndex`;;
CREATE PROCEDURE `CategoryGetIndex`(IN `params` json)
BEGIN
  DECLARE _title VARCHAR(32);
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN
    SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN
    SET _status = params->'$._status'; END IF;
  IF (JSON_TYPE(params->'$._offset') <> 'NULL') THEN
    SET _rowsOffset = params->'$._offset'; END IF;
  IF (JSON_TYPE(params->'$._limit') <> 'NULL') THEN
    SET _rowsLimit = params->'$._limit'; END IF;

  SELECT SQL_CALC_FOUND_ROWS
         `c`.`id`, `c`.`time`, `c`.`title`, `u`.`title` AS 'user', `c`.`status`
    FROM `category` AS `c`
    INNER JOIN `user` AS `u` ON `u`.`id` = `c`.`user`
    WHERE `c`.`id` > 0
      AND (_title  IS NULL OR `c`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_status IS NULL OR `c`.`status` = _status)
    ORDER BY `c`.`title`
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `CategorySet`;;
CREATE PROCEDURE `CategorySet`(IN `params` json)
BEGIN
  DECLARE _id TINYINT(3) UNSIGNED;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(256);
  DECLARE _image VARCHAR(48);
  DECLARE _alias VARCHAR(32);
  DECLARE _user TINYINT(3) UNSIGNED;

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
   SET _id = params->'$.id'; END IF;
  SET _title = params->>'$.title'; 
  IF (JSON_TYPE(params->'$.description') <> 'NULL') THEN
    SET _description = params->>'$.description'; END IF;
  IF (JSON_TYPE(params->'$.image') <> 'NULL') THEN
    SET _image = params->>'$.image'; END IF;
  SET _alias = params->>'$.alias';
  SET _user = params->'$.user';

  IF (_id IS NOT NULL) THEN
    UPDATE  `category` 
      SET   `title` = _title, `description` = _description, `image` = _image, `alias` = _alias, `user` = _user
      WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `category` (`title`, `description`, `image`, `alias`, `user`) 
      VALUES (_title, _description, _image, _alias, _user);
  END IF;
END;;

DROP PROCEDURE IF EXISTS `CategoryUnset`;;
CREATE PROCEDURE `CategoryUnset`(IN `_id` tinyint(3) unsigned)
BEGIN
  DECLARE _count INTEGER UNSIGNED DEFAULT 0;

  SELECT COUNT(*) INTO _count FROM `article` WHERE `category` = _id;

  IF (_count = 0) THEN
    #DELETE FROM `category` WHERE `id` = _id;
    UPDATE `category` SET `status` = (1 - `status`) WHERE `id` = _id; #cut
  ELSE
    UPDATE `category` SET `status` = (1 - `status`) WHERE `id` = _id;
  END IF;  
END;;

DROP PROCEDURE IF EXISTS `CommentGet`;;
CREATE PROCEDURE `CommentGet`(IN `_id` int unsigned)
BEGIN
  SELECT      `c`.*, `u`.`title` AS `user`, `a`.`title` AS `article`
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

  IF (JSON_TYPE(params->'$.dateBegin') <> 'NULL') THEN
    SET _dateBegin = CONCAT(params->>'$.dateBegin', ' 00:00:00'); END IF;
  IF (JSON_TYPE(params->'$.dateEnd') <> 'NULL') THEN
    SET _dateEnd = CONCAT(params->>'$.dateEnd', ' 23:59:59'); END IF;
  IF (JSON_TYPE(params->'$.text') <> 'NULL') THEN
    SET _text = params->>'$.text'; END IF;
  IF (JSON_TYPE(params->'$.article') <> 'NULL') THEN
    SET _article = params->>'$.article'; END IF;
  IF (JSON_TYPE(params->'$.user') <> 'NULL') THEN
    SET _user = params->>'$.user'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN
    SET _status = params->'$._status'; END IF;
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
      AND (_dateBegin IS NULL OR `c`.`time`   >= _dateBegin)
      AND (_dateEnd   IS NULL OR `c`.`time`   <= _dateEnd)
      AND (_text      IS NULL OR `c`.`text`   LIKE CONCAT('%', _text, '%'))
      AND (_article   IS NULL OR `a`.`title`  LIKE CONCAT('%', _article, '%'))
      AND (_user      IS NULL OR `u`.`title`  LIKE CONCAT('%', _user, '%'))
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
  DECLARE _article INT(10) UNSIGNED;
  DECLARE _user TINYINT(3) UNSIGNED;

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
    SET _id = params->'$.id';
  END IF;
  SET _text = params->>'$.text';
  SET _article = params->'$.article';
  SET _user = params->'$.user';

  IF (_id IS NOT NULL) THEN
    UPDATE `comment` SET `text` = _text, `article` = _article, `user` = _user WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `comment` (`text`, `user`) VALUES (_text, _user);
  END IF;
END;;

DROP PROCEDURE IF EXISTS `CommentUnset`;;
CREATE PROCEDURE `CommentUnset`(IN `_id` int unsigned)
BEGIN
  #DELETE FROM `comment` WHERE `id` = _id;
  UPDATE `comment` SET `status` = (1 - `status`) WHERE `id` = _id; #cut
END;;

DROP PROCEDURE IF EXISTS `PageGet`;;
CREATE PROCEDURE `PageGet`(IN `_id` tinyint unsigned)
BEGIN
  SELECT      `p`.*, `u`.`title` AS `user`
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

  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN
    SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN
    SET _status = params->'$._status'; END IF;
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS
         `p`.`id`, `p`.`time`, `p`.`title`, `u`.`title` AS 'user', `p`.`status`
    FROM `page` AS `p`
    INNER JOIN `user` AS `u` ON `u`.`id` = `p`.`user`
    WHERE `p`.`id` > 0
      AND (_title  IS NULL OR `p`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_status IS NULL OR `p`.`status` = _status)
    ORDER BY `p`.`title`
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `PageSet`;;
CREATE PROCEDURE `PageSet`(IN `params` json)
BEGIN
  DECLARE _id TINYINT(3) UNSIGNED;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(256);
  DECLARE _text TEXT;
  DECLARE _image VARCHAR(48);
  DECLARE _alias VARCHAR(32);
  DECLARE _user TINYINT(3) UNSIGNED;

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
    SET _id = params->'$.id';
  END IF;
  SET _title = params->>'$.title';
  SET _description = params->>'$.description';
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
  UPDATE `page` SET `status` = (1 - `status`) WHERE `id` = _id; #cut
END;;

DROP PROCEDURE IF EXISTS `RoleGetIndex`;;
CREATE PROCEDURE `RoleGetIndex`()
BEGIN 
  SELECT `id`, `title`, `description` FROM `role` ORDER BY `id` DESC;
END;;

DROP PROCEDURE IF EXISTS `TagAutocomplete`;;
CREATE PROCEDURE `TagAutocomplete`(IN `_title` varchar(32), IN `_exclude` varchar(32))
BEGIN
  SELECT     `id`, `title`
    FROM     `tag`
    WHERE    `title` LIKE CONCAT('%', _title, '%') AND `status` = 1
             AND (_exclude IS NULL OR NOT FIND_IN_SET(`id`, _exclude))
    ORDER BY `title`
    LIMIT    100; 
END;;

DROP PROCEDURE IF EXISTS `TagGet`;;
CREATE PROCEDURE `TagGet`(IN `_id` smallint(5) unsigned)
BEGIN
  SELECT      `t`.*, `u`.`title` AS `user`
  FROM        `tag` AS `t`
  INNER JOIN  `user` AS `u` ON `u`.`id` = `t`.`user`
  WHERE       `t`.`id` = _id;
END;;

DROP PROCEDURE IF EXISTS `TagGetByIDs`;;
CREATE PROCEDURE `TagGetByIDs`(IN `_ids` varchar(32) CHARACTER SET 'utf8mb4')
BEGIN
  SELECT `id`, `title` FROM `tag` WHERE FIND_IN_SET (`id`, _ids);
END;;

DROP PROCEDURE IF EXISTS `TagGetIndex`;;
CREATE PROCEDURE `TagGetIndex`(IN `params` json)
BEGIN
  DECLARE _title VARCHAR(32);
  DECLARE _status TINYINT(1) UNSIGNED;
  DECLARE _rowsOffset INTEGER UNSIGNED DEFAULT 0;
  DECLARE _rowsLimit INTEGER UNSIGNED DEFAULT 100;

  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN
    SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN
    SET _status = params->'$._status'; END IF;
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS
         `t`.`id`, `t`.`time`, `t`.`title`, `u`.`title` AS 'user', `t`.`status`
    FROM `tag` AS `t`
    INNER JOIN `user` AS `u` ON `u`.`id` = `t`.`user`
    WHERE `t`.`id` > 0
      AND (_title  IS NULL OR `t`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_status IS NULL OR `t`.`status` = _status)
    ORDER BY `t`.`title`
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `TagSet`;;
CREATE PROCEDURE `TagSet`(IN `params` json)
BEGIN
  DECLARE _id TINYINT(3) UNSIGNED;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(256);
  DECLARE _image VARCHAR(48);
  DECLARE _alias VARCHAR(32);
  DECLARE _user TINYINT(3) UNSIGNED;

  IF (JSON_TYPE(params->'$.id') <> 'NULL') THEN
   SET _id = params->'$.id'; END IF;
  SET _title = params->>'$.title'; 
  IF (JSON_TYPE(params->'$.description') <> 'NULL') THEN
    SET _description = params->>'$.description'; END IF;
  IF (JSON_TYPE(params->'$.image') <> 'NULL') THEN
    SET _image = params->>'$.image'; END IF;
  SET _alias = params->>'$.alias';
  SET _user = params->'$.user';

  IF (_id IS NOT NULL) THEN
    UPDATE  `tag` 
      SET   `title` = _title, `description` = _description, `image` = _image, `alias` = _alias, `user` = _user
      WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `tag` (`title`, `description`, `image`, `alias`, `user`) 
      VALUES (_title, _description, _image, _alias, _user);
  END IF;
END;;

DROP PROCEDURE IF EXISTS `TagUnset`;;
CREATE PROCEDURE `TagUnset`(IN `_id` smallint unsigned)
BEGIN
  DECLARE _count INTEGER UNSIGNED DEFAULT 0;

  SELECT COUNT(*) INTO _count FROM `article_tag` WHERE `tag` = _id;

  IF (_count = 0) THEN
    #DELETE FROM `tag` WHERE `id` = _id;
    UPDATE `tag` SET `status` = (1 - `status`) WHERE `id` = _id; #cut
  ELSE
    UPDATE `tag` SET `status` = (1 - `status`) WHERE `id` = _id;
  END IF;  
END;;

DROP PROCEDURE IF EXISTS `UserAuthorize`;;
CREATE PROCEDURE `UserAuthorize`(IN `_email` varchar(32) CHARACTER SET 'utf8mb4', IN `_password` varchar(32) CHARACTER SET 'utf8mb4')
BEGIN 
  DECLARE _id INTEGER UNSIGNED DEFAULT NULL;
  DECLARE _token VARCHAR(32);

  SELECT `id` INTO _id FROM `user` WHERE `role` < 5 AND `email` = _email AND `password` = _password;

  IF (_id IS NOT NULL) THEN
    SET _token = MD5(CONCAT(_id, NOW(), _email, _password));
    UPDATE `user` SET `token` = _token WHERE `id` = _id;
    SELECT `u`.`id`, `u`.`title`, `u`.`image`, `r`.`id` AS 'roleID', `r`.`title` AS 'roleTitle', `u`.`token`
    FROM   `user` AS `u`, `role` AS `r`
    WHERE  `u`.`role` = `r`.`id` AND `u`.`id` = _id;
  END IF;
END;;

DROP PROCEDURE IF EXISTS `UserGet`;;
CREATE PROCEDURE `UserGet`(IN `_id` tinyint unsigned)
BEGIN 
  SELECT     `u1`.`id`, `u1`.`time`, `u1`.`title`, `u1`.`description`, `u1`.`phone`, `u1`.`skype`,
             `u1`.`email`, `u1`.`image`, `u1`.`role`, `u1`.`alias`, `u2`.`title` AS 'user', `u1`.`status` 
  FROM       `user` AS `u1`
  INNER JOIN `user` AS `u2` ON `u1`.`user` = `u2`.`id`  
  WHERE      `u1`.`id` = _id;
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

  IF (JSON_TYPE(params->'$.dateBegin') <> 'NULL') THEN
    SET _dateBegin = CONCAT(params->>'$.dateBegin', ' 00:00:00'); END IF;
  IF (JSON_TYPE(params->'$.dateEnd') <> 'NULL') THEN
    SET _dateEnd = CONCAT(params->>'$.dateEnd', ' 23:59:59'); END IF;
  IF (JSON_TYPE(params->'$.title') <> 'NULL') THEN
    SET _title = params->>'$.title'; END IF;
  IF (JSON_TYPE(params->'$.roleID') <> 'NULL') THEN
    SET _roleID = params->'$.roleID'; END IF;
  IF (JSON_TYPE(params->'$._status') <> 'NULL') THEN
    SET _status = params->'$._status'; END IF;
  SET _orderField = params->>'$._orderField';
  SET _orderDirection = params->'$._orderDirection';
  SET _rowsOffset = params->'$._offset';
  SET _rowsLimit = params->'$._limit';

  SELECT SQL_CALC_FOUND_ROWS
         `u`.`id`, `u`.`time`, `u`.`title`, `u`.`phone`, `u`.`email`, `r`.`title` AS 'role', `u`.`status`
    FROM `user` AS `u`
    INNER JOIN `role` AS `r` ON `r`.`id` = `u`.`role`
    WHERE `u`.`id` > 0
      AND (_dateBegin IS NULL OR `u`.`time` >= _dateBegin)
      AND (_dateEnd   IS NULL OR `u`.`time` <= _dateEnd)
      AND (_title     IS NULL OR `u`.`title` LIKE CONCAT('%', _title, '%'))
      AND (_roleID    IS NULL OR `r`.`id` = _roleID)
      AND (_status    IS NULL OR `u`.`status` = _status)
    ORDER BY
      CASE WHEN _orderField = 'time'   AND _orderDirection = 1 THEN `u`.`time`  END ASC,
      CASE WHEN _orderField = 'time'   AND _orderDirection = 0 THEN `u`.`time`  END DESC,
      CASE WHEN _orderField = 'title'  AND _orderDirection = 1 THEN `u`.`title` END ASC,
      CASE WHEN _orderField = 'title'  AND _orderDirection = 0 THEN `u`.`title` END DESC,
      CASE WHEN _orderField = 'roleID' AND _orderDirection = 1 THEN `r`.`id`    END ASC, `u`.`title` ASC,
      CASE WHEN _orderField = 'roleID' AND _orderDirection = 0 THEN `r`.`id`    END DESC, `u`.`title` ASC
    LIMIT _rowsOffset, _rowsLimit; 
END;;

DROP PROCEDURE IF EXISTS `UserSet`;;
CREATE PROCEDURE `UserSet`(IN `params` json)
BEGIN
  DECLARE _id INTEGER UNSIGNED;
  DECLARE _title VARCHAR(32);
  DECLARE _description VARCHAR(256);
  DECLARE _phone VARCHAR(32);
  DECLARE _skype VARCHAR(32);
  DECLARE _email VARCHAR(32);
  DECLARE _password VARCHAR(32);
  DECLARE _image VARCHAR(48);
  DECLARE _role TINYINT(1) UNSIGNED;
  DECLARE _alias VARCHAR(32);
  DECLARE _user TINYINT(3) UNSIGNED;

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
  IF (JSON_TYPE(params->'$.password') <> 'NULL' AND LENGTH(params->>'$.password') > 0) THEN
    SET _password = params->>'$.password';
    IF (LENGTH(_password) < 8) THEN
      SIGNAL SQLSTATE '22001'
         SET MESSAGE_TEXT = "Data too short for column '_password' at row 1 (LENGTH < 8)";
    END IF;
  END IF;
  IF (JSON_TYPE(params->'$.image') <> 'NULL') THEN
    SET _image = params->>'$.image';
  END IF;
  SET _role = params->'$.role';
  SET _alias = params->>'$.alias';
  SET _user = params->'$.user';

  IF (_id IS NOT NULL) THEN
    UPDATE  `user` 
      SET   `title` = _title, `description` = _description, `phone` = _phone, `skype` = _skype,
            `email` = _email, `image` = _image, `role` = _role, `alias` = _alias, `user` = _user
      WHERE `id` = _id AND `status` = 1;
  ELSE
    INSERT INTO `user` (`title`, `description`, `phone`, `skype`, `email`, `image`, `role`, `alias`, `user`) 
      VALUES (_title, _description, _phone, _skype, _email,  _image, _role, _alias, _user);
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
    #DELETE FROM `user` WHERE `id` = _id;
    UPDATE `user` SET `status` = (1 - `status`) WHERE `id` = _id; #cut
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

-- 2019-04-20 15:17:41
