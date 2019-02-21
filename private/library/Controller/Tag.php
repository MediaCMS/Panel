<?php
/**
 * Контролер міток
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://github.com/MediaCMS
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller;

class Tag extends \MediaCMS\Panel\Controller {

    /**
     * Перевіряє доступ для редагування мітки
     */
    protected function access(): void {

        if ($this->user['roleID'] > 3) $this->denied();
    }

    /**
     * Вивід міток для автозаповнення
     */
    public function autocomplete(): void {

        $exclude = $_GET['exclude'] ?? null;

        $this->database->call('TagAutocomplete', $_GET['title'], $exclude);

        $tags = $this->database->getResults();

        $this->api->setData($tags);

        //$this->api->setDebug('$_GET', $_GET);

        //$this->api->setDebug('queries', $this->database->getQueries());

        //$this->api->setDebug('results', $tags);
    }
}