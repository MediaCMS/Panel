<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу власних шаблонів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" exclude-result-prefixes="exslt my"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:exslt="http://exslt.org/common"
    xmlns:my="https://github.com/MediaCMS">

    <xsl:template match="/my:form">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <xsl:if test="@type='extended'">
                <xsl:attribute name="class">mx-auto extended</xsl:attribute>
            </xsl:if>
            <xsl:apply-templates>
                <xsl:with-param name="formType" select="@type" />
            </xsl:apply-templates>
        </form>
    </xsl:template>

    <xsl:template match="/my:form/my:fields">
        <xsl:param name="formType" select="standard" />
        <div>
            <xsl:for-each select="*">
                <xsl:choose>
                    <xsl:when test="self::my:field">
                        <xsl:apply-templates select=".">
                            <xsl:with-param name="formType" select="$formType" />
                        </xsl:apply-templates>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:copy-of select="." />
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>

        </div>
    </xsl:template>

    <xsl:template match="my:field[@type='title']">
        <xsl:param name="formType" select="standard" />
        <div class="form-group row">
            <xsl:if test="$formType='standard'">
                <label for="formTitle" class="col-sm-4 col-form-label">Назва</label>
            </xsl:if>
            <div class="col-sm-8">
                <xsl:if test="$formType='extended'">
                    <xsl:attribute name="class">col-sm-12</xsl:attribute>
                </xsl:if>
                <input type="text" name="title" value="{@value}" placeholder="{@description}"
                       id="formTitle" class="form-control" title="{@description}" />
            </div>
        </div>
    </xsl:template>

    <xsl:template match="my:field[@type='description']">
        <xsl:param name="formType" select="standard" />
        <div class="form-group row">
            <xsl:if test="$formType='standard'">
                <label for="formDescription" class="col-sm-4 col-form-label">Опис</label>
            </xsl:if>
            <div class="col-sm-8">
                <xsl:if test="$formType='extended'">
                    <xsl:attribute name="class">col-sm-12</xsl:attribute>
                </xsl:if>
               <textarea name="description" value="{@description}" id="formDescription"
                          placeholder="Опис статті" class="form-control"
                          title="{@description}"><xsl:value-of select="@value" /></textarea>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>