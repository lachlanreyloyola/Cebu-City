<?php
require_once 'db.php';
session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = getDB();
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Server-side validation
    if (empty($name) || empty($email) || empty($password)) {
        $error = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters long.';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match.';
    } else {
        try {
            // Check if email already exists
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $error = 'This email address is already registered.';
            } else {
                // Securely hash the password
                $hashed_password = password_hash($password, PASSWORD_BCRYPT);
                
                // Insert new user
                $stmt = $db->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')");
                $stmt->execute([$name, $email, $hashed_password]);
                
                $success = 'Registration successful! You can now log in.';
            }
        } catch (PDOException $e) {
            $error = 'An error occurred during registration. Please try again.';
            error_log("Registration Error: " . $e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Cebu Explorer</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>
        :root {
            --ocean-900: #063b54;
            --ocean-700: #0a6b8a;
            --ocean-500: #1aa3c4;
            --sand-50: #fdfaf3;
            --sand-100: #f6efe1;
            --sun: #f6b042;
            --white: #ffffff;
            --coral: #ff6f61;
            --ink: #0c2230;
            --muted: #5b6b76;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Poppins', sans-serif;
            background: var(--sand-50);
            color: var(--ink);
            display: grid;
            place-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .auth-container {
            background: var(--white);
            max-width: 450px;
            width: 100%;
            border-radius: 18px;
            padding: 40px;
            box-shadow: 0 12px 30px rgba(6,59,84,.14);
            border: 1px solid rgba(6,59,84,.08);
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--ocean-900);
            justify-content: center;
            margin-bottom: 24px;
        }
        .brand-mark {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--ocean-700), var(--ocean-500));
            display: grid;
            place-items: center;
            color: #fff;
            font-weight: 800;
        }
        h2 { text-align: center; margin-bottom: 20px; color: var(--ocean-900); }
        .form-group { margin-bottom: 18px; }
        label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
        input {
            width: 100%;
            padding: 12px 16px;
            border-radius: 10px;
            border: 1.5px solid rgba(6,59,84,.15);
            font-family: inherit;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.3s;
        }
        input:focus { border-color: var(--ocean-500); box-shadow: 0 0 0 3px rgba(26,163,196,0.15); }
        .btn-submit {
            background: linear-gradient(135deg, var(--ocean-700), var(--ocean-500));
            color: white;
            font-weight: 600;
            padding: 12px;
            width: 100%;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 10px;
        }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(10,107,138,0.25); }
        .alert {
            padding: 12px;
            border-radius: 8px;
            font-size: 0.88rem;
            margin-bottom: 18px;
            font-weight: 500;
        }
        .alert-danger { background: #ffebeb; color: var(--coral); border: 1px solid rgba(255,111,97,0.2); }
        .alert-success { background: #ebfbeb; color: #1f6f4a; border: 1px solid rgba(31,111,74,0.2); }
        .switch-prompt { text-align: center; font-size: 0.88rem; color: var(--muted); margin-top: 20px; }
        .switch-prompt a { color: var(--ocean-700); font-weight: 600; text-decoration: none; }
        .switch-prompt a:hover { text-decoration: underline; }
    </style>
</head>
<body>

<div class="auth-container">
    <div class="brand">
        <span class="brand-mark">C</span> Cebu Explorer
    </div>
    <h2>Create Account</h2>

    <?php if ($error): ?>
        <div class="alert alert-danger" id="php-alert"><?= $error ?></div>
    <?php endif; ?>

    <?php if ($success): ?>
        <div class="alert alert-success"><?= $success ?></div>
    <?php endif; ?>

    <!-- Error message element for JavaScript validations -->
    <div class="alert alert-danger" id="js-alert" style="display: none;"></div>

    <form method="POST" id="register-form" onsubmit="return validateForm()">
        <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Juan dela Cruz" required value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="juan@gmail.com" required value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Min. 8 characters" required>
        </div>
        <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" placeholder="Repeat your password" required>
        </div>
        <button type="submit" class="btn-submit">Register</button>
    </form>

    <div class="switch-prompt">
        Already have an account? <a href="login.php">Login here</a>
    </div>
    <div class="switch-prompt" style="margin-top: 10px;">
        <a href="index.php">← Back to Cebu Explorer</a>
    </div>
</div>

<script>
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const jsAlert = document.getElementById('js-alert');
    const phpAlert = document.getElementById('php-alert');

    if (phpAlert) phpAlert.style.display = 'none';
    jsAlert.style.display = 'none';

    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields.');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address.');
        return false;
    }

    // Password strength check
    if (password.length < 8) {
        showError('Password must be at least 8 characters long.');
        return false;
    }

    // Match verification
    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return false;
    }

    return true;
}

function showError(msg) {
    const jsAlert = document.getElementById('js-alert');
    jsAlert.textContent = msg;
    jsAlert.style.display = 'block';
}
</script>
</body>
</html>
