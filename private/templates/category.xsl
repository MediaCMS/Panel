<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для категорій
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/category/index">
        <xsl:choose>
            <xsl:when test="categories/category">
                <table class="table clickable">
                    <caption>Список категорій</caption>
                    <thead>
                        <tr class="text-center">
                            <th scope="col">#</th>
                            <th scope="col">Назва</th>
                            <th scope="col">Адміністратор</th>
                            <th scope="col">Дата</th>
                            <th scope="col">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="categories/category">
                            <tr data-edit="{@edit}">
                                <xsl:if test="@status=0">
                                    <xsl:attribute name="class">disabled</xsl:attribute>
                                </xsl:if>
                                <th scope="row" class="text-center"><xsl:value-of select="@position" />.</th>
                                <td class="text-left"><xsl:value-of select="@title" /></td>
                                <td class="text-center"><xsl:value-of select="@user" /></td>
                                <td class="text-center"><xsl:value-of select="@time" /></td>
                                <td class="text-center"><xsl:value-of select="@id" /></td>
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

    <xsl:template match="main/category/index/filter">
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
                                <label for="formTitle" class="col-sm-5 col-form-label">Назва</label>
                                <div class="col-sm-7">
                                    <input type="text" name="title" value="{@title}" placeholder="Фрагмент назви категорії"
                                           title="Фільтр за назвою категорії" id="formTitle" class="form-control" />
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

    <xsl:template match="main/category/edit">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <div class="form-group row">
                <label for="formTitle" class="col-sm-4 col-form-label">Назва</label>
                <div class="col-sm-8">
                    <input type="text" name="title" value="{@title}" placeholder="Назва категорії"
                           id="formTitle" class="form-control" title="Назва категорії" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formDescription" class="col-sm-4 col-form-label">Опис</label>
                <div class="col-sm-8">
                    <textarea name="description" value="{@description}" id="formDescription"
                              placeholder="Опис категорії" class="form-control"
                              title="Опис категорії"><xsl:value-of select="@description" /></textarea>
                </div>
            </div>
            <div class="form-group row">
                <label for="formImage" class="col-sm-4 col-form-label">Зображення</label>
                <div class="col-sm-8">
                    <xsl:call-template name="formImage">
                        <xsl:with-param name="title" select="'Зображення для категорії'" />
                    </xsl:call-template>
                </div>
            </div>
            <xsl:if test="@id">
                <div class="form-group row">
                    <label for="formAlias" class="col-sm-4 col-form-label">Псевдонім</label>
                    <div class="col-sm-8">
                        <input type="text" name="alias" value="{@alias}" readonly="readonly"
                               id="formAlias" class="form-control" title="Псевдонім" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formUser" class="col-sm-4 col-form-label">Користувач</label>
                    <div class="col-sm-8">
                        <input type="text" name="user" value="{@user}" readonly="readonly"
                               id="formUser" class="form-control" title="Користувач" />
                    </div>
                </div>
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

</xsl:stylesheet>