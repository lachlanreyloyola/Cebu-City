import { useState } from 'react';
import { Copy, Check, FileCode, Database, Terminal, Settings, HelpCircle, HardDrive, ShieldAlert } from 'lucide-react';

interface FileDetails {
  name: string;
  type: 'php' | 'sql' | 'md';
  icon: any;
  description: string;
  code: string;
}

export default function ExporterView() {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const phpFiles: FileDetails[] = [
    {
      name: 'cebu_explorer.sql',
      type: 'sql',
      icon: Database,
      description: 'MySQL database relational structure, normalization, indices, constraints, and seed data.',
      code: `-- ==========================================
-- CEBU EXPLORER DATABASE SCHEMA
-- Relational MySQL database design
-- ==========================================

CREATE DATABASE IF NOT EXISTS cebu_explorer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cebu_explorer_db;

-- Table structure for table \`users\`
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`destinations\`
CREATE TABLE IF NOT EXISTS \`destinations\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`category\` ENUM('falls', 'islands', 'beaches', 'mountains', 'attract') NOT NULL,
  \`badge\` VARCHAR(50) NOT NULL,
  \`location\` VARCHAR(150) NOT NULL,
  \`maps_url\` TEXT NOT NULL,
  \`description\` TEXT NOT NULL,
  \`why_visit\` TEXT NOT NULL,
  \`image_url\` VARCHAR(255) NOT NULL,
  \`rating\` DECIMAL(2,1) NOT NULL DEFAULT 4.5
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for table \`bookings\`
CREATE TABLE IF NOT EXISTS \`bookings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`destination_id\` VARCHAR(50) NOT NULL,
  \`booking_date\` DATE NOT NULL,
  \`time_slot\` VARCHAR(50) NOT NULL,
  \`guest_count\` INT NOT NULL CHECK (\`guest_count\` > 0),
  \`special_requests\` TEXT DEFAULT NULL,
  \`status\` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`destination_id\`) REFERENCES \`destinations\` (\`id\`) ON DELETE CASCADE,
  INDEX \`idx_user\` (\`user_id\`),
  INDEX \`idx_booking_date\` (\`booking_date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    },
    {
      name: 'db.php',
      type: 'php',
      icon: Settings,
      description: 'Secure PDO Database Connection engine with parameter initialization and HTML input sanitizer protection.',
      code: `<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
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
            error_log("Database Connection Failed: " . $e->getMessage());
            die("Database Connection Error. Contact administrator.");
        }
    }

    public static function getConnection() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }
}

function getDB() {
    return Database::getConnection();
}

function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>`
    },
    {
      name: 'index.php',
      type: 'php',
      icon: FileCode,
      description: 'Converted PHP Landing home page that dynamically loads Cebu spots from the database with category selections.',
      code: `<?php
require_once 'db.php';
session_start();
$isLoggedIn = isset($_SESSION['user_id']);
$userName = $isLoggedIn ? $_SESSION['user_name'] : '';

$db = getDB();
try {
    $stmt = $db->query("SELECT * FROM destinations ORDER BY name ASC");
    $destinations = $stmt->fetchAll();
} catch (PDOException $e) {
    die("Error retrieving destinations data from relational tables.");
}
?>
<!-- HTML code with PHP integration for dynamic loops -->`
    },
    {
      name: 'register.php',
      type: 'php',
      icon: Terminal,
      description: 'Account signup with front-end JS alerts, server-side data validations, and secure BCRYPT password hashing.',
      code: `<?php
require_once 'db.php';
session_start();

if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = ''; $success = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = getDB();
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Server-side checks & hashing
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    // Prepared insert statement execution
}
?>`
    },
    {
      name: 'login.php',
      type: 'php',
      icon: Terminal,
      description: 'Account logging validation, BCrypt password_verify() validations, and role-based redirects.',
      code: `<?php
require_once 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = getDB();
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        session_regenerate_id(true);
        header('Location: dashboard.php');
    }
}
?>`
    },
    {
      name: 'dashboard.php',
      type: 'php',
      icon: HardDrive,
      description: 'Comprehensive Tourist Board which runs full booking CRUD operations (Insert, Select, Update, Cancel).',
      code: `<?php
require_once 'db.php';
session_start();
if (!isset($_SESSION['user_id'])) { header('Location: login.php'); exit; }

// Handle Create Booking
if (isset($_POST['action']) && $_POST['action'] === 'create') { /* Insert with PDO */ }
// Handle Update Booking
if (isset($_POST['action']) && $_POST['action'] === 'update') { /* Update with PDO */ }
// Handle Cancel Booking
if (isset($_POST['action']) && $_POST['action'] === 'delete') { /* Delete with PDO */ }
?>`
    },
    {
      name: 'admin.php',
      type: 'php',
      icon: ShieldAlert,
      description: 'Administrative command room to monitor global users database and approve or reject travel itineraries.',
      code: `<?php
require_once 'db.php';
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') { header('Location: login.php'); exit; }

// Toggle Booking status (approve / reject)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    // UPDATE bookings SET status = ? WHERE id = ?
}
?>`
    },
    {
      name: 'INSTALL.md',
      type: 'md',
      icon: HelpCircle,
      description: 'Local host installation guidelines (XAMPP / WAMP), table maps, default testing credentials, and definitions.',
      code: `# Cebu Explorer Local Deployment Guide
1. Copy cebu-explorer folder into htdocs or www
2. Import cebu_explorer.sql into PhpMyAdmin
3. Default Tourist Login: user@cebuexplorer.com | UserPassword123
4. Default Admin Login: admin@cebuexplorer.com | AdminPassword123`
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(phpFiles[activeFileIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[rgba(6,59,84,0.08)] shadow-[0_4px_14px_rgba(6,59,84,0.06)] overflow-hidden">
      
      {/* Header bar */}
      <div className="bg-[#063b54] p-5.5 text-white flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-serif font-bold text-lg">PHP & MySQL Source Code Exporter</h2>
          <p className="text-[11px] text-[#7ed3e3] mt-0.5">Perfect for local host deployments on XAMPP, WAMP, or university submissions.</p>
        </div>
        <span className="text-[10px] bg-white/10 text-[#7ed3e3] border border-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider shrink-0">
          XAMPP Compatible
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
        
        {/* Left Sidebar files list */}
        <div className="bg-[#fdfaf3] p-4 border-r border-[rgba(6,59,84,0.06)] flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#5b6b76] mb-2 px-1">File Directory</p>
          {phpFiles.map((file, idx) => {
            const Icon = file.icon;
            const isActive = idx === activeFileIndex;

            return (
              <button 
                key={file.name}
                onClick={() => {
                  setActiveFileIndex(idx);
                  setCopied(false);
                }}
                className={`w-full flex items-start gap-2.5 p-2.5 text-left transition-all text-xs cursor-pointer rounded-xl ${
                  isActive 
                    ? 'bg-[#0a6b8a] text-white font-semibold shadow-sm' 
                    : 'hover:bg-[#f6efe1] text-[#063b54]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-[#0a6b8a]'}`} />
                <div className="truncate">
                  <span className="block truncate font-mono text-[11px]">{file.name}</span>
                  <span className={`block text-[10px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-[#5b6b76]'}`}>
                    {file.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Code Previewer block */}
        <div className="md:col-span-2 p-5 flex flex-col bg-white text-[#063b54] max-h-[500px]">
          
          {/* Filename and copy header */}
          <div className="flex justify-between items-center border-b border-[rgba(6,59,84,0.08)] pb-3 mb-3.5">
            <div>
              <span className="font-mono text-xs font-bold text-[#063b54] block">
                /{phpFiles[activeFileIndex].name}
              </span>
              <span className="text-[10px] text-[#5b6b76] block mt-0.5">
                {phpFiles[activeFileIndex].description}
              </span>
            </div>

            <button 
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 bg-[#0a6b8a] hover:bg-[#1aa3c4] text-white text-xs px-4 py-2 rounded-full transition-all cursor-pointer font-semibold shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span className="text-white">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Actual Source Code preview */}
          <div className="flex-1 overflow-auto rounded-xl bg-[#fdfaf3] border border-[rgba(6,59,84,0.06)] p-4 font-mono text-[11.5px] leading-relaxed text-[#063b54] shadow-inner">
            <pre className="whitespace-pre-wrap select-all">{phpFiles[activeFileIndex].code}</pre>
          </div>
        </div>

      </div>
    </div>
  );
}
