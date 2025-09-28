// v1.7.2 — fix SectionTitle, unregister SW early, PDF pro + guide coloré + import CSV
// --- SW cleanup early to avoid cached broken versions ---
(async function unregisterOldSW(){
  try{
    if('serviceWorker' in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      for(const r of regs){ try{ await r.unregister(); }catch(e){} }
    }
    if('caches' in window){
      const keys = await caches.keys();
      for(const k of keys){ try{ await caches.delete(k); }catch(e){} }
    }
  }catch(e){}
})();

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

document.addEventListener('DOMContentLoaded', ()=>{
  const safe = (fn)=> (...a)=>{ try{ return fn(...a); }catch(e){ console.error(e); alert('Erreur: '+(e.message||e)); } };

  // Splash
  $('btnStart')?.addEventListener('click', ()=> showPanel('panel-profile'));
  $('btnHelp')?.addEventListener('click', ()=> openGuide());
  $('closeHelp')?.addEventListener('click', ()=> closeGuide());
  $('btnResetTop')?.addEventListener('click', ()=> { if(confirm('Supprimer toutes les données locales ?')){ localStorage.removeItem(STORAGE_KEY); DB = defaultDB(); saveDB(DB); location.reload(); } });

  // Profil
  $('saveProfile')?.addEventListener('click', safe(()=>{
    const d = getDB();
    d.profile.nom = ($('nom')?.value||'').trim();
    d.profile.prenom = ($('prenom')?.value||'').trim();
    d.profile.classe = ($('classe')?.value||'').trim();
    setDB(d); updateProfileLine(); alert('Profil enregistré'); showPanel('panel-dashboard');
  }));
  $('backToSplash')?.addEventListener('click', ()=> showPanel('panel-splash'));

  // Dashboard
  $('btnCycle')?.addEventListener('click', ()=> { renderCycles(); showPanel('panel-cycle'); });
  $('btnWarmup')?.addEventListener('click', ()=> {
    const c = DB.cycles.find(x=>x.id===DB.selected); if(!c){ alert("Sélectionne ou crée d'abord un cycle"); renderCycles(); showPanel('panel-cycle'); return; }
    $('warmupCycleName').textContent = c.name; $('warmText').value = c.warmup||''; showPanel('panel-warmup');
  });
  $('btnNew')?.addEventListener('click', ()=> {
    const c = DB.cycles.find(x=>x.id===DB.selected); if(!c){ alert("Sélectionne ou crée d'abord un cycle"); renderCycles(); showPanel('panel-cycle'); return; }
    $('sessionText').value=''; showPanel('panel-newsession');
  });
  $('btnList')?.addEventListener('click', ()=> { renderSessions(); showPanel('panel-list'); });
  $('btnHelpGuide')?.addEventListener('click', ()=> openGuide());

  // Cycle
  $('createCycle')?.addEventListener('click', safe(()=>{
    const name = ($('cycleName')?.value||'').trim(); if(!name){ alert('Nom requis'); return; }
    let d = getDB(); let c = d.cycles.find(x=>x.name.toLowerCase()===name.toLowerCase());
    if(!c){ c={id:nid(), name, warmup:'', sessions:[]}; d.cycles.push(c); }
    d.selected = c.id; setDB(d); renderCycles(); alert('Cycle sélectionné : '+c.name); showPanel('panel-dashboard');
  }));
  $('cycleBack')?.addEventListener('click', ()=> showPanel('panel-dashboard'));

  // Warmup
  $('saveWarm')?.addEventListener('click', safe(()=>{ 
    let d=getDB(); const c=d.cycles.find(x=>x.id===d.selected); if(!c){ alert('Aucun cycle'); return; } 
    c.warmup = ($('warmText')?.value||''); setDB(d); alert('Échauffement enregistré'); showPanel('panel-dashboard'); 
  }));
  $('warmBack')?.addEventListener('click', ()=> showPanel('panel-dashboard'));

  // Session
  $('saveSession')?.addEventListener('click', safe(()=> {
    const txt = ($('sessionText')?.value||'').trim(); if(!txt){ alert('Écris quelque chose'); return; }
    let d = getDB(); const c = d.cycles.find(x=>x.id===d.selected); if(!c){ alert('Aucun cycle sélectionné'); return; }
    const date = todayLux(); const now = new Date().toISOString(); const s={id:nid(), dateISO:date, text:txt, created_atISO:now};
    c.sessions = c.sessions||[]; c.sessions.push(s); setDB(d); $('sessionText').value=''; alert('Séance enregistrée ('+date+')'); showPanel('panel-dashboard');
  }));
  $('sessionBack')?.addEventListener('click', ()=> showPanel('panel-dashboard'));
  $('listBack')?.addEventListener('click', ()=> showPanel('panel-dashboard'));

  // CSV export
  $('btnExportCSV')?.addEventListener('click', safe(()=>{
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

  // PDF export (pro, sans coupures, couleurs + numéros de page)
  $('btnExportPDF')?.addEventListener('click', safe(async ()=>{
    const d = getDB(); 
    const c = d.cycles.find(x => x.id === d.selected); 
    if (!c) { alert('Sélectionne un cycle avant d\'exporter'); return; }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit:'pt', format:'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;

    const color = { blue:[10,88,255], purple:[107,139,255], green:[52,199,89], orange:[255,151,77], pink:[236,72,153], gray:[100,116,139] };

    const H0 = (txt)=>{
      pdf.setTextColor(...color.blue); pdf.setFont('helvetica','bold'); pdf.setFontSize(20);
      pdf.text(txt, margin, y); y += 10;
      pdf.setDrawColor(230); pdf.setLineWidth(1); pdf.line(margin, y, pageW-margin, y); y += 16;
      pdf.setTextColor(0,0,0);
    };
    const Meta = (txt)=>{ pdf.setFont('helvetica','normal'); pdf.setFontSize(11); pdf.setTextColor(80); pdf.text(txt, margin, y); y += 14; pdf.setTextColor(0); };
    const SectionTitle = (txt, rgb)=>{ 
      pdf.setTextColor(rgb[0], rgb[1], rgb[2]); 
      pdf.setFont('helvetica','bold'); pdf.setFontSize(13); 
      pdf.text(txt, margin, y); y += 16; 
      pdf.setTextColor(0); 
    };
    const Line = ()=>{ pdf.setDrawColor(235); pdf.setLineWidth(0.8); pdf.line(margin, y, pageW-margin, y); y += 12; };
    const Para = (txt)=>{
      pdf.setFont('helvetica','normal'); pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(txt, pageW - margin*2);
      for (const ln of lines){
        if (y + 14 > pageH - margin){ pdf.addPage(); y = margin; }
        pdf.text(ln, margin, y); y += 14;
      }
    };

    // Header
    H0(`${c.name} — Carnet d'entraînement`);
    Meta(`Élève : ${d.profile.nom||''} ${d.profile.prenom||''} — Classe : ${d.profile.classe||''}`);
    Meta(`Date : ${new Date().toLocaleDateString('fr-FR')}`);
    Line();

    // Échauffement (bloc indivisible)
    if (c.warmup && c.warmup.trim().length){
      const content = c.warmup.replace(/\r?\n/g, '\n');
      const bodyLines = pdf.splitTextToSize(content, pageW - margin*2);
      const estH = 16 + (bodyLines.length * 14) + 12;
      if (y + estH > pageH - margin){ pdf.addPage(); y = margin; }
      SectionTitle("Échauffement type", color.orange);
      Para(content);
      Line();
    }

    // Séances
    const sessions = (c.sessions||[]);
    sessions.forEach((s, i)=>{
      const heading = `Séance ${i+1} — ${s.dateISO}`;
      const content = (s.text||'').replace(/\r?\n/g, '\n');
      const bodyLines = pdf.splitTextToSize(content, pageW - margin*2);
      const estH = 16 + (bodyLines.length * 14) + 12;
      if (y + estH > pageH - margin){ pdf.addPage(); y = margin; }
      SectionTitle(heading, color.blue);
      Para(content);
      Line();
    });

    // Footer numbering on each page
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i=1;i<=pageCount;i++){
      pdf.setPage(i);
      pdf.setFont('helvetica','normal'); pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(`ScanCarnet • Page ${i}/${pageCount}`, pageW - margin - 130, pageH - 16);
    }

    const filename = `${(d.profile.nom||'eleve')}_${(d.profile.prenom||'')}_${(c.name||'cycle')}.pdf`;
    pdf.save(filename);
  }));

  // Import CSV (recharge & retravailler)
  $('importCSV')?.addEventListener('change', (async (e)=>{
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
          classe: I.classe>=0 ? (first[I.classe]||'').replace(/^"|"$/g,'') : ''
        },
        cycles: Object.values(byCycle).map(cy => ({ id: Math.random().toString(36).slice(2,9), ...cy })),
        selected: null
      };
      if (d.cycles.length) d.selected = d.cycles[0].id;
      setDB(d); renderCycles(); alert('Carnet reconstruit depuis le CSV (tu peux continuer à travailler dessus).');
    } catch(err) {
      console.error(err); alert('Import CSV impossible : ' + (err.message || err));
    } finally {
      e.target.value='';
    }
  }));

  // Init
  $('nom').value = DB.profile.nom || ''; $('prenom').value = DB.profile.prenom || ''; $('classe').value = DB.profile.classe || '';
  updateProfileLine();
});

function openGuide(){
  const m = $('modalHelp'); if(m){ m.style.display='flex'; m.classList.remove('hidden'); }
}
function closeGuide(){
  const m = $('modalHelp'); if(m){ m.style.display='none'; m.classList.add('hidden'); }
}

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
