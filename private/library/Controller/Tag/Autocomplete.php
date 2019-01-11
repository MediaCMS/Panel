<?php
/**
 * Контролер для виводу міток для автозаповнення
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel\Controller\Tag;

class Autocomplete extends \MediaCMS\Panel\Controller {

    /**
     * Запускає виконання дії контролера
     */
    public function run(): void {

        $exclude = $_GET['exclude'] ?? null;

        $this->database->call('TagAutocomplete', $_GET['title'], $exclude);

        $tags = $this->database->getResults();

        $this->api->setData($tags);

        //$this->api->setDebug('$_GET', $_GET);

        //$this->api->setDebug('queries', $this->database->getQueries());

        //$this->api->setDebug('results', $tags);
    }
}