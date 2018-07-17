<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="tag">
        <div id="tag">tag</div>
    </xsl:template>

    <xsl:template match="tag-index">
        <div id="tag-index">tag-index</div>
    </xsl:template>

    <xsl:template match="tag-view">
        <div id="tag-view">tag-view</div>
    </xsl:template>

    <xsl:template match="tag-edit">
        <div id="tag-edit">tag-edit</div>
    </xsl:template>

</xsl:stylesheet>