<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статей
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

    <xsl:template match="main/article/index">
        <xsl:variable name="filter">
            <item type="date"   name="dateBegin"    value="{filter/@dateBegin}" title="Початкова дата"  />
            <item type="date"   name="dateEnd"      value="{filter/@dateEnd}"   title="Кінцева дата" />
            <item type="string" name="title"        value="{filter/@title}"     title="Назва" />
            <item type="string" name="category"     value="{filter/@category}"  title="Категорія" />
            <item type="string" name="tag"          value="{filter/@tag}"       title="Мітка" />
            <xsl:if test="/root/user/@roleID&lt;4">
                <item type="string" name="userTitle" value="{@userTitle}" title="Автор" />
            </xsl:if>
        </xsl:variable>
        <xsl:variable name="columns">
            <column name="position" title="#"           align="center" />
            <column name="time"     title="Дата"        align="center" />
            <column name="title"    title="Назва"       align="left" />
            <column name="category" title="Категорія"   align="center" />
            <column name="tags"     title="Мітки"       align="center" />
            <column name="user"     title="Користувач"  align="center" />
            <column name="id"       title="ID"          align="center" />
        </xsl:variable>
        <xsl:call-template name="index">
            <xsl:with-param name="filter" select="exslt:node-set($filter)" />
            <xsl:with-param name="columns" select="exslt:node-set($columns)" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="main/article/edit">
        <xsl:variable name="elements">
            <element type="string" name="title" value="{@title}" title="Назва" extended="true" />
            <element type="text" name="description" value="{@description}" title="Опис" extended="true" />
            <element type="wysiwyg" name="text" title="Текст" extended="true">
                <value><xsl:value-of select="@text" /></value>
            </element>
            <element type="image" name="image" value="{@image}" title="Зображення" />
            <element type="list" name="category" value="{@category}" title="Категорія">
                <items>
                    <xsl:for-each select="categories/category">
                        <item title="{@title}" value="{@id}" />
                    </xsl:for-each>
                </items>
            </element>
            <element type="autocomplete" name="tags" title="Мітки" uri="/мітки/автозаповнення">
                <items>
                    <xsl:for-each select="tags/tag">
                        <item title="{@title}" value="{@id}" />
                    </xsl:for-each>
                </items>
            </element>
            <xsl:if test="@id">
                <element type="string" name="alias" value="{@alias}" title="Псевдонім" readonly="true" />
                <element type="string" name="user" value="{@user}" title="Користувач" readonly="true" />
                <element type="string" name="time" value="{@time}" title="Дата та час" readonly="true" />
                <element type="string" name="id" value="{@id}" title="Ідентифікатор" readonly="true" />
            </xsl:if>
        </xsl:variable>
        <xsl:call-template name="form">
            <xsl:with-param name="elements" select="exslt:node-set($elements)" />
        </xsl:call-template>

        <!--
        <form action="" method="POST" enctype="multipart/form-data" class="extended mx-auto">
            <div class="form-group row">
                <div class="col-sm-12">
                    <input type="text" name="title" value="{@title}" placeholder="Назва статті"
                           id="formTitle" class="form-control" title="Назва статті" />
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-12">
                    <textarea name="description" value="{@description}" id="formDescription"
                              placeholder="Опис статті" class="form-control"
                              title="Опис сторінки"><xsl:value-of select="@description" /></textarea>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-12">
                    <textarea name="text" value="{@text}" id="formText"
                              placeholder="Текст статті" class="wysiwyg form-control"
                              title="Текст сторінки"><xsl:value-of select="@text" /></textarea>
                </div>
            </div>
            <div class="standard mx-auto">
                <div class="form-group row">
                    <label for="formImage" class="col-sm-4 col-form-label">Зображення</label>
                    <div class="col-sm-8">
                        <xsl:call-template name="formImage">
                            <xsl:with-param name="title" select="'Зображення для статті'" />
                        </xsl:call-template>
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
        -->
    </xsl:template>

</xsl:stylesheet>