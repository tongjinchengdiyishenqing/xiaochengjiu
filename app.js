// ==================== CONSTANTS ====================
// Read bucket from HTML data attribute, fallback to default
const KVDB_BUCKET=typeof KVB!=='undefined'?KVB:(document.currentScript.dataset.bucket||'6motzc9fYAADYrSLwYtqKQ');
const THEMES=[
  {id:'purple',name:'暗夜紫',preview:'linear-gradient(135deg,#8B5CF6,#6D28D9)',css:{'--bg':'#09090B','--bg1':'#18181B','--bg2':'#27272A','--bg3':'#3F3F46','--ink1':'#FAFAFA','--ink2':'#A1A1AA','--ink3':'#71717A','--ac':'#8B5CF6','--ac2':'#6D28D9','--ac3':'#A78BFA'}},
  {id:'ocean',name:'深海蓝',preview:'linear-gradient(135deg,#0EA5E9,#0369A1)',css:{'--bg':'#020617','--bg1':'#0F172A','--bg2':'#1E3A5F','--bg3':'#334155','--ink1':'#F0F9FF','--ink2':'#7DD3FC','--ink3':'#38BDF8','--ac':'#0EA5E9','--ac2':'#0369A1','--ac3':'#38BDF8'}},
  {id:'forest',name:'翡翠绿',preview:'linear-gradient(135deg,#10B981,#047857)',css:{'--bg':'#022c22','--bg1':'#064E3B','--bg2':'#065F46','--bg3':'#047857','--ink1':'#ECFDF5','--ink2':'#A7F3D0','--ink3':'#6EE7B7','--ac':'#10B981','--ac2':'#047857','--ac3':'#34D399'}},
  {id:'sunset',name:'琥珀金',preview:'linear-gradient(135deg,#F59E0B,#B45309)',css:{'--bg':'#1C1206','--bg1':'#2D1E0A','--bg2':'#451A03','--bg3':'#78350F','--ink1':'#FFFBEB','--ink2':'#FDE68A','--ink3':'#FCD34D','--ac':'#F59E0B','--ac2':'#B45309','--ac3':'#FBBF24'}},
  {id:'rose',name:'玫瑰红',preview:'linear-gradient(135deg,#FB7185,#BE123C)',css:{'--bg':'#1C0A10','--bg1':'#2D1018','--bg2':'#4C0519','--bg3':'#881337','--ink1':'#FFF1F2','--ink2':'#FECDD3','--ink3':'#FDA4AF','--ac':'#FB7185','--ac2':'#BE123C','--ac3':'#FDA4AF'}},
  {id:'light',name:'明亮白',preview:'linear-gradient(135deg,#F1F5F9,#CBD5E1)',isLight:true,css:{'--bg':'#F1F5F9','--bg1':'#FFFFFF','--bg2':'#E2E8F0','--bg3':'#CBD5E1','--ink1':'#0F172A','--ink2':'#64748B','--ink3':'#94A3B8','--ac':'#7C3AED','--ac2':'#5B21B6','--ac3':'#8B5CF6'}},
];
const AVATARS=['🐱','🐶','🦊','🐼','🐨','🐯','🦁','🐸','🐙','🦄','🐲','👽','🤖','👻','🎃','💀'];
const CATS=[
  {id:'work',label:'工作',icon:'💼',c:'#8B5CF6'},
  {id:'study',label:'学习',icon:'📖',c:'#3B82F6'},
  {id:'life',label:'生活',icon:'🏠',c:'#F59E0B'},
  {id:'health',label:'健康',icon:'💪',c:'#10B981'},
  {id:'social',label:'社交',icon:'👥',c:'#EC4899'},
  {id:'creative',label:'创意',icon:'🎨',c:'#F97316'},
  {id:'finance',label:'理财',icon:'💰',c:'#14B8A6'},
  {id:'read',label:'阅读',icon:'📚',c:'#6366F1'},
];
const LEVELS=[0,100,233,416,662,994,1442,2046,2862,3964,5452,7460,10172,13834,18776,25548,34690,47034,63696,86200];
function lvStartXp(lv){if(lv<=1)return 0;if(lv<=LEVELS.length)return LEVELS[lv-1];const lastGap=LEVELS[LEVELS.length-1]-LEVELS[LEVELS.length-2];let xp=LEVELS[LEVELS.length-1];for(let i=LEVELS.length+1;i<=lv;i++)xp+=Math.round(lastGap*Math.pow(1.35,i-LEVELS.length));return xp}
function lvEndXp(lv){return lvStartXp(lv+1)}
function getLv(xp){for(let i=LEVELS.length-1;i>=0;i--)if(xp>=LEVELS[i])return i+1;let lv=LEVELS.length+1;while(lvEndXp(lv-1)<=xp)lv++;return lv}
function nextLvXp(xp){return lvEndXp(getLv(xp))}
function lvThisNeed(lv){return lvEndXp(lv)-lvStartXp(lv)}
const SYS_BADGES=[
  {id:'first',name:'初出茅庐',icon:'🌱',desc:'完成第一个任务',t:1,condition:'累计完成 1 个任务'},
  {id:'five',name:'效率新星',icon:'⚡',desc:'累计完成 5 个任务',t:5,condition:'累计完成 5 个任务'},
  {id:'ten',name:'任务达人',icon:'🔥',desc:'累计完成 10 个任务',t:10,condition:'累计完成 10 个任务'},
  {id:'twentyfive',name:'执行大师',icon:'💎',desc:'累计完成 25 个任务',t:25,condition:'累计完成 25 个任务'},
  {id:'fifty',name:'传奇人物',icon:'👑',desc:'累计完成 50 个任务',t:50,condition:'累计完成 50 个任务'},
  {id:'s3',name:'三日连胜',icon:'🔥',desc:'连续 3 天完成任务',streak:3,condition:'连续打卡 3 天'},
  {id:'s7',name:'一周不败',icon:'🌟',desc:'连续 7 天完成任务',streak:7,condition:'连续打卡 7 天'},
  {id:'s14',name:'两周坚持',icon:'💫',desc:'连续 14 天完成任务',streak:14,condition:'连续打卡 14 天'},
  {id:'s30',name:'月度冠军',icon:'🏅',desc:'连续 30 天完成任务',streak:30,condition:'连续打卡 30 天'},
  {id:'lv5',name:'等级突破',icon:'🆙',desc:'达到等级 5',lv:5,condition:'达到等级 5'},
  {id:'lv10',name:'登峰造极',icon:'🚀',desc:'达到等级 10',lv:10,condition:'达到等级 10'},
  {id:'hundred',name:'百任务大师',icon:'💯',desc:'累计完成 100 个任务',t:100,condition:'累计完成 100 个任务'},
  {id:'rich',name:'百万富翁',icon:'💰',desc:'累计获得 1000 XP',xp:1000,condition:'累计获得 1000 XP'},
  {id:'collector',name:'收藏家',icon:'🎖️',desc:'解锁 8 个徽章',badges:8,condition:'解锁 8 个徽章'},
  {id:'hidden_master',name:'隐藏大师',icon:'🎭',desc:'发现隐藏徽章',hidden:true,badges:15,condition:'???'},
  {id:'s60',name:'两月铁人',icon:'🏆',desc:'连续 60 天完成任务',streak:60,condition:'连续打卡 60 天'},
  {id:'s90',name:'季度传奇',icon:'🔥',desc:'连续 90 天完成任务',streak:90,condition:'连续打卡 90 天'},
  {id:'s365',name:'全年不辍',icon:'🌟',desc:'连续 365 天完成任务',streak:365,condition:'连续打卡 365 天'},
  {id:'twohundred',name:'双百精英',icon:'🔥',desc:'累计完成 200 个任务',t:200,condition:'累计完成 200 个任务'},
  {id:'fivehundred',name:'五百任务王',icon:'👑',desc:'累计完成 500 个任务',t:500,condition:'累计完成 500 个任务'},
  {id:'lv15',name:'超凡入圣',icon:'⚡',desc:'达到等级 15',lv:15,condition:'达到等级 15'},
  {id:'lv20',name:'登峰造极',icon:'🚀',desc:'达到等级 20',lv:20,condition:'达到等级 20'},
  {id:'xp5k',name:'经验大师',icon:'💎',desc:'累计获得 5000 XP',xp:5000,condition:'累计获得 5000 XP'},
  {id:'xp10k',name:'万点经验',icon:'✨',desc:'累计获得 10000 XP',xp:10000,condition:'累计获得 10000 XP'},
  {id:'badge15',name:'徽章猎人',icon:'🎯',desc:'解锁 15 个徽章',badges:15,condition:'解锁 15 个徽章'},
  {id:'badge20',name:'全能收藏家',icon:'🎪',desc:'解锁 20 个徽章',badges:20,condition:'解锁 20 个徽章'},
  {id:'thousand',name:'千任务传说',icon:'🏆',desc:'累计完成 1000 个任务',t:1000,condition:'累计完成 1000 个任务'},
  {id:'hidden_perfect',name:'完美主义',icon:'🔮',desc:'解锁所有徽章',hidden:true,badges:25,condition:'???'},
];

// ==================== DATA (kvdb only, no localStorage) ====================
// Strategy: cloud-first, no local cache
// Upload: read cloud _ver first → merge local changes → write back
// Download: poll every 1s, always apply if newer
// Upload triggers immediate re-download to catch merge conflicts
let ud=defaultData();
const BC=new BroadcastChannel('xcj_sync_'+location.pathname.split('/').pop().replace('.html',''));
let _saveTimer=null;
let _uploading=false;
let _lastCloudVer=0;
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function today_fmt(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function defaultData(){return{tasks:[],xp:0,totalCompleted:0,streak:0,maxStreak:0,badges:[],customBadges:[],dailyLog:{},lastActive:null,profile:{name:'我',avatar:'🐱'},dock:['today','calendar','history','badges','goals'],routines:[],goals:[],goalLogs:{},lastRoutineGen:null,theme:'purple',createdAt:today(),trackStats:{},_v:3}}
function mergeData(d){
  const def=defaultData();
  return{...def,...d,profile:{...def.profile,...(d.profile||{})},dock:d.dock||def.dock,routines:d.routines||[],goals:d.goals||[],goalLogs:d.goalLogs||{},lastRoutineGen:d.lastRoutineGen||null,theme:d.theme||'purple',trackStats:d.trackStats||{},_v:3};
}
// ==================== TRACK RULES (auto-extract stats from task titles) ====================
const TRACK_RULES=[
  {key:'words',label:'背单词',icon:'📖',unit:'个',patterns:[/背了?\s*(\d+)\s*个?\s*.*?单词/,/(\d+)\s*个?\s*.*?单词/,/单词\s*(\d+)/]},
  {key:'book',label:'读书',icon:'📚',unit:'页',patterns:[/看了?\s*(\d+)\s*页/,/读了?\s*(\d+)\s*页/,/(\d+)\s*页.*书/]},
  {key:'write',label:'写作',icon:'✍️',unit:'字',patterns:[/写了?\s*(\d+)\s*字/,/(\d+)\s*字/]},
  {key:'save',label:'存钱',icon:'💰',unit:'元',patterns:[/存了?\s*(\d+)\s*[块元]/,/存钱\s*(\d+)/,/存\s*(\d+)\s*[块元]/]},
  {key:'exercise',label:'运动',icon:'💪',unit:'分钟',patterns:[/运动了?\s*(\d+)\s*分[钟]/,/锻炼了?\s*(\d+)\s*分[钟]/,/(\d+)\s*分[钟].*[运动锻炼]/]},
  {key:'pushup',label:'俯卧撑',icon:'🏋️',unit:'个',patterns:[/(\d+)\s*个?\s*俯卧撑/,/俯卧撑\s*(\d+)/]},
  {key:'run',label:'跑步',icon:'🏃',unit:'km',patterns:[/跑了?\s*(\d+)\s*公?里/,/跑步\s*(\d+)/,/(\d+)\s*km/i]},
  {key:'water',label:'喝水',icon:'💧',unit:'杯',patterns:[/喝[了]?\s*(\d+)\s*[杯次]/,/(\d+)\s*杯.*水/]},
  {key:'meditate',label:'冥想',icon:'🧘',unit:'分钟',patterns:[/冥想[了]?\s*(\d+)\s*分[钟]/,/(\d+)\s*分[钟].*冥想/]},
  {key:'squat',label:'深蹲',icon:'🦵',unit:'个',patterns:[/(\d+)\s*个?\s*深蹲/,/深蹲\s*(\d+)/]},
  {key:'read_time',label:'阅读时长',icon:'⏱️',unit:'分钟',patterns:[/看了?\s*(\d+)\s*分[钟].*[书读]/,/读了?\s*(\d+)\s*分[钟]/,/阅读\s*(\d+)\s*分[钟]/]},
];
function extractTrack(title){
  const results=[];
  for(const rule of TRACK_RULES){
    for(const pat of rule.patterns){
      const m=title.match(pat);
      if(m){
        const val=parseInt(m[1]);
        if(val>0){results.push({key:rule.key,val:val});break}
      }
    }
  }
  return results;
}
function applyTrack(task,isComplete){
  if(isComplete){
    const extracted=extractTrack(task.title||'');
    if(extracted.length>0){
      task._tracked=extracted;
      extracted.forEach(e=>{
        ud.trackStats[e.key]=(ud.trackStats[e.key]||0)+e.val;
      });
    }
  }else{
    if(task._tracked&&Array.isArray(task._tracked)){
      task._tracked.forEach(e=>{
        ud.trackStats[e.key]=Math.max(0,(ud.trackStats[e.key]||0)-e.val);
      });
    }
  }
}
async function kvUpload(){
  if(_uploading)return;
  _uploading=true;
  try{
    // PROTECTION: Don't upload if local is empty but cloud might have data
    if(ud.tasks.length===0){
      // Check cloud first
      try{
        const cr=await fetch('https://kvdb.io/'+KVDB_BUCKET+'/data?_='+Date.now());
        if(cr.ok){
          const text=await cr.text();
          if(text){
            const cd=JSON.parse(text);
            if(cd&&Array.isArray(cd.tasks)&&cd.tasks.length>0){
              // Cloud has data! Don't overwrite. Download instead.
              ud=mergeData(cd);
              _lastCloudVer=Math.max(cd._ver||0,Date.now());
              renderAll();renderDock();
              _showSync('fail','本地为空已从云端恢复');
              _uploading=false;
              return;
            }
          }
        }
      }catch(e){}
    }
    const toSave={...ud,_ver:Date.now()};
    const r=await fetch('https://kvdb.io/'+KVDB_BUCKET+'/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(toSave)});
    if(r.ok){
      _lastCloudVer=toSave._ver;
      _showSync('ok','↑ '+toSave.tasks.length+'任务');
    }else{_showSync('fail','↑失败 HTTP'+r.status)}
  }catch(e){_showSync('fail','↑错误: '+e.message)}
  _uploading=false;
}
let _rateLimitReset=0;
async function kvDownload(){
  // If rate limited, wait until reset time
  if(_rateLimitReset>0){
    if(Date.now()<_rateLimitReset)return;
    _rateLimitReset=0;
  }
  try{
    const r=await fetch('https://kvdb.io/'+KVDB_BUCKET+'/data?_='+Date.now());
    if(!r.ok){
      if(r.status===429){
        const reset=r.headers.get('x-ratelimit-reset');
        _rateLimitReset=reset?parseInt(reset)*1000:Date.now()+30000;
        const wait=Math.max(0,Math.ceil((_rateLimitReset-Date.now())/1000));
        _showSync('fail','限流，'+wait+'秒后自动恢复');
        // Schedule retry after reset
        setTimeout(kvDownload,Math.min(wait*1000,60000));
        return;
      }
      return;
    }
    const text=await r.text();
    if(!text)return;
    const cloud=JSON.parse(text);
    if(!cloud||!Array.isArray(cloud.tasks))return;
    if(cloud._ver!==undefined&&cloud._ver<=_lastCloudVer)return;
    ud=mergeData(cloud);
    _lastCloudVer=Math.max(cloud._ver||0,Date.now());
    applyTheme(ud.theme||'purple');
    renderAll();renderDock();
    _showSync('ok','↓ '+ud.tasks.length+'任务');
  }catch(e){}
}
function _showSync(status,msg){
  const d=document.getElementById('_syncDot');
  const s=document.getElementById('_syncStatus');
  if(d){
    d.style.display='inline-block';d.style.width='8px';d.style.height='8px';d.style.borderRadius='50%';d.style.marginLeft='6px';
    d.style.background=status==='ok'?'#22C55E':'#EF4444';
    d.title=status==='ok'?'已同步':'同步失败(点击重试)';
    if(status==='ok')setTimeout(()=>{if(d)d.style.display='none'},1500);
  }
  if(s)s.textContent=msg||'';
}
async function manualSync(){
  const dot=document.getElementById('_syncDot');
  if(dot){dot.style.display='inline-block';dot.style.background='#FACC15';dot.title='同步中...';dot.style.width='8px';dot.style.height='8px';dot.style.borderRadius='50%';dot.style.marginLeft='6px'}
  await kvUpload();
  await kvDownload();
  if(!document.getElementById('_syncDot').style.background.includes('EF4444'))_showSync('ok');
}
function saveData(){
  BC.postMessage(JSON.stringify(ud));
  clearTimeout(_saveTimer);
  _saveTimer=setTimeout(kvUpload,200);
}
// Poll every 5s to avoid kvdb 429 rate limit
setInterval(kvDownload,5000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')kvDownload()});
window.addEventListener('beforeunload',()=>{clearTimeout(_saveTimer);if(!_uploading)kvUpload()});
BC.onmessage=e=>{try{const d=JSON.parse(e.data);if(d&&Array.isArray(d.tasks)){ud=mergeData(d);applyTheme(ud.theme||'purple');renderAll();renderDock()}}catch(e){}};

function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
const td=today();
if(ud.lastActive&&ud.lastActive!==td){
  const diff=Math.floor((new Date(td)-new Date(ud.lastActive))/86400000);
  if(diff>1)ud.streak=0;
}

// ==================== TASK CRUD ====================
function addTask(title,cat,time,pri,date){
  const d=date||td;
  ud.tasks.push({id:Date.now()+Math.random(),title:title.trim(),category:cat||'work',time:time||'',priority:pri||'mid',completed:false,createdAt:d,completedAt:null,linkedGoal:null});
  saveData();renderAll();
}
function toggleTask(id){
  const t=ud.tasks.find(t=>t.id===id);if(!t)return;
  t.completed=!t.completed;t.completedAt=t.completed?new Date().toISOString():null;
  if(t.completed){
    ud.xp+=10;ud.totalCompleted++;
    if(!ud.dailyLog[td])ud.dailyLog[td]={completed:0,total:0};
    ud.dailyLog[td].completed++;
    if(ud.lastActive!==td){
      const last=ud.lastActive?new Date(ud.lastActive):null;
      if(!last)ud.streak=1;else{const diff=Math.floor((new Date(td)-last)/86400000);ud.streak=diff===1?ud.streak+1:1}
    }
    ud.lastActive=td;if(ud.streak>ud.maxStreak)ud.maxStreak=ud.streak;
    applyTrack(t,true);
    const el=document.querySelector('[data-tid="'+id+'"] .chk');
    if(el){const r=el.getBoundingClientRect();spawnCfx(r.left+r.width/2,r.top+r.height/2);xpPop(r.left+r.width/2,r.top)}
    checkBadges();
  }else{
    ud.xp=Math.max(0,ud.xp-20);ud.totalCompleted=Math.max(0,ud.totalCompleted-1);
    if(ud.dailyLog[td])ud.dailyLog[td].completed=Math.max(0,ud.dailyLog[td].completed-1);
    applyTrack(t,false);
  }
  saveData();renderAll();
}
function delTask(id){ud.tasks=ud.tasks.filter(t=>t.id!==id);closeDetail();saveData();renderAll()}
function updTask(id,o){const t=ud.tasks.find(t=>t.id===id);if(t)Object.assign(t,o);saveData();renderAll()}
function genRoutineTasks(){
  if(ud.lastRoutineGen===td)return;
  let added=false;
  (ud.routines||[]).forEach(r=>{
    const exists=ud.tasks.some(t=>t.createdAt===td&&t.fromRoutine===r.id);
    if(!exists){
      ud.tasks.push({id:Date.now()+Math.random(),title:r.title,category:r.category||'work',time:r.time||'',priority:r.priority||'mid',completed:false,createdAt:td,completedAt:null,fromRoutine:r.id});
      added=true;
    }
  });
  ud.lastRoutineGen=td;
  if(added)saveData();
}
function rebuildTrackStats(){
  // Recalculate trackStats from all completed tasks
  ud.trackStats={};
  let changed=false;
  ud.tasks.forEach(t=>{
    if(t.completed){
      const extracted=extractTrack(t.title||'');
      if(extracted.length>0){
        // Check if task was already tracked with same values
        if(!t._tracked||JSON.stringify(t._tracked)!==JSON.stringify(extracted)){
          t._tracked=extracted;
          changed=true;
        }
        extracted.forEach(e=>{
          ud.trackStats[e.key]=(ud.trackStats[e.key]||0)+e.val;
        });
      }
    }
  });
  if(changed)saveData();
}

// ==================== BADGES ====================
function checkBadges(){
  SYS_BADGES.forEach(b=>{
    if(ud.badges.includes(b.id))return;
    let ok=false;
    if(b.t&&ud.totalCompleted>=b.t)ok=true;
    if(b.streak&&ud.streak>=b.streak)ok=true;
    if(b.lv&&getLv(ud.xp)>=b.lv)ok=true;
    if(b.xp&&ud.xp>=b.xp)ok=true;
    if(b.badges&&ud.badges.length>=b.badges)ok=true;
    if(ok){ud.badges.push(b.id);saveData();showBadgeModal(b)}
  });
  (ud.customBadges||[]).forEach(b=>{
    if(ud.badges.includes('c_'+b.id))return;
    if(ud.totalCompleted>=b.target){ud.badges.push('c_'+b.id);saveData();showBadgeModal({name:b.name,icon:b.icon,desc:b.desc})}
  });
}

// ==================== RENDER ====================
let _calOpenDs=null;
function renderAll(){
  renderHeader();renderSidebar();renderToday();renderTimeline();renderCalendar();renderHistory();renderBadges();renderStats();renderGoals();
  if(_calOpenDs)showCalDay(_calOpenDs);
}
function renderHeader(){
  const lv=getLv(ud.xp),nx=nextLvXp(ud.xp),cx=lvStartXp(lv),pct=Math.min(100,((ud.xp-cx)/(nx-cx))*100);
  const need=Math.max(0,nx-ud.xp);
  const p=ud.profile||{name:'我',avatar:'🐱'};
  const $=id=>document.getElementById(id);
  if($('mobName'))$('mobName').textContent=p.name;
  if($('mobAvatar'))$('mobAvatar').textContent=p.avatar;
  if($('mobLv'))$('mobLv').textContent=lv;
  if($('mobXpBar'))$('mobXpBar').style.width=pct+'%';
  if($('mobXpText'))$('mobXpText').textContent=ud.xp+'/'+nx;
  if($('deskName'))$('deskName').textContent=p.name;
  if($('deskAvatar'))$('deskAvatar').textContent=p.avatar;
  if($('deskLv'))$('deskLv').textContent=lv;
  if($('deskXp'))$('deskXp').textContent=ud.xp+'/'+nx+' XP';
  if($('deskXpBar'))$('deskXpBar').style.width=pct+'%';
  if($('menuName'))$('menuName').textContent=p.name;
  if($('menuAvatar'))$('menuAvatar').textContent=p.avatar;
  if($('menuLv'))$('menuLv').textContent='Lv.'+lv+' · 还需'+need+' XP';
}
function renderSidebar(){
  const tTasks=ud.tasks.filter(t=>t.createdAt===td),done=tTasks.filter(t=>t.completed).length;
  document.querySelectorAll('.dc-done').forEach(el=>el.textContent=done);
  document.querySelectorAll('.dc-total').forEach(el=>el.textContent=tTasks.length);
  document.querySelectorAll('.dc-bar').forEach(el=>el.style.width=tTasks.length?(done/tTasks.length*100)+'%':'0%');
}
let _todayViewDate=null;
function getTodayViewDate(){return _todayViewDate||td}
function switchTodayView(v){if(!v)return;_todayViewDate=v;renderToday()}
function todayViewPrev(){const d=new Date(getTodayViewDate()+'T12:00:00');d.setDate(d.getDate()-1);switchTodayView(fmtDate(d))}
function todayViewNext(){const d=new Date(getTodayViewDate()+'T12:00:00');d.setDate(d.getDate()+1);switchTodayView(fmtDate(d))}
function fmtDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function resetTodayView(){_todayViewDate=null;renderToday()}
function renderToday(){
  const viewDate=getTodayViewDate();
  const f=document.getElementById('fCat').value,s=document.getElementById('fSort').value;
  const vd=viewDate===td;
  if(document.getElementById('todayViewDate').value!==viewDate)document.getElementById('todayViewDate').value=viewDate;
  const pl=document.getElementById('todayProgLabel');
  if(pl)pl.textContent=vd?'今日进度':viewDate+' 进度';
  const allToday=ud.tasks.filter(t=>t.createdAt===viewDate);
  const doneAll=allToday.filter(t=>t.completed).length;
  const pt=document.getElementById('todayProgText'),pb=document.getElementById('todayProgBar');
  if(pt)pt.textContent=doneAll+' / '+allToday.length;
  if(pb)pb.style.width=allToday.length?(doneAll/allToday.length*100)+'%':'0%';
  let tasks=allToday;
  if(f!=='all')tasks=tasks.filter(t=>t.category===f);
  if(s==='time')tasks.sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99'));
  if(s==='pri'){const p={high:0,mid:1,low:2};tasks.sort((a,b)=>p[a.priority]-p[b.priority])}
  const list=document.getElementById('taskList'),empty=document.getElementById('emptyToday');
  if(!tasks.length){list.innerHTML='';empty.classList.remove('hidden');return}
  empty.classList.add('hidden');
  list.innerHTML=tasks.map(t=>{
    const c=CATS.find(x=>x.id===t.category)||CATS[0];
    const pc={high:'text-red-400',mid:'text-yellow-400',low:'text-gray-500'};
    const routineTag=t.fromRoutine?'<span class="text-[10px] bg-[#27272A] text-gray-400 px-1.5 py-0.5 rounded ml-1.5">例行</span>':'';
    return '<div class="task-enter group flex items-center gap-3 px-3 py-3 rounded-xl bg-[#18181B] hover:bg-[#27272A] active:bg-[#27272A] cursor-pointer '+(t.completed?'opacity-40':'')+'" data-tid="'+t.id+'" onclick="openDetail('+t.id+')">'+
      '<button class="chk w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center '+(t.completed?'bg-[#8B5CF6] border-[#8B5CF6]':'border-[#3F3F46]')+'" onclick="event.stopPropagation();toggleTask('+t.id+')">'+(t.completed?'<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>':'')+'</button>'+
      '<div class="flex-1 min-w-0"><div class="text-sm '+(t.completed?'line-through text-gray-500':'text-white')+' truncate">'+t.title+'</div>'+
      '<div class="flex items-center gap-2 mt-0.5"><span class="text-xs text-gray-500">'+c.icon+' '+c.label+'</span>'+(t.time?'<span class="text-xs text-gray-500">'+t.time+'</span>':'')+'<span class="text-xs '+pc[t.priority]+'">'+(t.priority==='high'?'高':t.priority==='mid'?'中':'低')+'</span>'+routineTag+'</div></div>'+
      (t.completed?'<span class="text-xs font-bold flex-shrink-0" style="color:var(--ac)">+10</span>':'')+
      '<button class="opacity-0 group-hover:opacity-100 md:opacity-0 text-gray-500 active:!opacity-100 hover:text-red-400 text-xs flex-shrink-0 p-1" onclick="event.stopPropagation();delTask('+t.id+')">✕</button></div>';
  }).join('');
}
function renderTimeline(){
  const tasks=ud.tasks.filter(t=>t.createdAt===td&&t.time).sort((a,b)=>a.time.localeCompare(b.time));
  const c=document.getElementById('tlList'),e=document.getElementById('emptyTL');
  if(!tasks.length){c.innerHTML='';c.style.display='none';e.classList.remove('hidden');return}
  e.classList.add('hidden');c.style.display='block';
  c.innerHTML='<div class="absolute left-[9px] top-2 bottom-2 w-px bg-[#3F3F46]"></div>'+tasks.map(t=>{
    const cat=CATS.find(x=>x.id===t.category)||CATS[0];
    return '<div class="relative pl-5 pb-5"><button class="absolute left-0 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center '+(t.completed?'bg-[#8B5CF6] border-[#8B5CF6]':'border-[#3F3F46]')+'" onclick="toggleTask('+t.id+')">'+(t.completed?'<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>':'')+'</button>'+
    '<div class="bg-[#18181B] rounded-lg px-3 py-2 '+(t.completed?'opacity-40':'')+'"><div class="flex items-center justify-between"><span class="text-sm '+(t.completed?'line-through text-gray-500':'text-white')+'">'+t.title+'</span><span class="text-xs font-mono" style="color:var(--ac)">'+t.time+'</span></div><span class="text-xs text-gray-500">'+cat.icon+' '+cat.label+'</span></div></div>';
  }).join('');
}
let calYear=new Date().getFullYear(),calMonth=new Date().getMonth();
function renderCalendar(){
  const y=calYear,m=calMonth;
  document.getElementById('calMonth').textContent=y+'年'+(m+1)+'月';
  const first=new Date(y,m,1),start=first.getDay(),days=new Date(y,m+1,0).getDate();
  let html='';
  for(let i=0;i<start;i++)html+='<div></div>';
  const tdy=td;
  for(let d=1;d<=days;d++){
    const ds=String(y)+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const dayTasks=ud.tasks.filter(t=>t.createdAt===ds);
    const done=dayTasks.filter(t=>t.completed).length;
    const isToday=ds===tdy;
    const isSelected=ds===_calOpenDs;
    let cls='aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs relative ';
    if(isToday&&isSelected)cls+='ring-2 ring-offset-1 ring-offset-[var(--bg)] bg-[var(--ac)] text-white';
    else if(isToday)cls+='bg-[var(--ac)] text-white font-bold shadow-lg';
    else if(isSelected)cls+='ring-2 ring-[var(--ac)] bg-[var(--ac)]/15';
    else cls+='bg-[#18181B] hover:bg-[#27272A]';
    html+='<button onclick="showCalDay(\''+ds+'\')" class="'+cls+'">'+
      '<span class="'+(isToday?'text-white font-bold':'text-gray-400')+'">'+d+'</span>'+
      (dayTasks.length?'<div class="flex gap-0.5"><div class="w-1 h-1 rounded-full '+(done>0?'bg-[#8B5CF6]':'bg-[#3F3F46]')+'"></div>'+(dayTasks.length>1?'<div class="w-1 h-1 rounded-full bg-[#3F3F46]"></div>':'')+'</div>':'')+
    '</button>';
  }
  document.getElementById('calGrid').innerHTML=html;
}
function changeMonth(d){calMonth+=d;if(calMonth>11){calMonth=0;calYear++}if(calMonth<0){calMonth=11;calYear--}renderCalendar()}
function showCalDay(ds){
  _calOpenDs=ds;
  const tasks=ud.tasks.filter(t=>t.createdAt===ds);
  const el=document.getElementById('calDetail');
  el.classList.remove('hidden');
  if(!tasks.length){
    el.innerHTML='<div class="bg-[#18181B] rounded-xl p-4 mt-2 text-center">'+
      '<div class="text-xs text-gray-500 mb-3">'+ds+(ds===td?' (今天)':'')+'</div>'+
      '<div class="text-3xl mb-2">📋</div><p class="text-gray-500 text-sm mb-3">该日期暂无任务</p>'+
      '<div class="flex gap-2 justify-center"><button onclick="quickAddToDay(\''+ds+'\')" class="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg text-xs font-bold">添加任务</button><button onclick="_calOpenDs=null;document.getElementById(\'calDetail\').classList.add(\'hidden\')" class="bg-[#27272A] text-gray-400 px-4 py-2 rounded-lg text-xs">收起</button></div></div>';
    return;
  }
  el.innerHTML='<div class="bg-[#18181B] rounded-xl p-4 mt-2"><div class="flex items-center justify-between mb-2"><div class="text-xs text-gray-500">'+ds+(ds===td?' (今天)':'')+'</div><div class="flex gap-1"><button onclick="quickAddToDay(\''+ds+'\')" class="text-xs bg-[#27272A] text-gray-400 px-2 py-1 rounded hover:text-white">+ 添加</button><button onclick="_calOpenDs=null;document.getElementById(\'calDetail\').classList.add(\'hidden\')" class="text-xs text-gray-500 px-1 hover:text-white">✕</button></div></div>'+tasks.map(t=>{
    const c=CATS.find(x=>x.id===t.category)||CATS[0];
    return '<div class="group flex items-center gap-2 py-2 border-b border-[#27272A] last:border-0 cursor-pointer" onclick="openDetail('+t.id+')">'+
      '<button class="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center '+(t.completed?'bg-[#8B5CF6] border-[#8B5CF6]':'border-[#3F3F46]')+'" onclick="event.stopPropagation();toggleTask('+t.id+')">'+(t.completed?'<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>':'')+'</button>'+
      '<span class="text-sm '+(t.completed?'line-through text-gray-500':'text-white')+' flex-1 min-w-0 truncate">'+t.title+'</span>'+
      '<span class="text-xs text-gray-500 flex-shrink-0">'+c.icon+'</span>'+
      '<button class="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-xs flex-shrink-0 p-1" onclick="event.stopPropagation();delTask('+t.id+')">✕</button></div>';
  }).join('')+'</div>';
}
function renderHistory(){
  const ds=document.getElementById('histDate').value||td;
  const f=document.getElementById('histFilter').value;
  let tasks=ud.tasks.filter(t=>t.createdAt===ds);
  if(f==='completed')tasks=tasks.filter(t=>t.completed);
  if(f==='pending')tasks=tasks.filter(t=>!t.completed);
  const list=document.getElementById('histList'),empty=document.getElementById('emptyHist');
  if(!tasks.length){list.innerHTML='';empty.classList.remove('hidden');return}
  empty.classList.add('hidden');
  list.innerHTML=tasks.map(t=>{
    const c=CATS.find(x=>x.id===t.category)||CATS[0];
    return '<div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#18181B]"><span class="text-sm">'+(t.completed?'✅':'⭕')+'</span><span class="text-sm '+(t.completed?'line-through text-gray-500':'text-white')+'">'+t.title+'</span><span class="text-xs text-gray-500 ml-auto">'+c.icon+' '+c.label+'</span></div>';
  }).join('');
}
function renderBadges(){
  const SECTIONS=[
    {key:'task',label:'任务达人',icon:'📋',filter:b=>!!b.t},
    {key:'streak',label:'坚持不懈',icon:'🔥',filter:b=>!!b.streak},
    {key:'level',label:'等级突破',icon:'🆙',filter:b=>!!b.lv},
    {key:'xp',label:'经验积累',icon:'💎',filter:b=>!!b.xp},
    {key:'collector',label:'收藏成就',icon:'🎯',filter:b=>!!b.badges&&!b.hidden},
    {key:'hidden',label:'神秘徽章',icon:'🔮',filter:b=>!!b.hidden},
    {key:'custom',label:'自定义',icon:'✨',filter:b=>!b.sys},
  ];
  const container=document.getElementById('badgeSections');
  let html='';
  SECTIONS.forEach(sec=>{
    const badges=(sec.key==='custom'?(ud.customBadges||[]).map(b=>({...b,sys:false,id:'c_'+b.id})):SYS_BADGES).filter(sec.filter);
    if(!badges.length)return;
    const unlocked=badges.filter(b=>b.sys?ud.badges.includes(b.id):ud.badges.includes(b.id)).length;
    html+='<div class="mb-6"><div class="flex items-center gap-2 mb-3"><span class="text-sm">'+sec.icon+'</span><span class="text-sm font-semibold text-gray-300">'+sec.label+'</span><span class="text-[10px] text-gray-500">'+unlocked+' / '+badges.length+'</span></div><div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">';
    badges.forEach(b=>{
      const u=b.sys?ud.badges.includes(b.id):ud.badges.includes(b.id);
      const isHidden=!u&&b.hidden;
      const icon=isHidden?'❓':b.icon;
      const name=isHidden?'???':b.name;
      const cond=u?b.desc:(b.condition||b.desc);
      let progress='';
      if(!u&&!isHidden){
        let cur='',goal='',unit='';
        if(b.t){cur=ud.totalCompleted;goal=b.t;unit='个任务';}
        else if(b.streak){cur=ud.streak;goal=b.streak;unit='天连续打卡';}
        else if(b.lv){cur=getLv(ud.xp);goal=b.lv;unit='级';}
        else if(b.xp){cur=ud.xp;goal=b.xp;unit='XP 经验值';}
        else if(b.badges){cur=ud.badges.length;goal=b.badges;unit='个徽章';}
        if(goal){
          const pct=Math.min(100,Math.round(cur/goal*100));
          progress='<div class="text-[9px] text-gray-500 text-center mt-1 leading-tight">'+cond+'</div><div class="w-full h-1 bg-[#3F3F46] rounded-full mt-1 overflow-hidden"><div class="h-full rounded-full" style="width:'+pct+'%;background:var(--ac)"></div></div><div class="text-[9px] text-gray-600 mt-0.5">'+cur+' / '+goal+' '+unit+'</div>';
        }else{
          progress='<div class="text-[9px] text-gray-500 text-center mt-1 leading-tight">'+cond+'</div>';
        }
      }
      html+='<div class="flex flex-col items-center p-2 md:p-3 rounded-xl '+(u?'bg-[#18181B]':'bg-[#18181B]/50')+'">'+
        '<div class="text-2xl md:text-3xl mb-1 '+(u?'':'grayscale')+'">'+icon+'</div>'+
        '<div class="text-[11px] md:text-xs font-semibold '+(u?'text-white':'text-gray-500')+' text-center">'+name+'</div>'+
        (u?'<div class="text-[10px] mt-1" style="color:var(--ac)">✓ 已解锁</div>':'<div class="mt-1 w-full px-1">'+progress+'</div>')+
      '</div>';
    });
    html+='</div></div>';
  });
  container.innerHTML=html||'<div class="text-center py-16 text-gray-500 text-sm">暂无徽章</div>';
}
function renderStats(){
  const lv=getLv(ud.xp),nx=nextLvXp(ud.xp),cx=lvStartXp(lv),pct=Math.min(100,((ud.xp-cx)/(nx-cx))*100);
  document.querySelector('.st-total').textContent=ud.totalCompleted;
  document.querySelector('.st-xp').textContent=ud.xp;
  document.querySelector('.st-lv').textContent=lv;
  document.querySelector('.st-streak').textContent=ud.maxStreak;
  document.querySelector('.st-badges').textContent=ud.badges.length;
  const stxt=document.querySelector('.st-xp-text');if(stxt)stxt.textContent=ud.xp+' / '+nx+' XP（本级需 '+lvThisNeed(lv)+'，还需 '+(nx-ud.xp)+'）';
  const sbar=document.querySelector('.st-xp-bar');if(sbar)sbar.style.width=pct+'%';
  const chart=document.getElementById('weekChart'),days=['日','一','二','三','四','五','六'];
  let html='';
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const key=today_fmt(d),log=ud.dailyLog[key],count=log?log.completed:0;
    const h=Math.max(4,count*8),isToday=i===0;
    html+='<div class="flex-1 flex flex-col items-center gap-1"><span class="text-[10px] text-gray-400">'+count+'</span><div class="w-full rounded-sm '+(isToday?'bg-[#8B5CF6]':'bg-[#3F3F46]')+'" style="height:'+h+'px"></div><span class="text-[10px] text-gray-500">'+days[d.getDay()]+'</span></div>';
  }
  chart.innerHTML=html;
  renderTrackStats();
}
function renderTrackStats(){
  const container=document.getElementById('trackStats');
  if(!container)return;
  const ts=ud.trackStats||{};
  const active=TRACK_RULES.filter(r=>ts[r.key]&&ts[r.key]>0);
  if(active.length===0){
    container.innerHTML='<div class="text-center py-6 text-gray-500 text-sm">完成包含数字的任务（如"背了50个单词"、"存了100块钱"）会自动统计</div>';
    return;
  }
  let html='<div class="grid grid-cols-2 md:grid-cols-3 gap-3">';
  active.forEach(r=>{
    const val=ts[r.key]||0;
    html+='<div class="bg-[#18181B] rounded-xl p-4 flex items-center gap-3">'+
      '<span class="text-2xl">'+r.icon+'</span>'+
      '<div><div class="text-xl font-bold" style="color:var(--ac)">'+val+'</div>'+
      '<div class="text-xs text-gray-500">'+r.label+'（'+r.unit+'）</div></div></div>';
  });
  html+='</div>';
  container.innerHTML=html;
}
function renderGoals(){
  const list=document.getElementById('goalList'),empty=document.getElementById('emptyGoals');
  if(!ud.goals||!ud.goals.length){if(list)list.innerHTML='';if(empty)empty.classList.remove('hidden');return}
  if(empty)empty.classList.add('hidden');
  const todayLogs=ud.goalLogs[td]||{};
  if(list)list.innerHTML=ud.goals.map(g=>{
    const pct=Math.min(100,(g.current/g.target)*100);
    const todayVal=todayLogs[g.id]||0;
    const daysLeft=Math.max(0,Math.ceil((new Date(g.year,11,31)-new Date())/(86400000)));
    const avgNeed=daysLeft>0?((g.target-g.current)/daysLeft).toFixed(1):0;
    return '<div class="bg-[#18181B] rounded-xl p-4">'+
      '<div class="flex items-center gap-3 mb-3">'+
        '<span class="text-2xl">'+g.icon+'</span>'+
        '<div class="flex-1 min-w-0"><div class="text-sm font-bold truncate">'+g.title+'</div><div class="text-xs text-gray-500">'+g.current+' / '+g.target+' '+g.unit+'</div></div>'+
        '<div class="text-right"><div class="text-lg font-bold" style="color:var(--ac)">'+Math.round(pct)+'%</div><div class="text-[10px] text-gray-500">剩余 '+daysLeft+' 天</div></div>'+
      '</div>'+
      '<div class="w-full h-2.5 bg-[#27272A] rounded-full overflow-hidden mb-3"><div class="h-full rounded-full transition-all duration-500" style="width:'+pct+'%;background:'+(g.color||'var(--ac)')+'"></div></div>'+
      '<div class="flex items-center gap-2 bg-[#09090B] rounded-lg p-2">'+
        '<div class="flex-1 flex items-center gap-1.5"><span class="text-xs text-gray-500">今日记录</span><input type="number" min="0" value="'+todayVal+'" id="gi_'+g.id+'" class="w-20 bg-[#18181B] border border-[#3F3F46] rounded-lg px-2 py-1.5 text-sm text-white text-center focus:border-[#8B5CF6] outline-none" placeholder="0"><span class="text-xs text-gray-500">'+g.unit+'</span></div>'+
        '<button onclick="logGoal(\''+g.id+'\')" class="bg-[#8B5CF6] text-white px-4 py-1.5 rounded-lg text-xs font-bold">记录</button>'+
      '</div>'+
      '<div class="flex justify-between mt-2 text-[10px] text-gray-600"><span>日均需 '+avgNeed+' '+g.unit+'</span><span>今日 +'+todayVal+' '+g.unit+'</span></div>'+
      '<div class="mt-3 pt-2 border-t border-[#27272A]"><button onclick="delGoal(\''+g.id+'\')" class="text-xs text-red-400 hover:text-red-300">删除目标</button></div>'+
    '</div>';
  }).join('');
}
function logGoal(gid){
  const inp=document.getElementById('gi_'+gid);
  if(!inp)return;
  const val=Math.max(0,parseFloat(inp.value)||0);
  const g=ud.goals.find(x=>x.id===gid);if(!g)return;
  g.current=Math.min(g.target,g.current+val);
  if(!ud.goalLogs[td])ud.goalLogs[td]={};
  ud.goalLogs[td][gid]=val;
  saveData();renderGoals();renderAll();
}
function showGoalModal(){document.getElementById('gmName').value='';document.getElementById('gmIcon').value='';document.getElementById('gmTarget').value='3650';document.getElementById('gmUnit').value='';document.getElementById('gmCurrent').value='0';const m=document.getElementById('goalModal');m.classList.remove('hidden');m.classList.add('flex')}
function closeGoalModal(){const m=document.getElementById('goalModal');m.classList.add('hidden');m.classList.remove('flex')}
function saveGoal(){
  const name=document.getElementById('gmName').value.trim(),icon=document.getElementById('gmIcon').value.trim(),target=parseInt(document.getElementById('gmTarget').value)||100,unit=document.getElementById('gmUnit').value.trim()||'个',current=parseInt(document.getElementById('gmCurrent').value)||0;
  if(!name||!icon){alert('请填写名称和图标');return}
  if(!ud.goals)ud.goals=[];
  ud.goals.push({id:'g_'+Date.now(),title:name,icon,target,unit,current:Math.max(0,Math.min(current,target)),color:'var(--ac)',year:new Date().getFullYear()});
  saveData();renderGoals();closeGoalModal();
}
function delGoal(id){ud.goals=ud.goals.filter(g=>g.id!==id);saveData();renderGoals();}
function showRoutineModal(){
  const list=document.getElementById('routineList');
  list.innerHTML=(ud.routines||[]).map((r,i)=>'<div class="flex items-center justify-between bg-[#09090B] rounded-lg px-3 py-2"><span class="text-xs text-white">'+(r.time?r.time+' ':'')+r.title+'</span><button onclick="delRoutine('+i+')" class="text-gray-500 hover:text-red-400 text-xs">✕</button></div>').join('');
  const m=document.getElementById('routineModal');m.classList.remove('hidden');m.classList.add('flex');
}
function closeRoutineModal(){const m=document.getElementById('routineModal');m.classList.add('hidden');m.classList.remove('flex')}
function addRoutine(){
  const title=document.getElementById('rmTitle').value.trim(),cat=document.getElementById('rmCat').value,time=document.getElementById('rmTime').value;
  if(!title){alert('请填写任务名称');return}
  if(!ud.routines)ud.routines=[];
  ud.routines.push({id:'r_'+Date.now(),title,category:cat,time,priority:'mid'});
  saveData();showRoutineModal();
  document.getElementById('rmTitle').value='';document.getElementById('rmTime').value='';
}
function delRoutine(i){ud.routines.splice(i,1);saveData();showRoutineModal();}

// ==================== DETAIL ====================
function openDetail(id){
  const t=ud.tasks.find(t=>t.id===id);if(!t)return;
  const c=CATS.find(x=>x.id===t.category)||CATS[0];
  // Show detail sheet on ALL devices (not just mobile)
  document.getElementById('detailSheet').classList.remove('hidden');
  document.getElementById('detailSheet').classList.add('flex');
  const html='<div class="space-y-3">'+
    '<div><label class="text-xs text-gray-500 mb-1 block">任务标题</label><input type="text" value="'+t.title.replace(/"/g,'&quot;')+'" onchange="updTask('+t.id+',{title:this.value})" class="w-full bg-[#09090B] border border-[#3F3F46] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#8B5CF6] outline-none"></div>'+
    '<div><label class="text-xs text-gray-500 mb-1 block">分类</label><div class="flex flex-wrap gap-1.5" id="dtCats">'+CATS.map(c=>'<button onclick="updTask('+t.id+',{category:\''+c.id+'\'});detailSelCat(this)" class="dt-cat flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border '+(t.category===c.id?'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]':'border-[#3F3F46] bg-[#09090B] text-gray-500')+'">'+c.icon+' '+c.label+'</button>').join('')+'</div></div>'+
    '<div><label class="text-xs text-gray-500 mb-1 block">优先级</label><div class="flex gap-1.5" id="dtPri"><button onclick="updTask('+t.id+',{priority:\'high\'});detailSelPri(this,\'high\')" class="dt-pri flex-1 py-2 rounded-lg text-xs font-semibold border '+(t.priority==='high'?'border-red-500 bg-red-500/10 text-red-400':'border-[#3F3F46] bg-[#09090B] text-gray-500')+'">🔴 高</button><button onclick="updTask('+t.id+',{priority:\'mid\'});detailSelPri(this,\'mid\')" class="dt-pri flex-1 py-2 rounded-lg text-xs font-semibold border '+(t.priority==='mid'?'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]':'border-[#3F3F46] bg-[#09090B] text-gray-500')+'">🟡 中</button><button onclick="updTask('+t.id+',{priority:\'low\'});detailSelPri(this,\'low\')" class="dt-pri flex-1 py-2 rounded-lg text-xs font-semibold border '+(t.priority==='low'?'border-blue-400 bg-blue-400/10 text-blue-400':'border-[#3F3F46] bg-[#09090B] text-gray-500')+'">⚪ 低</button></div></div>'+
    '<div class="flex gap-2"><div class="flex-1"><label class="text-xs text-gray-500 mb-1 block">日期</label><input type="date" value="'+t.createdAt+'" onchange="updTask('+t.id+',{createdAt:this.value})" class="w-full bg-[#09090B] border border-[#3F3F46] rounded-lg px-3 py-2.5 text-sm text-white"></div><div class="flex-1"><label class="text-xs text-gray-500 mb-1 block">时间</label><input type="time" value="'+t.time+'" onchange="updTask('+t.id+',{time:this.value})" class="w-full bg-[#09090B] border border-[#3F3F46] rounded-lg px-3 py-2.5 text-sm text-white"></div></div>'+
    '</div>'+
    '<div class="mt-3 pt-3 border-t border-[#27272A]">'+
      '<label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="dtRepeat" onchange="toggleDetailRepeat('+t.id+')" class="w-4 h-4 rounded accent-[#8B5CF6]"><span class="text-sm text-gray-300">设为重复任务</span></label>'+
      '<div id="dtRepeatRange" class="hidden mt-2 flex gap-2">'+
        '<div class="flex-1"><label class="text-xs text-gray-500 mb-1 block">从</label><input type="date" id="dtRepStart" value="'+t.createdAt+'" class="w-full bg-[#09090B] border border-[#3F3F46] rounded-lg px-3 py-2 text-sm text-white"></div>'+
        '<div class="flex-1"><label class="text-xs text-gray-500 mb-1 block">到</label><input type="date" id="dtRepEnd" value="'+t.createdAt+'" class="w-full bg-[#09090B] border border-[#3F3F46] rounded-lg px-3 py-2 text-sm text-white"></div>'+
      '</div>'+
      '<button id="dtRepBtn" onclick="applyDetailRepeat('+t.id+')" class="hidden w-full mt-2 py-2 rounded-lg text-sm font-semibold bg-[#8B5CF6] text-white">应用到日期范围</button>'+
    '</div>'+
    '<div class="mt-3 pt-3 border-t border-[#27272A]"><button onclick="delTask('+t.id+')" class="w-full text-sm text-red-400 py-2">删除任务</button></div>';
  document.getElementById('detailBody').innerHTML=html;
}
function closeDetail(){document.getElementById('detailSheet').classList.add('hidden');document.getElementById('detailSheet').classList.remove('flex')}
function toggleDetailRepeat(tid){
  const chk=document.getElementById('dtRepeat');
  const range=document.getElementById('dtRepeatRange');
  const btn=document.getElementById('dtRepBtn');
  if(chk.checked){range.classList.remove('hidden');btn.classList.remove('hidden')}
  else{range.classList.add('hidden');btn.classList.add('hidden')}
}
function applyDetailRepeat(tid){
  const t=ud.tasks.find(t=>t.id===tid);if(!t)return;
  const start=document.getElementById('dtRepStart').value;
  const end=document.getElementById('dtRepEnd').value;
  if(!start||!end){alert('请选择日期范围');return}
  const s=new Date(start),e=new Date(end);
  let added=0;
  for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
    const ds=today_fmt(d);
    if(ds===t.createdAt)continue; // skip current date
    const exists=ud.tasks.some(x=>x.createdAt===ds&&x.title===t.title);
    if(!exists){
      ud.tasks.push({id:Date.now()+Math.random(),title:t.title,category:t.category,time:t.time||'',priority:t.priority||'mid',completed:false,createdAt:ds,completedAt:null,linkedGoal:null});
      added++;
    }
  }
  saveData();renderAll();
  alert('已复制到'+added+'天');
}
function detailSelCat(btn){
  document.querySelectorAll('.dt-cat').forEach(b=>{b.className=b.className.replace(/border-\[#8B5CF6\] bg-\[#8B5CF6\]\/10 text-\[#8B5CF6\]/g,'border-[#3F3F46] bg-[#09090B] text-gray-500')});
  btn.className=btn.className.replace(/border-\[#3F3F46\] bg-\[#09090B\] text-gray-500/g,'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#8B5CF6]');
}
function detailSelPri(btn,val){
  const colors={high:['border-red-500','bg-red-500/10','text-red-400'],mid:['border-[#8B5CF6]','bg-[#8B5CF6]/10','text-[#8B5CF6]'],low:['border-blue-400','bg-blue-400/10','text-blue-400']};
  document.querySelectorAll('.dt-pri').forEach(b=>{b.className=b.className.replace(/border-\[[^\]]+\] bg-\[[^\]]+\]\/10 text-\[[^\]]+\]/g,'').replace(/border-red-500|bg-red-500\/10|text-red-400|border-\[#8B5CF6\]|bg-\[#8B5CF6\]\/10|text-\[#8B5CF6\]|border-blue-400|bg-blue-400\/10|text-blue-400/g,'')+'border-[#3F3F46] bg-[#09090B] text-gray-500'});
  (colors[val]||[]).forEach(c=>btn.classList.add(c));
}

// ==================== VIEWS ====================
function renderDock(){
  const dock=ud.dock||DOCK_ITEMS.map(d=>d.id);
  const el=document.getElementById('mobDock');if(!el)return;
  el.innerHTML=dock.map(id=>{const d=DOCK_ITEMS.find(x=>x.id===id);return d?'<button onclick="setView(\''+id+'\')" class="mob-tab text-xs py-1 text-gray-500" data-v="'+id+'">'+d.label+'</button>':'';}).join('');
}
function setView(v){
  if(v==='today'){_todayViewDate=null;clearQuickAddHint()}
  else if(v!=='calendar'){clearQuickAddHint()}
  const dock=ud.dock||DOCK_ITEMS.map(d=>d.id);
  if(!dock.includes(v))v=dock[0]||'today';
  document.querySelectorAll('.vp').forEach(el=>el.classList.add('hidden'));
  document.getElementById('v-'+v).classList.remove('hidden');
  document.querySelectorAll('.desk-nav').forEach(b=>{b.classList.remove('bg-[#27272A]','text-white');b.classList.add('text-gray-500')});
  document.querySelectorAll('.mob-nav').forEach(b=>{b.classList.remove('bg-[#27272A]','text-white');b.classList.add('text-gray-500')});
  document.querySelectorAll('.mob-tab').forEach(b=>{b.classList.remove('text-[#8B5CF6]');b.classList.add('text-gray-500')});
  const a=document.querySelector('[data-v="'+v+'"]');
  if(a){a.classList.add('bg-[#27272A]','text-white');a.classList.remove('text-gray-500')}
  const t=document.querySelector('.mob-tab[data-v="'+v+'"]');
  if(t){t.classList.add('text-[#8B5CF6]');t.classList.remove('text-gray-500')}
  const titles={today:'今日任务',calendar:'日历',timeline:'时间轴',history:'历史任务',badges:'成就徽章',stats:'数据统计',goals:'年度目标'};
  if(document.getElementById('deskTitle'))document.getElementById('deskTitle').textContent=titles[v]||'';
  closeDetail();
}
function toggleMobMenu(){const m=document.getElementById('mobMenu');if(m.classList.contains('hidden')){m.classList.remove('hidden');m.classList.add('flex')}else{m.classList.add('hidden');m.classList.remove('flex')}}

// ==================== INPUT ====================
function triggerAdd(id){
  const input=document.getElementById(id);
  if(input.value.trim()){showCat(input.value);input.value=''}
}
function bindIn(id){
  const input=document.getElementById(id);if(!input)return;
  input.addEventListener('keydown',e=>{if((e.key==='Enter'||e.keyCode===13)&&input.value.trim()){e.preventDefault();showCat(input.value);input.value=''}});
}
function showCat(title){
  pendingTitle=title;
  document.getElementById('catDate').value=_quickAddDay||getTodayViewDate();
  document.getElementById('catTime').value='';
  document.getElementById('catPri').value='mid';
  document.getElementById('catRepeat').checked=false;
  document.getElementById('repeatRange').classList.add('hidden');
  document.querySelectorAll('.pri-btn').forEach(b=>{b.classList.remove('active-pri');b.classList.remove('border-[#8B5CF6]','bg-[#8B5CF6]/10','text-[#8B5CF6]','border-red-500','bg-red-500/10','text-red-400','border-blue-400','bg-blue-400/10','text-blue-400');b.classList.add('border-[#3F3F46]','bg-[#09090B]','text-gray-500')});
  const midBtn=document.querySelectorAll('.pri-btn')[1];if(midBtn){midBtn.classList.remove('border-[#3F3F46]','bg-[#09090B]','text-gray-500');midBtn.classList.add('border-[#8B5CF6]','bg-[#8B5CF6]/10','text-[#8B5CF6]','active-pri')}
  document.getElementById('catOpts').innerHTML=CATS.map(c=>'<button onclick="confirmCat(\''+c.id+'\')" class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white hover:bg-[#27272A] transition-colors"><span>'+c.icon+'</span> '+c.label+'</button>').join('');
  const m=document.getElementById('catModal');m.classList.remove('hidden');m.classList.add('flex');
}
function selPri(val,btn){
  document.getElementById('catPri').value=val;
  const colors={high:['border-red-500','bg-red-500/10','text-red-400'],mid:['border-[#8B5CF6]','bg-[#8B5CF6]/10','text-[#8B5CF6]'],low:['border-blue-400','bg-blue-400/10','text-blue-400']};
  document.querySelectorAll('.pri-btn').forEach(b=>{b.classList.remove('active-pri','border-red-500','bg-red-500/10','text-red-400','border-[#8B5CF6]','bg-[#8B5CF6]/10','text-[#8B5CF6]','border-blue-400','bg-blue-400/10','text-blue-400');b.classList.add('border-[#3F3F46]','bg-[#09090B]','text-gray-500')});
  btn.classList.remove('border-[#3F3F46]','bg-[#09090B]','text-gray-500');
  (colors[val]||[]).forEach(c=>btn.classList.add(c));
}
function closeCat(){const m=document.getElementById('catModal');m.classList.add('hidden');m.classList.remove('flex');pendingTitle=null}
let pendingTitle=null;

// Desktop input (sidebar)
bindIn('deskInput');
// Desktop input (main content)
bindIn('deskMainInput');
// Mobile bottom input
bindIn('mobInput');

// ==================== MODALS ====================
function showBadgeModal(b){document.getElementById('bmIcon').textContent=b.icon;document.getElementById('bmName').textContent='解锁：'+b.name;document.getElementById('bmDesc').textContent=b.desc;const m=document.getElementById('badgeModal');m.classList.remove('hidden');m.classList.add('flex')}
function closeBadgeModal(){const m=document.getElementById('badgeModal');m.classList.add('hidden');m.classList.remove('flex')}
function showAddBadgeModal(){const m=document.getElementById('addBadgeModal');m.classList.remove('hidden');m.classList.add('flex')}
function closeAddBadgeModal(){const m=document.getElementById('addBadgeModal');m.classList.add('hidden');m.classList.remove('flex')}
function doAddCustomBadge(){
  const name=document.getElementById('cbName').value.trim(),icon=document.getElementById('cbIcon').value.trim(),desc=document.getElementById('cbDesc').value.trim(),target=parseInt(document.getElementById('cbTarget').value)||1;
  if(!name||!icon){alert('请填写名称和图标');return}
  if(!ud.customBadges)ud.customBadges=[];
  ud.customBadges.push({id:Date.now(),name,icon,desc,target});
  saveData();renderBadges();closeAddBadgeModal();
  document.getElementById('cbName').value='';document.getElementById('cbIcon').value='';document.getElementById('cbDesc').value='';document.getElementById('cbTarget').value='1';
}
let _pfSelAva=null;
const DOCK_ITEMS=[{id:'today',label:'任务'},{id:'calendar',label:'日历'},{id:'history',label:'历史'},{id:'badges',label:'徽章'},{id:'goals',label:'目标'},{id:'timeline',label:'时间轴'},{id:'stats',label:'统计'}];
function showProfile(){
  const p=ud.profile||{name:'我',avatar:'🐱'};
  const lv=getLv(ud.xp),nx=nextLvXp(ud.xp),cx=lvStartXp(lv),pct=Math.min(100,((ud.xp-cx)/(nx-cx))*100);
  _pfSelAva=p.avatar;
  document.getElementById('pfAvatar').textContent=p.avatar;
  document.getElementById('pfName').textContent=p.name;
  document.getElementById('pfLv').textContent='Lv.'+lv+' · 还需 '+(nx-ud.xp)+' XP 升级';
  document.getElementById('pfXpText').textContent=ud.xp+' / '+nx+' XP（本级需 '+lvThisNeed(lv)+'）';
  document.getElementById('pfXpBar').style.width=pct+'%';
  document.getElementById('pfNameInput').value=p.name;
  document.getElementById('pfAvatarPicker').innerHTML=AVATARS.map(a=>'<button onclick="selPfAva(this)" data-ava="'+a+'" class="pf-ava w-9 h-9 rounded-full text-lg flex items-center justify-center border-2 '+(a===p.avatar?'border-[#8B5CF6] bg-[#27272A]':'border-transparent hover:border-[#3F3F46]')+'">'+a+'</button>').join('');
  const dock=ud.dock||DOCK_ITEMS.map(d=>d.id);
  document.getElementById('pfDockOpts').innerHTML=DOCK_ITEMS.map(d=>'<label class="flex items-center gap-1.5 text-xs text-gray-400 bg-[#09090B] border border-[#3F3F46] rounded-lg px-2.5 py-1.5 cursor-pointer select-none"><input type="checkbox" value="'+d.id+'" '+(dock.includes(d.id)?'checked':'')+' class="accent-[#8B5CF6] w-3.5 h-3.5">'+d.label+'</label>').join('');
  const curTheme=ud.theme||'purple';
  document.getElementById('pfThemeOpts').innerHTML=THEMES.map(t=>'<button onclick="previewTheme(\''+t.id+'\')" class="pf-theme flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 '+(t.id===curTheme?'border-[#8B5CF6]':'border-transparent hover:border-[#3F3F46]')+'" data-tid="'+t.id+'"><div class="w-full h-5 rounded" style="background:'+t.preview+'"></div><span class="text-[9px] text-gray-500">'+t.name+'</span></button>').join('');
  const m=document.getElementById('profileModal');m.classList.remove('hidden');m.classList.add('flex');
}
function closeProfile(){const m=document.getElementById('profileModal');m.classList.add('hidden');m.classList.remove('flex')}

function applyTheme(tid){
  const t=THEMES.find(x=>x.id===tid);if(!t)return;
  const r=document.documentElement;
  Object.entries(t.css).forEach(([k,v])=>r.style.setProperty(k,v));
  // Inject dynamic style to override hardcoded Tailwind dark classes
  requestAnimationFrame(()=>{
    const bg=r.style.getPropertyValue('--bg').trim()||'#09090B';
    const bg1=r.style.getPropertyValue('--bg1').trim()||'#18181B';
    const bg2=r.style.getPropertyValue('--bg2').trim()||'#27272A';
    const bg3=r.style.getPropertyValue('--bg3').trim()||'#3F3F46';
    const ink1=r.style.getPropertyValue('--ink1').trim()||'#FAFAFA';
    const ink2=r.style.getPropertyValue('--ink2').trim()||'#A1A1AA';
    const ink3=r.style.getPropertyValue('--ink3').trim()||'#71717A';
    const ac=r.style.getPropertyValue('--ac').trim()||'#8B5CF6';
    let ds=document.getElementById('tw-dynamic-style');
    if(!ds){ds=document.createElement('style');ds.id='tw-dynamic-style';document.head.appendChild(ds)}
    ds.textContent=
      '.bg-\\[\\#18181B\\]{background-color:'+bg1+'!important}'+
      '.bg-\\[\\#27272A\\]{background-color:'+bg2+'!important}'+
      '.bg-\\[\\#3F3F46\\]{background-color:'+bg3+'!important}'+
      '.bg-\\[\\#09090B\\]{background-color:'+bg+'!important}'+
      '.border-\\[\\#27272A\\]{border-color:'+bg2+'!important}'+
      '.border-\\[\\#3F3F46\\]{border-color:'+bg3+'!important}'+
      '.hover\\:bg-\\[\\#27272A\\]:hover{background-color:'+bg2+'!important}'+
      '.bg-\\[\\#8B5CF6\\/10\\]{background-color:'+ac+'1a!important}'+
      '.bg-\\[\\#8B5CF6\\/20\\]{background-color:'+ac+'33!important}'+
      '.bg-\\[\\#8B5CF6\\]{background-color:'+ac+'!important}'+
      '.border-\\[\\#8B5CF6\\/40\\]{border-color:'+ac+'66!important}'+
      '.border-\\[\\#8B5CF6\\]{border-color:'+ac+'!important}'+
      '.text-\\[\\#8B5CF6\\]{color:'+ac+'!important}'+
      '.ring-\\[\\#8B5CF6\\]{--tw-ring-color:'+ac+'!important}'+
      '.focus\\:border-\\[\\#8B5CF6\\]:focus{border-color:'+ac+'!important}'+
      '.accent-\\[\\#8B5CF6\\]{accent-color:'+ac+'!important}'+
      '.text-gray-400{color:'+ink2+'!important}'+
      '.text-gray-500{color:'+ink3+'!important}'+
      '.text-white{color:'+ink1+'!important}'+
      '.text-gray-300{color:'+ink2+'!important}'+
      '.text-gray-600{color:'+ink3+'!important}'+
      'body{color:'+ink1+'!important}';
  });
}
function previewTheme(tid){
  applyTheme(tid);
  document.querySelectorAll('.pf-theme').forEach(b=>{b.classList.remove('border-[#8B5CF6]');b.classList.add('border-transparent')});
  const sel=document.querySelector('[data-tid="'+tid+'"]');if(sel){sel.classList.remove('border-transparent');sel.classList.add('border-[#8B5CF6]')}
  ud.theme=tid;
}
function toggleRepeatRange(){
  const show=document.getElementById('catRepeat').checked;
  const el=document.getElementById('repeatRange');
  if(show){el.classList.remove('hidden');document.getElementById('repeatStart').value=td;document.getElementById('repeatEnd').value=td;}
  else{el.classList.add('hidden')}
}
function confirmCat(cat){
  if(!pendingTitle)return;
  const date=document.getElementById('catDate').value;
  const time=document.getElementById('catTime').value;
  const pri=document.getElementById('catPri').value;
  if(document.getElementById('catRepeat').checked){
    const start=document.getElementById('repeatStart').value;
    const end=document.getElementById('repeatEnd').value;
    if(start&&end){
      const s=new Date(start),e=new Date(end);
      for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){
        const ds=today_fmt(d);
        const exists=ud.tasks.some(t=>t.createdAt===ds&&t.title===pendingTitle.trim());
        if(!exists){
          ud.tasks.push({id:Date.now()+Math.random(),title:pendingTitle.trim(),category:cat,time:time||'',priority:pri||'mid',completed:false,createdAt:ds,completedAt:null,linkedGoal:null});
        }
      }
    }
  }else{
    addTask(pendingTitle,cat,time,pri,date);
  }
  saveData();renderAll();closeCat();_quickAddDay=null;
}
let _quickAddDay=null;
function quickAddToDay(ds){
  _quickAddDay=ds;
  const inp=document.getElementById('mobInput')||document.getElementById('deskMainInput')||document.getElementById('deskInput');
  if(inp){inp.focus();inp.placeholder='输入 '+ds+' 的任务...'}
  closeDetail();
}
function clearQuickAddHint(){
  _quickAddDay=null;
  const inp=document.getElementById('mobInput')||document.getElementById('deskMainInput')||document.getElementById('deskInput');
  if(inp)inp.placeholder='输入任务...';
}
function calQuickConfirm(){
  const inp=document.getElementById('calQuickInput');
  if(!inp||!inp.value.trim()){_quickAddDay=null;return}
  const title=inp.value.trim();
  const time=document.getElementById('calQuickTime').value;
  const ds=_quickAddDay||td;
  addTask(title,'work',time,'mid',ds);
  _quickAddDay=null;
  saveData();renderAll();showCalDay(ds);
}
function selPfAva(btn){_pfSelAva=btn.dataset.ava;document.querySelectorAll('.pf-ava').forEach(b=>{b.classList.remove('border-[#8B5CF6]','bg-[#27272A]');b.classList.add('border-transparent')});btn.classList.remove('border-transparent');btn.classList.add('border-[#8B5CF6]','bg-[#27272A]')}
function saveProfile(){
  const newName=document.getElementById('pfNameInput').value.trim();
  const newAva=_pfSelAva||(ud.profile?.avatar||'🐱');
  const dock=Array.from(document.querySelectorAll('#pfDockOpts input:checked')).map(i=>i.value);
  if(!ud.profile)ud.profile={};
  if(newName)ud.profile.name=newName;
  ud.profile.avatar=newAva;
  ud.dock=dock.length?dock:DOCK_ITEMS.map(d=>d.id);
  saveData();renderHeader();renderDock();closeProfile();
}

// ==================== DATA EXPORT/IMPORT ====================
function exportData(){
  const json=JSON.stringify(ud,null,2);
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='小成就_数据备份_'+today()+'.json';
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url)},1000);
}
function resetData(){
  if(!confirm('确定清空所有数据？此操作不可恢复！'))return;
  ud=defaultData();
  const empty={...defaultData(),_ver:++_lastCloudVer};
  fetch('https://kvdb.io/'+KVDB_BUCKET+'/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(empty)}).catch(()=>{});
  renderAll();renderDock();setView('today');
}
function importData(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(ev){
    try{
      const d=JSON.parse(ev.target.result);
      if(!d.tasks||!d.profile){alert('文件格式不正确');return}
      const merged={...defaultData(),...d,profile:{...defaultData().profile,...(d.profile||{})}};
      ud=merged;saveData();renderAll();renderDock();setView('today');
      closeProfile();
      alert('数据导入成功！');
    }catch(err){alert('导入失败：文件格式不正确')}
  };
  reader.readAsText(file);
  e.target.value='';
}

// ==================== FX ====================
function spawnCfx(x,y){
  const c=document.getElementById('cfx'),ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  const colors=['#8B5CF6','#A78BFA','#F59E0B','#FBBF24','#C084FC','#FDE68A','#10B981'];
  const p=[];
  for(let i=0;i<25;i++)p.push({x,y,vx:(Math.random()-0.5)*14,vy:(Math.random()-1)*14-3,color:colors[Math.floor(Math.random()*colors.length)],size:Math.random()*5+2,life:1,g:0.35});
  (function anim(){ctx.clearRect(0,0,c.width,c.height);let a=false;p.forEach(q=>{if(q.life>0){a=true;q.x+=q.vx;q.y+=q.vy;q.vy+=q.g;q.life-=0.025;q.size*=0.97;ctx.globalAlpha=q.life;ctx.fillStyle=q.color;ctx.beginPath();ctx.arc(q.x,q.y,q.size,0,Math.PI*2);ctx.fill()}});if(a)requestAnimationFrame(anim);else ctx.clearRect(0,0,c.width,c.height)})();
}
function xpPop(x,y){const el=document.createElement('div');el.className='xp-float';el.textContent='+10 XP';el.style.left=x+'px';el.style.top=(y-10)+'px';document.body.appendChild(el);setTimeout(()=>el.remove(),800)}

// ==================== INIT ====================
const deskInputHtml='<div class="desktop-only px-3 pt-3 pb-2"><div class="flex gap-2"><input id="deskInput" type="text" placeholder="+ 新任务" class="flex-1 bg-[#18181B] border border-[#3F3F46] rounded-lg px-3 py-2 text-sm text-white focus:border-[#8B5CF6] outline-none"><button onclick="triggerAdd(\'deskInput\')" class="bg-[#8B5CF6] text-white px-3 rounded-lg text-sm font-bold">+</button></div></div>';
async function initApp(){
  // Load from kvdb FIRST, before any rendering
  try{await kvDownload()}catch(e){console.error('kvDownload error:',e)}
  // kvDownload already calls renderAll() on success, but force re-render
  applyTheme(ud.theme||'purple');
  try{rebuildTrackStats()}catch(e){console.error('rebuildTrack error:',e)}
  try{renderAll();renderDock();setView('today')}catch(e){console.error('render error:',e)}
  const tvd=document.getElementById('todayViewDate');if(tvd)tvd.value=td;
  const sb=document.querySelector('.desktop-only nav');
  if(sb){const wrap=document.createElement('div');wrap.innerHTML=deskInputHtml;sb.insertBefore(wrap.firstChild,sb.firstChild)}
  try{genRoutineTasks()}catch(e){console.error('genRoutine error:',e)}
  // Extra safety: force render after a short delay to ensure DOM is ready
  setTimeout(()=>{try{renderAll();renderDock()}catch(e){}},500);
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initApp);
}else{
  initApp();
}
// Fallback: re-render on window load
window.addEventListener('load',()=>{setTimeout(()=>{renderAll();renderDock()},100)});