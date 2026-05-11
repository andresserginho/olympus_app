/* ============================================================
   PROGRESS.JS — Pantalla de Estadísticas y Progreso
   ============================================================ */

let _chartMode = 'calories'; // 'calories' | 'minutes'

const _ACHIEVEMENTS = [
  { icon:'flame',      name:'En Fuego',   sub:'8 días seguidos',  unlocked:true,  color:'var(--orange)' },
  { icon:'dumbbell',   name:'Iron Man',   sub:'30 entrenos',      unlocked:true,  color:'var(--cyan)'   },
  { icon:'star',       name:'Elite',      sub:'Top 5% este mes',  unlocked:true,  color:'var(--gold)'   },
  { icon:'calendar',   name:'Constante',  sub:'4 sem activo',     unlocked:true,  color:'#22c55e'       },
  { icon:'zap',        name:'Explosivo',  sub:'HIIT +5 seguidos', unlocked:false                        },
  { icon:'check-circle',name:'Perfecto', sub:'Semana sin fallo',  unlocked:false                        },
];

window.screens.progress = {
  render() {
    /* SVG chart path generator */
    const calData = [65, 30, 10, 46, 60, 70];
    const minData = [55, 38, 20, 52, 63, 72];
    const data = _chartMode === 'calories' ? calData : minData;
    const W = 300, H = 70;
    const pts = data.map((y, i) => ({ x: (i / (data.length - 1)) * W, y }));
    let linePath = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx1 = pts[i].x + (pts[i+1].x - pts[i].x) / 2.5;
      const cx2 = pts[i+1].x - (pts[i+1].x - pts[i].x) / 2.5;
      linePath += ` C${cx1},${pts[i].y} ${cx2},${pts[i+1].y} ${pts[i+1].x},${pts[i+1].y}`;
    }
    const areaPath = linePath + ` L${W},${H+5} L0,${H+5} Z`;

    const achieveHTML = _ACHIEVEMENTS.map(a => `
      <div style="padding:12px 8px;border-radius:12px;text-align:center;
        border:1px solid ${a.unlocked ? 'rgba(0,245,255,.3)' : 'rgba(255,255,255,.07)'};
        background:${a.unlocked ? 'rgba(0,245,255,.04)' : 'rgba(255,255,255,.02)'};
        opacity:${a.unlocked ? 1 : 0.5};">
        <i data-lucide="${a.icon}" style="width:20px;height:20px;color:${a.unlocked ? (a.color || 'var(--cyan)') : '#555'};margin:0 auto 4px;"></i>
        <p style="font-size:10px;font-weight:700;color:${a.unlocked ? '#fff' : '#555'};margin-bottom:2px;">${a.name}</p>
        <p style="font-size:9px;color:#888;">${a.sub}</p>
      </div>`).join('');

    const btnStyle = (mode) => `padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;
      background:${_chartMode===mode?'var(--cyan)':'rgba(255,255,255,.07)'};
      color:${_chartMode===mode?'#000':'#888'};
      border:${_chartMode===mode?'none':'1px solid rgba(255,255,255,.1)'};cursor:pointer;`;

    return `
    <div class="screen-scroll" style="position:relative;">
      <!-- Header -->
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="trending-up" style="width:11px;height:11px;color:var(--cyan);"></i> ESTADÍSTICAS
        </div>
        <h1 style="font-size:26px;font-weight:800;">Tu Progreso</h1>
      </div>

      <!-- Stats 2×2 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 20px 16px;">
        <div style="padding:14px;border-radius:14px;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.18);">
          <i data-lucide="flame" style="width:18px;height:18px;color:var(--orange);"></i>
          <div style="font-size:22px;font-weight:800;color:var(--orange);margin:5px 0 2px;">12,840</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Calorías quemadas esta semana</div>
          <span style="display:inline-block;font-size:10px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);padding:2px 7px;border-radius:10px;margin-top:6px;">+8%</span>
        </div>
        <div style="padding:14px;border-radius:14px;background:rgba(0,245,255,.03);border:1px solid rgba(0,245,255,.18);">
          <i data-lucide="clock" style="width:18px;height:18px;color:var(--cyan);"></i>
          <div style="font-size:22px;font-weight:800;color:var(--cyan);margin:5px 0 2px;">6.8</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Tiempo activo horas / semana</div>
          <span style="display:inline-block;font-size:10px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);padding:2px 7px;border-radius:10px;margin-top:6px;">+12%</span>
        </div>
        <div style="padding:14px;border-radius:14px;background:rgba(168,85,247,.03);border:1px solid rgba(168,85,247,.18);">
          <i data-lucide="dumbbell" style="width:18px;height:18px;color:#a855f7;"></i>
          <div style="font-size:22px;font-weight:800;color:#a855f7;margin:5px 0 2px;">24</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Entrenamientos este mes</div>
          <span style="display:inline-block;font-size:10px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);padding:2px 7px;border-radius:10px;margin-top:6px;">+4</span>
        </div>
        <div style="padding:14px;border-radius:14px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.18);">
          <i data-lucide="star" style="width:18px;height:18px;color:var(--gold);"></i>
          <div style="font-size:22px;font-weight:800;color:var(--gold);margin:5px 0 2px;">12</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Racha actual días seguidos</div>
        </div>
      </div>

      <!-- Weekly Chart -->
      <div style="padding:0 20px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px;">
          <div><p style="font-size:15px;font-weight:700;">Esta semana</p><p style="font-size:11px;color:#888;">Actividad diaria</p></div>
          <div style="display:flex;gap:6px;">
            <button type="button" id="prog-cal-btn" style="${btnStyle('calories')}">Calorías</button>
            <button type="button" id="prog-min-btn" style="${btnStyle('minutes')}">Minutos</button>
          </div>
        </div>
        <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:14px;overflow:hidden;">
          <svg width="100%" height="80" viewBox="0 0 300 70" preserveAspectRatio="none">
            <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00f5ff" stop-opacity=".2"/>
              <stop offset="100%" stop-color="#00f5ff" stop-opacity=".02"/>
            </linearGradient></defs>
            <line x1="0" y1="18" x2="300" y2="18" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
            <line x1="0" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
            <line x1="0" y1="52" x2="300" y2="52" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
            <path d="${areaPath}" fill="url(#cg)"/>
            <path d="${linePath}" fill="none" stroke="#00f5ff" stroke-width="2" stroke-linecap="round"/>
            ${pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y}" r="3" fill="#00f5ff" opacity=".7"/>`).join('')}
          </svg>
          <div style="display:flex;justify-content:space-around;margin-top:8px;">
            ${['M','X','J','V','S','D'].map(d => `<span style="font-size:10px;color:#666;">${d}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Monthly Chart -->
      <div style="padding:0 20px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div><p style="font-size:15px;font-weight:700;">Este mes</p><p style="font-size:11px;color:#888;">Entrenamientos por semana</p></div>
          <span style="font-size:11px;font-weight:700;color:var(--cyan);background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);padding:3px 10px;border-radius:20px;">14 total</span>
        </div>
        <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:14px;">
          <div style="display:flex;align-items:flex-end;gap:8px;height:72px;">
            ${[{h:48,op:.28,s:'S1',a:false},{h:65,op:.38,s:'S2',a:false},{h:40,op:.22,s:'S3',a:false},{h:58,op:1,s:'S4',a:true}]
              .map(b => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
                <div style="width:100%;height:${b.h}px;background:${b.a?'var(--cyan)':`rgba(0,245,255,${b.op})`};border-radius:6px 6px 0 0;"></div>
                <span style="font-size:10px;color:${b.a?'var(--cyan)':'#888'};font-weight:${b.a?700:400}">${b.s}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div style="padding:0 20px 100px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <p style="font-size:15px;font-weight:700;">Logros</p>
          <span style="font-size:11px;font-weight:600;color:var(--gold);background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);padding:3px 10px;border-radius:20px;">4/6 desbloqueados</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${achieveHTML}</div>
      </div>

      <button type="button" class="dash-fab-chat" id="prog-fab"><i data-lucide="message-circle"></i></button>
    </div>`;
  },

  init() {
    document.getElementById('prog-cal-btn')?.addEventListener('click', () => { _chartMode = 'calories'; navigateTo('progress'); });
    document.getElementById('prog-min-btn')?.addEventListener('click', () => { _chartMode = 'minutes'; navigateTo('progress'); });
   
    if (window.lucide) lucide.createIcons();
  }
};