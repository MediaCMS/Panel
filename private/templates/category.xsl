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

    <xsl:template match="main/category/index" mode="extends">
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
                <xsl:for-each select="items/item">
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
    </xsl:template>

    <xsl:template match="main/category/index/filter" mode="extends">
        <div class="form-group row">
            <label for="formTitle" class="col-sm-5 col-form-label">Назва</label>
            <div class="col-sm-7">
                <input type="text" name="title" value="{@title}" placeholder="Фрагмент назви категорії"
                       title="Фільтр за назвою категорії" id="formTitle" class="form-control" />
            </div>
        </div>
    </xsl:template>

    <xsl:template match="main/category/edit" mode="extends">
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
                <input type="file" name="image" id="formImage" class="form-control" title="Зображення для категорії" />
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>