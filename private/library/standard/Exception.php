<?php
/**
 * Абстрактний базовий клас для винятків
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Log\Exception as ExceptionLog;

abstract class Exception extends \Exception {

    /** @var string Текст винятка */
    protected $message = 'Виняток';

    /** @var string Код винятка */
    protected $code;


    /**
     * Конструктор класу
     *
     * @param string $message Опис винятка
     * @param integer $code Код винятка
     * @param Exception $preview Попередній виняток
     */
    public function __construct(string $message = null, int $code = null, Exception $preview = null) {

        if (isset($message)) $this->message = $message;

        if (isset($code)) $this->code = $code;

        ExceptionLog::append(get_class($this) . ' ' . $this->message);

        parent::__construct($this->message, $this->code, $preview);
    }
}