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
        <xsl:variable name="filter">
            <element type="date"   name="dateBegin"    value="{filter/@dateBegin}" title="Початкова дата"  />
            <element type="date"   name="dateEnd"      value="{filter/@dateEnd}"   title="Кінцева дата" />
            <element type="string" name="title"        value="{filter/@title}"     title="Назва" />
            <element type="list"   name="roleID"       value="{filter/@roleID}"    title="Роль">
                <items>
                    <xsl:for-each select="filter/roles/item">
                        <item title="{@title}" value="{@id}" />
                    </xsl:for-each>
                </items>
            </element>
        </xsl:variable>
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
            <xsl:with-param name="filter" select="exslt:node-set($filter)" />
            <xsl:with-param name="columns" select="exslt:node-set($columns)" />
        </xsl:call-template>
     </xsl:template>

    <xsl:template match="main/user/edit">
        <xsl:variable name="elements">
            <element type="string"      name="title"        value="{@title}"        title="Назва" />
            <element type="text"        name="description"  value="{@description}"  title="Опис" />
            <element type="image"       name="image"        value="{@image}"        title="Зображення" />
            <element type="string"      name="phone"        value="{@phone}"        title="Телефон" />
            <element type="string"      name="skype"        value="{@skype}"        title="Skype" />
            <element type="string"      name="email"        value="{@email}"        title="Пошта" />
            <element type="password"    name="password"     value="{@password}"     title="Пароль" />
            <element type="password"    name="password2"    value="{@password2}"    title="Пароль (повторно)" />
            <element type="list"        name="role"         value="{@role}"         title="Роль">
                <items>
                    <xsl:for-each select="roles/role">
                        <item title="{@title}" value="{@id}" />
                    </xsl:for-each>
                </items>
            </element>
            <xsl:if test="@id">
                <element type="string" name="alias" value="{@alias}"    title="Псевдонім"       readonly="true" />
                <element type="string" name="user"  value="{@user}"     title="Користувач"      readonly="true" />
                <element type="string" name="time"  value="{@time}"     title="Дата та час"     readonly="true" />
                <element type="string" name="id"    value="{@id}"       title="Ідентифікатор"   readonly="true" />
            </xsl:if>
        </xsl:variable>
        <xsl:call-template name="form">
            <xsl:with-param name="elements" select="exslt:node-set($elements)" />
        </xsl:call-template>
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