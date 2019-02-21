<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для коментарів
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

    <xsl:template match="main/comment/index">
        <xsl:variable name="columns">
            <column name="position" title="#"           align="center" />
            <column name="text"     title="Текст"       align="left" />
            <column name="article"  title="Стаття"      align="left" />
            <column name="user"     title="Користувач"  align="center" />
            <column name="time"     title="Дата"        align="center" />
            <column name="id"       title="ID"          align="center" />
        </xsl:variable>
        <xsl:call-template name="index">
            <xsl:with-param name="title" select="'Список коментарів'" />
            <xsl:with-param name="columns" select="exslt:node-set($columns)" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="main/comment/index/filter">
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
                            <div class="form-group row">
                                <label for="formText" class="col-sm-5 col-form-label">Текст</label>
                                <div class="col-sm-7">
                                    <input type="text" name="text" value="{@text}" placeholder="Фрагмент тексту коментаря"
                                           title="Фільтр за текстом коментаря" id="formText" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formArticle" class="col-sm-5 col-form-label">Стаття</label>
                                <div class="col-sm-7">
                                    <input type="text" name="article" value="{@article}" placeholder="Фрагмент назви статті"
                                           title="Фільтр за назвою статті" id="formArticle" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formUser" class="col-sm-5 col-form-label">Користувач</label>
                                <div class="col-sm-7">
                                    <input type="text" name="user" value="{@user}" placeholder="Фрагмент назви користувача"
                                           title="Фільтр за назвою користувача" id="formUser" class="form-control" />
                                </div>
                            </div>
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

    <xsl:template match="main/comment/edit">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <div class="form-group row">
                <label for="formText" class="col-sm-4 col-form-label">Текст</label>
                <div class="col-sm-8">
                    <textarea name="text" value="{@text}" id="formText" class="form-control"
                              title="Текст коментаря"><xsl:value-of select="@text" /></textarea>
                </div>
            </div>
            <div class="form-group row">
                <label for="formArticle" class="col-sm-4 col-form-label">Стаття</label>
                <div class="col-sm-8">
                    <input type="text" name="article" value="{@article}" readonly="readonly"
                           id="formArticle" class="form-control" title="Назва статті" />
                </div>
            </div>
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

</xsl:stylesheet>