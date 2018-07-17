<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="category">
        <div id="category">category</div>
    </xsl:template>

    <xsl:template match="category-index">
        <div id="category-index">category-index</div>
    </xsl:template>

    <xsl:template match="category-view">
        <div id="category-view">category-view</div>
    </xsl:template>

    <xsl:template match="category-edit">
        <div id="category-edit">category-edit</div>
    </xsl:template>

</xsl:stylesheet>