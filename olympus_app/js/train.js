/* ============================================================
   TRAIN.JS — Módulo de Entrenamiento (v3 — todos los tabs)
   ============================================================ */

/* ── DATA ──────────────────────────────────────────────────── */
const _PLAN = [
  { id:1, name:'Pecho & Tríceps',   icon:'💪', ex:3, dur:45, status:'done'    },
  { id:2, name:'Espalda & Bíceps',  icon:'🏋', ex:3, dur:50, status:'done'    },
  { id:3, name:'Piernas & Glúteos', icon:'🦵', ex:3, dur:55, status:'today',
    exercises:[
      { name:'Sentadilla con barra', muscle:'Piernas', sets:4, reps:8,  rest:120, description:'Baja hasta que los muslos queden paralelos al suelo.'         },
      { name:'Hip Thrust',           muscle:'Glúteos', sets:4, reps:10, rest:90,  description:'Apoya el hombro en el banco y empuja la cadera hacia arriba.' },
      { name:'Zancadas',             muscle:'Piernas', sets:3, reps:12, rest:60,  description:'Da un paso largo y baja la rodilla trasera al suelo.'          },
    ]},
  { id:4, name:'Hombros & Core',    icon:'⚡', ex:3, dur:40, status:'pending' },
  { id:5, name:'Full Body HIIT',    icon:'🔥', ex:3, dur:30, status:'pending' },
];

const _RECOMMENDED = [
  { id:'r1', name:'Upper Body Strength', level:'Intermedio', dur:45, ex:5, kcal:220,
    loc:['gym'],
    img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=70',
    exercises:[
      { name:'Press de banca Inclinado', muscle:'Pecho',   sets:4, reps:10, rest:90, description:'Contrae el pecho al subir, controla la bajada.'    },
      { name:'Remo con barra',           muscle:'Espalda', sets:4, reps:10, rest:90, description:'Mantén la espalda recta y jala hacia el abdomen.'  },
      { name:'Press militar',            muscle:'Hombros', sets:3, reps:10, rest:90, description:'Empuja sin arquear la espalda.'                     },
      { name:'Curl de bíceps',           muscle:'Bíceps',  sets:3, reps:12, rest:60, description:'Mantén los codos fijos y sube controlado.'         },
      { name:'Tríceps en polea',         muscle:'Tríceps', sets:3, reps:12, rest:60, description:'Codos pegados al cuerpo durante todo el rango.'    },
    ]},
  { id:'r2', name:'HIIT Cardio Blast', level:'Avanzado', dur:20, ex:5, kcal:450,
    loc:['gym','home'],
    img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=70',
    exercises:[
      { name:'Burpees',           muscle:'Full body', sets:3, reps:15, rest:30, description:'Salta arriba al terminar.'                      },
      { name:'Mountain Climbers', muscle:'Core',      sets:3, reps:20, rest:30, description:'Alterna rodillas al pecho lo más rápido posible.' },
      { name:'Jump Squats',       muscle:'Piernas',   sets:3, reps:15, rest:45, description:'Aterriza suave y vuelve a bajar de inmediato.'   },
      { name:'Box Jumps',         muscle:'Piernas',   sets:3, reps:12, rest:45, description:'Salta y baja controlado.'                       },
      { name:'Plank to Push-up',  muscle:'Core',      sets:3, reps:10, rest:30, description:'Alterna plank con flexiones.'                   },
    ]},
  { id:'r3', name:'Yoga Flow', level:'Principiante', dur:30, ex:4, kcal:120,
    loc:['home'],
    img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=70',
    exercises:[
      { name:'Saludo al Sol',    muscle:'Full body', sets:3, reps:5, rest:30, description:'Flujo continuo de posiciones.'                    },
      { name:'Guerrero I',       muscle:'Piernas',   sets:2, reps:8, rest:20, description:'Mantén 30 segundos cada lado.'                   },
      { name:'Tabla (Plank)',    muscle:'Core',      sets:3, reps:1, rest:30, description:'Sostén 45 segundos.'                             },
      { name:'Postura del niño', muscle:'Espalda',   sets:2, reps:1, rest:20, description:'Relaja completamente la espalda.'                },
    ]},
];

const _HISTORY = [
  { name:'Pecho & Tríceps',     date:'Hoy, 15:30',   dur:42, kcal:310, ex:3 },
  { name:'Espalda & Bíceps',    date:'Ayer, 18:12',  dur:48, kcal:345, ex:3 },
  { name:'Upper Body Strength', date:'1 Ago',        dur:45, kcal:320, ex:6 },
  { name:'HIIT Cardio Blast',   date:'2 Ago, 19:30', dur:28, kcal:440, ex:5 },
];

/* ── STATE ──────────────────────────────────────────────────── */
let _trainOpen = 3;
let _activeTab = 'plan';
let _locFilter = 'all';
let _favorites = new Set();

/* ── SHARED HTML HELPERS ────────────────────────────────────── */
function _heroHTML() {
  return `
  <div style="position:relative;height:175px;overflow:hidden;">
    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
      style="width:100%;height:100%;object-fit:cover;opacity:.35;">
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.2),#080808);"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;padding:18px 20px;">
      <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:6px;">
        <i data-lucide="zap" style="width:11px;height:11px;color:var(--cyan);"></i> MÓDULO DE ENTRENAMIENTO
      </div>
      <h1 style="font-size:21px;font-weight:800;margin-bottom:7px;">Tu Plan de Rutinas</h1>
      <div style="display:flex;gap:14px;">
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;"><i data-lucide="calendar" style="width:12px;height:12px;"></i><span>5 días</span></div>
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;"><i data-lucide="clock" style="width:12px;height:12px;"></i><span>210 min</span></div>
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;"><i data-lucide="flame" style="width:12px;height:12px;color:var(--orange);"></i><span>+1,500 kcal</span></div>
      </div>
    </div>
  </div>`;
}

function _tabsHTML() {
  return `
  <div style="padding:13px 20px;display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;">
    ${[['plan','Mi Plan'],['recomendados','Recomendados'],['favoritos','Favoritos'],['historial','Historial']].map(([id,label]) => `
      <button type="button" class="train-tab-btn" data-tab="${id}"
        style="padding:7px 15px;border-radius:20px;font-size:12px;font-weight:600;
          background:${_activeTab===id?'var(--cyan)':'rgba(255,255,255,.07)'};
          color:${_activeTab===id?'#000':'#888'};
          border:${_activeTab===id?'none':'1px solid rgba(255,255,255,.1)'};
          cursor:pointer;white-space:nowrap;flex-shrink:0;">${label}
      </button>`).join('')}
  </div>`;
}

/* ── RENDER: MI PLAN ────────────────────────────────────────── */
function _renderPlan() {
  const wHTML = _PLAN.map(w => {
    const isOpen = w.id === _trainOpen && w.status === 'today';
    let numEl = '';
    if      (w.status === 'done')    numEl = `<div style="width:28px;height:28px;border-radius:8px;background:rgba(34,197,94,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i></div>`;
    else if (w.status === 'today')   numEl = `<div style="width:28px;height:28px;border-radius:8px;background:rgba(0,245,255,.15);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--cyan);flex-shrink:0;">${w.id}</div>`;
    else                             numEl = `<div style="width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#666;flex-shrink:0;">${w.id}</div>`;

    let stEl = '';
    if      (w.status === 'done')    stEl = `<span style="font-size:11px;font-weight:600;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;">✓ Completado</span>`;
    else if (w.status === 'today')   stEl = `<button type="button" class="train-toggle" data-wid="${w.id}" style="font-size:11px;font-weight:600;color:var(--cyan);background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.25);padding:4px 10px;border-radius:20px;cursor:pointer;white-space:nowrap;flex-shrink:0;">Hoy ${isOpen?'▲':'▼'}</button>`;
    else                             stEl = `<span style="font-size:11px;color:#666;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;">Pendiente</span>`;

    let exSec = '';
    if (isOpen && w.exercises) {
      const rows = w.exercises.map(e => {
        const mc = e.muscle === 'Glúteos'
          ? 'background:rgba(168,85,247,.15);color:#a855f7'
          : 'background:rgba(0,245,255,.1);color:var(--cyan)';
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
          <div style="flex:1;"><p style="font-size:12px;font-weight:600;margin-bottom:2px;">${e.name}</p><p style="font-size:10px;color:var(--gray-400);">${e.sets} series · ${e.reps} reps · ${e.rest}s descanso</p></div>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:8px;white-space:nowrap;${mc};">${e.muscle}</span>
        </div>`;
      }).join('');
      exSec = `<div style="padding:0 14px 14px;">
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:11px;">${rows}</div>
        <button type="button" id="train-start-btn" style="width:100%;padding:13px;border-radius:12px;background:var(--cyan);border:none;color:#000;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
          <i data-lucide="play" style="width:16px;height:16px;color:#000;"></i>
          Iniciar entrenamiento
          <i data-lucide="zap" style="width:14px;height:14px;color:#000;"></i>
        </button>
      </div>`;
    }

    const bdr = w.status === 'today'
      ? 'border-color:rgba(0,245,255,.28);background:rgba(0,245,255,.02);'
      : 'border-color:rgba(255,255,255,.07);background:rgba(255,255,255,.025);';

    return `<div style="border:1px solid;border-radius:13px;overflow:hidden;${bdr}">
      <div style="display:flex;align-items:center;gap:10px;padding:13px 14px;">${numEl}
        <div style="flex:1;min-width:0;">
          <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${w.name} ${w.icon}</p>
          <p style="font-size:11px;color:var(--gray-400);">${w.ex} ejercicios · ${w.dur} min</p>
        </div>${stEl}
      </div>${exSec}
    </div>`;
  }).join('');

  return `
  <div style="padding:0 20px 12px;">
    <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#555;margin-bottom:8px;">TIPO DE RUTINA</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;">
      <div style="padding:12px 13px;border-radius:13px;background:rgba(0,245,255,.07);border:1px solid rgba(0,245,255,.35);">
        <i data-lucide="cpu" style="width:18px;height:18px;color:var(--cyan);margin-bottom:6px;"></i>
        <p style="font-size:13px;font-weight:700;color:var(--cyan);margin-bottom:3px;">Rutina IA</p>
        <p style="font-size:10px;color:#888;line-height:1.4;">Generada según tu perfil</p>
      </div>
      <div style="padding:12px 13px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);">
        <i data-lucide="edit-3" style="width:18px;height:18px;color:#666;margin-bottom:6px;"></i>
        <p style="font-size:13px;font-weight:700;color:#aaa;margin-bottom:3px;">Manual</p>
        <p style="font-size:10px;color:#666;line-height:1.4;">Crea tus propios ejercicios</p>
      </div>
    </div>
  </div>
  <div style="padding:0 20px 12px;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:11px;">
      <span style="font-size:11px;color:#888;">Plan generado · Semana 4 · Intermedio</span>
      <button type="button" id="train-regen-btn" style="font-size:11px;color:var(--cyan);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;font-weight:600;padding:0;">
        <i data-lucide="refresh-cw" style="width:13px;height:13px;"></i> Regenerar
      </button>
    </div>
  </div>
  <div style="padding:0 20px 14px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">
      <span style="font-size:14px;font-weight:700;">Progreso de la semana</span>
      <span style="font-size:14px;font-weight:700;color:var(--cyan);">2/5 días</span>
    </div>
    <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
      <div style="width:40%;height:100%;background:linear-gradient(90deg,var(--cyan),#0099cc);border-radius:3px;"></div>
    </div>
  </div>
  <div style="padding:0 20px 100px;display:flex;flex-direction:column;gap:8px;">${wHTML}</div>`;
}

/* ── RENDER: RECOMENDADOS ───────────────────────────────────── */
function _renderRecomendados() {
  const filtered = _locFilter === 'all'
    ? _RECOMMENDED
    : _RECOMMENDED.filter(r => r.loc.includes(_locFilter));

  const cardsHTML = filtered.map(r => {
    const isFav = _favorites.has(r.id);
    return `<div style="border-radius:16px;overflow:hidden;background:#0a0a0a;border:1px solid rgba(255,255,255,.08);margin-bottom:12px;">
      <div style="position:relative;height:130px;overflow:hidden;">
        <img src="${r.img}" style="width:100%;height:100%;object-fit:cover;opacity:.5;">
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.6));"></div>
        <span style="position:absolute;top:10px;left:10px;font-size:10px;font-weight:700;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.2);color:#fff;padding:3px 10px;border-radius:20px;">${r.level}</span>
        <button type="button" class="train-fav-btn" data-rid="${r.id}"
          style="position:absolute;top:8px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <i data-lucide="heart" style="width:15px;height:15px;color:${isFav?'#ec4899':'#888'};${isFav?'fill:#ec4899':''}"></i>
        </button>
      </div>
      <div style="padding:14px;">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">${r.name}</h3>
        <div style="display:flex;gap:14px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#888;"><i data-lucide="clock" style="width:12px;height:12px;"></i><span>${r.dur} min</span></div>
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#888;"><i data-lucide="dumbbell" style="width:12px;height:12px;"></i><span>${r.ex} ejercicios</span></div>
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#888;"><i data-lucide="flame" style="width:12px;height:12px;color:var(--orange);"></i><span>${r.kcal} kcal</span></div>
        </div>
        <div style="display:flex;gap:8px;">
          <button type="button" style="flex:1;padding:10px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;">
            <i data-lucide="eye" style="width:14px;height:14px;"></i> Preview
          </button>
          <button type="button" class="train-recom-start" data-rid="${r.id}"
            style="flex:1;padding:10px;border-radius:10px;background:var(--cyan);border:none;color:#000;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;">
            <i data-lucide="play" style="width:14px;height:14px;color:#000;"></i> Iniciar
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <div style="padding:0 20px 14px;">
    <div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;">
      ${[['all','Todos'],['gym','Gimnasio'],['home','Casa']].map(([id,label]) => `
        <button type="button" class="train-loc-btn" data-loc="${id}"
          style="padding:7px 15px;border-radius:20px;font-size:12px;font-weight:600;
            background:${_locFilter===id?'var(--cyan)':'rgba(255,255,255,.07)'};
            color:${_locFilter===id?'#000':'#888'};
            border:${_locFilter===id?'none':'1px solid rgba(255,255,255,.1)'};
            cursor:pointer;white-space:nowrap;flex-shrink:0;">${label}
        </button>`).join('')}
    </div>
  </div>
  <div style="padding:0 20px 100px;">
    ${cardsHTML || `<div style="text-align:center;padding:40px 0;color:#888;">Sin resultados para este filtro</div>`}
  </div>`;
}

/* ── RENDER: FAVORITOS ──────────────────────────────────────── */
function _renderFavoritos() {
  const favs = _RECOMMENDED.filter(r => _favorites.has(r.id));
  if (!favs.length) {
    return `<div style="padding:60px 20px;text-align:center;">
      <i data-lucide="heart" style="width:48px;height:48px;color:rgba(255,255,255,.1);margin:0 auto 12px;"></i>
      <p style="font-size:15px;font-weight:600;color:#888;margin-bottom:6px;">Sin favoritos aún</p>
      <p style="font-size:13px;color:#555;">Toca ❤️ en Recomendados para guardar rutinas</p>
    </div>`;
  }
  return `<div style="padding:0 20px 100px;">
    ${favs.map(r => `
      <div style="border-radius:14px;overflow:hidden;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
          <div style="width:48px;height:48px;border-radius:10px;overflow:hidden;flex-shrink:0;">
            <img src="${r.img}" style="width:100%;height:100%;object-fit:cover;opacity:.7;">
          </div>
          <div style="flex:1;min-width:0;">
            <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${r.name}</p>
            <p style="font-size:11px;color:#888;">${r.dur} min · ${r.ex} ejercicios · ${r.kcal} kcal</p>
          </div>
          <button type="button" class="train-fav-btn" data-rid="${r.id}"
            style="width:34px;height:34px;border-radius:50%;background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <i data-lucide="heart" style="width:15px;height:15px;color:#ec4899;fill:#ec4899;"></i>
          </button>
        </div>
        <div style="padding:0 14px 13px;">
          <button type="button" class="train-recom-start" data-rid="${r.id}"
            style="width:100%;padding:11px;border-radius:10px;background:var(--cyan);border:none;color:#000;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
            <i data-lucide="play" style="width:14px;height:14px;color:#000;"></i> Iniciar entrenamiento
          </button>
        </div>
      </div>`).join('')}
  </div>`;
}

/* ── RENDER: HISTORIAL ──────────────────────────────────────── */
function _renderHistorial() {
  return `
  <div style="padding:0 20px 6px;">
    <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;margin-bottom:12px;">SESIONES COMPLETADAS</p>
  </div>
  <div style="padding:0 20px 100px;">
    ${_HISTORY.map(h => `
      <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:13px;padding:14px 16px;margin-bottom:9px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
          <div>
            <p style="font-size:14px;font-weight:700;margin-bottom:3px;">${h.name}</p>
            <p style="font-size:11px;color:#888;">${h.date}</p>
          </div>
          <div style="width:28px;height:28px;border-radius:50%;background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i data-lucide="check" style="width:13px;height:13px;color:#22c55e;"></i>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
            <div style="font-size:13px;font-weight:700;color:var(--cyan);">${h.dur} min</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">Tiempo</div>
          </div>
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
            <div style="font-size:13px;font-weight:700;color:var(--orange);">${h.kcal} kcal</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">Calorías</div>
          </div>
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
            <div style="font-size:13px;font-weight:700;color:#a855f7;">${h.ex}</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">Ejercicios</div>
          </div>
        </div>
      </div>`).join('')}
  </div>`;
}

/* ── MAIN SCREEN OBJECT ─────────────────────────────────────── */
window.screens.train = {
  render() {
    const content = {
      plan:         _renderPlan,
      recomendados: _renderRecomendados,
      favoritos:    _renderFavoritos,
      historial:    _renderHistorial,
    }[_activeTab]?.() ?? _renderPlan();

    return `
    <div class="screen-scroll" style="position:relative;">
      ${_heroHTML()}
      ${_tabsHTML()}
      ${content}
      <button type="button" class="dash-fab-chat" id="train-fab">
        <i data-lucide="message-circle"></i>
      </button>
    </div>`;
  },

  init() {
    /* Tab switching */
    document.querySelectorAll('.train-tab-btn').forEach(btn =>
      btn.addEventListener('click', () => { _activeTab = btn.dataset.tab; navigateTo('train'); })
    );
    /* Mi Plan: toggle expand */
    document.querySelectorAll('.train-toggle').forEach(btn =>
      btn.addEventListener('click', () => {
        const wid = parseInt(btn.dataset.wid);
        _trainOpen = _trainOpen === wid ? null : wid;
        navigateTo('train');
      })
    );
    /* Mi Plan: iniciar workout */
    document.getElementById('train-start-btn')?.addEventListener('click', () => {
      const w = _PLAN.find(x => x.id === _trainOpen);
      if (w?.exercises) startWorkoutSession({ name: w.name, exercises: w.exercises });
    });
    /* Mi Plan: regenerar */
    document.getElementById('train-regen-btn')?.addEventListener('click', () => alert('Generando nuevo plan IA... 🤖'));
    /* Location filter */
    document.querySelectorAll('.train-loc-btn').forEach(btn =>
      btn.addEventListener('click', () => { _locFilter = btn.dataset.loc; navigateTo('train'); })
    );
    /* Favorito toggle */
    document.querySelectorAll('.train-fav-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        const rid = btn.dataset.rid;
        _favorites.has(rid) ? _favorites.delete(rid) : _favorites.add(rid);
        navigateTo('train');
      })
    );
    /* Iniciar recomendado/favorito */
    document.querySelectorAll('.train-recom-start').forEach(btn =>
      btn.addEventListener('click', () => {
        const r = _RECOMMENDED.find(x => x.id === btn.dataset.rid);
        if (r) startWorkoutSession({ name: r.name, exercises: r.exercises });
      })
    );
    
    if (window.lucide) lucide.createIcons();
  }
};