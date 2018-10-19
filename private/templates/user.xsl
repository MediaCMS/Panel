<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="main/user/index" mode="extends">
         <table class="table clickable">
            <caption>Список користувачів</caption>
            <thead>
                <tr class="text-center">
                    <th scope="col">#</th>
                    <th scope="col">Назва</th>
                    <th scope="col">Телефон</th>
                    <th scope="col">Пошта</th>
                    <th scope="col">Доступ</th>
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
                        <th scope="row" class="text-right"><xsl:value-of select="@position" />.</th>
                        <td class="text-left"><xsl:value-of select="@title" /></td>
                        <td class="text-left"><xsl:value-of select="@phone" /></td>
                        <td class="text-left"><xsl:value-of select="@email" /></td>
                        <td class="text-center"><xsl:value-of select="@role" /></td>
                        <td class="text-center"><xsl:value-of select="@time" /></td>
                        <td class="text-center"><xsl:value-of select="@id" /></td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>

    <xsl:template match="main/user/index/filter" mode="extends">
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
                    <xsl:for-each select="roles/item">
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
    </xsl:template>

    <xsl:template match="main/user/edit" mode="extends">
        <div class="form-group row">
            <label for="formTitle" class="col-sm-4 col-form-label">Найменування</label>
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