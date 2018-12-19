<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Головний файл виводу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:include href="article.xsl" />
    <xsl:include href="category.xsl" />
    <xsl:include href="tag.xsl" />
    <xsl:include href="comment.xsl" />
    <xsl:include href="page.xsl" />
    <xsl:include href="user.xsl" />
    <xsl:include href="common.xsl" />

    <xsl:output method="html" indent="yes" encoding="UTF-8"  media-type="text/html" />

    <xsl:template match="/*">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html></xsl:text>
        <html xml:lang="uk" lang="uk" dir="ltr" id="root">
            <xsl:if test="debug"><xsl:attribute name="data-debug">true</xsl:attribute></xsl:if>
            <head>
                <title><xsl:value-of select="@title" /></title>
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <link href="/index.css" rel="stylesheet" />
                <link href="/bootstrap.min.css" rel="stylesheet" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=1" />
                <script src="/jquery.min.js" type="application/javascript" />
                <script src="/popper.min.js" type="application/javascript" />
                <script src="/bootstrap.min.js" type="application/javascript" />
                <xsl:if test="not(debug)">
                    <script src='https://www.google.com/recaptcha/api.js' />
                </xsl:if>
                <script src="/index.js" type="application/javascript" />
            </head>
            <body>
                <xsl:if test="menu">
                    <header>
                        <nav class="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
                            <a class="navbar-brand" href="{@hostMain}" title="Головний сайт">
                                <img src="/logo.png" alt="{@logo}" />
                            </a>
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon">&#160;</span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul class="navbar-nav mr-auto">
                                    <xsl:for-each select="menu/item">
                                        <li class="nav-item">
                                            <xsl:if test="@active"><xsl:attribute name="class">nav-item active</xsl:attribute></xsl:if>
                                            <a class="nav-link" href="{@uri}">
                                                <xsl:value-of select="(@title)" /> <span class="sr-only">(current)</span>
                                            </a>
                                        </li>
                                    </xsl:for-each>
                                </ul>
                            </div>
                            <div title="{user/@roleTitle}" class="user text-light"><xsl:value-of select="(user/@title)" />
                                <img src="/user.png" alt="Фото">
                                    <xsl:if test="user/@image">
                                        <xsl:attribute name="src">/thumbnails/<xsl:value-of select="substring(user/@image,1,1)" />/<xsl:value-of select="user/@image" />.0320.jpg</xsl:attribute>
                                    </xsl:if>
                                </img>
                            </div>
                        </nav>
                    </header>
                </xsl:if>
                <xsl:if test="alert">
                    <div class="container text-center my-3">
                        <div class="alert alert-{alert/@type} d-inline-block" role="alert">
                            <xsl:value-of select="alert/@text" />
                        </div>
                    </div>
                </xsl:if>
                <main class="container">
                    <xsl:if test="menu">
                        <div class="row mt-5">
                            <h1 class="col"><xsl:value-of select="@title" /></h1>
                            <xsl:if test="submenu">
                                <nav class="navbar sticky-top navbar-expand-md">
                                    <ul class="col navbar-nav">
                                        <xsl:for-each select="submenu/item">
                                            <li class="nav-item">
                                                <a class="nav-link" href="{@uri}">
                                                    <xsl:if test="@modal">
                                                        <xsl:attribute name="data-toggle">modal</xsl:attribute>
                                                        <xsl:attribute name="data-target"><xsl:value-of select="@modal" /></xsl:attribute>
                                                    </xsl:if>
                                                    <xsl:value-of select="(@title)" /> <span class="sr-only">(current)</span>
                                                </a>
                                            </li>
                                        </xsl:for-each>
                                    </ul>
                                </nav>
                            </xsl:if>
                        </div>
                    </xsl:if>
                    <div class="body controller-{name(main/*/.)} action-{name(main/*/*/.)} mt-4">
                        <xsl:apply-templates select="main/*" />
                    </div>
                </main>
                <footer class="text-center small my-5">
                    <div class="copyright"><xsl:value-of select="@copyright" disable-output-escaping="yes" /></div>
                    <xsl:if test="debug">
                        <div class="debug text-muted my-2">
                            <span title="Загальний час створення сторінки"><xsl:value-of select="debug/@time" /> мс</span>&#160;/
                            <span title="Час витрачений на запит до БД"><xsl:value-of select="debug/database/@time" /> мс</span>&#160;/
                            <span title="Використано пам’яті"><xsl:value-of select="debug/@memory" /> kB</span>&#160;/
                            <span title="Максимальний рівень пам’яті"><xsl:value-of select="debug/@memoryPeak" /> kB</span>
                        </div>
                    </xsl:if>
                </footer>
                <xsl:apply-templates select="debug" />
            </body>
        </html>
    </xsl:template>
<!--
    <xsl:template match="main/*/index">
         <xsl:choose>
            <xsl:when test="items/item">
                <xsl:apply-templates select="." mode="extends" />
                <xsl:apply-templates select="pagination" />
            </xsl:when>
            <xsl:otherwise>Записів не знайдено</xsl:otherwise>
        </xsl:choose>
        <xsl:apply-templates select="filter" />
    </xsl:template>
-->
<!--
    <xsl:template match="main/*/index/filter">
        <div class="modal fade" id="filter" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Фільтр</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&#215;</span>
                        </button>
                    </div>
                    <form action="{@uri}" method="POST">
                        <div class="modal-body">
                            <xsl:apply-templates select="." mode="extends" />
                            <div class="form-group row">
                                <label for="filterStatus" class="col-sm-5 col-form-label">Статус</label>
                                <div class="col-sm-7">
                                    <select name="_status" title="Фільтр за статусом" id="filterStatus" class="form-control">
                                        <xsl:for-each select="statuses/item">
                                            <option value="{@value}">
                                                <xsl:if test="@value=../../@_status">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                            <xsl:if test="orderFields">
                                <div class="form-group row">
                                    <label for="filterOrderField" class="col-sm-5 col-form-label">Поле для сортування</label>
                                    <div class="col-sm-7">
                                        <select name="_orderField" title="Поле для сортування" id="filterOrderField" class="form-control">
                                            <xsl:for-each select="orderFields/item">
                                                <option value="{@field}">
                                                    <xsl:if test="@field=../../@_orderField">
                                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                                    </xsl:if>
                                                    <xsl:value-of select="@title" />
                                                </option>
                                            </xsl:for-each>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="filterOrderDirection" class="col-sm-5 col-form-label">Напрям сортування</label>
                                    <div class="col-sm-7">
                                        <select name="_orderDirection" title="Напрямок сортування" id="filterOrderDirection" class="form-control">
                                            <xsl:for-each select="orderDirections/item">
                                                <option value="{@value}">
                                                    <xsl:if test="@value=../../@_orderDirection">
                                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                                    </xsl:if>
                                                    <xsl:value-of select="@title" />
                                                </option>
                                            </xsl:for-each>
                                        </select>
                                    </div>
                                </div>
                            </xsl:if>
                            <div class="form-group row">
                                <label for="filterLimit" class="col-sm-5 col-form-label">Записів на сторінку</label>
                                <div class="col-sm-7">
                                    <select name="_limit" title="Кількість записів на сторінку" id="filterLimit" class="form-control">
                                        <xsl:for-each select="limits/item">
                                            <option value="{@value}">
                                                <xsl:if test="@value=../../@_limit">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
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
-->
<!--
    <xsl:template match="main/*/edit">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <xsl:apply-templates select="." mode="extends" />
            <xsl:if test="@id">
                <xsl:if test="@alias">
                    <div class="form-group row">
                        <label for="formAlias" class="col-sm-4 col-form-label">Псевдонім</label>
                        <div class="col-sm-8">
                            <input type="text" name="alias" value="{@alias}" readonly="readonly"
                                   id="formAlias" class="form-control" title="Псевдонім" />
                        </div>
                    </div>
                </xsl:if>
                <xsl:if test="@user">
                    <div class="form-group row">
                        <label for="formUser" class="col-sm-4 col-form-label">Користувач</label>
                        <div class="col-sm-8">
                            <input type="text" name="user" value="{@user}" readonly="readonly"
                                   id="formUser" class="form-control" title="Користувач" />
                        </div>
                    </div>
                </xsl:if>
                <div class="form-group row">
                    <label for="formTime" class="col-sm-4 col-form-label">Дата та час</label>
                    <div class="col-sm-8">
                        <input type="text" name="time" value="{@time}" readonly="readonly"
                               id="formTime" class="form-control" title="Дата та час останньої модифікації" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formID" class="col-sm-4 col-form-label">Ідентифікатор</label>
                    <div class="col-sm-8">
                        <input type="text" name="id" value="{@id}" readonly="readonly"
                               id="formID" class="form-control" title="Ідентифікатор" />
                    </div>
                </div>
            </xsl:if>
            <div class="form-group text-center py-5">
                <input type="submit" name="_save" value="Зберегти" class="btn btn-primary mx-1" />
                <xsl:if test="not(@id)">
                    <input type="reset" name="_reset" value="Очистити" class="btn btn-secondary mx-1" />
                </xsl:if>
                <xsl:if test="@id">
                    <input type="submit" name="_delete" value="Видалити" class="btn btn-danger mx-1">
                        <xsl:if test="@status=0">
                            <xsl:attribute name="value">Відновити</xsl:attribute>
                        </xsl:if>
                    </input>
                </xsl:if>
            </div>
        </form>
    </xsl:template>
-->
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

    <xsl:template match="pageNotFound">
        <div id="pageNotFound">
            <h2><xsl:value-of select="/root/@description" /></h2>
            <p>Page Not Found (Text)</p>
        </div>
    </xsl:template>

    <xsl:template match="test">
        <div id="test" />
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

</xsl:stylesheet>