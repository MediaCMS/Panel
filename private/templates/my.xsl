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
                    <form action="{@index}" method="POST">
                        <div class="modal-body">
                            <xsl:apply-templates select="elements/element" mode="common" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                            <input type="submit" name="_submit" value="Фільтрувати" class="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </xsl:template>

    <xsl:template match="/my:index/filter/elements/element" mode="common">
        <div class="form-group row">
            <label for="filter-{@name}" class="col-sm-5 col-form-label"><xsl:value-of select="@title" /></label>
            <div class="col-sm-7">
                <xsl:apply-templates select="." />
            </div>
        </div>
    </xsl:template>


    <xsl:template match="/my:form">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <xsl:choose>
                <xsl:when test="@type='extended'">
                    <xsl:attribute name="class">mx-auto extended</xsl:attribute>
                    <xsl:apply-templates select="elements/element[@extended]" mode="common" />
                    <div class="standard mx-auto">
                        <xsl:apply-templates select="elements/element[not(@extended)]" mode="common" />
                    </div>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="elements/element" mode="common" />
                </xsl:otherwise>
            </xsl:choose>
            <div class="form-group text-center py-5">
                <xsl:apply-templates select="buttons/button" />
             </div>
        </form>
    </xsl:template>

    <xsl:template match="/my:form/elements/element[not(@extended)]" mode="common">
        <div class="form-group row">
            <label for="form-{@name}" class="col-sm-4 col-form-label"><xsl:value-of select="@title" /></label>
            <div class="col-sm-8">
                <xsl:apply-templates select="." />
            </div>
        </div>
    </xsl:template>

    <xsl:template match="/my:form/elements/element[@extended]" mode="common">
        <div class="form-group row">
            <div class="col-sm-12"><xsl:apply-templates select="." /></div>
        </div>
    </xsl:template>

    <xsl:template match="elements/element[@type='datetime']">
        <input type="datetime-local" name="{@name}" value="{@value}"
               title="{@title}" id="form-{@name}" class="form-control" />
    </xsl:template>

    <xsl:template match="elements/element[@type='string']">
        <input type="text" name="{@name}" value="{@value}" placeholder="{@title}"
               id="form-{@name}" class="form-control" title="{@title}">
            <xsl:if test="not(@extended)">
                <xsl:attribute name="id">form-<xsl:value-of select="@name" /></xsl:attribute>
            </xsl:if>
            <xsl:if test="name(../..)='filter'">
                <xsl:attribute name="placeholder">Ведіть фрагмент тексту</xsl:attribute>
            </xsl:if>
            <xsl:if test="@readonly">
                <xsl:attribute name="readonly">readonly</xsl:attribute>
            </xsl:if>
        </input>
    </xsl:template>

    <xsl:template match="elements/element[@type='password']">
        <input type="password" name="{@name}" value="{@value}" id="form-{@name}" class="form-control" title="{@title}" />
    </xsl:template>

    <xsl:template match="elements/element[@type='text']">
        <textarea name="{@name}" placeholder="{@title}"
               id="form-{@name}" class="form-control" title="{@title}" rows="4"
        ><xsl:if test="@rows"><xsl:attribute name="rows"><xsl:value-of select="@value" /></xsl:attribute></xsl:if
        ><xsl:value-of select="@value" /></textarea>
    </xsl:template>

    <xsl:template match="elements/element[@type='list']">
        <select name="{@name}" title="{@title}" id="filter-{@name}" class="form-control">
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

    <xsl:template match="elements/element[@type='wysiwyg']">
        <textarea name="{@name}" id="form-{@name}"
                  placeholder="Введіть текст" class="wysiwyg form-control"
                  title="{@title}"><xsl:value-of select="value" /></textarea>
    </xsl:template>

    <xsl:template match="elements/element[@type='image']">
        <input type="file" name="image" id="form-{@name}" class="form-control" title="{@title}">
            <xsl:if test="string-length(@value) &gt; 0">
                <xsl:attribute name="class">form-control d-none</xsl:attribute>
            </xsl:if>
        </input>
        <div class="image" title="Видалити зображення">
            <xsl:choose>
                <xsl:when test="string-length(@value) = 0">
                    <xsl:attribute name="class">image d-none</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:call-template name="image">
                        <xsl:with-param name="uri" select="@value" />
                        <xsl:with-param name="title" select="@title" />
                    </xsl:call-template>
                </xsl:otherwise>
            </xsl:choose>
            <input type="hidden" name="image" value="{@value}" />
            <svg height="25px" width="25px">
                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:#ccc;stroke-width:1" />
                <line x1="100%" y1="0" x2="0" y2="100%" style="stroke:#ccc;stroke-width:1" />
            </svg>
        </div>
    </xsl:template>

    <xsl:template match="elements/element[@type='autocomplete']">
        <xsl:attribute name="class">autocomplete col-sm-8</xsl:attribute>
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text"><img src="/search.png" alt="Пошук" /></span>
            </div>
            <input type="text" list="formTagList" autocomplete="off"
                   data-api="/мітки/автозаповнення" placeholder="Введіть літери для пошуку.."
                   id="formTag" class="autocomplete-input form-control" title="Мітки для статті" />
        </div>
        <xsl:if test="items">
            <div class="autocomplete-selected">
                <xsl:for-each select="items/item">
                    <button type="button" class="btn btn-outline-secondary">
                        <xsl:value-of select="@title" />
                        <input type="hidden" name="tags[{@value}]" value="{@title}" />
                    </button>
                </xsl:for-each>
            </div>
        </xsl:if>
    </xsl:template>

    <xsl:template match="/my:form/buttons/button">
        <input type="submit" name="{@name}" value="{@title}" class="btn btn-{@color} mx-1">
            <xsl:if test="name='_reset'">
                <xsl:attribute name="type">reset</xsl:attribute>
            </xsl:if>
        </input>
    </xsl:template>

</xsl:stylesheet>