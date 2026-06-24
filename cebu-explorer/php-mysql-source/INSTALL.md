# Cebu Explorer Setup & Installation Guide (Local Host)

Welcome to Cebu Explorer! This guide explains how to install, import, and run the PHP & MySQL back-end application locally on your computer using **XAMPP** or **WAMP**.

---

## 1. Project Overview & Features Added
Cebu Explorer has been upgraded from a static HTML website to a full-stack, secure relational database-driven web application.

### Key Features Added:
*   **Secure Authentication System**: User registration and login utilizing BCrypt hashes (`password_hash()`) to prevent credential breaches.
*   **Proper Session Management**: Multi-page session tracking with protection against session hijacking (session regeneration) and secure logout.
*   **Relational Database Normalization**: Highly structured 3-table relational schema (`users`, `bookings`, `destinations`) with primary keys, indexes, and full cascading foreign key integrity.
*   **Cebu Adventure Booking System (Full CRUD)**:
    *   **Create**: Form to select travel dates, time slots, guest counts, and special notes.
    *   **Read**: Real-time itinerary feed dynamically retrieved from the MySQL database.
    *   **Update**: Modify existing itineraries with validation, automatically setting status to 'pending' for admin review.
    *   **Delete**: Cancel active trips instantly with user confirmation safeguards.
*   **Admin Control Panel**:
    *   Summary charts showing metrics (total bookings, active users, pending actions).
    *   Full registry of all system accounts.
    *   Real-time approvals/rejections of user bookings.
*   **Dual-Layer Validations & Security**: Secure prepared statements (PDO parameters) to eliminate SQL Injection risks, HTML sanitization to neutralize XSS, and client-side JavaScript safeguards for immediate UX feedback.

---

## 2. Folder Structure
Ensure you organize your local directory as follows in your `htdocs` or `www` folder:

```text
cebu-explorer/
│
├── cebu_explorer.sql      # Database initialization, table definitions & seeds
├── db.php                 # Safe PDO Database Connection & sanitizers
├── index.php              # Dynamically populated cebu landing page
├── login.php              # Account Login interface with verification
├── register.php           # Registration interface with validation rules
├── logout.php             # Destroys session variables and redirects
├── dashboard.php          # User core panel (Submit, edit, cancel bookings)
├── admin.php              # Administrative control center & operations
└── INSTALL.md             # This comprehensive manual
```

---

## 3. Database Schema & Table Relationships
The schema has been fully normalized to avoid data redundancies.

### Tables:
1.  **`users`**: Records client information.
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `name` (VARCHAR)
    *   `email` (VARCHAR, Unique, Indexed)
    *   `password_hash` (VARCHAR, BCrypt secure string)
    *   `role` (ENUM: 'user', 'admin')
    *   `created_at` (TIMESTAMP)

2.  **`destinations`**: Stores Cebu attractions data.
    *   `id` (VARCHAR, Primary Key)
    *   `name` (VARCHAR)
    *   `category` (ENUM)
    *   `badge` (VARCHAR)
    *   `location` (VARCHAR)
    *   `maps_url` (TEXT)
    *   `description` (TEXT)
    *   `why_visit` (TEXT)
    *   `image_url` (VARCHAR)
    *   `rating` (DECIMAL)

3.  **`bookings`**: Relational table joining users and destinations.
    *   `id` (INT, Primary Key, Auto-Increment)
    *   `user_id` (INT, Foreign Key referencing `users(id)` ON DELETE CASCADE)
    *   `destination_id` (VARCHAR, Foreign Key referencing `destinations(id)` ON DELETE CASCADE)
    *   `booking_date` (DATE, Indexed)
    *   `time_slot` (VARCHAR)
    *   `guest_count` (INT, with CHECK constraint > 0)
    *   `special_requests` (TEXT)
    *   `status` (ENUM: 'pending', 'approved', 'rejected')
    *   `created_at` (TIMESTAMP)

---

## 4. How to Run Locally

### Step A: Install XAMPP or WAMP
1.  Download and install **XAMPP** (from [apachefriends.org](https://www.apachefriends.org/)) or **WAMP** (from [wampserver.com](https://www.wampserver.com/)).
2.  Launch the Control Panel and click **Start** next to **Apache** and **MySQL**.

### Step B: Copy Files to Web Root
1.  Navigate to your web server root directory:
    *   **XAMPP**: `C:\xampp\htdocs\`
    *   **WAMP**: `C:\wamp64\www\`
2.  Create a new folder named `cebu-explorer`.
3.  Copy all project source files (`index.php`, `login.php`, etc.) inside that folder.

### Step C: Import the MySQL Database Schema
1.  Open your browser and navigate to `http://localhost/phpmyadmin/`.
2.  Click **Databases** on the top menu, type `cebu_explorer_db` as the Database name, and click **Create**.
3.  Select `cebu_explorer_db` from the left sidebar.
4.  Click the **Import** tab on the top menu.
5.  Click **Choose File** and select `cebu_explorer.sql` from your folder.
6.  Scroll to the bottom and click **Import** (or **Go**).

### Step D: Open in Browser
Open your browser and navigate to:
`http://localhost/cebu-explorer/index.php`

---

## 5. Default Test Accounts
We have pre-seeded two demo accounts in the SQL file:

### 1. Tourist Account (General User)
*   **Email**: `user@cebuexplorer.com`
*   **Password**: `UserPassword123`
*   *Capability*: Create, edit, and cancel bookings. View personal travel itineraries.

### 2. Admin Account (Control Staff)
*   **Email**: `admin@cebuexplorer.com`
*   **Password**: `AdminPassword123`
*   *Capability*: Access Admin Dashboard to approve/reject all bookings, view registries, and track business statistics.

---

## 6. How each PHP file works

*   **`db.php`**: Handshakes with the MySQL database using PHP PDO driver. Sets error reporting options and returns a reusable PDO instance. Also exports a `sanitize()` utility to clean user entries of malicious characters.
*   **`index.php`**: The homepage of Cebu Explorer. Checks if a user is logged in to change navigation buttons. Dynamically retrieves cebu beaches, falls, and peaks from the MySQL database and presents them in their beautiful original layouts.
*   **`register.php`**: Lets new tourists join. It validates details (checks email format, makes sure passwords match and are at least 8 characters long). If client tests pass, it uses `password_hash()` to generate a highly secure BCrypt hash and stores the account in `users` table.
*   **`login.php`**: Lets registered users sign in. Runs safe queries to find the account, verifies the password using `password_verify()`, generates a clean session id, and directs admins to `admin.php` and general users to `dashboard.php`.
*   **`logout.php`**: Destroys session hashes, unsets session cookies, completely terminates the active login status, and redirects the user back to the homepage.
*   **`dashboard.php`**: The active tourist hub. Offers a clean form to book tours. Under the hood, it handles the creation of bookings (INSERT), lists existing trips (SELECT), permits edits on dates or guests (UPDATE), and supports trip cancellations (DELETE) safely.
*   **`admin.php`**: The management center. Calculates database aggregations in real-time, displays accounts, and lets administrators approve or reject pending reservations in one click.
