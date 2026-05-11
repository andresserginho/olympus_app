/* ============================================================
   APP.JS — Router SPA, Dark Mode, LocalStorage, Chat Overlay
   ============================================================ */

window.AppState = {
  user: {
    name:'', email:'', role:'user', gender:'male',
    level:7, xp:2340, xpToNext:3000, streak:12,
    goal:'', levelName:'', location:'',
    emailVerified:false, pendingVerificationEmail:'',
    cycleOptIn:false, lastCycleDate:null,
    daysPerWeek:'', areas:[],
    height:'', weight:'', age:'', bio:'',
  },
  fromRegisterFlow: false,
  currentScreen: 'welcome',
  testUsers: [
    { email:'demo@olympus.com',  password:'Demo1234',  name:'Demo User',     role:'user'  },
    { email:'admin@olympus.com', password:'Admin1234', name:'Admin Olympus', role:'admin' },
    { email:'coach@olympus.com', password:'Coach765',  name:'Coach Olympus', role:'coach' },
  ],
};

window.screens = {};

/* ── Dark Mode ── */
window.toggleDarkMode = function() {
  const curr = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('olympus_theme', next);
};
window.isDarkMode = function() {
  return (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
};

/* ── Router ── */
function navigateTo(screenName) {
  const container = document.getElementById('screen-container');
  const nav       = document.getElementById('bottom-nav');
  const screen    = window.screens[screenName];
  if (!screen) {
    console.error(`❌ Pantalla "${screenName}" no encontrada. Registradas:`, Object.keys(window.screens));
    return;
  }
  window.AppState.currentScreen = screenName;
  container.innerHTML = screen.render();
  container.scrollTop = 0;

  const navScreens = ['dashboard','train','progress','challenges','profile'];
  if (navScreens.includes(screenName)) {
    nav.hidden = false;
    nav.classList.remove('hidden');
    updateNavActive(screenName);
  } else {
    nav.hidden = true;
    nav.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
  if (screen.init) requestAnimationFrame(() => screen.init());
}

function updateNavActive(name) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === name);
  });
}

/* ── Chat Overlay (NO navegación — se superpone) ── */
window._openChat = function() {
  const overlay = document.getElementById('chat-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  // Renderizar mensajes
  const msgsEl = document.getElementById('chat-msgs');
  if (msgsEl && window._renderChatMsgs) {
    msgsEl.innerHTML = window._renderChatMsgs();
    if (window.lucide) lucide.createIcons();
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
};

window._closeChat = function() {
  document.getElementById('chat-overlay')?.classList.add('hidden');
};

/* ── Helpers ── */
function olympusLogoSVG(size = 40) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="#00f5ff" stroke-width="2" opacity="0.3"/>
    <circle cx="50" cy="50" r="30" stroke="#00f5ff" stroke-width="2.5" opacity="0.6"/>
    <polygon points="50,20 65,45 58,45 68,70 50,50 32,70 42,45 35,45" fill="#00f5ff"/>
    <circle cx="50" cy="50" r="48" stroke="#00f5ff" stroke-width="1" opacity="0.15"/>
  </svg>`;
}
function backgroundHTML() {
  return `<div class="bg-glow bg-glow-top"></div><div class="bg-glow bg-glow-bottom"></div><div class="bg-grid"></div>`;
}
function formatDate() {
  return new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. Tema guardado */
  const savedTheme = localStorage.getItem('olympus_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  /* 2. Cargar usuarios registrados */
  const savedUsers = JSON.parse(localStorage.getItem('olympus_users') || '[]');
  savedUsers.forEach(u => {
    if (!window.AppState.testUsers.some(t => t.email.toLowerCase() === u.email.toLowerCase()))
      window.AppState.testUsers.push(u);
  });

  /* 3. Nav clicks */
  document.querySelectorAll('.nav-item').forEach(item =>
    item.addEventListener('click', () => navigateTo(item.dataset.route))
  );

  /* 4. FAB global → abre chat overlay */
  document.getElementById('screen-container').addEventListener('click', e => {
    if (e.target.closest('.dash-fab-chat')) {
      e.stopPropagation();
      window._openChat();
    }
  });

  /* 5. Inicializar chat overlay (se llama una vez) */
  _initChatOverlay();

  /* 6. Restaurar sesión */
  const savedSession = JSON.parse(localStorage.getItem('olympus_session') || 'null');
  if (savedSession && savedSession.emailVerified && savedSession.name) {
    window.AppState.user = { ...window.AppState.user, ...savedSession };
    navigateTo('dashboard');
  } else {
    navigateTo('welcome');
  }
});

/* ── Inicializar listeners del chat overlay ── */
function _initChatOverlay() {
  // Cerrar
  document.getElementById('chat-close-btn')?.addEventListener('click', window._closeChat);
  document.getElementById('chat-min-btn')?.addEventListener('click', window._closeChat);
  document.getElementById('chat-backdrop')?.addEventListener('click', window._closeChat);

  // Micrófono (placeholder)
  document.getElementById('chat-mic-btn')?.addEventListener('click', () =>
    alert('Función de voz próximamente 🎙️')
  );

  // Enviar mensaje
  const send = () => {
    const inp = document.getElementById('chat-input');
    const msg = (inp?.value || '').trim();
    if (!msg) return;
    inp.value = '';
    if (window._sendChatMsg) window._sendChatMsg(msg);
  };
  document.getElementById('chat-send-btn')?.addEventListener('click', send);
  document.getElementById('chat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  // Sugerencias
  document.querySelectorAll('.chat-chip').forEach(btn =>
    btn.addEventListener('click', () => {
      const inp = document.getElementById('chat-input');
      if (inp) { inp.value = btn.textContent.trim(); send(); }
    })
  );
}