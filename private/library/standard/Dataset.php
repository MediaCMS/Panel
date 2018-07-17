<?php
/**
 * Абстрактний базовий клас для роботи з набором даних
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Exception\Dataset as DatasetException;

abstract class Dataset implements \Iterator, \JsonSerializable {

    /** @var string Найменування набору даних */
    protected $__title;

    /** @var array Властивості набору даних
     *
     *  type: тип значення (integer|string|array|...)
     *  preset: назва типового шаблонц регулярного виразу
     *  pattern: шаблон регулярного виразу
     *  minimum: мінімальне число
     *  maximum: максимальне число
     *  access: 0 - доступ тільки для читання, 1 - повний доступ (по замовчуванню)
     *  value: значення по замовчуванню
     */
    protected $__properties = [];

    /** @var array Спільні властивості наборів даних */
    protected $__propertiesCommon = [];

    /** @var array Типи властивостей наборів даних */
    protected $__types = [

        'bit'       => ['pattern' => '/^[01]$/'],
        'integer1'  => ['pattern' => '/^[-]?\d{1,3}$/', 'min' => -128, 'max' => 127],
        'integer2'  => ['pattern' => '/^[-]?\d{1,5}$/', 'min' => -32768, 'max' => 32767],
        'integer3'  => ['pattern' => '/^[-]?\d{1,7}$/', 'min' => -8388608, 'max' => 8388607],
        'integer4'  => ['pattern' => '/^[-]?\d{1,10}$/', 'min' => -2147483648, 'max' => 2147483647],
        'unsigned1' => ['pattern' => '/^\d{1,3}$/', 'max' => 255],
        'unsigned2' => ['pattern' => '/^\d{1,5}$/', 'max' => 65535],
        'unsigned3' => ['pattern' => '/^\d{1,8}$/', 'max' => 16777215],
        'unsigned4' => ['pattern' => '/^\d{1,10}$/', 'max' => 4294967295],
        'positive1' => ['pattern' => '/^[1-9]\d{0,9}$/', 'max' => 255],
        'positive2' => ['pattern' => '/^[1-9]\d{0,9}$/', 'max' => 65535],
        'positive3' => ['pattern' => '/^[1-9]\d{0,9}$/', 'max' => 16777215],
        'positive4' => ['pattern' => '/^[1-9]\d{0,9}$/', 'max' => 4294967295],
        'date'      => ['pattern' => '/^\d{4}-\d{2}-\d{2}$/'],
        'datetime'  => ['pattern' => '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/'],
        'string16'  => ['pattern' => '/^[^\n\r]{1,16}$/u'],
        'string32'  => ['pattern' => '/^[^\n\r]{1,32}$/u'],
        'string64'  => ['pattern' => '/^[^\n\r]{1,64}$/u'],
        'string128' => ['pattern' => '/^[^\n\r]{1,128}$/u'],
        'string256' => ['pattern' => '/^[^\n\r]{1,256}$/u'],
        'string512' => ['pattern' => '/^[^\n\r]{1,512}$/u'],
        'text1K'    => ['pattern' => '/^.{1,1024}$/u'],
        'text2K'    => ['pattern' => '/^.{1,2048}$/u'],
        'text4K'    => ['pattern' => '/^.{1,4096}$/u'],
        'text8K'    => ['pattern' => '/^.{1,4096}$/u'],
        'path'      => ['pattern' => '/^.{1,32}$/u'],
        'host'      => ['pattern' => '/^http(s)?:\/\/[a-z][a-z0-9._-]{1,32}$/u'],
        'phone'     => ['pattern' => '/^[0-9]{12}$/'],
        'email'     => ['pattern' => '/^[a-z][a-z0-9._-]{1,32}@[a-z][a-z0-9._-]{1,32}$/u'],
        'hash32'    => ['pattern' => '/^[0-9a-f]{1,32}$/iu']
    ];


    /**
     * Конструктор класу
     *
     * @param array $properties Властвості набору даних
     */
    public function __construct(array $properties = null) {

        $path = explode('\\', get_class($this));

        $this->__title = $path[3] . $path[2];

        foreach($this->__propertiesCommon as $name => $value) {

            if (isset($this->__properties[$name])) {

                $this->__properties[$name] = array_merge($value, $this->__properties[$name]);

            } else {

                $this->__properties[$name] = $value;
            }
        }

        $this->setDefaults();

        if (isset($properties)) {

            foreach($properties as $name => $value) {

                if ($this->__isset($name)) $this->__set($name, $value);
            }
        }
    }

    /**
     * Встановлює значення по замовчуванню
     */
    protected function setDefaults(): void {}

    /**
     * Зберігає значення властивості набору даних
     *
     * @param string $name Найменування властивості набору даних
     * @param mixed $value Значення властивості набору даних
     */
    protected function set($name, $value): void {

        $this->__properties[$name]['value'] = $value;
    }

    /**
     * Повертає значення властивості набору даних
     *
     * @param   string $name Найменування властивості набору даних
     * @return  mixed Значення властивості набору даних
     */
    protected function get($name) {

        return isset($this->__properties[$name]['value']) ? $this->__properties[$name]['value'] : null;
    }

    /**
     * Зберігає значення властивості набору даних
     *
     * @param string $name Найменування властивості набору даних
     * @param mixed $value Значення властивості набору даних
     */
    public function __set($name, $value): void {

        if (!isset($this->__properties[$name])) {

            $exception = 'Невідома назва властивості "%s" набору даних "%s"';

            throw new DatasetException(sprintf($exception, $name, $this->__title));
        }

        if (isset($this->__properties[$name]['access'])&& ($this->__properties[$name]['access'] == 0)) {

            $exception = 'Запис у властивість "%s" набору даних "%s" заборонено';

            throw new DatasetException(sprintf($exception, $name, $this->__title));
        }

        if (strlen($value) == 0) {

            $value = null;

        } else {

            $this->validate($name, $value);
        }

        $method = 'set' . ucfirst($name);

        if (method_exists($this, $method)) {

            call_user_func([$this, $method], $value);

        } else {

            $this->set($name, $value);
        }
    }

    /**
     * Повертає значення властивості набору даних
     *
     * @param   string $name Найменування властивості набору даних
     * @return  mixed Значення властивості набору даних
     */
    public function __get($name) {

        return $this->get($name);
    }

    /**
     * Перевіряє наявність властивості набору даних
     *
     * @param   string $name Найменування властивості набору даних
     * @return  boolean Ознака наявності властивості
     */
    public function __isset($name): bool {

        return isset($this->__properties[$name]);
    }

    /**
     * Видаляє значення властивості набору даних
     *
     * @param string $name Найменування властивості набору даних
     */
    public function __unset($name): void {

        $this->__properties[$name]['value'] = null;
    }

    /**
     * Переводить вказівник переліку на перший елемент (перемотка на початок)
     */
    public function rewind(): void {

        reset($this->__properties);
    }

    /**
     * Повертає поточний елемент масиву
     *
     * @return mixed Значення поточно елементу масиву
     */
    public function current() {

        $property = current($this->__properties);

        return (isset($property['value'])) ? $property['value'] : null;
    }

    /**
     * Повертає ключ поточного едементу переліку
     *
     * @return mixed Значення ключа поточно елементу переліку
     */
    public function key() {

        return key($this->__properties);
    }

    /**
     * Переводить вказівник масиву на наступний елеммент
     */
    public function next(): void {

        next($this->__properties);
    }

    /**
     * Перевіряє чи існує елемент за поточним вказівником переліку
     *
     * @return boolean Ознака наявності елемента переліку
     */
    public function valid(): bool {

        $key = key($this->__properties);

        return (($key !== null) && ($key !== false) && ($this->__properties[$key] !== null));
    }

    /**
     * Перевіряє значення властивості набору даних
     *
     * @param string $name Найменування властивості набору даних
     * @param mixed $value Значення властивості набору даних
     */
    protected function validate($name, $value): void {

        if (isset($this->__properties[$name]['type'])) {

            $type = $this->__properties[$name]['type'];

            if (!key_exists($type, $this->__types)) {

                $exception = 'Невідомий тип "%s" властивості "%s->%s"';

                $exception = sprintf($exception, $this->__properties[$name]['type'], $this->__title, $name);

                throw new DatasetException($exception);
            }

            $this->__properties[$name] = array_merge($this->__types[$type], $this->__properties[$name]);
        }

        try {

            if (isset($this->__properties[$name]['pattern'])

                && !preg_match($this->__properties[$name]['pattern'], $value)) {

                throw new DatasetException();
            }

        } catch (\Exception $exception) {

            $exception = 'Значення властивості "%s->%s = %s" не відповідає шаблону "%s"';

            $exception = sprintf($exception, $this->__title, $name, $value, $this->__properties[$name]['pattern']);

            throw new DatasetException($exception);
        }

        if (isset($this->__properties[$name]['min']) && ($value < $this->__properties[$name]['min'])) {

            $exception = 'Значення властивості "%s->%s = %s" менше за дозволене "%s"';

            $exception = sprintf($exception, $this->__title, $name, $value, $this->__properties[$name]['min']);

            throw new DatasetException($exception);
        }

        if (isset($this->__properties[$name]['max']) && ($value > $this->__properties[$name]['max'])) {

            $exception = 'Значення властивості "%s->%s = %s"  більше за дозволене "%s"';

            $exception = sprintf($exception, $name, $value, $this->__title, $this->__properties[$name]['max']);

            throw new DatasetException($exception);
        }
    }

    /**
     * Повертає властивості набору даних у вигляді масиву
     *
     * @return array Масив властивостей набору даних
     */
    public function toArray(): array {

        $properties = [];

        foreach($this->__properties as $name => $property)

            $properties[$name] = (isset($property['value'])) ? $property['value'] : null;

        return $properties;
    }

    /**
     * Повертає масив для JSON Serialize
     *
     * @return array Масив властивостей набору даних
     */
    public function jsonSerialize(): array {

        return $this->toArray();
    }
}