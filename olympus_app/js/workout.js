/* ============================================================
   WORKOUT.JS — Entrenamiento Activo con Timer y Cronómetro
   ============================================================ */

let _session = {
  workoutName: '', exercises: [],
  currentEx: 0, currentSet: 1,
  completedSets: new Set(),
  elapsedSec: 0, restSec: 0,
  timerInterval: null, restInterval: null,
};

/* Llamar para iniciar el workout desde train.js */
function startWorkoutSession(workout) {
  if (_session.timerInterval) clearInterval(_session.timerInterval);
  if (_session.restInterval)  clearInterval(_session.restInterval);
  _session = {
    workoutName: workout.name,
    exercises: workout.exercises || [],
    currentEx: 0, currentSet: 1,
    completedSets: new Set(),
    elapsedSec: 0, restSec: 0,
    timerInterval: null, restInterval: null,
  };
  navigateTo('active-workout');
}

function _fmt(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

window.screens['active-workout'] = {
  render() {
    const ex       = _session.exercises[_session.currentEx];
    if (!ex) return `<div style="padding:60px 20px;text-align:center;"><p style="color:#888">Sin ejercicios</p></div>`;
    const total    = _session.exercises.length;
    const pct      = Math.round((_session.currentEx / total) * 100);
    const isRest   = _session.restSec > 0;

    /* Series progress dots */
    const setsHTML = Array.from({ length: ex.sets }, (_, i) => {
      const n    = i + 1;
      const done = _session.completedSets.has(`${_session.currentEx}-${n}`);
      const curr = n === _session.currentSet && !done && !isRest;
      return `<div style="width:42px;height:42px;border-radius:50%;cursor:pointer;
        background:${done?'rgba(34,197,94,.2)':curr?'rgba(0,245,255,.15)':'rgba(255,255,255,.08)'};
        border:2px solid ${done?'#22c55e':curr?'var(--cyan)':'rgba(255,255,255,.2)'};
        display:flex;align-items:center;justify-content:center;
        font-size:14px;font-weight:700;color:${done?'#22c55e':curr?'var(--cyan)':'#888'};">
        ${done?'✓':n}
      </div>`;
    }).join('');

    return `
    <div style="min-height:100vh;background:#080808;display:flex;flex-direction:column;">

      <!-- Header -->
      <div style="padding:48px 20px 12px;display:flex;align-items:center;justify-content:space-between;">
        <button type="button" id="wo-exit"
          style="display:flex;align-items:center;gap:6px;color:var(--cyan);background:none;border:none;cursor:pointer;font-size:14px;font-weight:600;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;color:var(--cyan);"></i> Salir
        </button>
        <div style="text-align:center;">
          <p style="font-size:14px;font-weight:700;">${_session.workoutName}</p>
          <p style="font-size:11px;color:#888;">Ejercicio ${_session.currentEx+1} de ${total}</p>
        </div>
        <div style="text-align:right;">
          <span style="font-size:10px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);padding:3px 8px;border-radius:20px;">EN VIVO</span>
          <p style="font-size:10px;color:#888;margin-top:3px;">${pct}% completado</p>
        </div>
      </div>

      <!-- Progress bar -->
      <div style="height:3px;background:rgba(255,255,255,.1);margin:0 20px 8px;">
        <div style="width:${pct}%;height:100%;background:var(--cyan);transition:width .3s;"></div>
      </div>

      <!-- Timer / Cronómetro -->
      <div style="text-align:center;padding:8px 20px 16px;">
        <div id="wo-timer" style="font-size:36px;font-weight:900;color:var(--cyan);font-variant-numeric:tabular-nums;letter-spacing:.05em;">
          ${_fmt(_session.elapsedSec)}
        </div>
        <p style="font-size:11px;color:#888;">Tiempo total</p>
      </div>

      <!-- Main card -->
      <div style="flex:1;padding:0 20px 16px;">
        ${isRest ? `
          <div style="background:rgba(0,245,255,.05);border:1px solid rgba(0,245,255,.2);border-radius:20px;padding:32px 20px;text-align:center;">
            <p style="font-size:12px;color:var(--cyan);font-weight:700;letter-spacing:.08em;margin-bottom:14px;">DESCANSANDO</p>
            <div id="wo-rest" style="font-size:64px;font-weight:900;color:var(--cyan);line-height:1;">${_session.restSec}</div>
            <p style="font-size:12px;color:#888;margin-top:8px;">segundos</p>
            <button type="button" id="wo-skip"
              style="margin-top:18px;padding:10px 24px;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">
              Saltar descanso
            </button>
          </div>
        ` : `
          <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:22px 18px;">
            <p style="font-size:11px;color:var(--cyan);font-weight:600;margin-bottom:4px;">${ex.muscle||'Ejercicio'} · Ejercicio ${_session.currentEx+1}/${total}</p>
            <h2 style="font-size:24px;font-weight:800;margin-bottom:8px;line-height:1.2;">${ex.name}</h2>
            <p style="font-size:12px;color:#888;margin-bottom:18px;line-height:1.5;">${ex.description||'Realiza el movimiento con control y buena técnica.'}</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;">
              ${[['star','var(--cyan)',ex.sets,'Series'],['repeat','var(--cyan)',ex.reps,'Repeticiones'],['clock','var(--cyan)',ex.rest+'s','Descanso']].map(([ic,cl,v,l])=>`
                <div style="text-align:center;padding:13px 6px;background:rgba(0,245,255,.07);border-radius:12px;border:1px solid rgba(0,245,255,.2);">
                  <i data-lucide="${ic}" style="width:16px;height:16px;color:${cl};margin:0 auto;"></i>
                  <div style="font-size:20px;font-weight:800;color:${cl};margin-top:4px;">${v}</div>
                  <div style="font-size:10px;color:#888;margin-top:2px;">${l}</div>
                </div>`).join('')}
            </div>
            <p style="font-size:12px;font-weight:600;color:#888;margin-bottom:10px;">Progreso de series</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">${setsHTML}</div>
          </div>
        `}
      </div>

      <!-- Bottom Actions -->
      <div style="padding:8px 20px 32px;display:flex;align-items:center;gap:10px;">
        ${_session.currentEx > 0 ? `
          <button type="button" id="wo-prev"
            style="width:48px;height:52px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i data-lucide="chevron-left" style="width:20px;height:20px;"></i>
          </button>` : ''}
        <button type="button" id="wo-complete"
          style="flex:1;padding:16px;border-radius:14px;
            background:${isRest?'rgba(255,255,255,.08)':'var(--cyan)'};
            border:none;color:#000;font-size:14px;font-weight:700;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:8px;
            ${isRest?'pointer-events:none;':''}">
          ${isRest
            ? `<span style="color:#888;">Descansando...</span>`
            : `<i data-lucide="check" style="width:18px;height:18px;color:#000;"></i> Serie ${_session.currentSet} completada`}
        </button>
        ${_session.currentEx < _session.exercises.length - 1 ? `
          <button type="button" id="wo-next"
            style="width:48px;height:52px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i data-lucide="chevron-right" style="width:20px;height:20px;"></i>
          </button>` : ''}
      </div>
    </div>`;
  },

  init() {
    /* Cronómetro general */
    if (_session.timerInterval) clearInterval(_session.timerInterval);
    _session.timerInterval = setInterval(() => {
      _session.elapsedSec++;
      const el = document.getElementById('wo-timer');
      if (el) el.textContent = _fmt(_session.elapsedSec);
    }, 1000);

    /* Timer de descanso */
    if (_session.restSec > 0) {
      if (_session.restInterval) clearInterval(_session.restInterval);
      _session.restInterval = setInterval(() => {
        _session.restSec--;
        const el = document.getElementById('wo-rest');
        if (el) el.textContent = _session.restSec;
        if (_session.restSec <= 0) { clearInterval(_session.restInterval); navigateTo('active-workout'); }
      }, 1000);
      document.getElementById('wo-skip')?.addEventListener('click', () => {
        clearInterval(_session.restInterval); _session.restSec = 0; navigateTo('active-workout');
      });
    }

    /* Salir */
    document.getElementById('wo-exit')?.addEventListener('click', () => {
      if (confirm('¿Salir? Se perderá el progreso del entrenamiento.')) {
        clearInterval(_session.timerInterval); clearInterval(_session.restInterval);
        navigateTo('train');
      }
    });

    /* Completar serie */
    document.getElementById('wo-complete')?.addEventListener('click', () => {
      if (_session.restSec > 0) return;
      const ex  = _session.exercises[_session.currentEx];
      const key = `${_session.currentEx}-${_session.currentSet}`;
      _session.completedSets.add(key);

      if (_session.currentSet < ex.sets) {
        _session.currentSet++;
        _session.restSec = ex.rest;
      } else if (_session.currentEx < _session.exercises.length - 1) {
        _session.currentEx++;
        _session.currentSet = 1;
        _session.restSec = ex.rest;
      } else {
        clearInterval(_session.timerInterval); clearInterval(_session.restInterval);
        alert(`🎉 ¡Entrenamiento completado!\n⏱ Tiempo: ${_fmt(_session.elapsedSec)}`);
        navigateTo('train');
        return;
      }
      navigateTo('active-workout');
    });

    /* Prev / Next */
    document.getElementById('wo-prev')?.addEventListener('click', () => {
      clearInterval(_session.restInterval); _session.restSec = 0;
      _session.currentEx--; _session.currentSet = 1; navigateTo('active-workout');
    });
    document.getElementById('wo-next')?.addEventListener('click', () => {
      clearInterval(_session.restInterval); _session.restSec = 0;
      _session.currentEx++; _session.currentSet = 1; navigateTo('active-workout');
    });

    if (window.lucide) lucide.createIcons();
  }
};