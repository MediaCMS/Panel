<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статичних сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template name="image">
        <xsl:param name="uri" />
        <xsl:param name="title" select="123" />
        <img src="{/root/@photoHost}{/root/@photoPath}{substring($uri, 0, 40)}/0320.jpg">
            <xsl:if test="string-length($title) &gt; 0">
                <xsl:attribute name="alt"><xsl:value-of select="$title" /></xsl:attribute>
            </xsl:if>
        </img>
    </xsl:template>

    <xsl:template name="form">
        <xsl:param name="uri" />
        <xsl:param name="title" select="123" />
        <img src="{/root/@photoHost}{/root/@photoPath}{substring($uri, 0, 40)}/0320.jpg">
            <xsl:if test="string-length($title) &gt; 0">
                <xsl:attribute name="alt"><xsl:value-of select="$title" /></xsl:attribute>
            </xsl:if>
        </img>
    </xsl:template>

    <xsl:template name="formImage">
        <xsl:param name="title" />
        <input type="file" name="image" id="formImage" class="form-control" title="{$title}">
            <xsl:if test="string-length(@image) &gt; 0">
                <xsl:attribute name="class">form-control d-none</xsl:attribute>
            </xsl:if>
        </input>
        <div class="image" title="Видалити зображення">
            <xsl:choose>
                <xsl:when test="string-length(@image) = 0">
                    <xsl:attribute name="class">image d-none</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="image">
                        <xsl:with-param name="uri" select="@image" />
                        <xsl:with-param name="title" select="$title" />
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
            <input type="hidden" name="image" value="{@image}" />
            <svg height="100%" width="100%">
                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:#ccc;stroke-width:1" />
                <line x1="100%" y1="0" x2="0" y2="100%" style="stroke:#ccc;stroke-width:1" />
            </svg>
        </div>
    </xsl:template>

</xsl:stylesheet>