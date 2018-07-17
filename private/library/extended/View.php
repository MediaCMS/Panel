<?php
/**
 * Вигляд
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS/Panel
 * @link        https://медіа.укр
 * @copyright   Всі права застережено (c) 2018 Медіа
 */

namespace MediaCMS\Panel;

use MediaCMS\Panel\Exception\View as ViewException;

class View {

    /** @var string Початковий xml-файл вигляду */
    protected $fileXML = 'view.xml';

    /** @var string Загальний xsl-файл вигляду */
    protected $fileXSL = 'templates/index.xsl';

    /** @var \SimpleXMLElement Дерево вигляду */
    protected $xml;

    /** @var \SimpleXMLElement Поточний шаблон сторінки */
    protected $template;

    /** @var integer Кількість сторінок в пейджері */
    protected $adjacent = 10;

    /** @var array Перелік типів оповіщень */
    protected $alerts = [

        'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
    ];


    /**
     * Конструктор класу
     */
    public function __construct() {

        $xmlFile = PATH_PRIVATE . DIRECTORY_SEPARATOR . $this->fileXML;

        $this->xml = new \SimpleXMLElement(file_get_contents($xmlFile));

        $this->xml->addAttribute('title', TITLE);

        $host = idn_to_utf8($_SERVER['HTTP_HOST'], 0, INTL_IDNA_VARIANT_UTS46);

        $this->xml->addAttribute('host', $host);

        $this->xml->addAttribute('hostIDN', $_SERVER['HTTP_HOST']);

        $url = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

        $this->xml->addAttribute('url', $url);

        $this->xml->addAttribute('urlEncoded', urlencode($url));

        $this->xml->addAttribute('uri', $_SERVER['REQUEST_URI']);

        $this->xml->addAttribute('hostMain', HOST_MAIN);

        $this->xml->addAttribute('hostPhoto', HOST_PHOTO);

        $this->xml->addAttribute('copyright', TITLE . ' @ ' . date('Y'));

        if (DEVELOPMENT) $this->xml->addChild('debug');
    }

    /**
     * Додає заголовок сторінки
     *
     * @param string $title Текст заголовка
     */
    public function setTitle(string $title): void {

        $this->xml->attributes()->title = $title;
    }

    /**
     * Повертаэ заголовок сторінки
     *
     * @return integer Текст заголовка
     */
    public function getTitle(): string {

        return ($this->xml->attributes()->title) ?? null;
    }

    /**
     * Додає поточний шаблон сторінки
     *
     * @param string $template Назва шаблону
     * @return \SimpleXMLElement Поточний шаблон сторінки
     */
    public function setTemplate(string $template): \SimpleXMLElement {

        return $this->template = $this->xml->main->addChild($template);
    }

    /**
     * Вмикає завантаження js-файлу reCaptcha
     */
    public function setRecaptcha(): void {

        $this->xml->addAttribute('recaptcha', RECAPTCHA_PUBLIC);
    }

    /**
     * Додає головне меню
     *
     * @param array $menu Меню
     * @param string $alias Поточний перший псевдонім адреси
     */
    public function setMenu(array $menu, string $alias): void {

        $menuNode = $this->xml->addChild('menu');

        foreach($menu as $item) {

            $itemNode = $menuNode->addChild('item');

            $itemNode->addAttribute('title', $item['title']);

            $itemNode->addAttribute('uri', '/' . implode('/', $item['uri']));

            if ($alias == $item['uri'][0])

                $itemNode->addAttribute('active', 'true');
        }
    }

    /**
     * Додає поточне підменю
     *
     * @param array $submenu Підменю
     * @param string $alias Поточний перший псевдонім адреси
     */
    public function setSubmenu(array $submenu, string $alias): void {

        $submenuNode = $this->xml->addChild('submenu');

        foreach($submenu as $item) {

            $itemNode = $submenuNode->addChild('item');

            $itemNode->addAttribute('title', $item['title']);

            if (isset($item['alias']))

                $itemNode->addAttribute('uri', '/' . $alias . '/' . $item['alias']);

            if (isset($item['modal']))

                $itemNode->addAttribute('modal', $item['modal']);
        }
    }

    /**
     * Додає оповіщення
     *
     * @param string $text Текст оповіщення
     * @param string $type Тип оповіщення
     * @throws ViewException Виняток вигляду
     */
    public function setAlert(string $text, string $type = 'info'): void {

        if (!in_array($type, $this->alerts))

            throw new ViewException(sprintf('Невідомий тип оповіщення %s', $type));

        $alertNode = $this->xml->addChild('alert');

        $alertNode->addAttribute('type', $type);

        $alertNode->addAttribute('text', $text);
    }

    /**
     * Додає сторінку з 404-ю помилкою
     *
     * @param string $uri Відносна адреса сторінки
     */
    public function pageNotFound(string $uri): void {

        $this->xml->main->addChild('PageNotFound');

        $this->xml->attributes()->title = 'Сторінка не знайдена';

        $description = sprintf('Сторінка "%s" не знайдена', $uri);

        $this->xml->attributes()->description = $description;

        header('HTTP/1.x 404 Not Found');
    }

    /**
     * Додає відлагодження
     *
     * @param array $queries SQL-запити мапера
     */
    public function setDebug(array $queries = null): void {

        $timeTotal = 0;

        $this->xml->addAttribute('timestamp', time());

        $debugNode = $this->xml->addChild('debug');

        $debugNode->addAttribute('time', round(((microtime(true) - TIME) * 1000), 2));

        $debugNode->addAttribute('memory', round(((memory_get_usage() - MEMORY) / 1024), 2));

        $debugNode->addAttribute('memoryPeak', round((memory_get_peak_usage() / 1024), 2));

        if (isset($queries)) {

            $mapperNode = $this->xml->debug->addChild('mapper');

            if (is_array($queries)) {

                $queriesNode = $mapperNode->addChild('queries');

                foreach($queries as $key => $query) {

                    $string = $query['string'];

                    $string = preg_replace("/\t/", "", $string);

                    $string = preg_replace("/\n\s{12}/", "\n", $string);

                    $string = preg_replace("/\n[\s]*\n/", "\n", $string);

                    $string = preg_replace("/^\n(.*)\n$/iu", "$1", $string);

                    $string = preg_replace("/(|\s)([A-Z_]+)(\(|\s)/", "$1<span>$2</span>$3", $string);

                    $queryNode = $queriesNode->addChild('query', $string);

                    $time = round($query['time'], 2);

                    $time = sprintf('%01.2f', $query['time']);

                    $queryNode->addAttribute('time', $time);

                    $timeTotal += $query['time'];
                }

                $timeTotal = sprintf('%01.2f', $timeTotal);

                $mapperNode->addAttribute('time', $timeTotal);
            }
        }
    }

    /**
     * Додає трасування
     *
     * @param \Exception $exception Виняток
     * @throws ViewException Виняток контроллера
     */
    public function setException(\Exception $exception): void {

        $alert = $exception->getMessage();

        if (!is_null($exception->getFile()))

            $alert .= sprintf(' [%s, %s]', $exception->getFile(), $exception->getLine());

        $this->setAlert($alert, 'danger');

        if (DEVELOPMENT) {

            $traceNode = $this->xml->debug->addChild('trace');

            foreach($exception->getTrace() as $key => $item) {

                if (!isset($item['file'])) continue;

                $itemNode = $traceNode->addChild('item');

                $itemNode->addAttribute('file', $item['file']);

                $itemNode->addAttribute('line', $item['line']);

                $itemNode->addAttribute('function', $item['function']);
            }
        }
    }

    /**
     * Здійснює XSLT-трансформацію та повертає HTML-код
     *
     * return string HTML-код сторінки
     */
    public function getHTML(): string {

        $xml = new \DOMDocument('1.0', 'UTF-8');

        $xml->loadXML($this->xml->asXML());

        $xslt = new \XSLTProcessor();

        $xsl = new \DOMDocument('1.0', 'UTF-8');

        $xslFile = PATH_PRIVATE . DIRECTORY_SEPARATOR . $this->fileXSL;

        $xsl->load($xslFile, LIBXML_NOCDATA);

        $xslt->importStylesheet($xsl);

        return $xslt->transformToXML($xml);
    }


};