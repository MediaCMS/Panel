<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статей
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<!--
    <patterns>
        <forms>
            <form id="article" title="" pagination="true">
                <fields>
                    <field id="title" title="" description="" type="" />
                    <field id="description" title="" description="" type="" />

                    <field id="status" title="" description="" type="" />
                </fields>
            </form>
        </forms>
        <tables>

        </tables>
    </patterns>
-->


    <xsl:template match="main/article/index">
        <xsl:choose>
            <xsl:when test="articles/article">
                <table class="table clickable">
                    <caption>Список статей</caption>
                    <thead>
                        <tr class="text-center">
                            <th scope="col">#</th>
                            <th scope="col">Дата</th>
                            <th scope="col">Назва</th>
                            <th scope="col">Категорія</th>
                            <th scope="col">Мітки</th>
                            <th scope="col">Автор</th>
                            <th scope="col">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="articles/article">
                            <tr data-edit="{@edit}">
                                <xsl:if test="@status=0">
                                    <xsl:attribute name="class">disabled</xsl:attribute>
                                </xsl:if>
                                <th scope="row" class="text-center"><xsl:value-of select="@position" />.</th>
                                <td class="text-center"><xsl:value-of select="@time" /></td>
                                <td class="text-center"><xsl:value-of select="@title" /></td>
                                <td class="text-center"><xsl:value-of select="@category" /></td>
                                <td class="text-center"><xsl:value-of select="@tags" /></td>
                                <td class="text-center"><xsl:value-of select="@user" /></td>
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

    <xsl:template match="main/article/index/filter">
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
                                <label for="formDateBegin" class="col-sm-5 col-form-label">Початкова дата</label>
                                <div class="col-sm-7">
                                    <input type="date" name="dateBegin" value="{@dateBegin}"
                                           title="Фільтр за початковою датою" id="formDateBegin" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formDateEnd" class="col-sm-5 col-form-label">Кінцева дата</label>
                                <div class="col-sm-7">
                                    <input type="date" name="dateEnd" value="{@dateEnd}"
                                           title="Фільтр за кінцевою датою" id="formDateEnd" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formTitle" class="col-sm-5 col-form-label">Назва</label>
                                <div class="col-sm-7">
                                    <input type="text" name="title" value="{@title}" placeholder="Фрагмент назви статті"
                                           title="Фільтр за назвою статті" id="formTitle" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formCategory" class="col-sm-5 col-form-label">Категорія</label>
                                <div class="col-sm-7">
                                    <input type="text" name="category" value="{@category}" placeholder="Фрагмент назви категорії"
                                           title="Фільтр за назвою категорії" id="formCategory" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formTag" class="col-sm-5 col-form-label">Мітка</label>
                                <div class="col-sm-7">
                                    <input type="text" name="tag" value="{@tag}" placeholder="Фрагмент назви мітки"
                                           title="Фільтр за назвою мітки" id="formTag" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formUser" class="col-sm-5 col-form-label">Автор</label>
                                <div class="col-sm-7">
                                    <input type="text" name="user" value="{@user}" placeholder="Фрагмент назви автора"
                                           title="Фільтр за назвою автора" id="formUser" class="form-control" />
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

    <xsl:template match="main/article/edit">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <div class="form-group row">
                <label for="formTitle" class="col-sm-4 col-form-label">Назва</label>
                <div class="col-sm-8">
                    <input type="text" name="title" value="{@title}" placeholder="Назва статті"
                           id="formTitle" class="form-control" title="Назва статті" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formDescription" class="col-sm-4 col-form-label">Опис</label>
                <div class="col-sm-8">
                    <textarea name="description" value="{@description}" id="formDescription"
                              placeholder="Опис статті" class="form-control"
                              title="Опис сторінки"><xsl:value-of select="@description" /></textarea>
                </div>
            </div>
            <div class="form-group row">
                <label for="formText" class="col-sm-4 col-form-label">Текст</label>
                <div class="col-sm-8">
                    <textarea name="text" value="{@text}" id="formText"
                              placeholder="Текст статті" class="form-control"
                              title="Текст сторінки"><xsl:value-of select="@text" /></textarea>
                </div>
            </div>
            <div class="form-group row">
                <label for="formImage" class="col-sm-4 col-form-label">Зображення</label>
                <div class="col-sm-8">
                    <input type="file" name="image" id="formImage" class="form-control" title="Зображення для статті">
                        <xsl:if test="@image">
                            <xsl:attribute name="class">form-control d-none</xsl:attribute>
                        </xsl:if>
                    </input>
                    <xsl:if test="@image">
                        <div class="image" title="Видалити зображення">
                            <img src="/thumbnails/{substring(@image,1,1)}/{@image}.0320.jpg" />
                            <input type="hidden" name="image" value="{@image}" />
                            <svg height="100%" width="100%">
                                <line x1="0" y1="0" x2="100%" y2="100%" style="stroke:#ccc;stroke-width:1" />
                                <line x1="100%" y1="0" x2="0" y2="100%" style="stroke:#ccc;stroke-width:1" />
                            </svg>
                        </div>
                    </xsl:if>
                </div>
            </div>
            <div class="form-group row">
                <label for="formCategory" class="col-sm-4 col-form-label">Категорія</label>
                <div class="col-sm-8">
                    <select name="category" title="Категорія" id="formRole" class="form-control">
                        <xsl:for-each select="categories/category">
                            <option value="{@id}">
                                <xsl:if test="@id=../../@category">
                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                </xsl:if>
                                <xsl:value-of select="@title" />
                            </option>
                        </xsl:for-each>
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <label for="formTag" class="col-sm-4 col-form-label">Мітки</label>
                <div class="autocomplete col-sm-8">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><img src="/search.png" alt="Пошук" /></span>
                        </div>
                        <input type="text" list="formTagList" autocomplete="off"
                               data-api="/мітки/автозаповнення" placeholder="Введіть літери для пошуку.."
                               id="formTag" class="autocomplete-input form-control" title="Мітки для статті" />
                    </div>
                    <xsl:if test="tags">
                        <div class="autocomplete-selected">
                            <xsl:for-each select="tags/*">
                                <button type="button" class="btn btn-outline-secondary">
                                    <xsl:value-of select="@title" />
                                    <input type="hidden" name="tags[{@id}]" value="{@title}" />
                                </button>
                            </xsl:for-each>
                        </div>
                    </xsl:if>
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