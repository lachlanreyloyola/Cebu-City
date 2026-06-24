import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db-store.json');

app.use(express.json());

// Initialize database store file if not exists
interface DbStore {
  users: any[];
  bookings: any[];
}

const initialDb: DbStore = {
  users: [
    { id: 1, name: 'Cebu Admin', email: 'admin@cebuexplorer.com', password: 'AdminPassword123', role: 'admin' },
    { id: 2, name: 'Maria Santos', email: 'user@cebuexplorer.com', password: 'UserPassword123', role: 'user' }
  ],
  bookings: [
    {
      id: 1,
      userId: 2,
      destinationId: 'kawasan-falls',
      bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeSlot: '08:00 AM - 12:00 PM',
      guestCount: 3,
      specialRequests: 'Requesting local canyoneering guide registration.',
      status: 'approved',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      userId: 2,
      destinationId: 'osmena-peak',
      bookingDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeSlot: '05:00 AM - 08:00 AM',
      guestCount: 2,
      specialRequests: 'Sunrise camping hike preferences.',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ]
};

function readDb(): DbStore {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading file db:', err);
    return initialDb;
  }
}

function writeDb(data: DbStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing file db:', err);
  }
}

// --------------------------------------------------
// API ENDPOINTS - Authentication
// --------------------------------------------------

// Register API
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = readDb();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'This email is already registered.' });
  }

  const newUser = {
    id: db.users.length ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
    name,
    email,
    password, // Simulated hashing for local dev preview ease
    role: 'user'
  };

  db.users.push(newUser);
  writeDb(db);

  // Return user without password
  const { password: _, ...userResponse } = newUser;
  res.status(201).json({ success: true, user: userResponse });
});

// Login API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...userResponse } = user;
  res.json({ success: true, user: userResponse });
});

// --------------------------------------------------
// API ENDPOINTS - Bookings CRUD
// --------------------------------------------------

// List user bookings (Read)
app.get('/api/bookings', (req, res) => {
  const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
  const role = req.query.role as string;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  const db = readDb();
  
  // Admins see all bookings, regular users see their own
  let bookings = db.bookings;
  if (role !== 'admin') {
    bookings = db.bookings.filter(b => b.userId === userId);
  }

  res.json({ bookings });
});

// Create booking (Create)
app.post('/api/bookings', (req, res) => {
  const { userId, destinationId, bookingDate, timeSlot, guestCount, specialRequests } = req.body;

  if (!userId || !destinationId || !bookingDate || !timeSlot || !guestCount) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = readDb();
  const newBooking = {
    id: db.bookings.length ? Math.max(...db.bookings.map(b => b.id)) + 1 : 1,
    userId: parseInt(userId),
    destinationId,
    bookingDate,
    timeSlot,
    guestCount: parseInt(guestCount),
    specialRequests: specialRequests || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  writeDb(db);

  res.status(201).json({ success: true, booking: newBooking });
});

// Update booking (Update)
app.put('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const { bookingDate, timeSlot, guestCount, specialRequests, userId } = req.body;

  if (!bookingId || !bookingDate || !timeSlot || !guestCount || !userId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  // Verify ownership or admin privileges
  if (db.bookings[index].userId !== parseInt(userId)) {
    return res.status(403).json({ error: 'Permission denied.' });
  }

  db.bookings[index] = {
    ...db.bookings[index],
    bookingDate,
    timeSlot,
    guestCount: parseInt(guestCount),
    specialRequests: specialRequests || '',
    status: 'pending' // Revert to pending for administrative review after editing
  };

  writeDb(db);
  res.json({ success: true, booking: db.bookings[index] });
});

// Delete booking (Delete)
app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const userId = parseInt(req.query.userId as string);

  if (!bookingId || !userId) {
    return res.status(400).json({ error: 'Invalid parameters.' });
  }

  const db = readDb();
  const index = db.bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  // Verify ownership
  if (db.bookings[index].userId !== userId) {
    return res.status(403).json({ error: 'Permission denied.' });
  }

  db.bookings.splice(index, 1);
  writeDb(db);

  res.json({ success: true });
});

// --------------------------------------------------
// API ENDPOINTS - Admin control (Approve/Reject)
// --------------------------------------------------

// Update status
app.post('/api/admin/bookings/:id/status', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const { status, adminId } = req.body;

  if (!bookingId || !status || !adminId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = readDb();
  const adminUser = db.users.find(u => u.id === parseInt(adminId) && u.role === 'admin');

  if (!adminUser) {
    return res.status(403).json({ error: 'Unauthorized: Admin privileges required.' });
  }

  const index = db.bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  db.bookings[index].status = status; // 'approved' or 'rejected'
  writeDb(db);

  res.json({ success: true, booking: db.bookings[index] });
});

// Get global system statistics
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const totalUsers = db.users.length;
  const totalBookings = db.bookings.length;
  const pendingBookings = db.bookings.filter(b => b.status === 'pending').length;
  const approvedBookings = db.bookings.filter(b => b.status === 'approved').length;

  res.json({
    totalUsers,
    totalBookings,
    pendingBookings,
    approvedBookings,
    users: db.users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }))
  });
});

// --------------------------------------------------
// VITE DEV SERVER AND STATIC ASSETS INTEGRATION
// --------------------------------------------------

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched on host 0.0.0.0 and port ${PORT}`);
  });
}

bootstrap();
