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
<xsl:stylesheet version="1.0" exclude-result-prefixes="exslt my"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:exslt="http://exslt.org/common"
                xmlns:my="https://github.com/MediaCMS">

    <xsl:template name="image">
        <xsl:param name="uri" />
        <xsl:param name="title" />
        <img data-uri="{$uri}">
            <xsl:if test="string-length($title) &gt; 0">
                <xsl:attribute name="alt"><xsl:value-of select="$title" /></xsl:attribute>
            </xsl:if>
        </img>
    </xsl:template>

    <xsl:template name="index">
        <xsl:param name="filter" />
        <xsl:param name="columns" />
        <xsl:variable name="index">
            <my:index edit="{@edit}">
                <filter index="{@index}">
                    <elements>
                        <xsl:copy-of select="$filter" />
                        <xsl:if test="filter/statuses">
                            <element type="list" name="_status" value="{filter/@_status}" title="Статус">
                                <items><xsl:copy-of select="filter/statuses/item" /></items>
                            </element>
                        </xsl:if>
                        <xsl:if test="filter/orderFields">
                            <element type="list" name="_orderField" value="{filter/@_orderField}" title="Поле сортування">
                                <items><xsl:copy-of select="filter/orderFields/item" /></items>
                            </element>
                        </xsl:if>
                        <xsl:if test="filter/orderDirections">
                            <element type="list" name="_orderDirection" value="{filter/@_orderDirection}" title="Напрям сортування">
                                <items><xsl:copy-of select="filter/orderDirections/item" /></items>
                            </element>
                        </xsl:if>
                        <xsl:if test="filter/limits">
                            <element type="list" name="_limit" value="{filter/@_limit}" title="Записів на сторінку">
                                <items><xsl:copy-of select="filter/limits/item" /></items>
                            </element>
                        </xsl:if>
                    </elements>
                </filter>
                <columns><xsl:copy-of select="$columns" /></columns>
                <xsl:copy-of select="items" />
                <xsl:copy-of select="pagination" />
            </my:index>
        </xsl:variable>
        <xsl:apply-templates select="exslt:node-set($index)" />
    </xsl:template>

    <xsl:template name="form">
        <xsl:param name="elements" />
        <xsl:param name="buttons" />
        <xsl:variable name="form">
            <my:form>
                <xsl:if test="@id">
                    <xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
                </xsl:if>
                <xsl:if test="$elements/element[@extended]">
                    <xsl:attribute name="type">extended</xsl:attribute>
                </xsl:if>
                <elements><xsl:copy-of select="$elements" /></elements>
                <buttons>
                    <button name="_save" title="Зберегти" color="primary" />
                    <xsl:choose>
                        <xsl:when test="@id">
                            <button name="_delete" title="Видалити" color="danger">
                                <xsl:if test="@status=0">
                                    <xsl:attribute name="title">Відновити</xsl:attribute>
                                </xsl:if>
                            </button>
                        </xsl:when>
                        <xsl:otherwise>
                            <button name="_reset" title="Очистити" color="secondary" />
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:copy-of select="$buttons" />
                </buttons>
            </my:form>
        </xsl:variable>
        <xsl:apply-templates select="exslt:node-set($form)" />
    </xsl:template>

    <xsl:template match="pagination">
        <nav aria-label="Page navigation example" class="mt-5">
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
        <div id="debug" class="container text-center">
            <xsl:if test="database/queries/query">
                <div class="mapper">
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
            <div class="xml text-left d-inline-block">
                <pre><xsl:value-of select="xml" /></pre>
            </div>
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

</xsl:stylesheet>