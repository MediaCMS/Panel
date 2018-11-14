<?php
/**
 * Прикладний програмний інтерфейс
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class API {

    /** @var array|null Дані для передачі (при наявності) */
    protected $data;

    /** @var array|null Виняток (при наявності) */
    protected $exception;

    /** @var array|null Відлагодження (при наявності) */
    protected $debug;



    /**
     * Конструктор класу
     */
    public function __construct() {

        //if (DEVELOPMENT) $this->xml->addChild('debug');
    }

    /**
     * Додає дані
     *
     * @param string $title Назва даних
     * @param array $data Дані
     */
    public function setData(string $title, array $data): void {

        $this->data[$title] = $data;
    }

    /**
     * Повертає дані
     *
     * @param string $title Назва даних
     * @return array|null Дані
     */
    public function getData(string $title = null): ?array {

        return (isset($title))

            ? ((isset($this->data[$title])) ? $this->data[$title] : null)

            : $this->data;
    }

    /**
     * Додає виняток
     *
     * @param \Exception $exception Виняток
     */
    public function setException(\Exception $exception): void {

        $this->exception['message'] = $exception->getMessage();

        if (!is_null($exception->getFile()))

            $this->exception['file'] = $exception->getFile();

        if (!is_null($exception->getLine()))

            $this->exception['line'] = $exception->getLine();

        foreach($exception->getTrace() as $key => $item)

            $this->exception['trace'][] = $item;
    }

    /**
     * Додає дані відлагодження
     *
     * @param string $title Назва
     * @param mixed $data Дані
     */
    public function setDebug(string $title, $data): void {

        $this->debug[$title] = $data;
    }

    /**
     * Виводить результат в JSON-форматі
     */
    public function print(): void {

        $result = [];

        if (isset($this->data)) $result['data'] = $this->data;

        if (isset($this->exception)) $result['exception'] = $this->exception;

        if (isset($this->debug)) $result['debug'] = $this->debug;

        print json_encode($result, JSON_UNESCAPED_UNICODE);
    }


};