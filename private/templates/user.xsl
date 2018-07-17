<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для користувачів
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="UserIndex">
        <div id="user-index">
            <xsl:choose>
                <xsl:when test="users/user">
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
                            <xsl:for-each select="users/user">
                                <tr data-edit="{@edit}">
                                    <xsl:if test="@status=0">
                                        <xsl:attribute name="class">disabled</xsl:attribute>
                                    </xsl:if>
                                    <th scope="row" class="text-right"><xsl:value-of select="@position" />.</th>
                                    <td class="text-left"><xsl:value-of select="@title" /></td>
                                    <td class="text-left"><xsl:value-of select="@phone" /></td>
                                    <td class="text-left"><xsl:value-of select="@email" /></td>
                                    <td class="text-center"><xsl:value-of select="@roleTitle" /></td>
                                    <td class="text-center"><xsl:value-of select="@time" /></td>
                                    <td class="text-center"><xsl:value-of select="@id" /></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </xsl:when>
                <xsl:otherwise>Записів не знайдено</xsl:otherwise>
            </xsl:choose>
            <xsl:apply-templates select="pagination" />
            <xsl:apply-templates select="filter" />
        </div>
    </xsl:template>

    <xsl:template match="UserIndex/filter">
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
                                <label for="userDateBegin" class="col-sm-5 col-form-label">Початкова дата</label>
                                <div class="col-sm-7">
                                    <input type="date" name="dateBegin" value="{@dateBegin}"
                                           title="Фільтр за початковою датою" id="userDateBegin" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userDateEnd" class="col-sm-5 col-form-label">Кінцева дата</label>
                                <div class="col-sm-7">
                                    <input type="date" name="dateEnd" value="{@dateEnd}"
                                           title="Фільтр за кінцевою датою" id="userDateEnd" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userTitle" class="col-sm-5 col-form-label">Назва</label>
                                <div class="col-sm-7">
                                    <input type="text" name="title" value="{@title}" placeholder="Іванов"
                                           title="Фільтр за назвою" id="userTitle" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userRole" class="col-sm-5 col-form-label">Роль</label>
                                <div class="col-sm-7">
                                    <select name="roleID" title="Фільтр за привами доступу" id="userRole" class="form-control">
                                        <xsl:for-each select="roles/role">
                                            <option value="{@id}">
                                                <xsl:if test="@active">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userStatus" class="col-sm-5 col-form-label">Статус</label>
                                <div class="col-sm-7">
                                    <select name="status" title="Фільтр за статусом" id="userStatus" class="form-control">
                                        <xsl:for-each select="statuses/status">
                                            <option value="{@key}">
                                                <xsl:if test="@key=../@value">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userOrderField" class="col-sm-5 col-form-label">Поле для сортування</label>
                                <div class="col-sm-7">
                                    <select name="orderField" title="Поле для сортування" id="userOrderField" class="form-control">
                                        <xsl:for-each select="order/fields/field">
                                            <option value="{@field}">
                                                <xsl:if test="@field=../../@field">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userOrderDirection" class="col-sm-5 col-form-label">Напрям сортування</label>
                                <div class="col-sm-7">
                                    <select name="orderDirection" title="Напрямок сортування" id="userOrderDirection" class="form-control">
                                        <xsl:for-each select="order/directions/direction">
                                            <option value="{@code}">
                                                <xsl:if test="@code=../../@direction">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                     </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="userRowsLimit" class="col-sm-5 col-form-label">Записів на сторінку</label>
                                <div class="col-sm-7">
                                    <select name="rowsLimit" title="Кількість записів на сторінку" id="userRowsLimit" class="form-control">
                                        <xsl:for-each select="rows/limits/limit">
                                            <option value="{@value}">
                                                <xsl:if test="@value=../../@limit">
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

    <xsl:template match="UserEdit">
        <div id="user-edit" class="container mt-5">
            <form action="" method="POST" class="col-5 mx-auto">
                <div class="form-group row">
                    <label for="formTitle" class="col-sm-4 col-form-label">Найменування</label>
                    <div class="col-sm-8">
                        <input type="text" name="title" value="{@title}"
                               id="formTitle" class="form-control" title="Прізвище Імя По-батькові" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formDescription" class="col-sm-4 col-form-label">Опис</label>
                    <div class="col-sm-8">
                        <textarea name="description" value="{@description}" id="formDescription" class="form-control"
                                  title="Опис користувача"><xsl:value-of select="@description" /></textarea>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formPhone" class="col-sm-4 col-form-label">Телефон</label>
                    <div class="col-sm-8">
                        <input type="text" name="phone" value="{@phone}"
                               id="formPhone" class="form-control" title="Номер мобільного телефону" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formSkype" class="col-sm-4 col-form-label">Skype</label>
                    <div class="col-sm-8">
                        <input type="text" name="skype" value="{@skype}"
                               id="formSkype" class="form-control" title="Адреса Skype" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formEmail" class="col-sm-4 col-form-label">Пошта</label>
                    <div class="col-sm-8">
                        <input type="text" name="email" value="{@email}"
                               id="formEmail" class="form-control" title="Адреса електронної пошти" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formPassword" class="col-sm-4 col-form-label">Пароль</label>
                    <div class="col-sm-8">
                        <input type="password" name="password"
                               id="formPassword" class="form-control" title="Пароль користувача" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="formRole" class="col-sm-4 col-form-label">Роль</label>
                    <div class="col-sm-8">
                        <select name="roleID" title="Права доступу" id="formRole" class="form-control">
                            <xsl:for-each select="roles/role">
                                <option value="{@id}">
                                    <xsl:if test="@active">
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
                        <label for="formTime" class="col-sm-4 col-form-label">Дата та час</label>
                        <div class="col-sm-8">
                            <input type="text" value="{@time}" readonly="readonly"
                                   id="formTime" class="form-control" title="Дата та час останньої модифікації користувача" />
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="formID" class="col-sm-4 col-form-label">Ідентифікатор</label>
                        <div class="col-sm-8">
                            <input type="text" value="{@id}" readonly="readonly"
                                   id="formID" class="form-control" title="Ідентифікатор користувача" />
                        </div>
                    </div>
                </xsl:if>
                <div class="form-group text-center py-5">
                    <input type="submit" name="save" value="Зберегти" class="btn btn-primary mx-1" />
                    <xsl:if test="not(@id)">
                        <input type="reset" name="reset" value="Очистити" class="btn btn-secondary mx-1" />
                    </xsl:if>
                    <xsl:if test="@id">
                        <input type="submit" name="delete" value="Видалити" class="btn btn-danger mx-1">
                            <xsl:if test="@status=0">
                                <xsl:attribute name="value">Відновити</xsl:attribute>
                            </xsl:if>
                        </input>
                    </xsl:if>
                    <xsl:if test="@id"><input type="hidden" name="id" value="{@id}" /></xsl:if>
                </div>
            </form>
        </div>
    </xsl:template>

</xsl:stylesheet>