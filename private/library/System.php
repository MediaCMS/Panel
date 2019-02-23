<?php
/**
 * Системні статичні функції
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class System {

    /**
     * Повертає ip-адресу користувача
     *
     * @return string IP-адреса
     */
    public static function getIP() : string {

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {

            $ip = $_SERVER['HTTP_CLIENT_IP'];

        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {

            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];

        } else {

            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

    /**
     * Конвертує строку в псевдонім
     *
     * @param string $string Строка з текстом
     * @return string IP-адреса
     */
    public static function getAlias(string $string ): string {
/*
        $chars = [

            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'h', 'ґ' => 'g', 'д' => 'd', 'е' => 'e', 'є' => 'ie',

            'ж' => 'zh', 'з' => 'z', 'и' => 'y', 'і' => 'i', 'ї' => 'i', 'й' => 'i', 'к' => 'k', 'л' => 'l',

            'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u',

            'ф' => 'f', 'х' => 'kh', 'ц' => 'ts', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'shch', 'ю' => 'iu', 'я' => 'ia'
        ];

        $first = [' є' => ' ye', ' ї' => ' yi', ' й' => ' y', ' ю' => ' yu', ' я' => ' ya'];

        $combinations = ['зг' => 'zgh'];
*/
        $alias = strip_tags($string);

        $alias = mb_strtolower($alias);

        //$alias = strtr($alias, $combinations);

        //$alias = trim(strtr(' ' . $alias, $first));

        //$alias = strtr($alias, $chars);

        $alias = mb_ereg_replace('[,-]|–', ' ', $alias);

        $alias = mb_ereg_replace('\s+', '-', $alias);

        $alias = mb_ereg_replace('[^а-яіїґa-z0-9\-]', '', $alias);

        return $alias;
    }

    /**
     * Конвертує дату/час з українською локалізацією
     *
     * @param string $format Формат дати/часу
     * @param integer|null $timestamp Дата/час
     * @return string Форматові дата/час
     */
    public static function getDate(string $format, int $timestamp = null): string {

        $timestamp = $timestamp ?? time();

        $days = [null, 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота', 'Неділя'];

        $format = str_replace('l', $days[date('N', $timestamp)], $format);

        $months = [null, 'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',

            'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

        $format = str_replace('F', $months[date('n', $timestamp)], $format);

        $months = [null, 'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',

            'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];

        $format = str_replace('f', $months[date('n', $timestamp)], $format);

        return date($format, $timestamp);
    }
}