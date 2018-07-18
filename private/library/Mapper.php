<?php
/**
 * Клас роботи з БД MySQL
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Exception\Mapper as MapperException;

class Mapper {

    /** @var string Адреса сервера БД */
    protected $host = '';

    /** @var string Назва БД */
    protected $db = '';

    /** @var string Назва користувача БД */
    protected $user = '';

    /** @var string Пароль для доступу до БД */
    protected $password = '';

    /** @var \mysqli Підключення до БД */
    protected $connection;

    /** @var string Кодування БД */
    protected $charset = 'utf8';

    /** @var array Запити sql для відлагодження */
    protected $queries;

    /** @var array Результат виконання запиту */
    protected $result;


    /**
     * Конструктор класу
     *
     * @param string $db Назва БД
     * @param string $user Назва користувача БД
     * @param string $password Пароль користувача БД
     * @param string $host Адреса сервера БД
     */
    public function __construct(string $db, string $user, string $password, string $host = 'localhost') {

        $this->db = $db;

        $this->user = $user;

        $this->password = $password;

        $this->host = $host;

        $this->connection = new \mysqli($this->host, $this->user, $this->password, $this->db);
    }

    /**
     * Виконує mysql-функцію
     *
     * @param   string $function Назва збереженої функції
     * @param   mixed $params Параметри функції
     */
    public function call(string $function, $params = null): void {

        if (isset($params)) {

            if (is_array($params) || is_object($params)) {

                $params = json_encode($params, JSON_UNESCAPED_UNICODE);

                $params = str_replace(",", ", ", $params);
            }

            $this->run(sprintf("CALL %s('%s');", $function, $params));

        } else {

            $this->run(sprintf("CALL %s();", $function));
        }

        if (isset($this->result)) $this->connection->next_result();
    }

    /**
     * Виконує sql-запит
     *
     * @param   string $query Запит sql
     * @param   string|array|null $params Додаткові параметри sql-запиту
     * @throws  MapperException Виняток мапера
     */
    public function run(string $query, $params = null): void {

        if (isset($params)) {

            $params = is_array($params) ? $params : [$params];

            foreach($params as $key => $param) {

                $params[$key] = $this->protect($param);
            }

            $query = vsprintf($query, $params);
        }

        $this->result = null;

        $time = microtime(true);

        $result = $this->connection->query($query);

        if ($result === false) {

            $exception = sprintf('Помилка запиту "%s"', $this->connection->error);

            throw new MapperException($exception);
        }

        $time = (microtime(true) - $time) * 1000;

        $this->queries[] = ['string' => $query, 'time' => $time];

        if (is_object($result) && $result->num_rows > 0) {

            $this->result = [];

            while($row = $result->fetch_assoc()) $this->result[] = $row;

            $result->close();
        }
    }

    /**
     * Повертає результат запиту
     *
     * @return array|null Список асоціативниих масивів результату
     */
    public function getResult(): ?array {

        return $this->result;
    }

    /**
     * Повертає перший рядок зі списку результату запиту
     *
     * @return array Асоціативний масив даних з першого рядка результату запиту
     */
    public function getResultFirst(): array {

        return $this->result[0];
    }

    /**
     * Повертає значення поля за назвою з першого рядка результату запиту
     *
     * @param   string $title Назва поля
     * @return  string Значення поля
     */
    public function getResultByName(string $title): string {

        $result = $this->getResultFirst();

        return $result[$title];
    }

    /**
     * Повертає кількість рядків результату запиту
     *
     * @return integer Кількість рядків результату запиту
     */
    public function getResultCount(): int {

        return (isset($this->result)) ? count($this->result) : 0;
    }

    /**
     * Повертає ідентифікатор нового запису
     *
     * @return integer Ідентифікатор
     */
    public function getInsertId(): int {

        return $this->connection->insert_id;
    }

    /**
     * Отримує та повертає кількість рядків останнього запиту
     *
     * @return integer id нового запису
     */
    public function getFoundRows(): int {

        $this->call('_GetFoundRows');

        return $this->getResultByName('foundRows');
    }

    /**
     * Захищає додаткові параметри sql-запиту від sql-ін`єкцій
     *
     * @param   string $string Додатковий параметр sql-запиту
     * @return  string Захищений додатковий параметр sql-запиту
     */
    private function protect(string &$string): string {

        return $this->connection->real_escape_string($string);
    }

    /**
     * Повертає перелік виконаних sql-запитів
     *
     * @return array Перелік sql-запитів з часом їх виконаня
     */
    public function getQueries(): ?array {

        return $this->queries;
    }
}