/* ============================================================
   PROFILE.JS — Perfil + Edición real
   ============================================================ */

window.screens.profile = {
  render() {
    const u       = window.AppState.user;
    const pct     = Math.min(100, (u.xp / u.xpToNext) * 100);
    const dark    = window.isDarkMode ? window.isDarkMode() : true;
    const initials= (u.name || 'DU').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const goalLabels = {
      lose:'Perder peso', muscle:'Ganar músculo', endurance:'Resistencia',
      fit:'Mantenerme fit', sport:'Deporte específico'
    };

    /* ── Fila de accordion ── */
    const row = (it) => `
      <div style="display:flex;align-items:center;gap:12px;padding:13px 14px;
        background:rgba(255,255,255,.025);border-bottom:1px solid rgba(255,255,255,.05);">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(${it.bg});
          display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="${it.icon}" style="width:16px;height:16px;color:${it.color};"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${it.title}</p>
          <p style="font-size:11px;color:${it.subColor||'#888'};
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${it.sub}</p>
        </div>
        ${it.toggle
          ? `<div id="${it.id}" style="width:42px;height:24px;border-radius:12px;
               background:${dark?'var(--cyan)':'rgba(255,255,255,.15)'};
               position:relative;cursor:pointer;flex-shrink:0;transition:background .3s;">
               <div style="width:18px;height:18px;border-radius:50%;background:#fff;
                 position:absolute;top:3px;${dark?'right:3px':'left:3px'};
                 transition:all .25s;box-shadow:0 1px 3px rgba(0,0,0,.3);"></div>
             </div>`
          : it.action
          ? `<button type="button" class="prof-acc-btn" data-action="${it.action}"
               style="padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;
                 background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);
                 color:var(--cyan);cursor:pointer;font-family:inherit;">Editar</button>`
          : `<i data-lucide="chevron-right" style="width:16px;height:16px;color:#555;flex-shrink:0;"></i>`
        }
      </div>`;

    const cuentaItems = [
      { icon:'user',   bg:'0,245,255,.08',  color:'var(--cyan)', title:'Datos personales',
        sub: u.height && u.weight
          ? `${u.height} cm · ${u.weight} kg${u.age ? ` · ${u.age} años` : ''}`
          : 'Nombre, altura, peso',
        action: 'edit-profile' },
      { icon:'target', bg:'168,85,247,.08', color:'#a855f7',  title:'Mis objetivos',
        sub: goalLabels[u.goal] || 'Ganar músculo', action: 'edit-profile' },
      { icon:'bell',   bg:'251,191,36,.08', color:'var(--gold)', title:'Notificaciones',
        sub:'Recordatorios de entrenamiento' },
    ];
    const devItems = [
      { icon:'watch',  bg:'34,197,94,.08',  color:'#22c55e', title:'Relojes inteligentes',
        sub:'Garmin conectado', subColor:'#22c55e' },
    ];
    const appItems = [
      { icon:'settings',    bg:'255,255,255,.05', color:'#888',       title:'Preferencias',      sub:'Unidades, idioma' },
      { icon:'moon',        bg:'0,245,255,.06',   color:'var(--cyan)',title:'Modo oscuro',
        sub: dark ? 'Tema oscuro activo' : 'Tema claro activo',
        toggle:true, id:'profile-dark-toggle' },
      { icon:'lock',        bg:'255,255,255,.05', color:'#888',       title:'Privacidad y datos',sub:'Gestiona tu información' },
      { icon:'help-circle', bg:'255,255,255,.05', color:'#888',       title:'Ayuda y soporte',   sub:'Centro de ayuda, contacto' },
    ];

    const sec = (label, items) => `
      <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;
        padding:0 20px;margin-bottom:8px;">${label}</p>
      <div style="margin:0 20px 14px;border-radius:14px;overflow:hidden;
        border:1px solid rgba(255,255,255,.07);">
        ${items.map(row).join('')}<div style="height:1px;"></div>
      </div>`;

    return `
    <div class="screen-scroll" style="position:relative;">

      <!-- Header -->
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;
          letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="user" style="width:11px;height:11px;color:var(--cyan);"></i> MI PERFIL
        </div>
        <h1 style="font-size:26px;font-weight:800;">Cuenta</h1>
      </div>

      <!-- Tarjeta usuario -->
      <div style="margin:0 20px 14px;padding:16px;border-radius:16px;
        background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);">
        <div style="display:flex;align-items:center;gap:13px;margin-bottom:12px;">
          <!-- Avatar con lápiz de edición -->
          <div style="position:relative;flex-shrink:0;">
            <div style="width:62px;height:62px;border-radius:50%;background:rgba(0,245,255,.18);
              border:2px solid rgba(0,245,255,.45);display:flex;align-items:center;
              justify-content:center;font-size:20px;font-weight:800;color:var(--cyan);">
              ${initials}
            </div>
            <button type="button" id="dash-edit-profile-btn"
              style="position:absolute;bottom:-2px;right:-2px;width:22px;height:22px;
                border-radius:50%;background:var(--cyan);border:2px solid #080808;
                display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <i data-lucide="pencil" style="width:11px;height:11px;color:#000;"></i>
            </button>
          </div>
          <div style="flex:1;min-width:0;">
            <p style="font-size:16px;font-weight:700;margin-bottom:2px;
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${u.name || 'Demo User'}
            </p>
            <p style="font-size:11px;color:#888;margin-bottom:6px;
              white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${u.email || 'demo@olympus.com'}
            </p>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <span style="font-size:10px;font-weight:600;color:var(--gold);
                background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.3);
                padding:2px 8px;border-radius:10px;">Intermedio</span>
              <span style="font-size:10px;font-weight:600;color:var(--cyan);
                background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.3);
                padding:2px 8px;border-radius:10px;">Nivel ${u.level}</span>
            </div>
          </div>
        </div>
        <!-- XP -->
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:5px;">
          <span>${u.xp} / ${u.xpToNext} XP</span>
          <span style="color:var(--gold);font-weight:600;">→ Nivel ${u.level+1}</span>
        </div>
        <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:var(--cyan);border-radius:3px;transition:width .5s;"></div>
        </div>
        <p style="font-size:10px;color:#888;margin-top:5px;">${u.xpToNext-u.xp} XP para Nivel ${u.level+1}</p>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:0 20px 16px;">
        <div style="padding:12px 6px;border-radius:13px;background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.07);text-align:center;">
          <i data-lucide="flame" style="width:18px;height:18px;color:var(--orange);margin:0 auto;"></i>
          <div style="font-size:18px;font-weight:800;color:var(--orange);margin-top:4px;">48</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Entrenos</div>
        </div>
        <div style="padding:12px 6px;border-radius:13px;background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.07);text-align:center;">
          <i data-lucide="calendar" style="width:18px;height:18px;color:var(--cyan);margin:0 auto;"></i>
          <div style="font-size:18px;font-weight:800;color:var(--cyan);margin-top:4px;">21d</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Racha máx</div>
        </div>
        <div style="padding:12px 6px;border-radius:13px;background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.07);text-align:center;">
          <i data-lucide="trophy" style="width:18px;height:18px;color:var(--gold);margin:0 auto;"></i>
          <div style="font-size:18px;font-weight:800;color:var(--gold);margin-top:4px;">12</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Logros</div>
        </div>
      </div>

      ${sec('MI CUENTA', cuentaItems)}
      ${sec('DISPOSITIVOS', devItems)}
      ${sec('APP', appItems)}

      <!-- Cerrar sesión -->
      <button type="button" id="profile-logout"
        style="margin:4px 20px 24px;padding:14px;border-radius:12px;background:transparent;
          border:1px solid rgba(239,68,68,.4);color:#ef4444;font-size:14px;font-weight:600;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
          width:calc(100% - 40px);font-family:inherit;">
        <i data-lucide="log-out" style="width:16px;height:16px;color:#ef4444;"></i>
        Cerrar sesión
      </button>

      <!-- FAB (global delegation en app.js lo maneja) -->
      <button type="button" class="dash-fab-chat" id="profile-fab">
        <i data-lucide="message-circle"></i>
      </button>
    </div>`;
  },

  init() {
    document.getElementById('profile-dark-toggle')?.addEventListener('click', () => {
      if (window.toggleDarkMode) window.toggleDarkMode();
      navigateTo('profile');
    });
    document.getElementById('dash-edit-profile-btn')?.addEventListener('click', () => navigateTo('edit-profile'));
    document.querySelectorAll('.prof-acc-btn').forEach(btn => {
      if (btn.dataset.action === 'edit-profile')
        btn.addEventListener('click', () => navigateTo('edit-profile'));
    });
    document.getElementById('profile-logout')?.addEventListener('click', () => {
      if (confirm('¿Seguro que quieres cerrar sesión?')) {
        localStorage.removeItem('olympus_session');
        window.AppState.user = {
          name:'', email:'', role:'user', gender:'male',
          level:7, xp:2340, xpToNext:3000, streak:12,
          goal:'', levelName:'', location:'',
          emailVerified:false, pendingVerificationEmail:'',
          cycleOptIn:false, lastCycleDate:null,
          daysPerWeek:'', areas:[], height:'', weight:'', age:'', bio:'',
        };
        navigateTo('welcome');
      }
    });
    if (window.lucide) lucide.createIcons();
  }
};

/* ── EDITAR PERFIL ─────────────────────────────────────────── */
window.screens['edit-profile'] = {
  render() {
    const u = window.AppState.user;
    const initials = (u.name||'DU').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const goals = [
      {id:'lose',      label:'Perder peso'        },
      {id:'muscle',    label:'Ganar músculo'       },
      {id:'endurance', label:'Mejorar resistencia' },
      {id:'fit',       label:'Mantenerme fit'      },
      {id:'sport',     label:'Deporte específico'  },
    ];

    const inpStyle = `width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;font-family:inherit;outline:none;`;
    const lblStyle = `font-size:10px;font-weight:700;letter-spacing:.07em;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;`;

    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">

      <!-- Header -->
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;
        border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="ep-back"
          style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);
            border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;
            justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 style="font-size:18px;font-weight:700;flex:1;">Editar Perfil</h2>
        <button type="button" id="ep-save-top"
          style="padding:8px 18px;border-radius:20px;background:var(--cyan);border:none;
            color:#000;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">
          Guardar
        </button>
      </div>

      <!-- Avatar -->
      <div style="padding:24px 20px 8px;display:flex;flex-direction:column;align-items:center;gap:8px;">
        <div style="position:relative;">
          <div style="width:80px;height:80px;border-radius:50%;background:rgba(0,245,255,.18);
            border:3px solid rgba(0,245,255,.5);display:flex;align-items:center;
            justify-content:center;font-size:26px;font-weight:800;color:var(--cyan);">
            ${initials}
          </div>
          <div style="position:absolute;bottom:0;right:0;width:26px;height:26px;border-radius:50%;
            background:var(--cyan);border:3px solid #080808;display:flex;align-items:center;justify-content:center;">
            <i data-lucide="camera" style="width:12px;height:12px;color:#000;"></i>
          </div>
        </div>
        <p style="font-size:12px;color:var(--cyan);">Cambiar foto (próximamente)</p>
      </div>

      <!-- Formulario -->
      <div style="padding:16px 20px;display:flex;flex-direction:column;gap:16px;">

        <!-- Nombre -->
        <div>
          <label style="${lblStyle}">Nombre completo</label>
          <input type="text" id="ep-name" value="${u.name||''}" placeholder="Tu nombre" style="${inpStyle}">
        </div>

        <!-- Email solo lectura -->
        <div>
          <label style="${lblStyle}">Correo electrónico</label>
          <input type="email" value="${u.email||''}" readonly
            style="${inpStyle}background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08);color:#666;cursor:not-allowed;">
          <p style="font-size:10px;color:#666;margin-top:4px;">El correo no se puede cambiar</p>
        </div>

        <!-- Edad -->
        <div>
          <label style="${lblStyle}">Edad</label>
          <input type="number" id="ep-age" value="${u.age||''}" placeholder="25" min="10" max="99" style="${inpStyle}">
        </div>

        <!-- Altura + Peso -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div>
            <label style="${lblStyle}">Altura</label>
            <div style="position:relative;">
              <input type="number" id="ep-height" value="${u.height||''}" placeholder="175" min="100" max="250"
                style="${inpStyle}padding-right:44px;">
              <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;color:#888;">cm</span>
            </div>
          </div>
          <div>
            <label style="${lblStyle}">Peso</label>
            <div style="position:relative;">
              <input type="number" id="ep-weight" value="${u.weight||''}" placeholder="70" min="30" max="300" step="0.1"
                style="${inpStyle}padding-right:44px;">
              <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;color:#888;">kg</span>
            </div>
          </div>
        </div>

        <!-- Objetivo -->
        <div>
          <label style="${lblStyle}">Objetivo principal</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${goals.map(g => `
              <button type="button" class="ep-goal-btn" data-goal="${g.id}"
                style="padding:10px 12px;border-radius:12px;font-size:12px;font-weight:600;
                  cursor:pointer;font-family:inherit;
                  background:${u.goal===g.id?'rgba(0,245,255,.12)':'rgba(255,255,255,.05)'};
                  border:1px solid ${u.goal===g.id?'var(--cyan)':'rgba(255,255,255,.1)'};
                  color:${u.goal===g.id?'var(--cyan)':'#888'};">
                ${g.label}
              </button>`).join('')}
          </div>
        </div>

        <!-- Bio -->
        <div>
          <label style="${lblStyle}">Bio (opcional)</label>
          <textarea id="ep-bio" rows="3" placeholder="Cuéntanos algo sobre ti..."
            style="${inpStyle}resize:none;">${u.bio||''}</textarea>
        </div>

        <!-- Guardar (abajo) -->
        <button type="button" id="ep-save-bottom"
          style="width:100%;padding:15px;border-radius:14px;background:var(--cyan);border:none;
            color:#000;font-size:15px;font-weight:700;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:8px;
            margin-top:4px;font-family:inherit;">
          <i data-lucide="check" style="width:18px;height:18px;color:#000;"></i>
          Guardar cambios
        </button>
        <div style="height:24px;"></div>
      </div>
    </div>`;
  },

  init() {
    let selGoal = window.AppState.user.goal || '';

    document.getElementById('ep-back')?.addEventListener('click', () => navigateTo('profile'));

    /* Selección de objetivo */
    document.querySelectorAll('.ep-goal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selGoal = btn.dataset.goal;
        document.querySelectorAll('.ep-goal-btn').forEach(b => {
          const act = b.dataset.goal === selGoal;
          b.style.background  = act ? 'rgba(0,245,255,.12)' : 'rgba(255,255,255,.05)';
          b.style.borderColor = act ? 'var(--cyan)' : 'rgba(255,255,255,.1)';
          b.style.color       = act ? 'var(--cyan)' : '#888';
        });
      });
    });

    /* Focus / blur en inputs */
    document.querySelectorAll('input:not([readonly]), textarea').forEach(inp => {
      inp.addEventListener('focus', () => { inp.style.borderColor = 'var(--cyan)'; });
      inp.addEventListener('blur',  () => { inp.style.borderColor = 'rgba(255,255,255,.15)'; });
    });

    /* Guardar */
    const save = () => {
      const name   = (document.getElementById('ep-name')?.value   || '').trim();
      const age    =  document.getElementById('ep-age')?.value    || '';
      const height =  document.getElementById('ep-height')?.value || '';
      const weight =  document.getElementById('ep-weight')?.value || '';
      const bio    = (document.getElementById('ep-bio')?.value    || '').trim();

      if (!name) { alert('El nombre no puede estar vacío.'); return; }

      Object.assign(window.AppState.user, { name, age, height, weight, bio, goal: selGoal });
      localStorage.setItem('olympus_session', JSON.stringify(window.AppState.user));

      /* Actualizar en lista de usuarios registrados */
      const savedUsers = JSON.parse(localStorage.getItem('olympus_users') || '[]');
      const idx = savedUsers.findIndex(u => u.email.toLowerCase() === window.AppState.user.email.toLowerCase());
      if (idx >= 0) {
        savedUsers[idx] = { ...savedUsers[idx], name, age, height, weight, bio, goal: selGoal };
        localStorage.setItem('olympus_users', JSON.stringify(savedUsers));
      }

      navigateTo('profile');
      setTimeout(() => alert('✅ Perfil actualizado correctamente'), 100);
    };

    document.getElementById('ep-save-top')?.addEventListener('click', save);
    document.getElementById('ep-save-bottom')?.addEventListener('click', save);
    if (window.lucide) lucide.createIcons();
  }
};