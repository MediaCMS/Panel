<?php
/**
 * Системні статичні функції
 *
 * @author      Артем Висоцький <a.vysotsky@gmail.com>
 * @package     MediaCMS\Panel
 * @link        https://медіа.укр
 * @copyright   GNU General Public License v3
 */

namespace MediaCMS\Panel;

class Image {

    /** @var array Масив з даними завантаженого файлу ($_FILES['x']) */
    protected $file = [];

    /** @var string Шлях до теки з зменшеними зображеннями */
    protected $path = PATH_PUBLIC . '/thumbnails';

    /** @var array Перелік допустимих розмірів (ширини та висоти в пікселях) */
    protected $widths = ['0320', '0480', '0640', '0960'];

    /** @var integer Мінімально дозволений розмір (байти) */
    protected $sizeMinimum = 65536;

    /** @var integer Максимально дозволений розмір (байти) */
    protected $sizeMaximum = 1048576;

    /** @var string Дозволений тип файла */
    protected $type = 'image/jpeg';

    /** @var array Перелік кодів та опису помилок завантаження файлів */
    protected $errors = [

        UPLOAD_ERR_INI_SIZE => 'Розмір зображення більший за допустимий в налаштуваннях сервера',

        UPLOAD_ERR_FORM_SIZE => 'Розмір зображення більший за значення MAX_FILE_SIZE, вказаний в HTML-формі',

        UPLOAD_ERR_PARTIAL => 'Зображення завантажено тільки частково',

        UPLOAD_ERR_NO_FILE => 'Зображення не завантажено',

        UPLOAD_ERR_NO_TMP_DIR => 'Відсутня тимчасова тека',

        UPLOAD_ERR_CANT_WRITE => 'Не вдалось записати зображення на диск',

        UPLOAD_ERR_EXTENSION => 'Сервер зупинив завантаження зображення',
    ];


    /**
     * Додає файл зображення
     *
     * @param array $file Масив з даними завантаженого файлу
     * @return string Хеш файла
     */
    public function append(array $file) : string {

        $this->validate($file);

        $hash = hash_file('md5', $file['tmp_name']);

        $directory = $this->path . DIRECTORY_SEPARATOR . $hash[0];

        if (!file_exists($directory)) {

            mkdir($directory, 0775);

            chmod($directory, 0775);
        }

        $imageRelative = $hash . '.original.jpg';

        $imageAbsolute = $this->path . DIRECTORY_SEPARATOR . $hash[0] . DIRECTORY_SEPARATOR . $imageRelative;

        if (file_exists($imageAbsolute))

            throw new Exception(sprintf("Файл вже існує '%s'", $imageRelative));

        if (!move_uploaded_file($file['tmp_name'], $imageAbsolute))

            throw new Exception(sprintf("Помилка переміщення файла '%s'", $file['name']));

        chmod($imageAbsolute, 0775);

        $this->create($directory, $hash);

        return $hash;
    }

    /**
     * Перевіряє файл зображення
     *
     * @param string $image Шлях до завантаженого файла
     */
    private function validate(array $file): void {

        try {

            if ($file['error'] !== 0)

                throw new Exception($this->errors[$file['error']]);

            if (!is_uploaded_file($file['tmp_name']))

                throw new Exception("Файл не завантажений");

            if ($file['type'] != $this->type)

                throw new Exception(sprintf("Не дозволений тип файла '%s'", $file['type']));

            if ($file['size'] < $this->sizeMinimum) {

                $message = "Розмір файла зображення занадто малий (%d B < %d B)";

                throw new Exception(vsprintf($message, [$file['size'], $this->sizeMinimum]));
            }

            if ($file['size'] > $this->sizeMaximum) {

                $message = "Розмір файла зображення занадто великий (%d B > %d B)";

                throw new Exception(vsprintf($message, [$file['size'], $this->sizeMaximum]));
            }

            $size = getimagesize($file['tmp_name']);

            $widthMinimum = end($this->widths);

            if ($size[0] < $widthMinimum) {

                $message = "Ширина файла зображення занадто мала (%d B < %d B)";

                throw new Exception(vsprintf($message, [$size[0], $widthMinimum]));
            }

        } catch (Exception $exception) {

            $message = "При перевірці файла забраження '%s' виникла помилка: %s.";

            throw new Exception(vsprintf($message, [$file['name'], $exception->getMessage()]));
        }
    }

    /**
     * Створює зменшені зображення
     *
     * @param string $directory Назва теки
     * @param string $hash Хеш файла
     */
    private function create(string $directory, string $hash): void {

    }

    /**
     * Видаляє файл зображення та його зменшені копії
     *
     * @param string $file Назва зображення
     */
    public function delete(string $hash) : void {

        $directory = $this->path . DIRECTORY_SEPARATOR . $hash[0];

        $images = $this->widths;

        $images[] = 'original';

        foreach($images as $image) {

            $image = DIRECTORY_SEPARATOR . $hash . '.' . $image . $this->extension;

            unlink($image);
        }

    }
}