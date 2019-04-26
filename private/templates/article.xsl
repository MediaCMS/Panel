<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статей
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

    <xsl:template match="main/article/index">
        <xsl:variable name="filter">
            <element type="date"   name="dateBegin"    value="{filter/@dateBegin}" title="Початкова дата"  />
            <element type="date"   name="dateEnd"      value="{filter/@dateEnd}"   title="Кінцева дата" />
            <element type="string" name="title"        value="{filter/@title}"     title="Назва" />
            <element type="string" name="category"     value="{filter/@category}"  title="Категорія" />
            <element type="string" name="tag"          value="{filter/@tag}"       title="Мітка" />
            <xsl:if test="/root/user/@roleID&lt;4">
                <element type="string" name="userTitle" value="{@userTitle}" title="Автор" />
            </xsl:if>
        </xsl:variable>
        <xsl:variable name="columns">
            <column name="position" title="#"           align="center" />
            <column name="time"     title="Дата"        align="center" />
            <column name="title"    title="Назва"       align="left" />
            <column name="category" title="Категорія"   align="center" />
            <column name="user"     title="Користувач"  align="center" />
            <column name="id"       title="ID"          align="center" />
        </xsl:variable>
        <xsl:call-template name="index">
            <xsl:with-param name="filter" select="exslt:node-set($filter)" />
            <xsl:with-param name="columns" select="exslt:node-set($columns)" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="main/article/edit">
        <xsl:variable name="elements">
            <element type="string"  name="title"        value="{@title}"        title="Назва"   extended="true" />
            <element type="text"    name="description"  value="{@description}"  title="Опис"    extended="true" />
            <element type="wysiwyg" name="text" title="Текст"   extended="true">
                <value><xsl:value-of select="@text" /></value>
            </element>
            <element type="image"   name="image"    value="{@image}"    title="Зображення" />
            <element type="list"    name="category" value="{@category}" title="Категорія">
                <items>
                    <xsl:for-each select="categories/category">
                        <item title="{@title}" value="{@id}" />
                    </xsl:for-each>
                </items>
            </element>
            <element type="autocomplete" name="tags" title="Мітки" uri="/мітки/автозаповнення">
                <items>
                    <xsl:for-each select="tags/tag">
                        <item title="{@title}" value="{@id}" />
                    </xsl:for-each>
                </items>
            </element>
            <xsl:if test="@id">
                <element type="string" name="alias" value="{@alias}"    title="Псевдонім"       readonly="true" />
                <element type="string" name="user"  value="{@user}"     title="Користувач"      readonly="true" />
                <element type="string" name="time"  value="{@time}"     title="Дата та час"     readonly="true" />
                <element type="string" name="id"    value="{@id}"       title="Ідентифікатор"   readonly="true" />
            </xsl:if>
        </xsl:variable>
        <xsl:call-template name="form">
            <xsl:with-param name="elements" select="exslt:node-set($elements)" />
        </xsl:call-template>
    </xsl:template>

</xsl:stylesheet>