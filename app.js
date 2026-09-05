'use strict';
const icons = {
  phone:'M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a14 14 0 0 1-7-7l2-2-2-5Z',
  home:'m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-7.87a4 4 0 0 1 0 7.75',
  mic:'M12 15a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v7a3 3 0 0 0 3 3Zm-7-4v1a7 7 0 0 0 14 0v-1m-7 8v3m-4 0h8',
  bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0',
  settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2-6h4l1 3 3 1 3 2v4l-2 2-1 3-2 4h-4l-2-2-3-1-4-2v-4l2-2 1-3 4-2Z',
  arrow:'M5 12h14m-6-6 6 6-6 6',chevron:'m9 5 7 7-7 7',back:'m15 5-7 7 7 7',plus:'M12 5v14M5 12h14',
  calendar:'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Zm2-3v6m10-6v6M3 11h18m-14 4h3m4 0h3',
  book:'M4 3h14a2 2 0 0 1 2 2v16H5a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2Zm-2 15a3 3 0 0 1 3-3h15M7 6h7m-7 4h9',
  search:'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM16 16l5 5',
  work:'M8 6V3h8v3M3 7h18v14H3ZM3 12a20 20 0 0 0 18 0M12 11v4',
  heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  coffee:'M4 8h12v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4ZM16 9h2a3 3 0 0 1 0 6h-2M7 2v3m6-3v3',
  check:'m5 12 4 4L19 6',shield:'m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Zm-4 10 3 3 5-6',
  play:'m8 4 12 8-12 8Z',pause:'M8 5v14m8-14v14',stop:'M6 6h12v12H6Z',wifi:'M3 8a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0m-9 4a4 4 0 0 1 6 0m-3 4h.01',signal:'M4 20v-4m5 4v-8m5 8V8m5 12V4',battery:'M3 7h16v10H3Zm18 3v4M6 10h10v4H6Z',close:'m6 6 12 12M6 18 18 6'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name] || icons.book}"/></svg>`;
const logo = `<span class="logo-mark">${icon('phone')}</span>`;
const screenNames = {welcome:'Welcome',home:'Home',people:'People',person:'Person details',record:'Record a memory',review:'Review memories',reminders:'Reminders',settings:'Settings'};
const params = new URLSearchParams(location.search);
const embedded = params.get('embed') === '1';
const app = document.querySelector('#app');
const escapeHTML = str => String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const people = [
  {name:'Dira',initial:'D',color:'photo',detail:'Design studio in Bandung',date:'Today',facts:[['work','Work','Building her own design studio in Bandung.'],['people','Family','Her sister just moved to Melbourne.'],['coffee','Preferences','No coffee after 2 pm. Oat milk, always.']]},
  {name:'Rafi',initial:'R',color:'amber',detail:'Preparing for his first half marathon',date:'Yesterday',facts:[['heart','Ongoing','Training for his first half marathon in October.'],['work','Work','Recently joined a small architecture firm.']]},
  {name:'Maya',initial:'M',color:'coral',detail:'Started a pottery class',date:'Sep 3',facts:[['heart','Interests','Started a pottery class on Saturday mornings.'],['people','Family','Her mum is visiting next month.']]},
  {name:'Reza',initial:'R',color:'sage',detail:'Moving to a new apartment',date:'Aug 28',facts:[['home','Ongoing','Moving into a new apartment in South Jakarta.'],['people','Connection','Introduced you to Dira last November.']]}
];
let selectedPerson = people[0];
let currentScreen = screenNames[params.get('screen')] ? params.get('screen') : 'home';
let recording = false, seconds = 0, recordingTimer, toastTimer;
let draft = 'Dira is building her own design studio in Bandung. Her sister just moved to Melbourne. She does not drink coffee after 2 pm.';
let reviewItems = [...people[0].facts.map(item=>[...item])];
let settings = {nightly:true,calendar:true,reconnect:false,time:'21:00'};
const navButton = (screen,label,cls='') => `<button class="${cls}" data-go="${screen}">${label}</button>`;
const avatar = (p,large=false) => `<span class="avatar ${p.color} ${large?'large':''}" aria-hidden="true">${p.color==='photo'?'':p.initial}</span>`;
const topbar = (title,back='home') => `<div class="topbar"><button class="icon-button" aria-label="Back to ${screenNames[back]}" data-go="${back}">${icon('back')}</button><h1 tabindex="-1">${title}</h1><span class="spacer"></span></div>`;
const coloredIcon = (name,color='') => `<span class="colored-icon ${color}">${icon(name)}</span>`;
const personRow = p => `<button class="person-row" data-person="${p.name}">${avatar(p)}<span><strong>${p.name}</strong><p>${escapeHTML(p.detail)}</p></span>${icon('chevron')}</button>`;
const eventCard = () => `<div class="app-card"><div class="event-top">${avatar(people[0])}<div><strong>Coffee with Dira</strong><small>Today, 4:00 pm · Kopi Tuku</small></div></div><div class="event-note">Her studio is taking shape in Bandung.<br>Her sister just moved to Melbourne.</div><div class="event-meta"><span class="tag">Before you meet</span><button class="text-button" data-person="Dira">View details</button></div></div>`;
function pageContent(screen){
  switch(screen){
    case 'welcome': return `<div class="welcome-brand">${logo} One Call Away</div><div><img class="welcome-art" src="assets/generated/memory-book.jpg" alt="A green memory book with a speech bubble and microphone"><div class="welcome-dots" aria-hidden="true"><i></i><i></i><i></i></div><h1>Little details.<br>Real connections.</h1><p>Remember the details about people you meet. A quick voice note today. The right words next time.</p></div><div>${navButton('record',`Try your first memory ${icon('arrow')}`,'primary')}${navButton('home','Explore the demo','text-button')}<p class="prototype-note">No account needed to try it.</p></div>`;
    case 'home': return `<header class="app-header"><div><p>Good afternoon,</p><h1 tabindex="-1">A little more present.</h1></div><button class="icon-button" aria-label="Open settings" data-go="settings"><span class="avatar sage">G</span></button></header><div class="memory-banner"><h2>Anyone you met today?</h2><p>A name. A story. Something you want to remember.</p><button class="round-action" data-go="record" aria-label="Record a memory">${icon('mic')}</button></div><div class="quick-grid">${navButton('people',`${coloredIcon('people','purple')}<span><strong>Your people</strong><small>4 people</small></span>`,'quick-card')}${navButton('reminders',`${coloredIcon('calendar','yellow')}<span><strong>Coming up</strong><small>1 meeting today</small></span>`,'quick-card')}</div><section class="app-section"><div class="section-row"><h2>Before you meet</h2>${navButton('reminders','View all','text-button')}</div>${eventCard()}</section><section class="app-section"><div class="section-row"><h2>Recently remembered</h2>${navButton('people','See all','text-button')}</div><div class="people-list">${people.slice(0,2).map(personRow).join('')}</div></section>`;
    case 'people': return `<header class="app-header"><div><p>A little context for everyone.</p><h1 tabindex="-1">Your people</h1></div><button class="icon-button" data-go="record" aria-label="Add a person through a memory">${icon('plus')}</button></header><label class="search">${icon('search')}<input type="search" id="people-search" aria-label="Search people" placeholder="Find a name or a detail"></label><div class="filter-row" aria-label="People filter"><button class="active" data-filter="all" aria-pressed="true">All people · 4</button><button data-filter="recent" aria-pressed="false">This week</button></div><div class="people-list" id="people-results">${people.map(personRow).join('')}</div><div class="privacy-note app-section"><h3>A memory starts with a name.</h3><p>Mention someone in a voice note. Their details will have a place here.</p></div>`;
    case 'person': return `${topbar('Person details','people')}<div class="person-hero">${avatar(selectedPerson,true)}<h1>${selectedPerson.name}</h1><p>Last updated ${selectedPerson.date.toLowerCase()} · ${selectedPerson.facts.length} details</p></div>${navButton('record',`${icon('plus')} Add a memory`,'primary')}<div class="section-row app-section"><h2>Things to remember</h2><span class="tag">Saved by you</span></div><div class="facts">${selectedPerson.facts.map(([glyph,label,value],i)=>`<article class="fact-card">${coloredIcon(glyph,['','purple','orange'][i%3])}<div><h3>${escapeHTML(label)}</h3><p>${escapeHTML(value)}</p><button class="source" data-source="${i}">From your note · ${selectedPerson.date} ${icon('chevron')}</button></div></article>`).join('')}</div><div class="app-section"><h2>Connected through a memory</h2><div class="people-list" style="margin-top:12px">${personRow(selectedPerson.name==='Reza'?people[0]:people[3])}</div></div>`;
    case 'record': return `${topbar('New memory')}<div class="record-center"><h1>What stayed with you?</h1><p>Think of someone you met recently.<br>What would you like to remember?</p></div><img class="record-art" src="assets/generated/voice-note.jpg" alt="An orange microphone beside a voice waveform"><div class="record-time" id="record-time">00:00</div><div class="waveform" id="waveform" aria-hidden="true">${Array.from({length:28},(_,i)=>`<i style="--bar-height:${12+(i*17%39)}px;--delay:-${i%7/10}s"></i>`).join('')}</div><div class="record-controls"><button id="record-toggle" aria-label="Start sample recording">${icon('mic')}</button><button id="record-stop" class="stop" aria-label="Finish sample recording" hidden>${icon('stop')}</button></div><p class="prototype-note" id="record-hint">Tap to try a sample recording. No microphone is used.</p><label class="note-label" for="typed-note">Or type a memory about ${selectedPerson.name}</label><textarea id="typed-note" class="note-input" placeholder="I caught up with Dira today…">${escapeHTML(draft)}</textarea><div class="app-footer-actions"><button class="primary" id="review-note">Review this memory ${icon('arrow')}</button></div>`;
    case 'review': return `${topbar('Review your memory','record')}<h1>Sound about right?</h1><p>These details came from your note.<br>Edit anything before you save.</p><div class="review-person">${avatar(selectedPerson)}<div><h3>${selectedPerson.name}</h3><small>${reviewItems.length} details to remember</small></div></div>${reviewItems.map(([,label,value],i)=>`<label class="review-fact"><span>${escapeHTML(label)}</span><textarea data-fact="${i}" aria-label="${escapeHTML(label)} detail">${escapeHTML(value)}</textarea></label>`).join('')}<div class="privacy-note app-section"><p>${icon('shield')} You decide what stays. Nothing is saved until you confirm.</p></div><div class="app-footer-actions"><button class="primary" id="save-memory">${icon('check')} Save ${reviewItems.length===1?'memory':'memories'}</button>${navButton('record','Back to my note','text-button')}</div>`;
    case 'reminders': return `${topbar('Reminders')}<h1>A little context.<br>Right on time.</h1><p>Useful details before your next conversation.</p><img class="reminder-art" src="assets/generated/reminder-calendar.jpg" alt="A green calendar and lavender reminder bell"><div class="filter-row" aria-label="Reminder filter"><button class="active" data-reminder="upcoming" aria-pressed="true">Upcoming</button><button data-reminder="past" aria-pressed="false">Past</button></div><div id="reminder-list"><div class="section-row"><h2>Today</h2><small>September 5</small></div>${eventCard()}<div class="app-card reminder-card"><div class="event-top">${coloredIcon('mic','orange')}<div><strong>Anyone you met today?</strong><small>Tonight, ${escapeHTML(settings.time)}</small></div></div><div class="event-meta"><span class="tag">Your nightly prompt</span>${navButton('settings','Change','text-button')}</div></div></div>`;
    case 'settings': return `${topbar('Settings')}<div class="person-hero"><span class="avatar sage large">G</span><h1>Your space</h1><p>A quieter way to remember.</p></div><div class="setting-group"><div class="setting-row"><div><strong>Nightly prompt</strong><p>Anyone you met today?</p></div><label class="switch-label"><input class="switch" type="checkbox" data-setting="nightly" aria-label="Nightly prompt" ${settings.nightly?'checked':''}></label></div><div class="setting-row"><label for="reminder-time"><strong>Remind me at</strong></label><input class="time-input" id="reminder-time" type="time" value="${escapeHTML(settings.time)}"></div><div class="setting-row"><div><strong>Calendar briefings</strong><p>30 minutes before a meeting</p></div><label class="switch-label"><input class="switch" type="checkbox" data-setting="calendar" aria-label="Calendar briefings" ${settings.calendar?'checked':''}></label></div><div class="setting-row"><div><strong>Reconnect nudges</strong><p>At most once a week</p></div><label class="switch-label"><input class="switch" type="checkbox" data-setting="reconnect" aria-label="Reconnect nudges" ${settings.reconnect?'checked':''}></label></div></div><div class="privacy-note"><h3>${icon('shield')} Your memories are yours.</h3><p>In this prototype, edits stay in this preview session. Your device settings are not changed.</p></div><div class="app-footer-actions">${navButton('welcome','View welcome screen','secondary')}</div><p class="prototype-note">One Call Away · Android concept · v0.1</p>`;
  }
}
function showToast(message){
  document.querySelector('.app-toast')?.remove(); clearTimeout(toastTimer);
  const el=document.createElement('div');el.className='app-toast';el.setAttribute('role','status');el.textContent=message;app.append(el);
  toastTimer=setTimeout(()=>el.remove(),3500);
}
function render(screen,focus=true){
  clearInterval(recordingTimer);recording=false;currentScreen=screen;if(screen==='record')seconds=0;
  const noNav=['welcome','record','review'].includes(screen);
  app.innerHTML=`<div class="statusbar" aria-hidden="true"><span>9:41</span><span class="camera-dot"></span><span class="system-icons">${icon('signal')}${icon('wifi')}${icon('battery')}</span></div><div class="app-content ${screen==='welcome'?'welcome-content':''}">${pageContent(screen)}</div>${noNav?'':`<nav class="bottom-nav" aria-label="App navigation">${[['home','home','Home'],['people','people','People'],['record','mic','Record'],['reminders','calendar','Reminders'],['settings','settings','Settings']].map(([s,g,l])=>`<button data-go="${s}" class="${s===screen||(s==='people'&&screen==='person')?'active':''} ${s==='record'?'record-nav':''}" ${s===screen?'aria-current="page"':''}>${icon(g)}${s==='record'?'<span class="sr-only" style="position:absolute;clip-path:inset(50%);width:1px;height:1px;overflow:hidden">Record</span>':l}</button>`).join('')}</nav>`}<div class="gesture-bar" aria-hidden="true"></div>`;
  if(focus) app.querySelector('h1')?.focus({preventScroll:true});
  const url=new URL(location);url.searchParams.set('screen',screen);history.replaceState(null,'',url);
  if(window.parent!==window)window.parent.postMessage({type:'oca-screen',screen},location.origin);
}
function startReview(){
  draft=document.querySelector('#typed-note').value.trim();
  if(!draft){document.querySelector('#typed-note').focus();showToast('Add a memory first, or try the sample recording.');return;}
  if(draft==='Dira is building her own design studio in Bandung. Her sister just moved to Melbourne. She does not drink coffee after 2 pm.'){
    selectedPerson=people[0];reviewItems=[...people[0].facts.map(item=>[...item])];
  }else{reviewItems=[['book','Your note',draft]];}
  render('review');
}
function sourceDialog(index){
  const detail=selectedPerson.facts[index];if(!detail)return;
  const dialog=document.createElement('dialog');dialog.className='source-dialog';
  dialog.innerHTML=`<h2>Your original note</h2><p><strong>${selectedPerson.name} · ${selectedPerson.date}</strong></p><p>“${escapeHTML(detail[2])}”</p><p>Sample transcript. Audio playback will be available in the Android app.</p><form method="dialog"><button class="primary">Close</button></form>`;
  app.append(dialog);dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();
}
if(embedded){
  document.body.classList.add('embedded');render(currentScreen,false);
  window.addEventListener('message',event=>{if(event.origin===location.origin&&event.source===window.parent&&event.data?.type==='oca-navigate'&&screenNames[event.data.screen])render(event.data.screen);});
  app.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.go){if(currentScreen==='person'&&target.dataset.go==='record')draft='';if(currentScreen==='record')draft=document.querySelector('#typed-note').value;render(target.dataset.go);return;}
    if(target.dataset.person){selectedPerson=people.find(p=>p.name===target.dataset.person);render('person');return;}
    if(target.dataset.source!==undefined){sourceDialog(Number(target.dataset.source));return;}
    if(target.dataset.filter){app.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===target);b.setAttribute('aria-pressed',String(b===target));});filterPeople();return;}
    if(target.dataset.reminder){app.querySelectorAll('[data-reminder]').forEach(b=>{b.classList.toggle('active',b===target);b.setAttribute('aria-pressed',String(b===target));});document.querySelector('#reminder-list').innerHTML=target.dataset.reminder==='past'?'<div class="app-card"><h3>Coffee with Maya</h3><p>September 3, 10:00 am</p><p>She started a pottery class on Saturday mornings.</p></div>':`<div class="section-row"><h2>Today</h2><small>September 5</small></div>${eventCard()}<div class="app-card reminder-card"><h3>Anyone you met today?</h3><p>Tonight, ${escapeHTML(settings.time)}</p>${navButton('settings','Change nightly prompt','text-button')}</div>`;return;}
    if(target.id==='record-toggle'){
      recording=!recording;target.innerHTML=icon(recording?'pause':'mic');target.setAttribute('aria-label',recording?'Pause sample recording':'Resume sample recording');
      document.querySelector('#record-stop').hidden=false;document.querySelector('#waveform').classList.toggle('live',recording);
      document.querySelector('#record-hint').textContent=recording?'Playing the recording interaction with a sample note.':'Sample recording paused.';
      clearInterval(recordingTimer);
      if(recording)recordingTimer=setInterval(()=>{seconds++;document.querySelector('#record-time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;if(seconds>=90)startReview();},1000);
    }
    if(target.id==='record-stop'||target.id==='review-note')startReview();
    if(target.id==='save-memory'){
      const values=[...app.querySelectorAll('[data-fact]')].map(t=>t.value.trim());
      if(values.some(v=>!v)){showToast('Fill in each detail before saving.');app.querySelectorAll('[data-fact]')[values.indexOf('')].focus();return;}
      reviewItems.forEach((item,i)=>{item[2]=values[i];});
      if(reviewItems.length===1&&reviewItems[0][1]==='Your note')selectedPerson.facts.push([...reviewItems[0]]);else selectedPerson.facts=reviewItems.map(item=>[...item]);
      selectedPerson.date='Today';render('person');showToast('Memory saved in this preview.');
    }
  });
  function filterPeople(){const query=document.querySelector('#people-search').value.toLowerCase();const recent=app.querySelector('[data-filter="recent"]').classList.contains('active');const result=people.filter((p,i)=>(!recent||i<3)&&`${p.name} ${p.detail}`.toLowerCase().includes(query));document.querySelector('#people-results').innerHTML=result.map(personRow).join('')||'<p class="empty-state" role="status">No matches. Try another name or detail.</p>';}
  app.addEventListener('input',event=>{if(event.target.id==='people-search')filterPeople();});
  app.addEventListener('change',event=>{if(event.target.dataset.setting){settings[event.target.dataset.setting]=event.target.checked;showToast('Preference updated in this preview.');}if(event.target.id==='reminder-time'&&event.target.value){settings.time=event.target.value;showToast('Reminder time updated in this preview.');}});
}else{
  const interactive=params.get('mode')==='interactive';
  app.innerHTML=`<header class="board-header"><div><a class="board-brand" href="index.html">${logo} One Call Away</a><p>Android frontend · Interactive design concept</p></div><nav class="board-actions" aria-label="Prototype view"><a href="index.html">Back to website</a><a href="mockup.html" class="${!interactive?'active':''}">All 8 screens</a><a href="mockup.html?mode=interactive&screen=welcome" class="${interactive?'active':''}">Try the flow ${icon('arrow')}</a></nav></header><div class="board-intro"><h1>Small details. Thoughtfully kept.</h1><p>${interactive?'Try recording a sample note, edit the details, and save it to a person. This is a browser prototype with sample data; it does not record audio or connect to your calendar.':'Eight connected screens for a quieter kind of relationship app. Explore each screen below, or open “Try the flow” to walk through the complete experience.'}</p></div>${interactive?`<div class="prototype-layout"><aside class="screen-picker" aria-label="Choose a screen">${Object.entries(screenNames).map(([id,name])=>`<button data-screen="${id}" class="${id===currentScreen?'active':''}">${name}</button>`).join('')}<small>Forest green, soft neutral surfaces, and a little color where it helps.</small></aside><div class="device"><iframe id="interactive-frame" src="mockup.html?embed=1&screen=${currentScreen}" title="Interactive One Call Away Android prototype"></iframe></div></div>`:`<div class="screen-grid">${Object.entries(screenNames).map(([id,name],i)=>`<section class="screen-item"><h2><span>${String(i+1).padStart(2,'0')} / ${name}</span><a href="mockup.html?mode=interactive&screen=${id}" aria-label="Open ${name} in interactive view">Open ↗</a></h2><div class="device"><iframe src="mockup.html?embed=1&screen=${id}" title="${name} Android mockup" loading="lazy"></iframe></div></section>`).join('')}</div>`}`;
  app.addEventListener('click',event=>{const button=event.target.closest('[data-screen]');if(button){document.querySelector('#interactive-frame').contentWindow.postMessage({type:'oca-navigate',screen:button.dataset.screen},location.origin);}});
  window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==document.querySelector('#interactive-frame')?.contentWindow||event.data?.type!=='oca-screen')return;app.querySelectorAll('[data-screen]').forEach(button=>button.classList.toggle('active',button.dataset.screen===event.data.screen));});
}
