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

    <xsl:template match="main/article/index" mode="extends">
        <table class="table clickable">
            <caption>Список статей</caption>
            <thead>
                <tr class="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Назва</th>
                    <th scope="col">Категорія</th>
                    <th scope="col">Автор</th>
                    <th scope="col">ID</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="items/item">
                    <tr data-edit="{@edit}">
                        <xsl:if test="@status=0">
                            <xsl:attribute name="class">disabled</xsl:attribute>
                        </xsl:if>
                        <th scope="row" class="text-center"><xsl:value-of select="@position" />.</th>
                        <td class="text-center"><xsl:value-of select="@time" /></td>
                        <td class="text-left"><xsl:value-of select="@title" /></td>
                        <td class="text-center"><xsl:value-of select="@category" /></td>
                        <td class="text-center"><xsl:value-of select="@user" /></td>
                        <td class="text-center"><xsl:value-of select="@id" /></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>

    <xsl:template match="main/article/index/filter" mode="extends">
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
            <label for="formUser" class="col-sm-5 col-form-label">Автор</label>
            <div class="col-sm-7">
                <input type="text" name="user" value="{@user}" placeholder="Фрагмент назви автора"
                       title="Фільтр за назвою автора" id="formUser" class="form-control" />
            </div>
        </div>
    </xsl:template>

    <xsl:template match="main/article/edit" mode="extends">
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
                          placeholder="Опис сторінки" class="form-control"
                          title="Опис сторінки"><xsl:value-of select="@description" /></textarea>
            </div>
        </div>
        <div class="form-group row">
            <label for="formText" class="col-sm-4 col-form-label">Текст</label>
            <div class="col-sm-8">
                <textarea name="text" value="{@text}" id="formText"
                          placeholder="Текст сторінки" class="form-control"
                          title="Текст сторінки"><xsl:value-of select="@text" /></textarea>
            </div>
        </div>
        <div class="form-group row">
            <label for="formImage" class="col-sm-4 col-form-label">Зображення</label>
            <div class="col-sm-8">
                <input type="file" name="image" id="formImage" class="form-control" title="Зображення для сторінки" />
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
    </xsl:template>

</xsl:stylesheet>