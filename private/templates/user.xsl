<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для користувачів
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

    <xsl:template match="main/user/index">
        <xsl:variable name="columns">
            <column name="position" title="#"       align="center" />
            <column name="title"    title="Назва"   align="left" />
            <column name="phone"    title="Телефон" align="left" />
            <column name="email"    title="Пошта"   align="left" />
            <column name="role"     title="Права"   align="center" />
            <column name="time"     title="Дата"    align="center" />
            <column name="id"       title="ID"      align="center" />
        </xsl:variable>
        <xsl:call-template name="index">
            <xsl:with-param name="title" select="'Список користувачів'" />
            <xsl:with-param name="columns" select="exslt:node-set($columns)" />
        </xsl:call-template>
     </xsl:template>

    <xsl:template match="main/user/index/filter">
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
                                    <input type="text" name="title" value="{@title}" placeholder="Назва"
                                           title="Фільтр за назвою" id="formTitle" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="formRole" class="col-sm-5 col-form-label">Роль</label>
                                <div class="col-sm-7">
                                    <select name="roleID" title="Фільтр за привами доступу" id="formRole" class="form-control">
                                        <xsl:for-each select="roles/role">
                                            <option value="{@id}">
                                                <xsl:if test="@id=../../@roleID">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
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

    <xsl:template match="main/user/edit">
        <form action="" method="POST" enctype="multipart/form-data" class="mx-auto">
            <div class="form-group row">
                <label for="formTitle" class="col-sm-4 col-form-label">Назва</label>
                <div class="col-sm-8">
                    <input type="text" name="title" value="{@title}" placeholder="Прізвище Імя По-батькові"
                           id="formTitle" class="form-control" title="Прізвище Імя По-батькові" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formDescription" class="col-sm-4 col-form-label">Опис</label>
                <div class="col-sm-8">
                    <textarea name="description" value="{@description}" id="formDescription"
                              placeholder="Опис користувача" class="form-control"
                              title="Опис користувача"><xsl:value-of select="@description" /></textarea>
                </div>
            </div>
            <div class="form-group row">
                <label for="formPhone" class="col-sm-4 col-form-label">Телефон</label>
                <div class="col-sm-8">
                    <input type="text" name="phone" value="{@phone}" placeholder="Номер мобільного телефону"
                           id="formPhone" class="form-control" title="Номер мобільного телефону" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formSkype" class="col-sm-4 col-form-label">Skype</label>
                <div class="col-sm-8">
                    <input type="text" name="skype" value="{@skype}" placeholder="Адреса Skype"
                           id="formSkype" class="form-control" title="Адреса Skype" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formEmail" class="col-sm-4 col-form-label">Пошта</label>
                <div class="col-sm-8">
                    <input type="text" name="email" value="{@email}" placeholder="Адреса електронної пошти"
                           id="formEmail" class="form-control" title="Адреса електронної пошти" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formPassword" class="col-sm-4 col-form-label">Пароль</label>
                <div class="col-sm-8">
                    <input type="password" name="password" placeholder="Пароль користувача"
                           id="formPassword" class="form-control" title="Пароль користувача" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formPassword" class="col-sm-4 col-form-label">Пароль (повторно)</label>
                <div class="col-sm-8">
                    <input type="password" name="password2" placeholder="Пароль користувача (повторно)"
                           id="formPassword" class="form-control" title="Пароль користувача (повторно)" />
                </div>
            </div>
            <div class="form-group row">
                <label for="formImage" class="col-sm-4 col-form-label">Зображення</label>
                <div class="col-sm-8">
                    <xsl:call-template name="formImage">
                        <xsl:with-param name="title" select="'Зображення для користувача'" />
                    </xsl:call-template>
                </div>
            </div>
            <div class="form-group row">
                <label for="formRole" class="col-sm-4 col-form-label">Роль</label>
                <div class="col-sm-8">
                    <select name="role" title="Права доступу" id="formRole" class="form-control">
                        <xsl:for-each select="roles/role">
                            <option value="{@id}">
                                <xsl:if test="@id=../../@role">
                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                </xsl:if>
                                <xsl:value-of select="@title" />
                            </option>
                        </xsl:for-each>
                    </select>
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

    <xsl:template match="main/user/login">
         <div class="card d-table mx-auto">
            <div class="card-header">Авторизація</div>
            <div class="card-body ">
                <form class="form" method="POST">
                    <div class="form-group">
                        <input type="email" name="email" value="{@email}" placeholder="Логін" class="form-control text-center" />
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" placeholder="Пароль" class="form-control text-center" />
                    </div>
                    <xsl:if test="not(/root/debug)">
                        <div class="form-group">
                            <div class="recaptcha">
                                <div class="g-recaptcha" data-size="normal"
                                     data-sitekey="{/root/@recaptcha}" />
                                <div class="logo" />
                                <div class="right" />
                                <div class="bottom" />
                            </div>
                        </div>
                    </xsl:if>
                    <div class="form-group text-center pt-3">
                        <input type="submit" name="submit" value="Авторизуватись" class="btn btn-primary" />
                    </div>
                </form>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>