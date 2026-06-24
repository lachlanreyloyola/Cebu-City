<?php
require_once 'db.php';
session_start();

// Strict Access Controls - Redirect if not authenticated as admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.php');
    exit;
}

$error = '';
$success = '';
$db = getDB();

// --------------------------------------------------
// PROCESS BOOKING STATUS UPDATE (APPROVE/REJECT)
// --------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $booking_id = intval($_POST['booking_id'] ?? 0);
    $action = $_POST['action']; // 'approve' or 'reject'

    if ($booking_id > 0 && ($action === 'approve' || $action === 'reject')) {
        $status = ($action === 'approve') ? 'approved' : 'rejected';
        try {
            $stmt = $db->prepare("UPDATE bookings SET status = ? WHERE id = ?");
            $stmt->execute([$status, $booking_id]);
            $success = "Booking #{$booking_id} has been successfully " . ($action === 'approve' ? 'approved!' : 'rejected.');
        } catch (PDOException $e) {
            $error = 'Failed to update booking status.';
            error_log("Admin Action Error: " . $e->getMessage());
        }
    } else {
        $error = 'Invalid action parameters.';
    }
}

// --------------------------------------------------
// RETRIEVE STATISTICS & USER RECORDS
// --------------------------------------------------
try {
    // 1. Counters and aggregators
    $totalUsers = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $totalBookings = $db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
    $pendingBookings = $db->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")->fetchColumn();
    $approvedBookings = $db->query("SELECT COUNT(*) FROM bookings WHERE status = 'approved'")->fetchColumn();

    // 2. Fetch all system users
    $userStmt = $db->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
    $allUsers = $userStmt->fetchAll();

    // 3. Fetch all system bookings joined with user and destination details
    $bookingStmt = $db->query("
        SELECT b.id, b.booking_date, b.time_slot, b.guest_count, b.special_requests, b.status, b.created_at,
               u.name AS user_name, u.email AS user_email,
               d.name AS dest_name, d.location AS dest_loc
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN destinations d ON b.destination_id = d.id
        ORDER BY b.created_at DESC
    ");
    $allBookings = $bookingStmt->fetchAll();

} catch (PDOException $e) {
    $error = 'Error loading admin database assets.';
    error_log("Admin Retrieval Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Cebu Explorer</title>
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
            --palm-700: #1f6f4a;
            --ink: #0c2230;
            --muted: #5b6b76;
            --radius: 12px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Poppins', sans-serif;
            background: var(--sand-50);
            color: var(--ink);
            line-height: 1.6;
        }
        .header {
            background: var(--white);
            border-bottom: 1px solid rgba(6,59,84,.08);
            padding: 15px 4%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
            font-size: 1.15rem;
            color: var(--ocean-900);
            text-decoration: none;
        }
        .brand-mark {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--ocean-700), var(--ocean-500));
            display: grid;
            place-items: center;
            color: #fff;
            font-weight: 800;
        }
        .user-nav { display: flex; align-items: center; gap: 20px; }
        .user-nav span { font-weight: 500; font-size: 0.95rem; }
        .btn-logout {
            color: var(--coral);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            border: 1.5px solid var(--coral);
            padding: 6px 14px;
            border-radius: 999px;
            transition: all 0.3s;
        }
        .btn-logout:hover { background: var(--coral); color: #fff; }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 4%;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: var(--white);
            border-radius: var(--radius);
            padding: 24px;
            box-shadow: 0 4px 14px rgba(6,59,84,.06);
            border-left: 5px solid var(--ocean-500);
            text-align: center;
        }
        .stat-card.stat-pending { border-left-color: var(--sun); }
        .stat-card.stat-approved { border-left-color: var(--palm-700); }
        .stat-card .num { font-size: 2.2rem; font-weight: 800; color: var(--ocean-900); margin-bottom: 4px; }
        .stat-card .lbl { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 600; }
        
        .section-title { color: var(--ocean-900); font-size: 1.4rem; margin-bottom: 20px; border-bottom: 2px solid var(--sand-100); padding-bottom: 8px; }
        
        .alert {
            padding: 12px;
            border-radius: 8px;
            font-size: 0.88rem;
            margin-bottom: 24px;
            font-weight: 500;
        }
        .alert-danger { background: #ffebeb; color: var(--coral); border: 1px solid rgba(255,111,97,0.2); }
        .alert-success { background: #ebfbeb; color: var(--palm-700); border: 1px solid rgba(31,111,74,0.2); }

        /* Admin Table Styles */
        .table-responsive {
            background: var(--white);
            border-radius: var(--radius);
            box-shadow: 0 4px 14px rgba(6,59,84,.06);
            overflow-x: auto;
            border: 1px solid rgba(6,59,84,.06);
            margin-bottom: 40px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.92rem;
        }
        th, td { padding: 14px 20px; border-bottom: 1px solid rgba(6,59,84,.06); }
        th { background: #fdfaf3; color: var(--ocean-900); font-weight: 600; }
        tr:hover { background-color: rgba(6,59,84,.01); }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-pending { background: #fff5e6; color: var(--sun); }
        .badge-approved { background: #e6f7ed; color: var(--palm-700); }
        .badge-rejected { background: #ffebeb; color: var(--coral); }
        .badge-role { background: rgba(6,59,84,0.08); color: var(--ocean-900); }
        .badge-role.role-admin { background: var(--sun); color: var(--ocean-900); }

        .btn-approve { background: var(--palm-700); color: #white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; color: white; transition: all 0.3s; }
        .btn-approve:hover { opacity: 0.85; }
        .btn-reject { background: var(--coral); color: #white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; color: white; transition: all 0.3s; }
        .btn-reject:hover { opacity: 0.85; }
    </style>
</head>
<body>

<header class="header">
    <a href="index.php" class="brand">
        <span class="brand-mark">C</span> Cebu Explorer <span style="font-size: 0.8rem; font-weight: 600; background: var(--sun); color: var(--ocean-900); padding: 2px 8px; border-radius: 4px; margin-left: 10px;">ADMIN</span>
    </a>
    <div class="user-nav">
        <span>Hi, Admin <strong><?= htmlspecialchars($user_name) ?></strong></span>
        <a href="dashboard.php" style="font-weight: 600; color: var(--ocean-700); font-size: 0.9rem;">My Booking Panel</a>
        <a href="logout.php" class="btn-logout">Logout</a>
    </div>
</header>

<div class="container">
    <h2 class="section-title">Operational Overview & KPI</h2>

    <?php if ($error): ?>
        <div class="alert alert-danger"><?= $error ?></div>
    <?php endif; ?>

    <?php if ($success): ?>
        <div class="alert alert-success"><?= $success ?></div>
    <?php endif; ?>

    <!-- KPI Metrics widgets -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="num"><?= $totalUsers ?></div>
            <div class="lbl">Registered Users</div>
        </div>
        <div class="stat-card">
            <div class="num"><?= $totalBookings ?></div>
            <div class="lbl">Total Bookings</div>
        </div>
        <div class="stat-card stat-pending">
            <div class="num"><?= $pendingBookings ?></div>
            <div class="lbl">Pending Action</div>
        </div>
        <div class="stat-card stat-approved">
            <div class="num"><?= $approvedBookings ?></div>
            <div class="lbl">Approved Trips</div>
        </div>
    </div>

    <!-- Bookings Management Section (UPDATE - APPROVE/REJECT) -->
    <h2 class="section-title">Manage Global Bookings</h2>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Traveler</th>
                    <th>Destination</th>
                    <th>Date & Time</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($allBookings)): ?>
                    <tr>
                        <td colspan="7" style="text-align: center; color: var(--muted); padding: 30px;">No bookings found in the database.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($allBookings as $b): ?>
                        <tr>
                            <td>#<?= $b['id'] ?></td>
                            <td>
                                <strong><?= htmlspecialchars($b['user_name']) ?></strong><br/>
                                <span style="font-size: 0.78rem; color: var(--muted);"><?= htmlspecialchars($b['user_email']) ?></span>
                            </td>
                            <td>
                                <strong><?= htmlspecialchars($b['dest_name']) ?></strong><br/>
                                <span style="font-size: 0.78rem; color: var(--muted);"><?= htmlspecialchars($b['dest_loc']) ?></span>
                            </td>
                            <td>
                                <?= date('M d, Y', strtotime($b['booking_date'])) ?><br/>
                                <span style="font-size: 0.78rem; color: var(--muted);"><?= htmlspecialchars($b['time_slot']) ?></span>
                            </td>
                            <td><?= $b['guest_count'] ?> person(s)</td>
                            <td>
                                <span class="badge badge-<?= $b['status'] ?>"><?= $b['status'] ?></span>
                            </td>
                            <td>
                                <?php if ($b['status'] === 'pending'): ?>
                                    <form method="POST" action="admin.php" style="display: inline;">
                                        <input type="hidden" name="booking_id" value="<?= $b['id'] ?>">
                                        <input type="hidden" name="action" value="approve">
                                        <button type="submit" class="btn-approve">Approve</button>
                                    </form>
                                    <form method="POST" action="admin.php" style="display: inline; margin-left: 5px;">
                                        <input type="hidden" name="booking_id" value="<?= $b['id'] ?>">
                                        <input type="hidden" name="action" value="reject">
                                        <button type="submit" class="btn-reject">Reject</button>
                                    </form>
                                <?php else: ?>
                                    <span style="font-size: 0.85rem; color: var(--muted);">Completed</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                        <?php if ($b['special_requests']): ?>
                            <tr style="background: #fafaf8;">
                                <td colspan="7" style="font-size: 0.85rem; padding: 10px 20px; color: var(--muted); border-bottom: 2px solid rgba(6,59,84,0.06);">
                                    ℹ️ <strong>Traveler Notes:</strong> <em>"<?= htmlspecialchars($b['special_requests']) ?>"</em>
                                </td>
                            </tr>
                        <?php endif; ?>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <!-- Users registry lists -->
    <h2 class="section-title">User Account Directory</h2>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>System Role</th>
                    <th>Joined On</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($allUsers as $u): ?>
                    <tr>
                        <td>#<?= $u['id'] ?></td>
                        <td><strong><?= htmlspecialchars($u['name']) ?></strong></td>
                        <td><?= htmlspecialchars($u['email']) ?></td>
                        <td>
                            <span class="badge badge-role <?= ($u['role'] === 'admin') ? 'role-admin' : '' ?>"><?= $u['role'] ?></span>
                        </td>
                        <td><?= date('M d, Y h:i A', strtotime($u['created_at'])) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>
