<?php
/**
 * Клас роботи з ітератором
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class Iterator implements \Iterator {

    /** @var array Внутрішній робочий перелік */
    private $items = [];


    /**
     * Конструктор класу
     *
     * @param array $array Перелік
     */
    public function __construct(array $array = null) {

        $this->items = ($array) ?? $array;
    }

    /**
     * Переводить вказівник переліку на перший елемент (перемотка на початок)
     */
    public function rewind(): void {

        reset($this->items);
    }

    /**
     * Повертає поточний елемент масиву
     *
     * @return mixed Значення поточно елементу масиву
     */
    public function current() {

        return current($this->items);
    }

    /**
     * Повертає ключ поточного едементу переліку
     *
     * @return mixed Значення ключа поточно елементу переліку
     */
    public function key() {

        return key($this->items);
    }

    /**
     * Переводить вказівник масиву на наступний елеммент
     */
    public function next(): void {

        next($this->items);
    }

    /**
     * Перевіряє чи існує елемент за поточним вказівником переліку
     *
     * @return boolean Ознака наявності елемента переліку
     */
    public function valid(): bool {

        $key = key($this->items);

        return ($key !== null && $key !== false);
    }

}
