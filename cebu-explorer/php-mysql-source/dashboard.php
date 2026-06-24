<?php
require_once 'db.php';
session_start();

// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'];
$user_email = $_SESSION['user_email'];

$error = '';
$success = '';

$db = getDB();

// --------------------------------------------------
// HANDLE BOOKING CREATION (CREATE)
// --------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create') {
    $destination_id = sanitize($_POST['destination_id'] ?? '');
    $booking_date = sanitize($_POST['booking_date'] ?? '');
    $time_slot = sanitize($_POST['time_slot'] ?? '');
    $guest_count = intval($_POST['guest_count'] ?? 1);
    $special_requests = sanitize($_POST['special_requests'] ?? '');

    if (empty($destination_id) || empty($booking_date) || empty($time_slot) || $guest_count < 1) {
        $error = 'Please fill out all required booking details.';
    } else {
        try {
            $stmt = $db->prepare("INSERT INTO bookings (user_id, destination_id, booking_date, time_slot, guest_count, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')");
            $stmt->execute([$user_id, $destination_id, $booking_date, $time_slot, $guest_count, $special_requests]);
            $success = 'Your adventure booking request has been submitted successfully! Check status below.';
        } catch (PDOException $e) {
            $error = 'Failed to submit booking. Please try again.';
            error_log("Create Booking Error: " . $e->getMessage());
        }
    }
}

// --------------------------------------------------
// HANDLE BOOKING UPDATE (UPDATE)
// --------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update') {
    $booking_id = intval($_POST['booking_id'] ?? 0);
    $booking_date = sanitize($_POST['booking_date'] ?? '');
    $time_slot = sanitize($_POST['time_slot'] ?? '');
    $guest_count = intval($_POST['guest_count'] ?? 1);
    $special_requests = sanitize($_POST['special_requests'] ?? '');

    if (empty($booking_date) || empty($time_slot) || $guest_count < 1 || $booking_id <= 0) {
        $error = 'Invalid parameters for updating booking.';
    } else {
        try {
            // Verify ownership before updating
            $checkStmt = $db->prepare("SELECT id FROM bookings WHERE id = ? AND user_id = ?");
            $checkStmt->execute([$booking_id, $user_id]);
            if ($checkStmt->fetch()) {
                $stmt = $db->prepare("UPDATE bookings SET booking_date = ?, time_slot = ?, guest_count = ?, special_requests = ?, status = 'pending' WHERE id = ?");
                $stmt->execute([$booking_date, $time_slot, $guest_count, $special_requests, $booking_id]);
                $success = 'Booking updated successfully! Note that status has reverted to pending for review.';
            } else {
                $error = 'Permission denied. Unauthorized booking modification.';
            }
        } catch (PDOException $e) {
            $error = 'Failed to update booking. Please try again.';
            error_log("Update Booking Error: " . $e->getMessage());
        }
    }
}

// --------------------------------------------------
// HANDLE BOOKING CANCELLATION (DELETE)
// --------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $booking_id = intval($_POST['booking_id'] ?? 0);

    if ($booking_id > 0) {
        try {
            // Verify ownership before deleting
            $checkStmt = $db->prepare("SELECT id FROM bookings WHERE id = ? AND user_id = ?");
            $checkStmt->execute([$booking_id, $user_id]);
            if ($checkStmt->fetch()) {
                $stmt = $db->prepare("DELETE FROM bookings WHERE id = ?");
                $stmt->execute([$booking_id]);
                $success = 'Booking canceled successfully.';
            } else {
                $error = 'Permission denied. Unauthorized booking cancellation.';
            }
        } catch (PDOException $e) {
            $error = 'Failed to cancel booking. Please try again.';
            error_log("Delete Booking Error: " . $e->getMessage());
        }
    } else {
        $error = 'Invalid booking ID.';
    }
}

// --------------------------------------------------
// READ DATA - Fetch user's bookings and destinations
// --------------------------------------------------
try {
    // Fetch all active destinations for booking form dropdown
    $destStmt = $db->query("SELECT id, name, location FROM destinations ORDER BY name ASC");
    $destinations = $destStmt->fetchAll();

    // Fetch user bookings with joined destination details
    $bookingStmt = $db->prepare("
        SELECT b.id, b.booking_date, b.time_slot, b.guest_count, b.special_requests, b.status, b.created_at,
               d.name AS dest_name, d.location AS dest_loc, d.image_url AS dest_image
        FROM bookings b
        JOIN destinations d ON b.destination_id = d.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date ASC
    ");
    $bookingStmt->execute([$user_id]);
    $bookings = $bookingStmt->fetchAll();
} catch (PDOException $e) {
    $error = 'Error loading dashboard records.';
    error_log("Dashboard Retrieval Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard - Cebu Explorer</title>
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
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        @media(max-width: 900px) { .container { grid-template-columns: 1fr; } }
        .card {
            background: var(--white);
            border-radius: var(--radius);
            padding: 24px;
            box-shadow: 0 4px 14px rgba(6,59,84,.06);
            border: 1px solid rgba(6,59,84,.06);
        }
        .card h2 { color: var(--ocean-900); font-size: 1.35rem; margin-bottom: 20px; border-bottom: 2px solid var(--sand-100); padding-bottom: 8px; }
        .form-group { margin-bottom: 16px; }
        label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
        input, select, textarea {
            width: 100%;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1.5px solid rgba(6,59,84,.12);
            font-family: inherit;
            outline: none;
            transition: all 0.3s;
        }
        input:focus, select:focus, textarea:focus { border-color: var(--ocean-500); }
        .btn {
            background: var(--ocean-700);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn:hover { background: var(--ocean-500); }
        .btn-block { width: 100%; }
        .alert {
            padding: 12px;
            border-radius: 8px;
            font-size: 0.88rem;
            margin-bottom: 20px;
            font-weight: 500;
        }
        .alert-danger { background: #ffebeb; color: var(--coral); border: 1px solid rgba(255,111,97,0.2); }
        .alert-success { background: #ebfbeb; color: var(--palm-700); border: 1px solid rgba(31,111,74,0.2); }
        
        /* Bookings List Styles */
        .bookings-list { display: flex; flex-direction: column; gap: 20px; }
        .booking-item {
            background: var(--white);
            border-radius: var(--radius);
            border: 1px solid rgba(6,59,84,.06);
            padding: 20px;
            display: flex;
            gap: 20px;
            box-shadow: 0 4px 12px rgba(6,59,84,.04);
            align-items: center;
        }
        @media(max-width: 600px) { .booking-item { flex-direction: column; align-items: flex-start; } }
        .booking-img {
            width: 110px;
            height: 110px;
            border-radius: 10px;
            object-fit: cover;
        }
        @media(max-width: 600px) { .booking-img { width: 100%; height: 150px; } }
        .booking-info { flex: 1; }
        .booking-info h3 { color: var(--ocean-900); font-size: 1.2rem; margin-bottom: 6px; }
        .booking-info .loc { font-size: 0.82rem; color: var(--ocean-700); font-weight: 500; margin-bottom: 10px; }
        .booking-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.88rem; color: var(--muted); margin-bottom: 12px; }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-pending { background: #fff5e6; color: var(--sun); }
        .badge-approved { background: #e6f7ed; color: var(--palm-700); }
        .badge-rejected { background: #ffebeb; color: var(--coral); }
        
        .booking-actions { display: flex; gap: 10px; margin-top: 10px; }
        .btn-cancel { background: #fff; border: 1.5px solid var(--coral); color: var(--coral); padding: 5px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-cancel:hover { background: var(--coral); color: #fff; }
        .btn-edit { background: #fff; border: 1.5px solid var(--ocean-700); color: var(--ocean-700); padding: 5px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .btn-edit:hover { background: var(--ocean-700); color: #fff; }

        /* Modal or Dynamic Editing styling */
        .modal {
            display: none;
            position: fixed;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(6,59,84,0.4);
            place-items: center;
        }
        .modal-content {
            background-color: #fff;
            padding: 30px;
            border-radius: var(--radius);
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            position: relative;
        }
        .close {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            color: var(--muted);
        }
    </style>
</head>
<body>

<header class="header">
    <a href="index.php" class="brand">
        <span class="brand-mark">C</span> Cebu Explorer
    </a>
    <div class="user-nav">
        <span>Hi, <strong><?= htmlspecialchars($user_name) ?></strong></span>
        <?php if ($_SESSION['user_role'] === 'admin'): ?>
            <a href="admin.php" style="font-weight: 600; color: var(--ocean-700); font-size: 0.9rem;">Admin Panel</a>
        <?php endif; ?>
        <a href="logout.php" class="btn-logout">Logout</a>
    </div>
</header>

<div class="container">
    <!-- Booking submission form column (CREATE) -->
    <div class="card">
        <h2>Book a New Adventure</h2>
        
        <?php if ($error): ?>
            <div class="alert alert-danger"><?= $error ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success"><?= $success ?></div>
        <?php endif; ?>

        <form method="POST" action="dashboard.php" id="booking-form">
            <input type="hidden" name="action" value="create">
            <div class="form-group">
                <label for="destination_id">Select Destination</label>
                <select name="destination_id" id="destination_id" required>
                    <option value="">-- Choose Destination --</option>
                    <?php foreach ($destinations as $dest): ?>
                        <option value="<?= $dest['id'] ?>"><?= htmlspecialchars($dest['name']) ?> (<?= htmlspecialchars($dest['location']) ?>)</option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="booking_date">Preferred Date</label>
                <input type="date" name="booking_date" id="booking_date" min="<?= date('Y-m-d') ?>" required>
            </div>
            <div class="form-group">
                <label for="time_slot">Preferred Time Slot</label>
                <select name="time_slot" id="time_slot" required>
                    <option value="05:00 AM - 08:00 AM">05:00 AM - 08:00 AM (Sunrise slots)</option>
                    <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning slots)</option>
                    <option value="01:00 PM - 05:00 PM" selected>01:00 PM - 05:00 PM (Afternoon slots)</option>
                    <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM (Evening slots)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="guest_count">Number of Travelers</label>
                <input type="number" name="guest_count" id="guest_count" min="1" max="50" value="1" required>
            </div>
            <div class="form-group">
                <label for="special_requests">Special Instructions / Requests</label>
                <textarea name="special_requests" id="special_requests" rows="3" placeholder="Dietary requests, hotel pickup details, tour guides, etc..."></textarea>
            </div>
            <button type="submit" class="btn btn-block">Confirm Booking Request</button>
        </form>
    </div>

    <!-- Booking history and actions column (READ, UPDATE, DELETE) -->
    <div>
        <h2 style="font-family: inherit; font-size: 1.45rem; color: var(--ocean-900); margin-bottom: 20px;">My Travel Itinerary</h2>
        
        <?php if (empty($bookings)): ?>
            <div class="card" style="text-align: center; padding: 40px; color: var(--muted);">
                <p style="font-size: 1.1rem; margin-bottom: 14px;">🏝️ You don't have any bookings yet.</p>
                <p style="font-size: 0.9rem;">Select a cebu destination on the left form and request your first booking!</p>
            </div>
        <?php else: ?>
            <div class="bookings-list">
                <?php foreach ($bookings as $b): ?>
                    <div class="booking-item">
                        <img src="<?= $b['dest_image'] ?>" alt="<?= htmlspecialchars($b['dest_name']) ?>" class="booking-img">
                        <div class="booking-info">
                            <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 8px;">
                                <h3><?= htmlspecialchars($b['dest_name']) ?></h3>
                                <span class="badge badge-<?= $b['status'] ?>"><?= $b['status'] ?></span>
                            </div>
                            <div class="loc">📍 <?= htmlspecialchars($b['dest_loc']) ?></div>
                            <div class="booking-meta">
                                <div>📅 <strong>Date:</strong> <?= date('M d, Y', strtotime($b['booking_date'])) ?></div>
                                <div>🕒 <strong>Time:</strong> <?= htmlspecialchars($b['time_slot']) ?></div>
                                <div>👥 <strong>Guests:</strong> <?= $b['guest_count'] ?> person(s)</div>
                            </div>
                            <?php if ($b['special_requests']): ?>
                                <div style="font-size: 0.85rem; color: var(--muted); background: var(--sand-50); padding: 8px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid var(--ocean-500);">
                                    💬 <em>"<?= htmlspecialchars($b['special_requests']) ?>"</em>
                                </div>
                            <?php endif; ?>

                            <div class="booking-actions">
                                <!-- Trigger Edit Modal -->
                                <button type="button" class="btn-edit" onclick="openEditModal(<?= htmlspecialchars(json_encode([
                                    'id' => $b['id'],
                                    'name' => $b['dest_name'],
                                    'date' => $b['booking_date'],
                                    'time_slot' => $b['time_slot'],
                                    'guests' => $b['guest_count'],
                                    'requests' => $b['special_requests']
                                ])) ?>)">Edit Booking</button>
                                
                                <!-- Delete Booking Form -->
                                <form method="POST" action="dashboard.php" style="display: inline;" onsubmit="return confirm('Are you sure you want to cancel this booking?');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="booking_id" value="<?= $b['id'] ?>">
                                    <button type="submit" class="btn-cancel">Cancel Itinerary</button>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<!-- Dynamic Update Modal -->
<div id="editModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="closeEditModal()">&times;</span>
        <h3 id="modal-dest-title" style="color: var(--ocean-900); font-size: 1.3rem; margin-bottom: 20px;">Edit Itinerary</h3>
        <form method="POST" action="dashboard.php">
            <input type="hidden" name="action" value="update">
            <input type="hidden" name="booking_id" id="edit_booking_id">
            
            <div class="form-group">
                <label for="edit_booking_date">Date of Travel</label>
                <input type="date" name="booking_date" id="edit_booking_date" min="<?= date('Y-m-d') ?>" required>
            </div>
            
            <div class="form-group">
                <label for="edit_time_slot">Preferred Time Slot</label>
                <select name="time_slot" id="edit_time_slot" required>
                    <option value="05:00 AM - 08:00 AM">05:00 AM - 08:00 AM (Sunrise slots)</option>
                    <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning slots)</option>
                    <option value="01:00 PM - 05:00 PM">01:00 PM - 05:00 PM (Afternoon slots)</option>
                    <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM (Evening slots)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="edit_guest_count">Number of Travelers</label>
                <input type="number" name="guest_count" id="edit_guest_count" min="1" max="50" required>
            </div>
            
            <div class="form-group">
                <label for="edit_special_requests">Special Requests / Instructions</label>
                <textarea name="special_requests" id="edit_special_requests" rows="3"></textarea>
            </div>
            
            <button type="submit" class="btn btn-block">Save Booking Changes</button>
        </form>
    </div>
</div>

<script>
function openEditModal(booking) {
    document.getElementById('edit_booking_id').value = booking.id;
    document.getElementById('modal-dest-title').textContent = "Modify Booking: " + booking.name;
    document.getElementById('edit_booking_date').value = booking.date;
    document.getElementById('edit_time_slot').value = booking.time_slot;
    document.getElementById('edit_guest_count').value = booking.guests;
    document.getElementById('edit_special_requests').value = booking.requests;
    
    document.getElementById('editModal').style.display = 'grid';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Close modal if user clicks outside content box
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
</script>
</body>
</html>
