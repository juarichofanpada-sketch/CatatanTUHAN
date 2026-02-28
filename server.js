/**
 * ═══════════════════════════════════════════════════════
 *  CATATAN TUHAN — Backend Server v2
 *  By Juaricho | Node.js + Express
 * ═══════════════════════════════════════════════════════
 *  npm install  →  node server.js
 *  Deploy: Render.com Web Service
 * ═══════════════════════════════════════════════════════
 */

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const fs         = require('fs');
const path       = require('path');
const crypto     = require('crypto');

const app  = express();
// Render menggunakan PORT dari environment variable (biasanya 10000)
const PORT = process.env.PORT || 3000;
// DB disimpan di /tmp saat di Render (karena filesystem-nya ephemeral untuk free tier)
const IS_RENDER = process.env.RENDER === 'true' || process.env.RENDER_SERVICE_ID;
const DB = IS_RENDER
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, 'db.json');

// ── Middleware ──────────────────────────────────────────
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Serve frontend dari folder public/
// Di repo GitHub: index.html & app.js ada di folder public/
app.use(express.static(path.join(__dirname, 'public')));

// ── Health check untuk Render ───────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'running', time: new Date().toISOString() });
});

// ── DB Helpers ──────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB)) return getDefaultDB();
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')); }
  catch { return getDefaultDB(); }
}

function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2), 'utf8');
}

function getDefaultDB() {
  const now = new Date().toISOString();
  return {
    // Multiple admin passwords
    adminPasswords: ['1223334444', 'Juaricho12345678', 'Andre123#'],
    registeredUsers: [
      { name: 'Juaricho', pw: 'jua2024',  role: 'user', created: now },
      { name: 'Maria',    pw: 'maria123', role: 'user', created: now },
      { name: 'Samuel',   pw: 'sam2024',  role: 'user', created: now },
      { name: 'Ruth',     pw: 'ruth2024', role: 'user', created: now },
    ],
    notes: [],
    sessions: {},
    visitors: []
  };
}

// Init DB if missing
if (!fs.existsSync(DB)) {
  writeDB(getDefaultDB());
  console.log('✅ Database db.json dibuat.');
} else {
  // Migrate: if old single adminPw field exists, upgrade to array
  const db = readDB();
  if (db.adminPw && !db.adminPasswords) {
    db.adminPasswords = ['1223334444', 'Juaricho12345678', 'Andre123#'];
    delete db.adminPw;
    writeDB(db);
    console.log('✅ DB dimigrasi ke format adminPasswords array.');
  }
}

// ── Session Helpers ─────────────────────────────────────
function makeToken() {
  return crypto.randomBytes(32).toString('hex');
}
function getSession(req) {
  const token = req.headers['x-session-token'];
  if (!token) return null;
  const db = readDB();
  return db.sessions[token] || null;
}
function requireAdmin(req, res) {
  const sess = getSession(req);
  if (!sess || sess.role !== 'admin') {
    res.status(403).json({ ok: false, error: 'Akses ditolak. Hanya Admin.' });
    return false;
  }
  return true;
}
function requireLogin(req, res) {
  const sess = getSession(req);
  if (!sess) {
    res.status(401).json({ ok: false, error: 'Belum login.' });
    return false;
  }
  return true;
}
function logVisitor(db, name, role) {
  const idx = db.visitors.findIndex(v => v.name === name && v.role === role);
  const entry = { name, role, loginTime: new Date().toISOString() };
  if (idx >= 0) db.visitors[idx] = entry;
  else db.visitors.push(entry);
}

// ═══════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════

// POST /api/auth/admin — Login admin (cek dari array adminPasswords)
app.post('/api/auth/admin', (req, res) => {
  const { password } = req.body;
  const db = readDB();
  const passwords = db.adminPasswords || [];
  if (!passwords.includes(password)) {
    return res.json({ ok: false, error: 'Sandi admin salah.' });
  }
  const token = makeToken();
  db.sessions[token] = { name: 'Admin', role: 'admin', loginTime: new Date().toISOString() };
  logVisitor(db, 'Admin', 'admin');
  writeDB(db);
  res.json({ ok: true, token, name: 'Admin', role: 'admin' });
});

// POST /api/auth/user — Login pengguna terdaftar
app.post('/api/auth/user', (req, res) => {
  const { name, password } = req.body;
  const db = readDB();
  const user = db.registeredUsers.find(
    u => u.name.toLowerCase() === (name || '').toLowerCase() && u.pw === password
  );
  if (!user) return res.json({ ok: false, error: 'Nama atau sandi salah.' });
  const token = makeToken();
  db.sessions[token] = { name: user.name, role: 'user', loginTime: new Date().toISOString() };
  logVisitor(db, user.name, 'user');
  writeDB(db);
  res.json({ ok: true, token, name: user.name, role: 'user' });
});

// POST /api/auth/register — Daftar akun baru
app.post('/api/auth/register', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return res.json({ ok: false, error: 'Nama dan sandi wajib diisi.' });
  if (name.length < 2) return res.json({ ok: false, error: 'Nama minimal 2 karakter.' });
  if (password.length < 4) return res.json({ ok: false, error: 'Sandi minimal 4 karakter.' });
  const db = readDB();
  const exists = db.registeredUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.json({ ok: false, error: 'Nama sudah digunakan. Pilih nama lain.' });
  const newUser = { name, pw: password, role: 'user', created: new Date().toISOString() };
  db.registeredUsers.push(newUser);
  const token = makeToken();
  db.sessions[token] = { name, role: 'user', loginTime: new Date().toISOString() };
  logVisitor(db, name, 'user');
  writeDB(db);
  res.json({ ok: true, token, name, role: 'user' });
});

// POST /api/auth/guest — Login tamu
app.post('/api/auth/guest', (req, res) => {
  const db = readDB();
  const token = makeToken();
  db.sessions[token] = { name: 'Tamu', role: 'guest', loginTime: new Date().toISOString() };
  logVisitor(db, 'Tamu', 'guest');
  writeDB(db);
  res.json({ ok: true, token, name: 'Tamu', role: 'guest' });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['x-session-token'];
  if (token) {
    const db = readDB();
    delete db.sessions[token];
    writeDB(db);
  }
  res.json({ ok: true });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const sess = getSession(req);
  if (!sess) return res.json({ ok: false });
  res.json({ ok: true, name: sess.name, role: sess.role });
});

// ═══════════════════════════════════════════════════════
//  NOTES ROUTES
// ═══════════════════════════════════════════════════════

app.get('/api/notes', (req, res) => {
  const sess = getSession(req);
  const db = readDB();
  let notes = db.notes;
  if (!sess || sess.role === 'guest') {
    notes = notes
      .filter(n => n.visibility === 'global' || n.visibility === 'locked' || !n.visibility)
      .map(n => n.visibility === 'locked' ? { ...n, content: '', lockPw: undefined } : n);
  } else if (sess.role === 'user') {
    notes = notes
      .filter(n =>
        n.visibility === 'global' || n.visibility === 'locked' || !n.visibility ||
        (n.visibility === 'private' && n.owner === sess.name)
      )
      .map(n => n.visibility === 'locked' ? { ...n, content: '', lockPw: undefined } : n);
  } else if (sess.role === 'admin') {
    notes = notes.map(n => ({ ...n, lockPw: undefined }));
  }
  res.json({ ok: true, notes });
});

app.post('/api/notes', (req, res) => {
  const sess = getSession(req);
  if (!sess) return res.status(401).json({ ok: false, error: 'Belum login.' });
  const { title, type, link, content, desc, cat, displayItem, visibility, lockPw, by } = req.body;
  if (!title) return res.json({ ok: false, error: 'Judul wajib diisi.' });
  if (type === 'drive' && (!link || !link.startsWith('http')))
    return res.json({ ok: false, error: 'Link tidak valid.' });
  if (type === 'text' && !content)
    return res.json({ ok: false, error: 'Isi catatan wajib diisi.' });
  const db = readDB();
  const id = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const finalVis = sess.role === 'guest' ? 'global' : (visibility || 'global');
  const note = {
    id, ts: id, type: type || 'drive', title,
    link: type === 'drive' ? (link || '') : '',
    content: type === 'text' ? (content || '') : '',
    desc: desc || '', cat: cat || 'Umum', displayItem: displayItem || '',
    visibility: finalVis, lockPw: finalVis === 'locked' ? (lockPw || '') : '',
    by: by || sess.name, owner: sess.name, date: today, pinned: false
  };
  db.notes.unshift(note);
  writeDB(db);
  res.json({ ok: true, note: { ...note, lockPw: undefined } });
});

app.put('/api/notes/:id', (req, res) => {
  const sess = getSession(req);
  if (!sess) return res.status(401).json({ ok: false, error: 'Belum login.' });
  const db = readDB();
  const id = parseInt(req.params.id);
  const idx = db.notes.findIndex(n => n.id === id);
  if (idx < 0) return res.json({ ok: false, error: 'Catatan tidak ditemukan.' });
  const note = db.notes[idx];
  if (sess.role !== 'admin' && note.owner !== sess.name)
    return res.status(403).json({ ok: false, error: 'Tidak punya izin.' });
  const { title, link, content, desc, cat, displayItem, visibility, lockPw, by } = req.body;
  db.notes[idx] = {
    ...note,
    title: title ?? note.title, link: link ?? note.link, content: content ?? note.content,
    desc: desc ?? note.desc, cat: cat ?? note.cat, displayItem: displayItem ?? note.displayItem,
    visibility: visibility ?? note.visibility, by: by ?? note.by,
    lockPw: (visibility || note.visibility) === 'locked' ? (lockPw ?? note.lockPw) : ''
  };
  writeDB(db);
  res.json({ ok: true, note: { ...db.notes[idx], lockPw: undefined } });
});

app.delete('/api/notes/:id', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const db = readDB();
  const id = parseInt(req.params.id);
  const before = db.notes.length;
  db.notes = db.notes.filter(n => n.id !== id);
  if (db.notes.length === before) return res.json({ ok: false, error: 'Catatan tidak ditemukan.' });
  writeDB(db);
  res.json({ ok: true });
});

app.patch('/api/notes/:id/pin', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const db = readDB();
  const id = parseInt(req.params.id);
  const idx = db.notes.findIndex(n => n.id === id);
  if (idx < 0) return res.json({ ok: false, error: 'Tidak ditemukan.' });
  db.notes[idx].pinned = !db.notes[idx].pinned;
  writeDB(db);
  res.json({ ok: true, pinned: db.notes[idx].pinned });
});

app.post('/api/notes/:id/unlock', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const note = db.notes.find(n => n.id === id);
  if (!note) return res.json({ ok: false, error: 'Tidak ditemukan.' });
  if (note.visibility !== 'locked') return res.json({ ok: false, error: 'Catatan ini tidak berkunci.' });
  const { password } = req.body;
  if (password !== note.lockPw) return res.json({ ok: false, error: 'Sandi salah.' });
  res.json({ ok: true, content: note.content, link: note.link, type: note.type });
});

// ═══════════════════════════════════════════════════════
//  ADMIN ROUTES
// ═══════════════════════════════════════════════════════

app.get('/api/admin/users', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const db = readDB();
  res.json({ ok: true, users: db.registeredUsers.map(({ pw, ...r }) => r) });
});

app.post('/api/admin/users', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { name, password } = req.body;
  if (!name || !password) return res.json({ ok: false, error: 'Nama dan sandi wajib.' });
  const db = readDB();
  const idx = db.registeredUsers.findIndex(u => u.name.toLowerCase() === name.toLowerCase());
  if (idx >= 0) {
    db.registeredUsers[idx].pw = password;
    writeDB(db);
    return res.json({ ok: true, action: 'updated', name });
  }
  db.registeredUsers.push({ name, pw: password, role: 'user', created: new Date().toISOString() });
  writeDB(db);
  res.json({ ok: true, action: 'created', name });
});

app.delete('/api/admin/users/:name', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const db = readDB();
  const name = decodeURIComponent(req.params.name);
  const before = db.registeredUsers.length;
  db.registeredUsers = db.registeredUsers.filter(u => u.name.toLowerCase() !== name.toLowerCase());
  if (db.registeredUsers.length === before)
    return res.json({ ok: false, error: 'Pengguna tidak ditemukan.' });
  writeDB(db);
  res.json({ ok: true });
});

// PUT /api/admin/password — Update salah satu admin password (atau tambah baru)
app.put('/api/admin/password', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { currentPw, newPw } = req.body;
  const db = readDB();
  const idx = db.adminPasswords.indexOf(currentPw);
  if (idx < 0) return res.json({ ok: false, error: 'Sandi saat ini tidak ditemukan di daftar sandi admin.' });
  if (!newPw) return res.json({ ok: false, error: 'Sandi baru tidak boleh kosong.' });
  db.adminPasswords[idx] = newPw;
  writeDB(db);
  res.json({ ok: true });
});

app.get('/api/admin/stats', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const db = readDB();
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    ok: true,
    total: db.notes.length,
    global: db.notes.filter(n => n.visibility === 'global' || !n.visibility).length,
    private: db.notes.filter(n => n.visibility === 'private').length,
    locked: db.notes.filter(n => n.visibility === 'locked').length,
    pinned: db.notes.filter(n => n.pinned).length,
    registeredUsers: db.registeredUsers.length,
    todayNotes: db.notes.filter(n => n.date === today).length,
    visitors: db.visitors,
    adminPasswordCount: db.adminPasswords.length
  });
});


// ── SPA fallback: route non-API ke index.html ───────────
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path === '/health') return next();
  const indexFile = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    next();
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'Endpoint tidak ditemukan.' });
});

// ── Start Server ────────────────────────────────────────
// PENTING: bind ke '0.0.0.0' agar bisa diakses di Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n\u271D  Catatan Tuhan \u2014 Backend Server v2`);
  console.log(`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`);
  console.log(`\uD83D\uDE80  Running at port ${PORT}`);
  console.log(`\uD83D\uDCC2  Database: ${DB}`);
  console.log(`\uD83C\uDF0D  Mode: ${IS_RENDER ? 'Render.com' : 'Local'}`);
  console.log(`\uD83D\uDD11  Admin passwords: 1223334444 | Juaricho12345678 | Andre123#`);
  console.log(`\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n`);
});
