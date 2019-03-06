<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для міток
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

    <xsl:template match="main/tag/index">
        <xsl:variable name="filter">
            <element type="string" name="title" value="{filter/@title}" title="Назва" />
        </xsl:variable>
        <xsl:variable name="columns">
            <column name="position" title="#"           align="center" />
            <column name="title"    title="Назва"       align="left" />
            <column name="user"     title="Користувач"  align="center" />
            <column name="time"     title="Дата"        align="center" />
            <column name="id"       title="ID"          align="center" />
        </xsl:variable>
        <xsl:call-template name="index">
            <xsl:with-param name="filter" select="exslt:node-set($filter)" />
            <xsl:with-param name="columns" select="exslt:node-set($columns)" />
        </xsl:call-template>
    </xsl:template>

   <xsl:template match="main/tag/edit">
       <xsl:variable name="elements">
           <element type="string"   name="title"        value="{@title}"        title="Назва" />
           <element type="text"     name="description"  value="{@description}"  title="Опис" />
           <element type="image"    name="image"        value="{@image}"        title="Зображення" />
           <xsl:if test="@id">
               <element type="string" name="alias"  value="{@alias}"    title="Псевдонім"       readonly="true" />
               <element type="string" name="user"   value="{@user}"     title="Користувач"      readonly="true" />
               <element type="string" name="time"   value="{@time}"     title="Дата та час"     readonly="true" />
               <element type="string" name="id"     value="{@id}"       title="Ідентифікатор"   readonly="true" />
           </xsl:if>
       </xsl:variable>
       <xsl:call-template name="form">
           <xsl:with-param name="elements" select="exslt:node-set($elements)" />
       </xsl:call-template>
    </xsl:template>

</xsl:stylesheet>