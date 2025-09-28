// NO service worker. App 100% client.
const STORAGE_KEY = 'scancarnet_v8';
const $ = id => document.getElementById(id);
function loadDB(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); }catch(e){ return {}; } }
function saveDB(db){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
function defaultDB(){ return { profile:{nom:'',prenom:'',classe:''}, cycles:[], selected:null }; }
function getDB(){ let d = loadDB(); if(!d || !d.profile){ d = defaultDB(); saveDB(d); } return d; }
function setDB(d){ saveDB(d); DB = d; }
function nid(){ return Math.random().toString(36).slice(2,9); }
function todayLux(){ try{ return new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Luxembourg'}); }catch(e){ return new Date().toISOString().slice(0,10);} }

let DB = getDB();

function hideAll(){ ['panel-splash','panel-profile','panel-dashboard','panel-cycle','panel-warmup','panel-newsession','panel-list'].forEach(id=>{ const el = $(id); if(el) el.classList.add('hidden'); }); }
function showPanel(id){ hideAll(); const el = $(id); if(el) el.classList.remove('hidden'); }
function updateProfileLine(){ const p = DB.profile||{}; const el = $('profileLine'); if(el) el.textContent = `${p.nom||'—'} ${p.prenom||''} — ${p.classe||''}`; }
function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderCycles(){
  const node = document.getElementById('cycleList'); if(!node) return; node.innerHTML = '';
  const d = getDB(); if(!d.cycles || d.cycles.length===0){ node.innerHTML = '<div style="color:#6b7280">Aucun cycle</div>'; return; }
  d.cycles.forEach(c=>{
    const el = document.createElement('div'); el.style.padding='8px'; el.style.borderBottom='1px solid #f1f7ff';
    el.innerHTML = `<strong>${c.name}</strong> <span style="color:#6b7280">(${(c.sessions||[]).length} séances)</span> <div style="margin-top:8px"><button class="ghost" data-id="${c.id}">Sélectionner</button></div>`;
    node.appendChild(el);
    const btn = el.querySelector('button');
    btn.addEventListener('click', (e)=>{ const id = e.currentTarget.dataset.id; let dd = getDB(); dd.selected = id; setDB(dd); alert('Cycle sélectionné'); showPanel('panel-dashboard'); });
  });
  updateProfileLine();
}

function renderSessions(){
  const node = document.getElementById('sessionsContainer'); if(!node) return; node.innerHTML='';
  const d = getDB(); const c = d.cycles.find(x=>x.id===d.selected); if(!c){ node.innerHTML='<div style="color:#6b7280">Aucun cycle sélectionné</div>'; return; }
  if(!(c.sessions||[]).length){ node.innerHTML='<div style="color:#6b7280">Aucune séance</div>'; return; }
  c.sessions.slice().reverse().forEach(s=>{
    const el = document.createElement('div'); el.style.marginBottom='12px'; el.innerHTML = `<div style="font-weight:800;color:#0066ff">${s.dateISO}</div><div style="white-space:pre-wrap;margin-top:6px">${escapeHtml(s.text)}</div>`;
    node.appendChild(el);
  });
  updateProfileLine();
}

document.addEventListener('DOMContentLoaded', ()=>{
  const safe = (fn)=> (...a)=>{ try{ return fn(...a); }catch(e){ console.error(e); alert('Erreur: '+(e.message||e)); } };

  const btnStart = $('btnStart'); if(btnStart) btnStart.addEventListener('click', ()=> showPanel('panel-profile'));
  const btnHelp = $('btnHelp'); if(btnHelp) btnHelp.addEventListener('click', ()=> { const m = $('modalHelp'); if(m){ m.style.display='flex'; m.classList.remove('hidden'); } });
  const closeHelp = $('closeHelp'); if(closeHelp) closeHelp.addEventListener('click', ()=> { const m = $('modalHelp'); if(m){ m.style.display='none'; m.classList.add('hidden'); } });
  const btnResetTop = $('btnResetTop'); if(btnResetTop) btnResetTop.addEventListener('click', ()=> { if(confirm('Supprimer toutes les données locales ?')){ localStorage.removeItem(STORAGE_KEY); DB = defaultDB(); saveDB(DB); location.reload(); } });

  const saveProfile = $('saveProfile'); if(saveProfile) saveProfile.addEventListener('click', safe(()=>{
    const d = getDB();
    d.profile.nom = ($('nom')?.value||'').trim();
    d.profile.prenom = ($('prenom')?.value||'').trim();
    d.profile.classe = ($('classe')?.value||'').trim();
    setDB(d); updateProfileLine(); alert('Profil enregistré'); showPanel('panel-dashboard');
  }));
  const backToSplash = $('backToSplash'); if(backToSplash) backToSplash.addEventListener('click', ()=> showPanel('panel-splash'));

  const btnCycle = $('btnCycle'); if(btnCycle) btnCycle.addEventListener('click', ()=> { renderCycles(); showPanel('panel-cycle'); });
  const btnWarmup = $('btnWarmup'); if(btnWarmup) btnWarmup.addEventListener('click', ()=> {
    const c = DB.cycles.find(x=>x.id===DB.selected); if(!c){ alert("Sélectionne ou crée d'abord un cycle"); renderCycles(); showPanel('panel-cycle'); return; }
    $('warmupCycleName').textContent = c.name; $('warmText').value = c.warmup||''; showPanel('panel-warmup');
  });
  const btnNew = $('btnNew'); if(btnNew) btnNew.addEventListener('click', ()=> {
    const c = DB.cycles.find(x=>x.id===DB.selected); if(!c){ alert("Sélectionne ou crée d'abord un cycle"); renderCycles(); showPanel('panel-cycle'); return; }
    $('sessionText').value=''; showPanel('panel-newsession');
  });
  const btnList = $('btnList'); if(btnList) btnList.addEventListener('click', ()=> { renderSessions(); showPanel('panel-list'); });

  const createCycle = $('createCycle'); if(createCycle) createCycle.addEventListener('click', safe(()=>{
    const name = ($('cycleName')?.value||'').trim(); if(!name){ alert('Nom requis'); return; }
    let d = getDB(); let c = d.cycles.find(x=>x.name.toLowerCase()===name.toLowerCase());
    if(!c){ c={id:nid(), name, warmup:'', sessions:[]}; d.cycles.push(c); }
    d.selected = c.id; setDB(d); renderCycles(); alert('Cycle sélectionné : '+c.name); showPanel('panel-dashboard');
  }));
  const cycleBack = $('cycleBack'); if(cycleBack) cycleBack.addEventListener('click', ()=> showPanel('panel-dashboard'));

  const saveWarm = $('saveWarm'); if(saveWarm) saveWarm.addEventListener('click', safe(()=>{ 
    let d=getDB(); const c=d.cycles.find(x=>x.id===d.selected); if(!c){ alert('Aucun cycle'); return; } 
    c.warmup = ($('warmText')?.value||''); setDB(d); alert('Échauffement enregistré'); showPanel('panel-dashboard'); 
  }));
  const warmBack = $('warmBack'); if(warmBack) warmBack.addEventListener('click', ()=> showPanel('panel-dashboard'));

  const saveSession = $('saveSession'); if(saveSession) saveSession.addEventListener('click', safe(()=> {
    const txt = ($('sessionText')?.value||'').trim(); if(!txt){ alert('Écris quelque chose'); return; }
    let d = getDB(); const c = d.cycles.find(x=>x.id===d.selected); if(!c){ alert('Aucun cycle sélectionné'); return; }
    const date = todayLux(); const now = new Date().toISOString(); const s={id:nid(), dateISO:date, text:txt, created_atISO:now};
    c.sessions = c.sessions||[]; c.sessions.push(s); setDB(d); $('sessionText').value=''; alert('Séance enregistrée ('+date+')'); showPanel('panel-dashboard');
  }));
  const sessionBack = $('sessionBack'); if(sessionBack) sessionBack.addEventListener('click', ()=> showPanel('panel-dashboard'));
  const listBack = $('listBack'); if(listBack) listBack.addEventListener('click', ()=> showPanel('panel-dashboard'));

  // CSV robuste
  const btnExportCSV = $('btnExportCSV'); 
  if (btnExportCSV) btnExportCSV.addEventListener('click', safe(()=>{
    const d = getDB(); 
    const c = d.cycles.find(x=>x.id===d.selected); 
    if (!c) { alert('Sélectionne un cycle avant d\'exporter'); return; }
    const head = ['nom','prenom','classe','cycle','date','texte','echauffement','created_at'];
    const esc = v => `"${String(v??'').replace(/"/g,'""').replace(/\r?\n/g,'\\n')}"`;
    const rows = (c.sessions||[]).map(s => ([ d.profile.nom, d.profile.prenom, d.profile.classe, c.name, s.dateISO, s.text, (c.warmup||''), s.created_atISO ]));
    const csv = [head, ...rows].map(r => r.map(esc).join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `${(d.profile.nom||'eleve')}_${(d.profile.prenom||'')}_${(c.name||'cycle')}.csv`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }));

  // PDF multipage
  const btnExportPDF = $('btnExportPDF'); 
  if (btnExportPDF) btnExportPDF.addEventListener('click', safe(async ()=>{
    const d = getDB(); 
    const c = d.cycles.find(x => x.id === d.selected); 
    if (!c) { alert('Sélectionne un cycle avant d\'exporter'); return; }

    const escHTML = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const wrap = document.createElement('div'); wrap.id = 'carnet-root';
    wrap.style.cssText = 'width:800px;background:#fff;color:#0b1320;font-family:Inter,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:32px;';

    const headerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
      <div>
        <div style="font-size:22px;font-weight:800;color:#0a58ff;margin-bottom:4px">${escHTML(c.name)} — Carnet</div>
        <div style="font-size:14px;color:#475569">Élève : <strong>${escHTML(d.profile.nom)} ${escHTML(d.profile.prenom)}</strong> — Classe : <strong>${escHTML(d.profile.classe)}</strong></div>
      </div>
      <div style="text-align:right;font-size:12px;color:#64748b">Généré par ScanCarnet<br/>${new Date().toLocaleDateString('fr-FR')}</div>
    </div>`;

    const warmupHTML = c.warmup ? `<div style="border:1px solid #e7eefc;border-radius:12px;padding:12px 14px;margin:8px 0 18px 0;background:linear-gradient(180deg,#f7fbff,#ffffff)">
      <div style="font-weight:700;color:#0a58ff;margin-bottom:6px">Échauffement type</div>
      <div style="white-space:pre-wrap;line-height:1.4">${escHTML(c.warmup)}</div>
    </div>` : '';

    const cards = (c.sessions||[]).map((s,i)=>`<div style="border:1px solid #eef2ff;border-radius:12px;padding:12px 14px;margin:0 0 12px 0;background:#fff; box-shadow:0 4px 14px rgba(10,20,40,0.05)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-weight:800;color:#0a58ff">Séance ${i+1}</div>
        <div style="font-size:12px;color:#64748b">${escHTML(s.dateISO)}</div>
      </div>
      <div style="white-space:pre-wrap;line-height:1.5">${escHTML(s.text)}</div>
    </div>${((i+1)%8===0)?'<div class="page-break"></div>':''}`).join('');

    wrap.innerHTML = headerHTML + warmupHTML + cards + `<div style="margin-top:8px;color:#64748b;font-size:12px;text-align:center">Équipe EPS Lycée Vauban — LUXEMBOURG</div>`;
    document.body.appendChild(wrap);
    try {
      const pdf = await window.ScanCarnetTools.generateFullPDF({ rootSelector:'#carnet-root', title:'Carnet d’entraînement' });
      const filename = `${(d.profile.nom||'eleve')}_${(d.profile.prenom||'')}_${(c.name||'cycle')}.pdf`;
      pdf.save(filename);
    } finally { wrap.remove(); }
  }));

  // Import CSV (anti-perte)
  const importCSVInput = $('importCSV');
  if (importCSVInput) importCSVInput.addEventListener('change', (async (e)=>{
    try {
      const file = e.target.files && e.target.files[0]; if (!file) return;
      const text = await file.text();
      const lines = text.replace(/\r/g,'').split('\n').filter(x=>x.trim().length);
      const header = lines.shift().split(';').map(h => h.replace(/^"|"$/g,'').toLowerCase().trim());
      const idx = name => header.indexOf(name);
      const I = {
        nom: idx('nom'), prenom: idx('prenom'), classe: idx('classe'),
        cycle: idx('cycle'), date: idx('date'), texte: idx('texte'),
        echauff: idx('echauffement'), created: idx('created_at')
      };
      if (I.cycle < 0 || I.date < 0 || I.texte < 0) { alert('CSV inattendu : colonnes manquantes.'); e.target.value=''; return; }
      const byCycle = {};
      for (const line of lines) {
        const parts = []; let cur = ''; let q=false;
        for (let i=0;i<line.length;i++){
          const ch=line[i];
          if (ch === '"'){ if (line[i+1] === '"'){ cur+='"'; i++; } else { q=!q; } }
          else if (ch === ';' && !q){ parts.push(cur); cur=''; }
          else { cur+=ch; }
        }
        parts.push(cur);
        const get = (ix)=> (ix>=0 && ix<parts.length) ? parts[ix] : '';
        const unesc = (s)=> (s||'').replace(/\\n/g,'\n');
        const cy = get(I.cycle) || 'Cycle';
        if (!byCycle[cy]) byCycle[cy] = { name: cy, warmup: '', sessions: [] };
        byCycle[cy].sessions.push({
          id: Math.random().toString(36).slice(2,9),
          dateISO: get(I.date),
          text: unesc(get(I.texte)),
          created_atISO: get(I.created) || new Date().toISOString()
        });
        if (I.echauff >= 0 && get(I.echauff) && !byCycle[cy].warmup) byCycle[cy].warmup = unesc(get(I.echauff));
      }
      const first = lines[0] ? lines[0].split(';') : [];
      const d = {
        profile: {
          nom: I.nom>=0 ? (first[I.nom]||'').replace(/^"|"$/g,'') : '',
          prenom: I.prenom>=0 ? (first[I.prenom]||'').replace(/^"|"$/g,'') : '',
          classe: I.classe>=0 ? (first[I.cllasse]||'').replace(/^"|"$/g,'') : ''
        },
        cycles: Object.values(byCycle).map(cy => ({ id: Math.random().toString(36).slice(2,9), ...cy })),
        selected: null
      };
      if (d.cycles.length) d.selected = d.cycles[0].id;
      setDB(d); renderCycles(); alert('Carnet reconstruit depuis le CSV.');
    } catch(err) {
      console.error(err); alert('Import CSV impossible : ' + (err.message || err));
    } finally {
      e.target.value='';
    }
  }));

  $('nom').value = DB.profile.nom || ''; $('prenom').value = DB.profile.prenom || ''; $('classe').value = DB.profile.classe || '';
  updateProfileLine();
});
