/* ============================================================
   DASHBOARD.JS — Pantalla de Control Principal
   ============================================================ */

function cyclePhaseMock() {
  const u = window.AppState.user;
  if (!u.lastCycleDate || !u.cycleOptIn)
    return { day: '?', phase: 'No configurado', detail: 'Configura tu fecha en el perfil.' };
  const diffDays = Math.floor(Math.abs(new Date() - new Date(u.lastCycleDate)) / 86400000);
  const day = (diffDays % 28) + 1;
  if (day <= 5)  return { day, phase: 'Menstrual', detail: 'Prioriza recuperación.'   };
  if (day <= 14) return { day, phase: 'Folicular', detail: 'Energía en ascenso.'      };
  if (day <= 17) return { day, phase: 'Ovulación', detail: 'Pico de fuerza.'          };
  return { day, phase: 'Lútea', detail: 'Cuidado con la fatiga.' };
}

const _DASH_ACTIVITY = [
  { name:'Full Body Power', time:'Ayer',        dur:'48 min', kcal:'350 kcal', cat:'Fuerza' },
  { name:'HIIT Cardio',     time:'Hace 2 días', dur:'22 min', kcal:'200 kcal', cat:'Cardio' },
  { name:'Upper Body',      time:'Hace 3 días', dur:'55 min', kcal:'280 kcal', cat:'Fuerza' },
];
const _WEEK_DAYS = ['L','M','X','J','V','S','D'];
const _DONE_DAYS = new Set([0, 1, 3]);

window.screens.dashboard = {
  render() {
    const u     = window.AppState.user;
    const xpPct = Math.min(100, (u.xp / u.xpToNext) * 100);
    const cycle = cyclePhaseMock();

    const weekHTML = _WEEK_DAYS.map((d, i) => {
      const ok = _DONE_DAYS.has(i);
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
        <div style="width:100%;max-width:38px;aspect-ratio:1;border-radius:10px;
          background:${ok?'var(--cyan)':'rgba(255,255,255,.06)'};
          border:1px solid ${ok?'var(--cyan)':'rgba(255,255,255,.1)'};
          display:flex;align-items:center;justify-content:center;">
          ${ok?'<i data-lucide="check" style="width:13px;height:13px;color:#000;"></i>':''}
        </div>
        <span style="font-size:10px;color:${ok?'var(--cyan)':'var(--gray-500,#666)'};">${d}</span>
      </div>`;
    }).join('');

    const actHTML = _DASH_ACTIVITY.map(a => `
      <div class="card" style="padding:12px 14px;display:flex;align-items:center;gap:11px;border-color:rgba(255,255,255,.07);">
        <div style="width:40px;height:40px;border-radius:11px;background:rgba(0,245,255,.07);
          border:1px solid rgba(0,245,255,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="dumbbell" style="width:17px;height:17px;color:var(--cyan);"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:13px;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${a.name}</p>
          <p style="font-size:11px;color:#888;">${a.dur} · ${a.kcal}</p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
          <span style="font-size:10px;color:#666;">${a.time}</span>
          <span style="font-size:10px;font-weight:600;color:var(--cyan);background:rgba(0,245,255,.1);padding:2px 8px;border-radius:10px;">${a.cat}</span>
        </div>
      </div>`).join('');

    return `
    <div class="screen-scroll dash-screen" style="position:relative;">

      <!-- Header -->
      <div class="fade-in" style="padding:52px 20px 14px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <p style="font-size:11px;color:#666;margin-bottom:2px;">${formatDate()}</p>
          <h1 style="font-size:23px;font-weight:800;line-height:1.2;">
            Hola, <span style="color:var(--cyan);">${u.name||'Atleta'}</span> 👋
          </h1>
          <p style="font-size:12px;color:#888;margin-top:3px;">Listo para superar tus límites?</p>
        </div>
        <button id="dash-notif-btn"
          style="width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.04);
            border:1px solid rgba(0,245,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="bell" style="width:19px;height:19px;color:#888;"></i>
        </button>
      </div>

      <!-- XP Bar -->
      <div class="fade-in-up delay-1" style="padding:0 20px 14px;">
        <div class="card" style="padding:13px 15px;border-color:rgba(0,245,255,.12);background:rgba(0,245,255,.02);">
          <div style="display:flex;align-items:center;gap:10px;">
            <i data-lucide="star" style="color:var(--gold,#fbbf24);width:18px;height:18px;flex-shrink:0;"></i>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:13px;font-weight:700;">Nivel ${u.level}</span>
                <span style="font-size:11px;color:#888;">
                  ${u.xp}/${u.xpToNext} XP
                  <span style="color:var(--gold,#fbbf24);font-weight:600;">→ Nv ${u.level+1}</span>
                </span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
                <div style="width:${xpPct}%;height:100%;background:linear-gradient(90deg,var(--cyan),#0099cc);border-radius:3px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="fade-in-up delay-2" style="padding:0 20px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        <div class="stat-card" style="text-align:center;padding:13px 6px;">
          <i data-lucide="flame" style="color:var(--orange,#f97316);"></i>
          <div style="font-size:20px;font-weight:700;color:var(--orange,#f97316);margin-top:3px;">${u.streak}</div>
          <div style="font-size:9px;color:#666;margin-top:1px;">Racha días</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:13px 6px;">
          <i data-lucide="zap" style="color:var(--cyan);"></i>
          <div style="font-size:20px;font-weight:700;color:var(--cyan);margin-top:3px;">2.4k</div>
          <div style="font-size:9px;color:#666;margin-top:1px;">Esta semana</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:13px 6px;">
          <i data-lucide="trophy" style="color:var(--gold,#fbbf24);"></i>
          <div style="font-size:20px;font-weight:700;color:var(--gold,#fbbf24);margin-top:3px;">3</div>
          <div style="font-size:9px;color:#666;margin-top:1px;">Retos activos</div>
        </div>
      </div>

      <!-- Ciclo Menstrual -->
      ${u.gender==='female' && u.cycleOptIn ? `
      <div class="fade-in-up delay-3" style="padding:0 20px 14px;">
        <div class="card" style="padding:15px;border-color:rgba(236,72,153,.3);">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
            <div>
              <p style="font-size:10px;color:var(--pink,#ec4899);letter-spacing:.06em;margin-bottom:3px;">CICLO MENSTRUAL</p>
              <strong style="font-size:15px;">Fase: ${cycle.phase}</strong>
              <p style="font-size:12px;color:#888;margin-top:4px;">Día ${cycle.day} · ${cycle.detail}</p>
            </div>
            <i data-lucide="heart" style="width:20px;height:20px;color:var(--pink,#ec4899);flex-shrink:0;"></i>
          </div>
        </div>
      </div>` : ''}

      <!-- Reto Activo -->
      <div class="fade-in-up delay-3" style="padding:0 20px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h2 style="font-size:15px;font-weight:700;">Reto activo</h2>
          <button type="button" id="dash-ver-retos" style="font-size:12px;color:var(--cyan);background:none;border:none;cursor:pointer;padding:0;">Ver todos</button>
        </div>
        <div class="card" style="padding:16px;border-color:rgba(255,165,0,.2);background:rgba(255,100,0,.03);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <p style="font-size:15px;font-weight:700;margin-bottom:3px;">Semana de Fuego 🔥</p>
              <p style="font-size:11px;color:#888;">2 / 5 entrenamientos · 4 días restante</p>
            </div>
            <span style="font-size:11px;font-weight:700;color:var(--gold,#fbbf24);background:rgba(255,165,0,.15);border:1px solid rgba(255,165,0,.3);padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;margin-left:10px;">+500 XP</span>
          </div>
          <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
            <div style="width:40%;height:100%;background:linear-gradient(90deg,var(--orange,#f97316),var(--gold,#fbbf24));border-radius:3px;"></div>
          </div>
        </div>
      </div>

      <!-- Entrenamiento de hoy -->
      <div class="fade-in-up delay-4" style="padding:0 20px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h2 style="font-size:15px;font-weight:700;">Entrenamiento de hoy</h2>
          <span style="font-size:11px;color:var(--cyan);background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);padding:3px 10px;border-radius:20px;">Día 3</span>
        </div>
        <div class="card" style="position:relative;overflow:hidden;background:#050505;border-color:rgba(0,245,255,.15);">
          <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?w=800&q=80') center/cover;opacity:.18;"></div>
          <div style="position:relative;padding:18px;">
            <div style="display:inline-flex;align-items:center;gap:5px;background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.3);padding:4px 12px;border-radius:20px;margin-bottom:10px;">
              <i data-lucide="zap" style="width:11px;height:11px;color:var(--cyan);"></i>
              <span style="font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);">FUERZA</span>
            </div>
            <h3 style="font-size:21px;font-weight:800;margin-bottom:3px;">Full Body Power</h3>
            <p style="font-size:12px;color:#888;margin-bottom:16px;">6 ejercicios · Intermedio</p>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;gap:14px;">
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#888;"><i data-lucide="clock" style="width:13px;height:13px;"></i><span>45 min</span></div>
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#888;"><i data-lucide="flame" style="width:13px;height:13px;color:var(--orange,#f97316);"></i><span>~350 kcal</span></div>
              </div>
              <button id="dash-play-btn" type="button"
                style="width:48px;height:48px;border-radius:50%;background:var(--cyan);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(0,245,255,.5);">
                <i data-lucide="play" style="width:20px;height:20px;color:#000;margin-left:2px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Progreso Semanal -->
      <div class="fade-in-up delay-5" style="padding:0 20px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div>
            <h2 style="font-size:15px;font-weight:700;">Progreso semanal</h2>
            <p style="font-size:11px;color:#888;margin-top:2px;">3 de 5 días completados</p>
          </div>
          <span style="font-size:11px;font-weight:600;color:#22c55e;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);padding:3px 10px;border-radius:20px;">↑ +12%</span>
        </div>
        <div style="display:flex;gap:6px;justify-content:space-between;">${weekHTML}</div>
      </div>

      <!-- Actividad Reciente -->
      <div class="fade-in-up delay-5" style="padding:0 20px 24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h2 style="font-size:15px;font-weight:700;">Actividad reciente</h2>
          <button type="button" id="dash-ver-actividad" style="font-size:12px;color:var(--cyan);background:none;border:none;cursor:pointer;padding:0;">Ver todo</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;">${actHTML}</div>
      </div>

      <!-- FAB → global delegation en app.js lo intercepta -->
      <button type="button" class="dash-fab-chat" id="dash-chat-fab">
        <i data-lucide="message-circle"></i>
      </button>
    </div>`;
  },

  init() {
    document.getElementById('dash-notif-btn')?.addEventListener('click', () => alert('Sin notificaciones nuevas'));
    document.getElementById('dash-play-btn')?.addEventListener('click', () => navigateTo('train'));
    document.getElementById('dash-ver-retos')?.addEventListener('click', () => navigateTo('challenges'));
    document.getElementById('dash-ver-actividad')?.addEventListener('click', () => navigateTo('progress'));
    
    if (window.lucide) lucide.createIcons();
  }
};