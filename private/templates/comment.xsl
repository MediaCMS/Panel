<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для коментарів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/comment">
        <div class="comment"><xsl:apply-templates select="*" /></div>
    </xsl:template>

    <xsl:template match="main/comment/index" mode="extends">
        <table class="table clickable">
            <caption>Список коментарів</caption>
            <thead>
                <tr class="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Дата</th>
                    <th scope="col">Текст</th>
                    <th scope="col">Стаття</th>
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
                        <td class="text-left"><xsl:value-of select="@text" /></td>
                        <td class="text-left"><xsl:value-of select="@article" /></td>
                        <td class="text-center"><xsl:value-of select="@user" /></td>
                        <td class="text-center"><xsl:value-of select="@id" /></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>

    <xsl:template match="main/comment/index/filter" mode="extends">
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
    </xsl:template>

    <xsl:template match="main/comment/edit" mode="extends">
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
    </xsl:template>

</xsl:stylesheet>