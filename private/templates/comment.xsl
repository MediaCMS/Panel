<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для коментарів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="comment">
        <div id="comment"><p>comment</p></div>
    </xsl:template>

    <xsl:template match="comment-index">
        <div id="comment-index"><p>comment-index</p></div>
    </xsl:template>

    <xsl:template match="comment-view">
        <div id="comment-view"><p>comment-view</p></div>
    </xsl:template>

    <xsl:template match="comment-edit">
        <div id="comment-edit"><p>comment-edit</p></div>
    </xsl:template>

</xsl:stylesheet>