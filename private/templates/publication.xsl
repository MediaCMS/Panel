<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для публікацій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="publication">
        <div id="publication">publication</div>
    </xsl:template>

    <xsl:template match="publication-index">
        <div id="publication-index">publication-index</div>
    </xsl:template>

    <xsl:template match="publication-view">
        <div id="publication-view">publication-view</div>
    </xsl:template>

    <xsl:template match="publication-edit">
        <div id="publication-edit">publication-edit</div>
    </xsl:template>

</xsl:stylesheet>