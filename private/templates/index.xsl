<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Головний файл виводу
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:include href="publication.xsl" />
    <xsl:include href="category.xsl" />
    <xsl:include href="tag.xsl" />
    <xsl:include href="comment.xsl" />
    <xsl:include href="page.xsl" />
    <xsl:include href="user.xsl" />

    <xsl:output method="html" indent="yes" encoding="UTF-8"  media-type="text/html" />

    <xsl:template match="/*">
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html></xsl:text>
        <html xml:lang="uk" lang="uk" dir="ltr" id="root">
            <xsl:if test="(@debug=1)"><xsl:attribute name="data-debug">true</xsl:attribute></xsl:if>
            <head>
                <title><xsl:value-of select="@title" /></title>
                <meta name="viewport" content="width=device-width,initial-scale=1.0" />
                <link href="/index.css" rel="stylesheet" />
                <link href="/bootstrap.min.css" rel="stylesheet" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=1" />
                <script src="/jquery.min.js" type="application/javascript" />
                <script src="/popper.min.js" type="application/javascript" />
                <script src="/bootstrap.min.js" type="application/javascript" />
                <xsl:if test="@recaptcha">
                    <script src='https://www.google.com/recaptcha/api.js' />
                </xsl:if>
                <script src="/index.js" type="application/javascript" />
            </head>
            <body>
                <xsl:if test="menu">
                    <header>
                        <nav class="navbar sticky-top navbar-expand-md navbar-dark bg-dark">
                            <a class="navbar-brand" href="{/root/@hostMain}" title="Головний сайт">
                                <img src="/logo.png" alt="Медіа" />
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
                                <xsl:if test="submenu">
                                    <ul class="navbar-nav">
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
                                </xsl:if>
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
                <main class="{name(main/*[1])} container">
                    <xsl:if test="menu"><h1 class="mt-5"><xsl:value-of select="@title" /></h1></xsl:if>
                    <div class="body mt-4"><xsl:apply-templates select="main/*[1]" /></div>
                </main>
                <footer class="text-center small my-5">
                    <div class="copyright"><xsl:value-of select="@copyright" disable-output-escaping="yes" /></div>
                    <xsl:if test="debug">
                        <div class="debug text-muted my-2">
                            <span title="Загальний час"><xsl:value-of select="debug/@time" /> мс</span>&#160;/
                            <span title="Час витрачений на Mapper"><xsl:value-of select="debug/mapper/@time" /> мс</span>&#160;/
                            <span title="Використано пам’яті"><xsl:value-of select="debug/@memory" /> kB</span>&#160;/
                            <span title="Максимальний рівень пам’яті"><xsl:value-of select="debug/@memoryPeak" /> kB</span>
                        </div>
                    </xsl:if>
                </footer>
                <xsl:apply-templates select="debug" />
            </body>
        </html>
    </xsl:template>

    <xsl:template match="AccessLogin">
        <div id="access-login">
            <div class="card d-table mx-auto">
                <div class="card-header">Авторизація</div>
                <div class="card-body ">
                    <form class="form" method="POST">
                        <div class="form-group">
                            <input type="email" name="login" value="{@login}" placeholder="Логін" class="form-control text-center" />
                        </div>
                        <div class="form-group">
                            <input type="password" name="password" placeholder="Пароль" class="form-control text-center" />
                        </div>
                        <!--
                        <div class="form-group">
                            <div class="recaptcha">
                                <div class="g-recaptcha" data-size="normal"
                                     data-sitekey="{/root/@recaptcha}" />
                                <div class="logo" />
                                <div class="right" />
                                <div class="bottom" />
                            </div>
                        </div>
                        -->
                        <!--
                        <div class="form-group text-center">
                            <input type="checkbox" name="remember-me" value="1">
                                <xsl:if test="@rememberMe">
                                    <xsl:attribute name="checked">checked</xsl:attribute>
                                </xsl:if>
                            </input>&#160;&#160;Запам'ятати мене
                        </div>
                        -->
                        <div class="form-group text-center pt-3">
                            <input type="submit" name="submit" value="Авторизуватись" class="btn btn-primary" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
            <xsl:if test="mapper/queries/query">
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
                            <xsl:for-each select="mapper/queries/query">
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