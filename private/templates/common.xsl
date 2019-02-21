<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статичних сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" exclude-result-prefixes="exslt"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common">

    <xsl:template name="index">
        <xsl:param name="title" />
        <xsl:param name="columns" />

        <xsl:choose>
            <xsl:when test="items/item">
                <table class="table clickable">
                    <caption><xsl:value-of select="$title" /></caption>
                    <thead>
                        <tr class="text-center">
                            <xsl:for-each select="$columns/column">
                                <th scope="col"><xsl:value-of select="@title" /></th>
                            </xsl:for-each>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="items/item">
                            <xsl:variable name="item" select="." />
                            <tr data-edit="{../../@edit}/{@id}">
                                <xsl:if test="@status=0">
                                    <xsl:attribute name="class">disabled</xsl:attribute>
                                </xsl:if>
                                <xsl:for-each select="$columns/column">
                                    <xsl:variable name="name" select="@name" />
                                    <xsl:choose>
                                        <xsl:when test="$name='position'">
                                            <th scope="row" class="text-{@align}"><xsl:value-of select="$item/@position" />.</th>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <td class="text-{@align}"><xsl:value-of select="$item/@*[name()=$name]" /></td>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:for-each>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
                <xsl:apply-templates select="pagination" />
            </xsl:when>
            <xsl:otherwise>Записів не знайдено</xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="filter" />
    </xsl:template>

    <xsl:template match="pagination">
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item">
                    <xsl:if test="@page = 1"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}" title="Перша сторінка" class="page-link">&lt;&lt;</a>
                </li>
                <li class="page-item">
                    <xsl:if test="@page = 1"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}/{@page - 1}" title="Попередня сторінка" class="page-link">&lt;</a>
                </li>
                <xsl:for-each select="pages/page">
                    <li class="page-item">
                        <xsl:if test="@value=../../@page"><xsl:attribute name="class">page-item active</xsl:attribute></xsl:if>
                        <a href="{../../@uri}/{@value}" title="{@title}" class="page-link"><xsl:value-of select="@value" /></a>
                    </li>
                </xsl:for-each>
                <li class="page-item">
                    <xsl:if test="@page = @pages"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}/{@page + 1}" title="Наступна сторінка" class="page-link">&gt;</a>
                </li>
                <li class="page-item">
                    <xsl:if test="@page = @pages"><xsl:attribute name="class">page-item disabled</xsl:attribute></xsl:if>
                    <a href="{@uri}/{@pages}" title="Остання сторінка" class="page-link">&gt;&gt;</a>
                </li>
            </ul>
        </nav>
    </xsl:template>

    <xsl:template match="debug">
        <div id="debug">
            <xsl:if test="database/queries/query">
                <div class="container mapper">
                    <table class="table">
                        <caption>Запити</caption>
                        <thead>
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">Час</th>
                                <th scope="col">Запит</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="database/queries/query">
                                <tr>
                                    <th scope="row" class="text-right"><xsl:value-of select="position()" />.</th>
                                    <td class="text-right"><xsl:value-of select="@time" /></td>
                                    <td class="text-left string">
                                        <pre><xsl:value-of select="." disable-output-escaping="yes" /></pre>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </xsl:if>
            <xsl:if test="trace/item">
                <div class="container trace">
                    <table class="table">
                        <caption>Відлагодження</caption>
                        <thead>
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">Файл</th>
                                <th scope="col">Рядок</th>
                                <th scope="col">Функція</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="trace/item">
                                <tr>
                                    <th scope="row" class="text-right"><xsl:value-of select="position()" />.</th>
                                    <td class="text-left"><xsl:value-of select="@file" /></td>
                                    <td class="text-right"><xsl:value-of select="@line" /></td>
                                    <td class="text-left"><xsl:value-of select="@function" /></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </xsl:if>
        </div>
    </xsl:template>

    <xsl:template match="pageNotFound">
        <div id="pageNotFound">
            <h2><xsl:value-of select="/root/@description" /></h2>
            <p>Page Not Found (Text)</p>
        </div>
    </xsl:template>

    <xsl:template match="test">
        <div id="test" />
    </xsl:template>

    <xsl:template name="image">
        <xsl:param name="uri" />
        <xsl:param name="title" />
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