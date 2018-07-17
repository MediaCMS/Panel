<?xml version="1.0" encoding="UTF-8" ?>
<!--
/**
 * Файл виводу для статичних сторінок
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="PageIndex">
        <div id="page-index">
            <xsl:choose>
                <xsl:when test="pages/page">
                    <table class="table clickable">
                        <caption>Список сторінок</caption>
                        <thead>
                            <tr class="text-center">
                                <th scope="col">#</th>
                                <th scope="col">Назва</th>
                                <th scope="col">Автор</th>
                                <th scope="col">Дата</th>
                                <th scope="col">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="pages/page">
                                <tr data-edit="{@edit}">
                                    <xsl:if test="@status=0">
                                        <xsl:attribute name="class">disabled</xsl:attribute>
                                    </xsl:if>
                                    <th scope="row" class="text-right"><xsl:value-of select="@position" />.</th>
                                    <td class="text-left"><xsl:value-of select="@title" /></td>
                                    <td class="text-center"><xsl:value-of select="@userTitle" /></td>
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

    <xsl:template match="PageIndex/filter">
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
                                <label for="pageDateBegin" class="col-sm-5 col-form-label">Початкова дата</label>
                                <div class="col-sm-7">
                                    <input type="date" name="dateBegin" value="{@dateBegin}"
                                           title="Фільтр за початковою датою" id="pageDateBegin" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="pageDateEnd" class="col-sm-5 col-form-label">Кінцева дата</label>
                                <div class="col-sm-7">
                                    <input type="date" name="dateEnd" value="{@dateEnd}"
                                           title="Фільтр за кінцевою датою" id="pageDateEnd" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="pageTitle" class="col-sm-5 col-form-label">Назва</label>
                                <div class="col-sm-7">
                                    <input type="text" name="title" value="{@title}" placeholder="Назва сторінки"
                                           title="Фільтр за назвою сторінки" id="pageTitle" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="pageUser" class="col-sm-5 col-form-label">Користувач</label>
                                <div class="col-sm-7">
                                    <select name="user" title="Фільтр за привами доступу" id="pageUser" class="form-control">
                                        <xsl:for-each select="users/user">
                                            <option value="{@id}">
                                                <xsl:if test="@id=../../@user">
                                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                                </xsl:if>
                                                <xsl:value-of select="@title" />
                                            </option>
                                        </xsl:for-each>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="pageStatus" class="col-sm-5 col-form-label">Статус</label>
                                <div class="col-sm-7">
                                    <select name="status" title="Фільтр за статусом" id="pageStatus" class="form-control">
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
                                <label for="pageOrderField" class="col-sm-5 col-form-label">Поле для сортування</label>
                                <div class="col-sm-7">
                                    <select name="orderField" title="Поле для сортування" id="pageOrderField" class="form-control">
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
                                <label for="pageOrderDirection" class="col-sm-5 col-form-label">Напрям сортування</label>
                                <div class="col-sm-7">
                                    <select name="orderDirection" title="Напрямок сортування" id="pageOrderDirection" class="form-control">
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
                                <label for="pageRowsLimit" class="col-sm-5 col-form-label">Записів на сторінку</label>
                                <div class="col-sm-7">
                                    <select name="rowsLimit" title="Кількість записів на сторінку" id="pageRowsLimit" class="form-control">
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

    <xsl:template match="PageEdit">
        <div id="page-edit" class="container mt-5">
            <form action="" method="POST" class="col-5 mx-auto">
                <div class="form-group row">
                    <label for="formTitle" class="col-sm-4 col-form-label">Найменування</label>
                    <div class="col-sm-8">
                        <input type="text" name="title" value="{@title}"
                               id="formTitle" class="form-control" title="Прізвище Імя По-батькові" />
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