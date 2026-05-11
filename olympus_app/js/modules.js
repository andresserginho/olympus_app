/* ============================================================
   MODULES.JS — Chat Atlas IA + Retos + Noticias
   ============================================================ */

/* ── BASE DE CONOCIMIENTO ── */
const _AI = [
  { t:['hola','hey','buenas','saludos','hi','qué tal'],
    r:'¡Hola! 💪 Soy **Atlas**, tu asistente fitness de Olympus.\n\nPuedo ayudarte con:\n• Técnica de ejercicios\n• Nutrición y dieta\n• Planes de entrenamiento\n• Recuperación y descanso\n\n¿En qué puedo orientarte hoy?' },
  { t:['sentadilla','squat','piernas','cuadriceps'],
    r:'La **sentadilla** es el rey de los ejercicios 🏆\n\n✅ Pies al ancho de hombros\n✅ Rodillas alineadas con los pies\n✅ Pecho arriba, espalda neutral\n✅ Baja hasta paralelo o más\n✅ Empuja a través de los talones' },
  { t:['perder peso','bajar','adelgazar','quemar grasa','déficit'],
    r:'Para **perder grasa** efectivamente:\n\n🔥 Déficit de 300-500 kcal/día\n🥩 Proteína 1.6-2g/kg de peso\n🏋 Combina cardio + pesas\n😴 7-9h de sueño\n💧 2-3 litros de agua/día' },
  { t:['ganar músculo','músculo','hipertrofia','volumen'],
    r:'Para **ganar músculo**:\n\n💪 Superávit de 200-300 kcal\n🥩 Proteína 1.8-2.2g/kg\n📈 Progresión de cargas constante\n🏋 3-5 días de entrenamiento\n😴 Duerme bien — el músculo crece en reposo' },
  { t:['proteina','nutrición','dieta','comer','alimentación'],
    r:'**Nutrición** para rendir:\n\n🥩 Proteína: pollo, huevo, atún, legumbres\n🍚 Carbos: avena, arroz, patata\n🥑 Grasas buenas: aguacate, nueces\n🚫 Evita ultraprocesados\n⏰ Come cada 3-4 horas' },
  { t:['descanso','recuperación','dormir','agujetas'],
    r:'La **recuperación** importa tanto como entrenar:\n\n😴 7-9h optimizan hormonas anabólicas\n⏱ 24-48h de descanso por grupo muscular\n🧘 Estiramiento post-entreno\n💧 Hidratación acelera la recuperación' },
  { t:['hiit','cardio','resistencia','correr','aeróbico'],
    r:'**HIIT** = cardio de alta intensidad:\n\n⚡ 20-30 min HIIT = 45-60 min cardio normal\n📋 30s máximo + 30s descanso × 10 rondas\n🔥 Mayor quema post-ejercicio\n⚠️ Máx 2-3 sesiones/semana' },
  { t:['calentamiento','estirar','movilidad','flexibilidad'],
    r:'**Calentamiento** (10 min antes):\n\n🚴 5 min cardio ligero\n🔄 Movilidad articular: hombros, caderas, tobillos\n💪 Series de calentamiento sin peso\n\n**Post-entreno**: 30-45s por músculo, sin rebotes' },
  { t:['rutina','plan','programa','frecuencia'],
    r:'**Rutinas** según nivel:\n\n🟢 Principiante (3 días): Full Body\n🟡 Intermedio (4 días): Upper/Lower\n🔴 Avanzado (5-6 días): PPL\n\nLa **Rutina IA** de Olympus se adapta automáticamente 🤖' },
  { t:['suplemento','creatina','whey','proteina en polvo'],
    r:'Suplementos más útiles:\n\n1️⃣ Creatina 3-5g/día — más respaldado ✅\n2️⃣ Proteína whey — conveniente\n3️⃣ Cafeína 150-200mg pre-entreno\n4️⃣ Omega-3 2-3g/día\n\n💡 Sin buena dieta, los sups no sirven.' },
  { t:['pecho','press','bench','banca'],
    r:'Para el **pecho**:\n\n🏋 Press banca inclinado: contrae al subir\n🏋 Fondos en paralelas: excelente para pecho\n🏋 Aperturas: estira bien el pecho\n\n💡 Usa rango completo de movimiento.' },
  { t:['espalda','remo','dominadas','jalón'],
    r:'Para la **espalda**:\n\n🏋 Dominadas: el mejor ejercicio de espalda\n🏋 Remo con barra: espalda recta, jala al abdomen\n🏋 Jalón en polea: controla la bajada\n\n💡 La espalda es el músculo más grande del tren superior.' },
  { t:['olympus','app','cómo funciona','ayuda'],
    r:'**Olympus** es tu app de fitness completa:\n\n📋 Entrena con planes IA personalizados\n📊 Mira tu progreso con gráficos\n🏆 Completa retos y logros\n👤 Edita tu perfil\n💬 ¡Aquí estoy yo, Atlas! 😊' },
];

const _AI_DEFAULT = 'Interesante pregunta 🤔\n\nPuedo ayudarte con **ejercicios**, **nutrición**, **planes de entrenamiento** y **recuperación**. Sé más específico y te daré una respuesta detallada. ¿Qué necesitas?';

let _chatHistory = [
  { role:'bot', text:'¡Hola! 💪 Soy **Atlas**, tu asistente de fitness.\n\nPuedo ayudarte con entrenamientos, nutrición, recuperación y más.\n\n¿En qué puedo ayudarte hoy?' }
];

/* ── AI response logic ── */
function _aiReply(msg) {
  const norm = t => t.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  const q = norm(msg);
  for (const item of _AI) {
    if (item.t.some(t => q.includes(norm(t)))) return item.r;
  }
  return _AI_DEFAULT;
}

/* ── Render messages ── */
function _renderChatBubbles(msgs) {
  return msgs.map(m => {
    const isBot = m.role === 'bot';
    const html  = (m.text||'')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return `
      <div style="display:flex;${isBot?'':'flex-direction:row-reverse;'}gap:8px;align-items:flex-end;">
        ${isBot ? `<div style="width:30px;height:30px;border-radius:50%;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="bot" style="width:14px;height:14px;color:var(--cyan);"></i></div>` : ''}
        <div style="max-width:82%;padding:10px 13px;font-size:13px;line-height:1.55;
          border-radius:${isBot?'4px 14px 14px 14px':'14px 4px 14px 14px'};
          background:${isBot?'rgba(255,255,255,.06)':'var(--cyan)'};
          color:${isBot?'#fff':'#000'};
          border:${isBot?'1px solid rgba(255,255,255,.08)':'none'};">
          ${html}
        </div>
      </div>`;
  }).join('');
}

/* ── Exposed functions for app.js ── */
window._renderChatMsgs = function() {
  return _renderChatBubbles(_chatHistory);
};

window._sendChatMsg = function(msg) {
  _chatHistory.push({ role:'user', text: msg });

  const msgsEl = document.getElementById('chat-msgs');
  if (msgsEl) {
    // Typing indicator
    msgsEl.innerHTML = _renderChatBubbles(_chatHistory) + `
      <div id="typing-dots" style="display:flex;gap:8px;align-items:flex-end;">
        <div style="width:30px;height:30px;border-radius:50%;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);display:flex;align-items:center;justify-content:center;">
          <i data-lucide="bot" style="width:14px;height:14px;color:var(--cyan);"></i>
        </div>
        <div style="padding:10px 14px;border-radius:4px 14px 14px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);">
          <span style="display:flex;gap:5px;align-items:center;">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:pulse 1s infinite;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:pulse 1s .2s infinite;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:pulse 1s .4s infinite;"></span>
          </span>
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  setTimeout(() => {
    _chatHistory.push({ role:'bot', text: _aiReply(msg) });
    if (msgsEl) {
      msgsEl.innerHTML = _renderChatBubbles(_chatHistory);
      if (window.lucide) lucide.createIcons();
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }
  }, 700 + Math.random() * 500);
};

/* ── PANTALLA DE RETOS ── */
window.screens.challenges = {
  render() {
    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="trophy" style="width:11px;height:11px;color:var(--cyan);"></i> RETOS
        </div>
        <h1 style="font-size:26px;font-weight:800;">Tus Retos</h1>
      </div>
      <div style="padding:0 20px;">
        <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;margin-bottom:12px;">ACTIVOS</p>
        <div style="border:1px solid rgba(255,165,0,.2);background:rgba(255,100,0,.03);border-radius:14px;padding:16px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <p style="font-size:15px;font-weight:700;margin-bottom:3px;">Semana de Fuego 🔥</p>
              <p style="font-size:11px;color:#888;">2 / 5 entrenamientos completados</p>
              <p style="font-size:11px;color:#888;">4 días restantes</p>
            </div>
            <span style="font-size:11px;font-weight:700;color:var(--gold);background:rgba(255,165,0,.15);border:1px solid rgba(255,165,0,.3);padding:4px 10px;border-radius:20px;">+500 XP</span>
          </div>
          <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
            <div style="width:40%;height:100%;background:linear-gradient(90deg,var(--orange),var(--gold));border-radius:3px;"></div>
          </div>
        </div>
        <div style="border:1px solid rgba(0,245,255,.15);background:rgba(0,245,255,.02);border-radius:14px;padding:16px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <p style="font-size:15px;font-weight:700;margin-bottom:3px;">Maratón de Cardio ⚡</p>
              <p style="font-size:11px;color:#888;">1 / 3 sesiones completadas</p>
              <p style="font-size:11px;color:#888;">6 días restantes</p>
            </div>
            <span style="font-size:11px;font-weight:700;color:var(--cyan);background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);padding:4px 10px;border-radius:20px;">+300 XP</span>
          </div>
          <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
            <div style="width:33%;height:100%;background:linear-gradient(90deg,var(--cyan),#0099cc);border-radius:3px;"></div>
          </div>
        </div>
        <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;margin-bottom:12px;">DISPONIBLES</p>
        ${[{n:'Reto del Mes 🏆',xp:'+1000 XP'},{n:'Sin Excusas 💪',xp:'+200 XP'},{n:'King of HIIT ⚡',xp:'+400 XP'}].map(r=>`
          <div style="padding:14px;border-radius:13px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);margin-bottom:9px;display:flex;align-items:center;justify-content:space-between;">
            <div>
              <p style="font-size:13px;font-weight:600;">${r.n}</p>
              <p style="font-size:11px;color:var(--gold);">${r.xp}</p>
            </div>
            <button type="button" class="ch-join" style="padding:7px 14px;border-radius:20px;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);color:var(--cyan);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">Unirse</button>
          </div>`).join('')}
      </div>
      <div style="height:100px;"></div>
      <button type="button" class="dash-fab-chat"><i data-lucide="message-circle"></i></button>
    </div>`;
  },
  init() {
    document.querySelectorAll('.ch-join').forEach(btn =>
      btn.addEventListener('click', () => alert('¡Unido al reto! 🏆 Próximamente disponible.'))
    );
    if (window.lucide) lucide.createIcons();
  }
};

/* ── PANTALLA DE NOTICIAS ── */
window.screens.news = {
  render() {
    const articles = [
      { cat:'TÉCNICA',     title:'5 tips para mejorar tu sentadilla',          mins:3, icon:'dumbbell',     color:'var(--cyan)' },
      { cat:'NUTRICIÓN',   title:'Qué comer antes y después de entrenar',       mins:5, icon:'apple',        color:'#22c55e' },
      { cat:'RECUPERACIÓN',title:'Por qué el descanso es clave',                mins:4, icon:'moon',         color:'#a855f7' },
      { cat:'MOTIVACIÓN',  title:'Cómo mantener la constancia en el gym',       mins:3, icon:'zap',          color:'var(--orange)' },
      { cat:'CIENCIA',     title:'La creatina: el suplemento más estudiado',    mins:6, icon:'flask-conical', color:'var(--gold)' },
    ];
    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="newspaper" style="width:11px;height:11px;color:var(--cyan);"></i> NOTICIAS
        </div>
        <h1 style="font-size:26px;font-weight:800;">Artículos</h1>
      </div>
      <div style="padding:0 20px 100px;display:flex;flex-direction:column;gap:10px;">
        ${articles.map(a=>`
          <div style="border-radius:14px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);padding:16px;cursor:pointer;" class="news-art">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:42px;height:42px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${a.icon}" style="width:18px;height:18px;color:${a.color};"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <span style="font-size:9px;font-weight:700;letter-spacing:.07em;color:${a.color};">${a.cat}</span>
                <p style="font-size:13px;font-weight:600;margin:3px 0 5px;line-height:1.3;">${a.title}</p>
                <div style="display:flex;align-items:center;gap:5px;font-size:10px;color:#888;">
                  <i data-lucide="clock" style="width:11px;height:11px;"></i>
                  <span>${a.mins} min lectura</span>
                </div>
              </div>
              <i data-lucide="chevron-right" style="width:16px;height:16px;color:#555;flex-shrink:0;"></i>
            </div>
          </div>`).join('')}
      </div>
      <button type="button" class="dash-fab-chat"><i data-lucide="message-circle"></i></button>
    </div>`;
  },
  init() {
    document.querySelectorAll('.news-art').forEach(a =>
      a.addEventListener('click', () => alert('Artículo completo próximamente 📰'))
    );
    if (window.lucide) lucide.createIcons();
  }
};