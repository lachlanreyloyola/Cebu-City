<?php
/**
 * Database Connection Configuration using PDO (PHP Data Objects)
 * Provides prepared statements security to shield against SQL injection.
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default XAMPP/WAMP blank password
define('DB_NAME', 'cebu_explorer_db');

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $this->conn = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Secure error logging - avoid displaying database credentials in browser
            error_log("Database Connection Failed: " . $e->getMessage());
            die("Database Connection Error. Please consult setup instructions or check MySQL credentials.");
        }
    }

    public static function getConnection() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }
}

// Global function to easily fetch connections
function getDB() {
    return Database::getConnection();
}

/**
 * Helper to safely sanitize input values against Cross-Site Scripting (XSS)
 */
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>
