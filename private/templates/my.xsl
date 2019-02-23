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

    <xsl:template match="/my:index">
        <xsl:choose>
            <xsl:when test="items/item">
                <table class="table clickable">
                    <thead>
                        <tr class="text-center">
                            <xsl:apply-templates select="columns/column" mode="header" />
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:apply-templates select="items/item">
                            <xsl:with-param name="columns" select="columns" />
                        </xsl:apply-templates>
                    </tbody>
                </table>
                <xsl:apply-templates select="pagination" />
            </xsl:when>
            <xsl:otherwise>Записів не знайдено</xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="filter" />
    </xsl:template>

    <xsl:template match="/my:index/columns/column" mode="header">
        <th scope="col"><xsl:value-of select="@title" /></th>
    </xsl:template>

    <xsl:template match="/my:index/columns/column">
        <xsl:param name="item" />
        <xsl:variable name="name" select="@name" />
        <xsl:choose>
            <xsl:when test="$name='position'">
                <th scope="row" class="text-{@align}"><xsl:value-of select="$item/@position" />.</th>
            </xsl:when>
            <xsl:otherwise>
                <td class="text-{@align}"><xsl:value-of select="$item/@*[name()=$name]" /></td>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="/my:index/items/item">
        <xsl:param name="columns" />
        <tr data-edit="{../../@edit}/{@id}">
            <xsl:if test="@status=0">
                <xsl:attribute name="class">disabled</xsl:attribute>
            </xsl:if>
            <xsl:apply-templates select="$columns/column">
                <xsl:with-param name="item" select="." />
            </xsl:apply-templates>
        </tr>
    </xsl:template>

    <xsl:template match="/my:index/filter">
        <div class="modal fade" id="filter" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Фільтр</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&#215;</span>
                        </button>
                    </div>
                    <form action="" method="POST">
                        <div class="modal-body">
                            <xsl:apply-templates select="item" mode="common" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                            <input type="submit" name="submit" value="Фільтрувати" class="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="/my:index/filter/item" mode="common">
        <div class="form-group row">
            <label for="filter-{@name}" class="col-sm-5 col-form-label"><xsl:value-of select="@title" /></label>
            <div class="col-sm-7">
                <xsl:apply-templates select="." />
            </div>
        </div>
    </xsl:template>

    <xsl:template match="/my:index/filter/item[@type='date']">
        <input type="date" name="{@name}" value="{@value}"
            title="Фільтр за датою" id="filter-{@name}" class="form-control" />
    </xsl:template>

    <xsl:template match="/my:index/filter/item[@type='string']">
        <input type="text" name="{@name}" value="{@value}" placeholder="Ведіть фрагмент тексту"
               title="Фільтр за фрагментом тексту" id="filter-{@name}" class="form-control" />
    </xsl:template>

    <xsl:template match="/my:index/filter/item[@type='list']">
        <xsl:copy-of select="." />
        <select name="{@name}" title="Фільтр за пунктом переліку" id="filter-{@name}" class="form-control">
            <xsl:for-each select="items/item">
                <option value="{@value}">
                    <xsl:if test="@value=../../@value">
                        <xsl:attribute name="selected">selected</xsl:attribute>
                    </xsl:if>
                    <xsl:value-of select="@title" />
                </option>
            </xsl:for-each>
        </select>
    </xsl:template>






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