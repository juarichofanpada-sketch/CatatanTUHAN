/* ════════════════════════════════════════════
   CATATAN TUHAN — app.js  (By Juaricho)
   Versi: 2.0 | Dipisah dari index.html
   ════════════════════════════════════════════ */

/* ── STARS INIT ─────────────────────────────── */
(function(){
  const sc = document.getElementById('stars-container');
  if (!sc) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = Math.random() * 4 + 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*88}%;left:${Math.random()*88}%;animation-delay:${Math.random()*2}s;animation-duration:${1.2+Math.random()*1.4}s;`;
    sc.appendChild(s);
  }
})();

/* ── LOADING SCREEN → LANGSUNG KE LOGIN ────── */
window.addEventListener('load', () => {
  // Animasi loading 3.8 detik lalu otomatis hilang dan tampil login
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) ls.classList.add('hide');
  }, 3800);
});

/* ── THEME ──────────────────────────────────── */
let currentTheme = localStorage.getItem('ct_theme') || 'dark';
function applyTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'light' : '');
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = currentTheme === 'light' ? '☀️ Terang' : '🌙 Gelap';
}
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ct_theme', currentTheme);
  applyTheme();
}
applyTheme();

/* ── VERSES ─────────────────────────────────── */
const VERSES = [
  {t:"Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal.",r:"Yohanes 3:16"},
  {t:"Tuhan adalah gembalaku, takkan kekurangan aku.",r:"Mazmur 23:1"},
  {t:"Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",r:"Filipi 4:13"},
  {t:"Rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan hari depan yang penuh harapan.",r:"Yeremia 29:11"},
  {t:"Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.",r:"Amsal 3:5"},
  {t:"Janganlah takut, sebab Aku menyertai engkau; janganlah bimbang, sebab Aku ini Allahmu.",r:"Yesaya 41:10"},
  {t:"Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu.",r:"Matius 6:33"},
  {t:"Aku adalah jalan dan kebenaran dan hidup.",r:"Yohanes 14:6"},
  {t:"Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.",r:"Mazmur 119:105"},
  {t:"Tuhan itu baik bagi orang yang berharap kepada-Nya, bagi jiwa yang mencari Dia.",r:"Ratapan 3:25"},
  {t:"Dalam kasih tidak ada ketakutan: kasih yang sempurna melenyapkan ketakutan.",r:"1 Yohanes 4:18"},
  {t:"Aku adalah kebangkitan dan hidup; barangsiapa percaya kepada-Ku, ia akan hidup.",r:"Yohanes 11:25"},
  {t:"Ia memberikan kekuatan kepada yang lelah dan menambah semangat kepada yang tiada berdaya.",r:"Yesaya 40:29"},
  {t:"TUHAN adalah terangku dan keselamatanku, kepada siapakah aku harus takut?",r:"Mazmur 27:1"},
  {t:"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu.",r:"1 Korintus 13:4"},
];
let vi = Math.floor(Math.random() * VERSES.length);
function showVerse() {
  const v = VERSES[vi];
  const vt = document.getElementById('verse-text');
  const vr = document.getElementById('verse-ref');
  if (vt) vt.textContent = `"${v.t}"`;
  if (vr) vr.textContent = `— ${v.r}`;
}
showVerse();
setInterval(() => {
  vi = (vi + 1) % VERSES.length;
  const el = document.getElementById('verse-text');
  if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => { showVerse(); el.style.transition = 'opacity 1s'; el.style.opacity = 1; }, 500);
}, 30000);

/* ── WITA CLOCK ─────────────────────────────── */
const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const MON  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
function tick() {
  const now  = new Date();
  const wita = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
  const h = String(wita.getHours()).padStart(2,'0');
  const m = String(wita.getMinutes()).padStart(2,'0');
  const s = String(wita.getSeconds()).padStart(2,'0');
  const cl = document.getElementById('wita-clock');
  const dt = document.getElementById('wita-date');
  if (cl) cl.textContent = `${h}:${m}:${s} WITA`;
  if (dt) dt.textContent = `${DAYS[wita.getDay()]}, ${wita.getDate()} ${MON[wita.getMonth()]} ${wita.getFullYear()}`;
}
setInterval(tick, 1000); tick();

/* ── DATABASE (localStorage - standalone mode) ─ */
const ADMIN_PASSWORDS_DEFAULT = ['1223334444', 'Juaricho12345678', 'Andre123#'];
const REGISTERED_USERS_DEFAULT = [
  {name:'Juaricho', pw:'jua2024',  role:'user'},
  {name:'Maria',    pw:'maria123', role:'user'},
  {name:'Samuel',   pw:'sam2024',  role:'user'},
  {name:'Ruth',     pw:'ruth2024', role:'user'},
];

let notes           = JSON.parse(localStorage.getItem('ct_notes')    || '[]');
let users           = JSON.parse(localStorage.getItem('ct_users')    || '[]');
let registeredUsers = JSON.parse(localStorage.getItem('ct_regusers') || JSON.stringify(REGISTERED_USERS_DEFAULT));
let adminPasswords  = JSON.parse(localStorage.getItem('ct_adminpws') || JSON.stringify(ADMIN_PASSWORDS_DEFAULT));
let currentUser     = null;
const PER_PAGE      = 9;
let curPageGlobal   = 1;
let curPagePersonal = 1;
let activeFolder    = { global: 'Semua', personal: 'Semua' };
let unlockTargetId  = null;

function saveNotes()    { localStorage.setItem('ct_notes',    JSON.stringify(notes)); }
function saveUsers()    { localStorage.setItem('ct_users',    JSON.stringify(users)); }
function saveRegUsers() { localStorage.setItem('ct_regusers', JSON.stringify(registeredUsers)); }
function savePws()      { localStorage.setItem('ct_adminpws', JSON.stringify(adminPasswords)); }

/* ── AUTH ────────────────────────────────────── */
function toggleAdminForm() {
  const f = document.getElementById('admin-login-form');
  document.getElementById('user-login-form').classList.remove('show');
  document.getElementById('register-form').classList.remove('show');
  f.classList.toggle('show');
  if (f.classList.contains('show')) setTimeout(() => document.getElementById('admin-pw-input').focus(), 100);
}

function toggleUserLoginForm() {
  const f = document.getElementById('user-login-form');
  document.getElementById('admin-login-form').classList.remove('show');
  document.getElementById('register-form').classList.remove('show');
  f.classList.toggle('show');
  if (f.classList.contains('show')) setTimeout(() => document.getElementById('user-login-name').focus(), 100);
}

function toggleRegisterForm() {
  const f = document.getElementById('register-form');
  document.getElementById('admin-login-form').classList.remove('show');
  document.getElementById('user-login-form').classList.remove('show');
  f.classList.toggle('show');
  if (f.classList.contains('show')) setTimeout(() => document.getElementById('reg-new-name').focus(), 100);
}

function togglePwVisibility(inputId, btnId) {
  const i = document.getElementById(inputId);
  const b = document.getElementById(btnId);
  i.type = i.type === 'password' ? 'text' : 'password';
  if (b) b.textContent = i.type === 'password' ? '👁️' : '🙈';
}

/* ── ADMIN LOGIN (3 sandi) ──────────────────── */
function confirmAdmin() {
  const val = document.getElementById('admin-pw-input').value;
  const err = document.getElementById('pw-error');
  // Cek ke semua sandi admin yang terdaftar
  if (adminPasswords.includes(val)) {
    err.classList.remove('show');
    document.getElementById('admin-pw-input').value = '';
    document.getElementById('admin-login-form').classList.remove('show');
    currentUser = { name: 'Admin', role: 'admin', loginTime: new Date().toLocaleString() };
    logUser(currentUser);
    afterLogin();
  } else {
    err.classList.add('show');
    document.getElementById('admin-pw-input').value = '';
    const inp = document.getElementById('admin-pw-input');
    inp.style.borderColor = 'var(--red)';
    inp.style.animation = 'shake .4s ease';
    setTimeout(() => { inp.style.borderColor = ''; inp.style.animation = ''; }, 650);
  }
}

/* ── USER LOGIN ─────────────────────────────── */
function confirmUserLogin() {
  const name = document.getElementById('user-login-name').value.trim();
  const pw   = document.getElementById('user-login-pw').value;
  const err  = document.getElementById('user-pw-error');
  const found = registeredUsers.find(u => u.name.toLowerCase() === name.toLowerCase() && u.pw === pw);
  if (found) {
    err.classList.remove('show');
    document.getElementById('user-login-name').value = '';
    document.getElementById('user-login-pw').value   = '';
    document.getElementById('user-login-form').classList.remove('show');
    currentUser = { name: found.name, role: 'user', loginTime: new Date().toLocaleString() };
    logUser(currentUser);
    afterLogin();
  } else {
    err.classList.add('show');
    document.getElementById('user-login-pw').value = '';
    const inp = document.getElementById('user-login-pw');
    inp.style.borderColor = 'var(--red)';
    inp.style.animation = 'shake .4s ease';
    setTimeout(() => { inp.style.borderColor = ''; inp.style.animation = ''; }, 650);
  }
}

/* ── REGISTER AKUN BARU ─────────────────────── */
function confirmRegister() {
  const name    = document.getElementById('reg-new-name').value.trim();
  const pw      = document.getElementById('reg-new-pw').value;
  const confirm = document.getElementById('reg-new-pw-confirm').value;
  const err     = document.getElementById('register-error');

  if (!name || name.length < 2) {
    err.textContent = '❌ Nama minimal 2 karakter.';
    err.classList.add('show'); return;
  }
  if (!pw || pw.length < 4) {
    err.textContent = '❌ Sandi minimal 4 karakter.';
    err.classList.add('show'); return;
  }
  if (pw !== confirm) {
    err.textContent = '❌ Konfirmasi sandi tidak cocok.';
    err.classList.add('show'); return;
  }
  if (registeredUsers.find(u => u.name.toLowerCase() === name.toLowerCase())) {
    err.textContent = '❌ Nama sudah digunakan. Pilih nama lain.';
    err.classList.add('show'); return;
  }

  err.classList.remove('show');
  registeredUsers.push({ name, pw, role: 'user' });
  saveRegUsers();

  document.getElementById('reg-new-name').value        = '';
  document.getElementById('reg-new-pw').value          = '';
  document.getElementById('reg-new-pw-confirm').value  = '';
  document.getElementById('register-form').classList.remove('show');

  currentUser = { name, role: 'user', loginTime: new Date().toLocaleString() };
  logUser(currentUser);
  afterLogin();
}

/* ── GUEST LOGIN ────────────────────────────── */
function loginGuest() {
  currentUser = { name: 'Tamu', role: 'guest', loginTime: new Date().toLocaleString() };
  logUser(currentUser);
  afterLogin();
}

function logUser(u) {
  const i = users.findIndex(x => x.name === u.name && x.role === u.role);
  if (i >= 0) users[i] = u; else users.push(u);
  saveUsers();
}

function afterLogin() {
  const overlay = document.getElementById('post-login-overlay');
  const msg     = document.getElementById('post-login-msg');
  if (msg) msg.textContent = `Selamat datang, ${currentUser.name}! 🙏`;
  if (overlay) overlay.classList.add('show');
  setTimeout(() => {
    if (overlay) overlay.classList.remove('show');
    const sn = document.getElementById('status-name');
    const sr = document.getElementById('status-role');
    const sa = document.getElementById('status-avatar');
    const ub = document.getElementById('user-status-bar');
    const mn = document.getElementById('main-nav');
    const na = document.getElementById('nav-admin');
    const roleLabel = currentUser.role === 'admin' ? '👑 Admin'
                    : currentUser.role === 'user'  ? '👤 Pengguna Terdaftar' : '🌐 Tamu';
    if (sn) sn.textContent = currentUser.name;
    if (sr) sr.textContent = roleLabel;
    if (sa) sa.textContent = currentUser.name.charAt(0).toUpperCase();
    if (ub) ub.classList.add('show');
    if (mn) mn.style.display = 'flex';
    if (na) na.style.display = currentUser.role === 'admin' ? '' : 'none';
    showPage('notes');
    showPrivacyAlert();
  }, 1600);
}

function showPrivacyAlert()  { const a = document.getElementById('privacy-alert'); if (a) a.classList.add('show'); }
function closePrivacyAlert() {
  const a = document.getElementById('privacy-alert');
  if (a) a.classList.remove('show');
  showToast(`Selamat datang, ${currentUser.name}! 🙏`);
}

function logout() {
  currentUser = null;
  const ub = document.getElementById('user-status-bar');
  const mn = document.getElementById('main-nav');
  const na = document.getElementById('nav-admin');
  if (ub) ub.classList.remove('show');
  if (mn) mn.style.display = 'none';
  if (na) na.style.display = 'none';
  showPage('login');
}

/* ── ADMIN USER MANAGEMENT ───────────────────── */
function adminSetUserPw() {
  if (currentUser?.role !== 'admin') { showToast('❌ Hanya Admin!'); return; }
  const name = document.getElementById('reg-name').value.trim();
  const pw   = document.getElementById('reg-pw').value.trim();
  const msg  = document.getElementById('reg-msg');
  msg.style.display = 'block';
  if (!name || !pw) { msg.style.color = 'var(--red)'; msg.textContent = '❌ Nama dan sandi wajib diisi.'; return; }
  const idx = registeredUsers.findIndex(u => u.name.toLowerCase() === name.toLowerCase());
  if (idx >= 0) { registeredUsers[idx].pw = pw; msg.style.color = 'var(--green)'; msg.textContent = '✅ Sandi pengguna diperbarui!'; }
  else { registeredUsers.push({ name, pw, role: 'user' }); msg.style.color = 'var(--green)'; msg.textContent = '✅ Pengguna baru ditambahkan!'; }
  saveRegUsers();
  document.getElementById('reg-name').value = '';
  document.getElementById('reg-pw').value   = '';
  renderAdmin();
  showToast('👤 Data pengguna disimpan!');
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

function changeAdminPassword() {
  const cur  = document.getElementById('pw-current').value;
  const nw   = document.getElementById('pw-new').value.trim();
  const conf = document.getElementById('pw-confirm').value.trim();
  const msg  = document.getElementById('pw-change-msg');
  msg.style.display = 'block';
  const idx = adminPasswords.indexOf(cur);
  if (idx < 0) { msg.style.color = 'var(--red)'; msg.textContent = '❌ Sandi saat ini tidak ditemukan.'; return; }
  if (!nw)     { msg.style.color = 'var(--red)'; msg.textContent = '❌ Sandi baru tidak boleh kosong.'; return; }
  if (nw !== conf) { msg.style.color = 'var(--red)'; msg.textContent = '❌ Konfirmasi sandi tidak cocok.'; return; }
  adminPasswords[idx] = nw;
  savePws();
  ['pw-current','pw-new','pw-confirm'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  msg.style.color = 'var(--green)';
  msg.textContent = '✅ Sandi berhasil diubah!';
  showToast('🔑 Sandi Admin berhasil diperbarui!');
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

/* ── PAGES ──────────────────────────────────── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  const nb = document.getElementById('nav-' + id);
  if (nb) nb.classList.add('active');
  if (id === 'notes')    { curPageGlobal = 1; renderNotes('global'); }
  if (id === 'personal') { renderPersonalPage(); }
  if (id === 'admin')    { renderAdmin(); }
}

function renderPersonalPage() {
  const locked  = document.getElementById('personal-locked-msg');
  const content = document.getElementById('personal-content');
  if (!currentUser || currentUser.role === 'guest') {
    if (locked)  locked.style.display  = 'block';
    if (content) content.style.display = 'none';
  } else {
    if (locked)  locked.style.display  = 'none';
    if (content) content.style.display = 'block';
    renderNotes('personal');
  }
}

/* ── FOLDER ─────────────────────────────────── */
function setFolder(scope, cat) {
  activeFolder[scope] = cat;
  document.querySelectorAll(`#folders-${scope} .folder-btn`).forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-folder') === cat);
  });
  if (scope === 'global') { curPageGlobal = 1; renderNotes('global'); }
  else { curPagePersonal = 1; renderNotes('personal'); }
}

/* ── NOTE TYPE / VISIBILITY ─────────────────── */
let noteType       = 'drive';
let noteVisibility = 'global';

function setNoteType(t) {
  noteType = t;
  document.getElementById('type-btn-drive').classList.toggle('active', t === 'drive');
  document.getElementById('type-btn-text').classList.toggle('active',  t === 'text');
  document.getElementById('drive-fields').style.display = t === 'drive' ? '' : 'none';
  document.getElementById('text-fields').style.display  = t === 'text'  ? '' : 'none';
}

function setVisibility(v) {
  noteVisibility = v;
  ['global','private','locked'].forEach(x => {
    const btn = document.getElementById('vis-' + x);
    if (!btn) return;
    btn.classList.toggle('active', x === v);
    ['global','private','locked'].forEach(cls => btn.classList.remove(cls));
    if (x === v) btn.classList.add(v);
  });
  const lpw = document.getElementById('lock-pw-wrap');
  if (lpw) lpw.style.display = v === 'locked' ? '' : 'none';
}

/* ── NAME VALIDATION ────────────────────────── */
function hasTriple(str) {
  const s = str.toLowerCase();
  for (let i = 0; i < s.length - 2; i++) if (s[i] === s[i+1] && s[i+1] === s[i+2]) return true;
  return false;
}
function checkAuthorName() {
  const v = document.getElementById('note-author').value.trim();
  const w = document.getElementById('name-warning');
  if (w) w.classList.toggle('show', v.length > 0 && hasTriple(v));
}

/* ── MODAL ──────────────────────────────────── */
let editId        = null;
let addingToScope = 'global';

function openAddModal(scope) {
  addingToScope = scope || 'global';
  editId = null;
  const mt = document.getElementById('modal-title');
  if (mt) mt.textContent = '✚ Tambah Catatan Baru';
  ['note-author','note-title','note-link','note-content','note-desc','note-display-item','note-lock-pw'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const nc = document.getElementById('note-cat');
  if (nc) nc.value = 'Umum';
  const nw = document.getElementById('name-warning');
  if (nw) nw.classList.remove('show');
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  const ttw = document.getElementById('type-toggle-wrap');
  const vw  = document.getElementById('visibility-wrap');
  if (ttw) ttw.style.display = '';
  if (vw)  vw.style.display  = currentUser?.role === 'guest' ? 'none' : '';
  setNoteType('drive');
  if (scope === 'personal') setVisibility('private');
  else setVisibility('global');
  const nm = document.getElementById('note-modal');
  if (nm) nm.classList.add('show');
}

function openEditModal(id) {
  const n = notes.find(x => x.id === id);
  if (!n) return;
  editId = id;
  const setVal = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
  const mt = document.getElementById('modal-title');
  if (mt) mt.textContent = '✏️ Edit Catatan';
  setVal('note-author', n.by);
  setVal('note-title',  n.title);
  setVal('note-link',   n.link);
  setVal('note-content',n.content);
  setVal('note-desc',   n.desc);
  setVal('note-display-item', n.displayItem);
  setVal('note-lock-pw', n.lockPw);
  const nc = document.getElementById('note-cat');
  if (nc) nc.value = n.cat || 'Umum';
  const nw = document.getElementById('name-warning');
  if (nw) nw.classList.remove('show');
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  const ttw = document.getElementById('type-toggle-wrap');
  const vw  = document.getElementById('visibility-wrap');
  if (ttw) ttw.style.display = 'none';
  if (vw)  vw.style.display  = '';
  noteType = n.type || 'drive';
  const df = document.getElementById('drive-fields');
  const tf = document.getElementById('text-fields');
  if (df) df.style.display = noteType === 'drive' ? '' : 'none';
  if (tf) tf.style.display = noteType === 'text'  ? '' : 'none';
  setVisibility(n.visibility || 'global');
  const nm = document.getElementById('note-modal');
  if (nm) nm.classList.add('show');
}

function closeModal() {
  const nm = document.getElementById('note-modal');
  if (nm) nm.classList.remove('show');
}

/* ── SAVE NOTE ──────────────────────────────── */
function saveNote() {
  const getVal = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const author      = getVal('note-author');
  const title       = getVal('note-title');
  const link        = getVal('note-link');
  const content     = getVal('note-content');
  const desc        = getVal('note-desc');
  const displayItem = getVal('note-display-item');
  const lockPw      = getVal('note-lock-pw');
  const catEl       = document.getElementById('note-cat');
  const cat         = catEl ? catEl.value : 'Umum';
  let ok = true;

  const aErr = document.getElementById('author-error');
  if (!author) {
    if (aErr) { aErr.textContent = 'Nama pengisi wajib diisi.'; aErr.classList.add('show'); }
    ok = false;
  } else if (hasTriple(author)) {
    if (aErr) { aErr.textContent = 'Nama tidak valid. Gunakan nama asli.'; aErr.classList.add('show'); }
    ok = false;
  } else { if (aErr) aErr.classList.remove('show'); }

  const tErr = document.getElementById('title-error');
  if (!title) { if (tErr) tErr.classList.add('show'); ok = false; }
  else { if (tErr) tErr.classList.remove('show'); }

  if (noteType === 'drive') {
    const lErr = document.getElementById('link-error');
    if (!link || !link.startsWith('http')) { if (lErr) lErr.classList.add('show'); ok = false; }
    else { if (lErr) lErr.classList.remove('show'); }
  } else {
    const cErr = document.getElementById('content-error');
    if (!content) { if (cErr) cErr.classList.add('show'); ok = false; }
    else { if (cErr) cErr.classList.remove('show'); }
  }
  if (!ok) return;

  const vis   = noteVisibility;
  const today = new Date().toISOString().slice(0, 10);

  if (editId) {
    const i = notes.findIndex(x => x.id === editId);
    if (i >= 0) notes[i] = {
      ...notes[i], by: author, title,
      link:    noteType === 'drive' ? link    : '',
      content: noteType === 'text'  ? content : '',
      desc, cat, displayItem, visibility: vis,
      lockPw: vis === 'locked' ? lockPw : ''
    };
    showToast('✅ Catatan berhasil diperbarui!');
  } else {
    const ts = Date.now();
    notes.unshift({
      id: ts, ts, type: noteType, title,
      link:    noteType === 'drive' ? link    : '',
      content: noteType === 'text'  ? content : '',
      desc, cat, by: author, date: today, displayItem,
      visibility: vis, lockPw: vis === 'locked' ? lockPw : '',
      owner: currentUser?.name || 'Tamu', pinned: false
    });
    showToast('✅ Catatan ditambahkan! 🙏');
  }
  saveNotes(); closeModal();
  renderNotes('global'); renderNotes('personal');
  const ap = document.getElementById('page-admin');
  if (ap && ap.classList.contains('active')) renderAdmin();
}

/* ── DELETE / PIN ────────────────────────────── */
function deleteNote(id) {
  if (currentUser?.role !== 'admin') { showToast('❌ Hanya Admin yang bisa menghapus.'); return; }
  if (!confirm('Hapus catatan ini?')) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes(); renderNotes('global'); renderNotes('personal');
  const ap = document.getElementById('page-admin');
  if (ap && ap.classList.contains('active')) renderAdmin();
  showToast('🗑️ Catatan dihapus.');
}

function togglePin(id) {
  if (currentUser?.role !== 'admin') { showToast('❌ Hanya Admin yang bisa menyematkan.'); return; }
  const i = notes.findIndex(n => n.id === id);
  if (i < 0) return;
  notes[i].pinned = !notes[i].pinned;
  saveNotes(); renderNotes('global'); renderNotes('personal');
  const ap = document.getElementById('page-admin');
  if (ap && ap.classList.contains('active')) renderAdmin();
  showToast(notes[i].pinned ? '📌 Catatan disematkan!' : '📌 Catatan dilepas dari sematan.');
}

/* ── FILTER/SORT ─────────────────────────────── */
function onFilterChange(scope) {
  if (scope === 'global') { curPageGlobal = 1; renderNotes('global'); }
  else { curPagePersonal = 1; renderNotes('personal'); }
}

function getSorted(scope) {
  const isGlobal = scope === 'global';
  const q      = (document.getElementById(isGlobal ? 'search-input' : 'search-personal')?.value || '').toLowerCase();
  const sort   = document.getElementById(isGlobal ? 'sort-select'  : 'sort-personal')?.value || 'newest';
  const folder = activeFolder[scope];

  let arr = notes.filter(n => {
    if (isGlobal) {
      if (n.visibility === 'private') return false;
      return true;
    } else {
      if (currentUser?.role === 'admin') return true;
      if (!currentUser || currentUser.role === 'guest') return false;
      return n.visibility === 'private' && n.owner === currentUser.name;
    }
  }).filter(n => folder === 'Semua' ? true : n.cat === folder)
    .filter(n =>
      (n.title||'').toLowerCase().includes(q)   ||
      (n.desc||'').toLowerCase().includes(q)    ||
      (n.by||'').toLowerCase().includes(q)      ||
      (n.content||'').toLowerCase().includes(q)
    );

  if (sort === 'newest') arr.sort((a,b) => (b.ts||0)-(a.ts||0));
  else if (sort === 'oldest') arr.sort((a,b) => (a.ts||0)-(b.ts||0));
  else if (sort === 'az') arr.sort((a,b) => a.title.localeCompare(b.title,'id'));
  else if (sort === 'za') arr.sort((a,b) => b.title.localeCompare(a.title,'id'));
  return arr;
}

/* ── RENDER NOTES ────────────────────────────── */
function renderNotes(scope) {
  const isGlobal = scope === 'global';
  const grid = document.getElementById(isGlobal ? 'notes-grid-global' : 'notes-grid-personal');
  const pag  = document.getElementById(isGlobal ? 'pagination-global' : 'pagination-personal');
  if (!grid) return;

  const arr       = getSorted(scope);
  const pinnedArr = isGlobal ? arr.filter(n => n.pinned) : [];
  const normalArr = isGlobal ? arr.filter(n => !n.pinned) : arr;
  const total     = normalArr.length;
  const pages     = Math.max(1, Math.ceil(total / PER_PAGE));
  const cp        = Math.min(isGlobal ? curPageGlobal : curPagePersonal, pages);
  if (isGlobal) curPageGlobal = cp; else curPagePersonal = cp;
  const start = (cp - 1) * PER_PAGE;
  const slice = normalArr.slice(start, start + PER_PAGE);

  if (isGlobal) {
    const pinnedSec = document.getElementById('pinned-section-global');
    if (pinnedSec) {
      pinnedSec.innerHTML = pinnedArr.length
        ? `<div class="pinned-label">📌 Disematkan Admin</div><div class="notes-grid">${pinnedArr.map(n => noteCardHTML(n, true)).join('')}</div>`
        : '';
    }
  }

  if (!total && !pinnedArr.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span>📂</span><p>Belum ada catatan.</p></div>`;
    if (pag) pag.innerHTML = ''; return;
  }
  grid.innerHTML = slice.map(n => noteCardHTML(n, false)).join('');
  renderPagination(scope, pages, total);
}

const CAT = {Umum:'📌',Ibadah:'🙏',Alkitab:'📖',Renungan:'✝',Musik:'🎵',Penting:'⭐',Lainnya:'📂'};

function noteCardHTML(n, isPinnedSection) {
  const isDrive  = (!n.type || n.type === 'drive') && n.link;
  const isText   = n.type === 'text';
  const isLocked  = n.visibility === 'locked';
  const isPrivate = n.visibility === 'private';
  const displayItem = (n.displayItem && n.displayItem.trim())
    ? `<span class="note-display-item">${esc(n.displayItem)}</span>` : '';

  let tagCls = '';
  if (isLocked) tagCls = 'note-tag-locked';
  else if (isPrivate) tagCls = 'note-tag-private';
  else if (isText) tagCls = 'note-tag-text';

  const visLabel = isLocked ? '🔐 Berkunci' : isPrivate ? '🔒 Pribadi' : '🌐 Global';
  const tagLbl   = isDrive && !isLocked
    ? `${CAT[n.cat]||'📌'} ${n.cat}`
    : `${isLocked?'🔐':isPrivate?'🔒':'📝'} ${n.cat}`;

  let body = '';
  if (isLocked) {
    body = `<div class="locked-note">🔐 Konten dikunci — <button style="background:none;border:none;color:var(--blue);cursor:pointer;font-size:.78rem;font-weight:700;text-decoration:underline;" onclick="openUnlockModal(${n.id})">Masukkan Sandi</button></div>`;
  } else if (isDrive) {
    body = `<a class="note-card-link" href="${esc(n.link)}" target="_blank" rel="noopener">🔗 Buka di Google Drive</a>`;
  } else {
    body = `<div class="note-card-text-content">${esc(n.content||'').replace(/\n/g,'<br>')}</div>`;
  }

  const adminBtns = currentUser?.role === 'admin'
    ? `<button class="btn-icon edit" onclick="openEditModal(${n.id})">✏️ Edit</button>`
      + `<button class="btn-icon pin" onclick="togglePin(${n.id})">${n.pinned?'📌 Lepas':'📌 Sematkan'}</button>`
      + `<button class="btn-icon" onclick="deleteNote(${n.id})">🗑️</button>` : '';
  const ownBtns = (currentUser && (currentUser.name === n.owner || currentUser.role === 'admin') && !adminBtns)
    ? `<button class="btn-icon edit" onclick="openEditModal(${n.id})">✏️</button>` : '';

  return `<div class="note-card${n.pinned?' pinned':''}">
    ${displayItem}
    <div style="display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-bottom:9px;">
      <div class="note-card-tag ${tagCls}">${tagLbl}</div>
      ${n.pinned?'<span class="pin-badge">📌 Disematkan</span>':''}
      <span style="font-size:.65rem;color:var(--text-muted);margin-left:auto;">${visLabel}</span>
    </div>
    <h3>${esc(n.title)}</h3>
    ${n.desc?`<p class="desc">${esc(n.desc)}</p>`:''}
    ${body}
    <div class="note-meta"><span>📅 ${n.date}</span><span>✍️ ${esc(n.by||'Tamu')}</span></div>
    ${adminBtns||ownBtns?`<div class="note-card-actions">${adminBtns||ownBtns}</div>`:''}
  </div>`;
}

/* ── UNLOCK ─────────────────────────────────── */
function openUnlockModal(id) {
  unlockTargetId = id;
  const ui = document.getElementById('unlock-input');
  const ue = document.getElementById('unlock-error');
  if (ui) ui.value = '';
  if (ue) ue.classList.remove('show');
  const um = document.getElementById('unlock-modal');
  if (um) { um.classList.add('show'); setTimeout(() => ui?.focus(), 100); }
}
function closeUnlockModal() {
  const um = document.getElementById('unlock-modal');
  if (um) um.classList.remove('show');
  unlockTargetId = null;
}
function confirmUnlock() {
  const n = notes.find(x => x.id === unlockTargetId);
  if (!n) return;
  const inp = document.getElementById('unlock-input').value;
  const err = document.getElementById('unlock-error');
  if (inp === n.lockPw) {
    if (err) err.classList.remove('show');
    closeUnlockModal();
    showToast('🔓 Catatan dibuka!');
    showUnlockedContent(n);
  } else {
    if (err) err.classList.add('show');
    document.getElementById('unlock-input').value = '';
    const inpEl = document.getElementById('unlock-input');
    inpEl.style.borderColor = 'var(--red)';
    setTimeout(() => inpEl.style.borderColor = '', 600);
  }
}
function showUnlockedContent(n) {
  const isDrive = (!n.type || n.type === 'drive') && n.link;
  const content = isDrive
    ? `<a href="${n.link}" target="_blank" style="color:var(--gold)">🔗 ${n.link}</a>`
    : `<div style="white-space:pre-wrap;font-size:.87rem;line-height:1.7;color:var(--text2);">${esc(n.content||'')}</div>`;
  const div = document.createElement('div');
  div.style.cssText = 'position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;padding:20px;';
  div.innerHTML = `<div style="background:var(--modal-bg);border:1px solid rgba(201,168,76,.3);border-radius:18px;padding:30px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;">
    <div style="font-size:.7rem;font-weight:700;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">🔓 Catatan Dibuka</div>
    <h3 style="font-family:'Playfair Display',serif;color:var(--text);margin-bottom:12px;">${esc(n.title)}</h3>
    ${content}
    <button onclick="this.closest('[style]').remove()" style="margin-top:16px;padding:9px 20px;background:linear-gradient(135deg,var(--gold),var(--accent));border:none;color:var(--deep);border-radius:8px;cursor:pointer;font-weight:700;font-family:'Lato',sans-serif;">✕ Tutup</button>
  </div>`;
  document.body.appendChild(div);
}

/* ── PAGINATION ─────────────────────────────── */
function renderPagination(scope, pages, total) {
  const isGlobal = scope === 'global';
  const pag      = document.getElementById(isGlobal ? 'pagination-global' : 'pagination-personal');
  const curPage  = isGlobal ? curPageGlobal : curPagePersonal;
  if (!pag) return;
  if (pages <= 1) { pag.innerHTML = ''; return; }
  let h = '';
  h += `<button class="page-btn" onclick="goPage('${scope}',${curPage-1})" ${curPage===1?'disabled':''}>← Kembali</button>`;
  pageRange(curPage, pages).forEach(p => {
    if (p === '...') h += `<span class="page-info">…</span>`;
    else h += `<button class="page-btn ${p===curPage?'cur':''}" onclick="goPage('${scope}',${p})">${p}</button>`;
  });
  h += `<button class="page-btn" onclick="goPage('${scope}',${curPage+1})" ${curPage===pages?'disabled':''}>Lanjutkan →</button>`;
  h += `<span class="page-info">${total} catatan</span>`;
  pag.innerHTML = h;
}
function pageRange(cur, total) {
  if (total <= 7) return Array.from({length:total},(_,i)=>i+1);
  if (cur <= 4)  return [1,2,3,4,5,'...',total];
  if (cur >= total-3) return [1,'...',total-4,total-3,total-2,total-1,total];
  return [1,'...',cur-1,cur,cur+1,'...',total];
}
function goPage(scope, p) {
  const arr   = getSorted(scope);
  const pages = Math.max(1, Math.ceil(arr.length / PER_PAGE));
  if (p < 1 || p > pages) return;
  if (scope === 'global') curPageGlobal = p; else curPagePersonal = p;
  renderNotes(scope);
  window.scrollTo({ top: 280, behavior: 'smooth' });
}

/* ── ADMIN PANEL ─────────────────────────────── */
function renderAdmin() {
  if (currentUser?.role !== 'admin') { showPage('notes'); showToast('❌ Akses ditolak!'); return; }
  const allNotes     = notes;
  const globalNotes  = allNotes.filter(n => n.visibility === 'global' || !n.visibility || n.visibility === 'locked');
  const privateNotes = allNotes.filter(n => n.visibility === 'private');
  const pinnedNotes  = allNotes.filter(n => n.pinned);
  const as = document.getElementById('admin-stats');
  if (as) as.innerHTML = `
    <div class="stat-card"><div class="num">${allNotes.length}</div><div class="label">Total</div></div>
    <div class="stat-card"><div class="num">${globalNotes.length}</div><div class="label">Global</div></div>
    <div class="stat-card"><div class="num">${privateNotes.length}</div><div class="label">Pribadi</div></div>
    <div class="stat-card"><div class="num">${pinnedNotes.length}</div><div class="label">Disematkan</div></div>
    <div class="stat-card"><div class="num">${registeredUsers.length}</div><div class="label">Terdaftar</div></div>
    <div class="stat-card"><div class="num">${allNotes.filter(n=>n.date===new Date().toISOString().slice(0,10)).length}</div><div class="label">Hari Ini</div></div>
  `;
  const atb = document.getElementById('admin-tbody');
  if (atb) atb.innerHTML = allNotes.map((n,i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${esc(n.title)}</strong></td>
      <td>${(!n.type||n.type==='drive')?'<span style="color:var(--gold)">🔗 Drive</span>':'<span style="color:var(--green)">📝 Teks</span>'}</td>
      <td>${n.visibility==='private'?'<span style="color:var(--blue)">🔒 Pribadi</span>':n.visibility==='locked'?'<span style="color:var(--green)">🔐 Kunci</span>':'<span style="color:var(--accent)">🌐 Global</span>'}</td>
      <td>${esc(n.by||'-')}</td>
      <td>${n.date}</td>
      <td><button class="btn-icon edit" onclick="openEditModal(${n.id})">✏️</button> <button class="btn-icon pin" onclick="togglePin(${n.id})">${n.pinned?'📌':'📌?'}</button> <button class="btn-icon" onclick="deleteNote(${n.id})">🗑️</button></td>
    </tr>`).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--muted);">Belum ada catatan</td></tr>';

  const rtb = document.getElementById('registered-tbody');
  if (rtb) rtb.innerHTML = registeredUsers.map(u => `
    <tr>
      <td>${esc(u.name)}</td>
      <td><span class="badge-user">👤 User</span></td>
      <td>${users.find(x=>x.name===u.name)?.loginTime||'Belum pernah'}</td>
      <td><button class="btn-icon edit" onclick="quickSetPw('${esc(u.name)}')">🔑 Ubah Sandi</button></td>
    </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted);">Belum ada pengguna</td></tr>';

  const ptb = document.getElementById('pinned-tbody');
  if (ptb) ptb.innerHTML = pinnedNotes.map(n => `
    <tr>
      <td>${esc(n.title)}</td>
      <td>${n.date}</td>
      <td><button class="btn-icon pin" onclick="togglePin(${n.id})">📌 Lepas</button></td>
    </tr>`).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--muted);">Tidak ada catatan disematkan</td></tr>';

  const utb = document.getElementById('users-tbody');
  if (utb) utb.innerHTML = users.map(u => `
    <tr><td>${esc(u.name)}</td><td>${u.role==='admin'?'<span class="badge-admin">Admin</span>':u.role==='user'?'<span class="badge-user">User</span>':'<span class="badge-guest">Tamu</span>'}</td><td>${u.loginTime||'-'}</td></tr>
  `).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--muted);">Belum ada pengunjung</td></tr>';
}

function quickSetPw(name) {
  const rn = document.getElementById('reg-name');
  const rp = document.getElementById('reg-pw');
  if (rn) rn.value = name;
  if (rp) rp.focus();
  showToast(`📝 Isi sandi baru untuk ${name}`);
}

/* ── HELPERS ─────────────────────────────────── */
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── CLOSE MODALS ON OVERLAY CLICK ──────────── */
document.addEventListener('DOMContentLoaded', () => {
  const nm = document.getElementById('note-modal');
  const um = document.getElementById('unlock-modal');
  if (nm) nm.addEventListener('click', function(e) { if (e.target === this) closeModal(); });
  if (um) um.addEventListener('click', function(e) { if (e.target === this) closeUnlockModal(); });
});
