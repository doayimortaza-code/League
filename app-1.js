
var parentText='',VER='۱٫۰۵',KEY='league_db_v1',MAX=40,view='home',msg='',armed=null,focusId=null,pending=null,showText='',curExam=null,awFilter='all',xferId=null,csvShow='';
function load(){try{var s=localStorage.getItem(KEY);if(s){var d=JSON.parse(s);if(d&&d.classes)return d}}catch(e){}return{v:1,classes:[],activeId:null}}
var db=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){msg='ذخیره‌سازی در این مرورگر ممکن نشد.'}}
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function fa(n){return Number(n).toLocaleString('fa-IR')}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function norm(s){return String(s||'').replace(/\s+/g,' ').trim()}
function active(){return db.classes.filter(function(c){return c.id===db.activeId&&!c.archived})[0]||null}
function val(id){var e=document.getElementById(id);return e?norm(e.value):''}
var menu=[['classes','کلاس‌ها','🏫'],['students','دانش‌آموزان','👧'],['groups','گروه‌ها','👥'],['exams','ثبت آزمون','📝'],['leagueInd','لیگ فردی','🥇'],['leagueGrp','لیگ گروهی','🏅'],['gquiz','پرسش گروهی','🙋'],['gexam','آزمون گروهی','📋'],['comp','شایستگی','🌟'],['honors','افتخارات','⭐'],['backup','پشتیبان‌گیری','💾'],['lottery','قرعه‌کشی شانسی','🎲'],['practice','تمرین و بازی','🎮'],['settings','تنظیمات','⚙️']];
function msgBox(){var m=msg?'<div class="msg" role="status">'+esc(msg)+'</div>':'';msg='';return m}
function vHome(){
  var c=active(),h='<header class="hero"><div class="medal" aria-hidden="true">🏆</div><div><h1>لیگ موفقیت<br>کلاس ششم&nbsp;۵</h1><p>دبستان سیدالشهدا<br>آموزگار: مرتضی دعائی</p></div></header>';
  h+=msgBox();
  h+='<div class="strip">'+(c?'کلاس فعال: <b>'+esc(c.name)+'</b><div class="muted">'+fa(c.students.length)+' از '+fa(MAX)+' دانش‌آموز</div>':'هنوز کلاسی نساخته‌اید. از منوی «کلاس‌ها» شروع کنید.')+'</div>';
  h+='<h2>منوی اصلی</h2><nav class="grid">';
  menu.forEach(function(m){h+='<button class="tile" type="button" data-act="go" data-v="'+esc(m[0])+'"><span class="ic" aria-hidden="true">'+m[2]+'</span><b>'+m[1]+'</b></button>'});
  return h+'</nav><p class="foot">نسخه '+VER+' · سازنده: مرتضی دعائی<br>اطلاعات فقط روی همین گوشی و در همین مرورگر ذخیره می‌شود.</p>';
}
function back(){return '<button class="back" data-act="go" data-v="home">بازگشت به داشبورد</button>'}
function vClasses(){
  var h=back()+'<h2>کلاس‌ها</h2>'+msgBox();
  var vis=db.classes.filter(function(k){return !k.archived});
  if(!vis.length)h+='<div class="empty"><p>هنوز کلاسی ندارید. فرم پایین را پر کنید.</p></div>';
  vis.forEach(function(c){
    h+='<div class="card"><div class="row"><b>'+esc(c.name)+'</b>'+(c.id===db.activeId?'<span class="badge">فعال</span>':'')+'</div><div class="muted">'+esc(c.grade)+' - '+esc(c.school)+' - '+esc(c.year)+'<br>آموزگار: '+esc(c.teacher)+' - '+fa(c.students.length)+' از '+fa(MAX)+' دانش‌آموز</div><div class="row" style="margin-top:10px">'+(c.id===db.activeId?'<span></span>':'<button class="btn" data-act="pick" data-id="'+c.id+'">انتخاب کلاس</button>')+'<button class="btn danger" data-act="delClass" data-id="'+c.id+'">حذف کلاس</button></div></div>';
  });
  h+='<h2>کلاس جدید</h2><div class="card"><label for="cn">نام کلاس</label><input id="cn" value="ششم ۵"><label for="cg">پایه</label><input id="cg" value="ششم"><label for="cs">مدرسه</label><input id="cs" value="دبستان سیدالشهدا"><label for="cy">سال تحصیلی</label><input id="cy" value="۱۴۰۵-۱۴۰۶"><label for="ct">آموزگار</label><input id="ct" value="مرتضی دعائی"><button class="btn" data-act="addClass">ساخت کلاس</button></div>';
  return h;
}
function transferStudent(from,to,sid){
  var s=from.students.filter(function(x){return x.id===sid})[0];
  if(!s||!to)return 'دانش‌آموز یا کلاس مقصد پیدا نشد.';
  if(to.id===from.id)return 'کلاس مقصد باید با کلاس فعلی فرق داشته باشد.';
  if(to.archived)return 'کلاس مقصد بایگانی شده است.';
  if(to.students.length>=MAX)return 'ظرفیت کلاس مقصد پر است (حداکثر '+fa(MAX)+' نفر).';
  if(to.students.some(function(x){return x.name===s.name}))return 'دانش‌آموزی با همین نام در کلاس مقصد هست.';
  var rows=[],tot=0,mx=0;
  exs(from).forEach(function(e){var v=e.scores&&e.scores[sid];if(v!=null){rows.push({t:e.title,d:e.date,m:e.max,v:v});tot+=v;mx+=e.max}});
  s.history=(s.history||[]).concat([{cls:from.name,year:from.year||'',rows:rows,total:r2(tot),max:mx,date:new Date().toISOString()}]);
  s.groupId=null;
  from.students=from.students.filter(function(x){return x.id!==sid});
  if(!from.former)from.former=[];
  from.former.push({id:sid,name:s.name,to:to.name,date:new Date().toISOString()});
  to.students.push(s);
  return null;
}
function formerCard(c){
  var f=c.former||[];if(!f.length)return '';
  var h='<h2>منتقل‌شده‌ها</h2><div class="card">';
  f.slice().reverse().forEach(function(x){h+='<div class="st"><span>'+esc(x.name)+'</span><span class="muted">به «'+esc(x.to)+'» - '+esc(new Date(x.date).toLocaleDateString('fa-IR'))+'</span></div>'});
  return h+'<p class="muted">نمره‌های قبلی این دانش‌آموزان در آزمون‌های همین کلاس باقی می‌ماند.</p></div>';
}
function vStudents(){
  var c=active(),h=back();
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  h+='<h2>دانش‌آموزان '+esc(c.name)+'</h2><p class="muted">'+fa(c.students.length)+' از '+fa(MAX)+' نفر</p>'+msgBox();
  var xs=xferId?c.students.filter(function(x){return x.id===xferId})[0]:null;
  if(xferId&&!xs)xferId=null;
  if(xs){
    var tg=db.classes.filter(function(k){return k.id!==c.id&&!k.archived});
    h+='<div class="card"><b>انتقال «'+esc(xs.name)+'» به کلاس دیگر</b>';
    if(!tg.length)h+='<p class="muted">کلاس دیگری وجود ندارد. اول در بخش کلاس‌ها یک کلاس دیگر بسازید.</p><button class="btn ghost" data-act="cancelXfer">انصراف</button>';
    else h+='<label for="tc">کلاس مقصد</label><select id="tc" class="fs">'+tg.map(function(k){return '<option value="'+k.id+'">'+esc(k.name)+' ('+fa(k.students.length)+' از '+fa(MAX)+')</option>'}).join('')+'</select><p class="muted">نمره‌ها و جایزه‌های گذشته در این کلاس باقی می‌ماند و خلاصه آن همراه دانش‌آموز می‌رود. عضویت در گروه برداشته می‌شود.</p><div class="row"><button class="btn danger" data-act="doXfer">انتقال</button><button class="btn ghost" data-act="cancelXfer">انصراف</button></div>';
    h+='</div>';
  }
  h+='<div class="card"><label for="sn">نام دانش‌آموز</label><input id="sn" placeholder="نام و نام خانوادگی"><button class="btn" data-act="addStu">افزودن</button></div>';
  h+='<div class="card"><label for="sb">افزودن چند نفر (هر نام در یک خط)</label><textarea id="sb" rows="4"></textarea><button class="btn ghost" data-act="addBulk">افزودن همه</button></div>';
  if(!c.students.length)return h+'<div class="empty"><p>هنوز دانش‌آموزی ثبت نشده است.</p></div>'+formerCard(c);
  h+='<ol class="card">';
  c.students.forEach(function(s,i){
    var hs=(s.history||[]).map(function(x){return 'سابقه در «'+esc(x.cls)+'»: '+fn(x.total)+' از '+fn(x.max)}).join('<br>');
    h+='<li class="st"><span>'+fa(i+1)+'. '+esc(s.name)+(hs?'<br><span class="muted">'+hs+'</span>':'')+'</span><span class="row" style="gap:6px"><button class="btn ghost" data-act="xfer" data-id="'+s.id+'">انتقال</button><button class="btn danger" data-act="delStu" data-id="'+s.id+'">حذف</button></span></li>';
  });
  return h+'</ol>'+formerCard(c);
}
function grp(c){if(!c.groups)c.groups=[];return c.groups}
function vGroups(){
  var c=active(),h=back();
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  var gs=grp(c);
  h+='<h2>گروه‌های '+esc(c.name)+'</h2>'+msgBox();
  h+='<div class="card"><label for="gn">نام گروه جدید</label><input id="gn" placeholder="مثلاً: ستاره‌ها"><button class="btn" data-act="addGroup">ساخت گروه</button></div>';
  if(!gs.length)return h+'<div class="empty"><p>هنوز گروهی ندارید.</p></div>';
  gs.forEach(function(g){
    var m=c.students.filter(function(s){return s.groupId===g.id});
    h+='<div class="card"><div class="row"><b>'+esc(g.name)+'</b><span class="muted">'+fa(m.length)+' نفر</span></div><div class="muted">'+(m.length?m.map(function(s){return esc(s.name)}).join('، '):'بدون عضو')+'</div><div style="margin-top:10px"><button class="btn danger" data-act="delGroup" data-id="'+g.id+'">حذف گروه</button></div></div>';
  });
  var un=c.students.filter(function(s){return !s.groupId||!gs.some(function(g){return g.id===s.groupId})}).length;
  h+='<h2>تعیین گروه دانش‌آموزان</h2><p class="muted">بدون گروه: '+fa(un)+' نفر</p><div class="card">';
  if(!c.students.length)h+='<p class="muted">هنوز دانش‌آموزی ثبت نشده است.</p>';
  c.students.forEach(function(s){
    h+='<div class="st" style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0"><span>'+esc(s.name)+'</span><select data-act="setGroup" data-id="'+s.id+'" aria-label="گروه '+esc(s.name)+'"><option value="">بدون گروه</option>'+gs.map(function(g){return '<option value="'+g.id+'"'+(s.groupId===g.id?' selected':'')+'>'+esc(g.name)+'</option>'}).join('')+'</select></div>';
  });
  return h+'</div>';
}

function today(){return new Date().toISOString().slice(0,10)}
function encodeBackup(){return 'LEAGUE1:'+btoa(unescape(encodeURIComponent(makeBackup())))}
function makeBackup(){return JSON.stringify({app:'league-success',formatVersion:1,exportedAt:new Date().toISOString(),data:{v:1,classes:db.classes,activeId:db.activeId}},null,1)}
function lastBackup(){try{var t=localStorage.getItem('league_last_backup');if(!t)return 'هنوز پشتیبان نگرفته‌اید.';var d=new Date(t);return 'آخرین پشتیبان: '+d.toLocaleDateString('fa-IR')+' ساعت '+d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
function validate(o){
  if(!o||o.app!=='league-success'||!o.data)return 'این فایل، پشتیبان برنامه «لیگ موفقیت» نیست.';
  if(typeof o.formatVersion!=='number'||o.formatVersion>1)return 'این فایل از نسخه جدیدتر برنامه است و قابل خواندن نیست.';
  var d=o.data;if(!Array.isArray(d.classes))return 'ساختار فایل ناقص است.';
  var ids={};
  for(var i=0;i<d.classes.length;i++){
    var c=d.classes[i];
    if(!c||typeof c.id!=='string'||typeof c.name!=='string'||!Array.isArray(c.students))return 'اطلاعات کلاس شماره '+fa(i+1)+' ناقص است.';
    if(ids[c.id])return 'شناسه یکی از کلاس‌ها تکراری است.';ids[c.id]=1;
    if(c.students.length>MAX)return 'کلاس «'+c.name+'» بیش از '+fa(MAX)+' دانش‌آموز دارد.';
    if(c.former&&!Array.isArray(c.former))return 'فهرست منتقل‌شده‌های کلاس «'+c.name+'» ناقص است.';
    if(c.awards&&!Array.isArray(c.awards))return 'جوایز کلاس «'+c.name+'» ناقص است.';
    if(c.comp&&!Array.isArray(c.comp))return 'رفتارهای ثبت‌شده کلاس «'+c.name+'» ناقص است.';
    if(c.twork&&!Array.isArray(c.twork))return 'کار گروهی کلاس «'+c.name+'» ناقص است.';
    if(c.twclose&&(typeof c.twclose!=='object'||Array.isArray(c.twclose)))return 'نتیجه ماه‌های کار گروهی کلاس «'+c.name+'» ناقص است.';
    if(c.exem&&(typeof c.exem!=='object'||Array.isArray(c.exem)))return 'نمونه‌های ماه کلاس «'+c.name+'» ناقص است.';
    if(c.gexams&&!Array.isArray(c.gexams))return 'آزمون‌های گروهی کلاس «'+c.name+'» ناقص است.';
    if(c.gquiz&&!Array.isArray(c.gquiz))return 'سابقه پرسش گروهی کلاس «'+c.name+'» ناقص است.';
    if(c.practice&&!Array.isArray(c.practice))return 'نتیجه تمرین‌های کلاس «'+c.name+'» ناقص است.';
    if(c.exams&&!Array.isArray(c.exams))return 'آزمون‌های کلاس «'+c.name+'» ناقص است.';
    if(c.groups&&!Array.isArray(c.groups))return 'گروه‌های کلاس «'+c.name+'» ناقص است.';
    for(var j=0;j<c.students.length;j++){var st=c.students[j];if(!st||typeof st.id!=='string'||typeof st.name!=='string')return 'اطلاعات دانش‌آموزان کلاس «'+c.name+'» ناقص است.'}
  }
  return null;
}
function count(d){var st=0,g=0;d.classes.forEach(function(c){st+=c.students.length;g+=(c.groups||[]).length});return{c:d.classes.length,s:st,g:g}}
function csvCell(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"'}
function buildCsv(c){
  var list=exs(c),rows=indTotals(c),head=['رتبه','نام','گروه'];
  list.forEach(function(e){head.push(e.title+' (از '+e.max+')')});
  head.push('مجموع نمره آزمون‌ها');head.push('تعدیل شایستگی');head.push('مجموع نهایی');
  var lines=[head.map(csvCell).join(',')];
  rows.forEach(function(r){
    var st=c.students.filter(function(x){return x.id===r.id})[0],line=[r.rank,r.name,r.group];
    list.forEach(function(e){var v=e.scores&&e.scores[r.id];line.push(v==null?'':v)});
    line.push(r.ex);line.push(r.adj);line.push(r.total);
    lines.push(line.map(csvCell).join(','));
  });
  return '\uFEFF'+lines.join('\r\n');
}
async function doCsv(c){
  var text=buildCsv(c),dl=null;
  try{dl=(window.claude&&window.claude.use)?await window.claude.use('downloads'):null}catch(e){dl=null}
  if(dl){
    try{await dl.save({filename:'league-table-'+today()+'.csv',data:text});csvShow='';msg='فایل CSV آماده ذخیره شد.';render(true);return}
    catch(e){if(e&&e.code==='declined'){msg='ذخیره لغو شد.';render(true);return}}
  }
  csvShow=text.replace('\uFEFF','');msg='ذخیره مستقیم فایل ممکن نشد. متن جدول را از کادر پایین کپی کنید.';render(true);
}
function vBackup(){
  var h=back()+'<h2>پشتیبان‌گیری</h2>'+msgBox();
  var n=count(db);
  h+='<div class="card"><b>ساخت پشتیبان</b><p class="muted">شامل '+fa(n.c)+' کلاس، '+fa(n.s)+' دانش‌آموز و '+fa(n.g)+' گروه. '+lastBackup()+'</p><p class="muted">⚠️ این فایل نام دانش‌آموزان و رمز کارنامه اولیا را دارد. آن را فقط برای افراد مجاز بفرستید.</p><div class="row"><button class="btn" data-act="export">ذخیره فایل پشتیبان</button><button class="btn ghost" data-act="showText">نمایش متن پشتیبان</button></div></div>';
  var ac=active();
  if(ac&&exs(ac).length&&ac.students.length)h+='<div class="card"><b>خروجی جدول لیگ (CSV)</b><p class="muted">جدول نمره‌ها و رتبه‌های کلاس فعال («'+esc(ac.name)+'») برای باز کردن در Excel. ⚠️ نام دانش‌آموزان در آن هست.</p><div class="row"><button class="btn" data-act="csv">ذخیره فایل CSV</button><button class="btn ghost" data-act="csvText">نمایش متن CSV</button></div></div>';
  if(csvShow)h+='<div class="card"><label for="ct2">متن CSV (همه را انتخاب و کپی کنید)</label><textarea id="ct2" rows="6" readonly>'+esc(csvShow)+'</textarea></div>';
  if(showText)h+='<div class="card"><label for="bt">متن پشتیبان (یک خط طولانی است. همه را انتخاب و کپی کنید)</label><textarea id="bt" rows="6" readonly>'+esc(showText)+'</textarea></div>';
  h+='<div class="card"><b>بازیابی از پشتیبان</b><p class="muted">اول فقط خلاصه فایل نشان داده می‌شود و تا تأیید شما چیزی تغییر نمی‌کند.</p><label for="pt">متن پشتیبان را اینجا بچسبانید</label><textarea id="pt" rows="3"></textarea><button class="btn ghost" data-act="checkText">بررسی متن</button></div>';
  if(pending){
    var p=count(pending.data),ex=0;pending.data.classes.forEach(function(c){if(db.classes.some(function(x){return x.id===c.id}))ex++});
    h+='<div class="card"><b>خلاصه فایل انتخاب‌شده</b><p class="muted">'+fa(p.c)+' کلاس، '+fa(p.s)+' دانش‌آموز، '+fa(p.g)+' گروه<br>'+fa(ex)+' کلاس از آن‌ها همین الان در برنامه هست.</p><div class="row"><button class="btn danger" data-act="restoreReplace">جایگزین کردن همه اطلاعات فعلی</button><button class="btn" data-act="restoreMerge">فقط کلاس‌های جدید را اضافه کن</button><button class="btn ghost" data-act="restoreCancel">انصراف</button></div></div>';
  }
  return h;
}
function stamp(){try{localStorage.setItem('league_last_backup',new Date().toISOString())}catch(e){}}
async function doExport(){
  var text=makeBackup(),dl=null;
  try{dl=(window.claude&&window.claude.use)?await window.claude.use('downloads'):null}catch(e){dl=null}
  if(dl){
    try{await dl.save({filename:'league-backup-'+today()+'.json',data:text});stamp();showText='';msg='فایل پشتیبان آماده ذخیره شد.';render(true);return}
    catch(e){if(e&&e.code==='declined'){msg='ذخیره لغو شد.';render(true);return}}
  }
  showText=encodeBackup();msg='ذخیره مستقیم فایل ممکن نشد. متن پشتیبان را از کادر پایین کپی کنید.';render(true);
}
function takeText(t){
  var o,raw=String(t||'').replace(/^\uFEFF/,'').trim();
  if(!raw){msg='متنی برای بررسی وجود ندارد. اول فایل را انتخاب کنید یا متن را بچسبانید.';pending=null;render(true);return}
  var k=raw.indexOf('LEAGUE1:');
  if(k>=0){try{raw=decodeURIComponent(escape(atob(raw.slice(k+8).replace(/\s+/g,''))))}catch(e){msg='متن پشتیبان ناقص یا خراب است. طول متن: '+fa(raw.length)+' نویسه. مطمئن شوید همه متن، از اول تا آخر، کپی شده است.';pending=null;render(true);return}}
  else raw=raw.replace(/[“”„‟«»]/g,'"');
  var a=raw.indexOf('{'),b=raw.lastIndexOf('}');
  if(a>=0&&b>a)raw=raw.slice(a,b+1);
  try{o=JSON.parse(raw)}catch(e){msg='محتوا قابل خواندن نیست. طول متن: '+fa(raw.length)+' نویسه. شروع: «'+raw.slice(0,25)+'» پایان: «'+raw.slice(-25)+'»';pending=null;render(true);return}
  var err=validate(o);
  if(err){msg=err;pending=null}else{pending={data:o.data};msg='فایل معتبر است. خلاصه را ببینید و تصمیم بگیرید.'}
  render(true);
}
function exs(c){if(!c.exams)c.exams=[];return c.exams}
function fn(n){return Number(n).toLocaleString('fa-IR',{maximumFractionDigits:2})}
function num(t){t=String(t==null?'':t).trim().replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632}).replace(/[٫\/,،]/g,'.');if(t==='')return null;if(!/^\d+(\.\d+)?$/.test(t))return NaN;return parseFloat(t)}
function findExam(c,id){return exs(c).filter(function(e){return e.id===id})[0]||null}
function note(t){var l=document.getElementById('live');if(l){l.innerHTML='<div class="msg" role="status">'+esc(t)+'</div>';l.scrollIntoView()}else{msg=t;render(true)}}
function vExams(){
  var c=active(),h=back();
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  var e=curExam?findExam(c,curExam):null;
  if(curExam&&!e)curExam=null;
  if(e)return vExam(c,e);
  h+='<h2>آزمون‌های '+esc(c.name)+'</h2><div id="live">'+msgBox()+'</div>';
  var list=exs(c);
  if(!list.length)h+='<div class="empty"><p>هنوز آزمونی ثبت نشده است.</p></div>';
  list.forEach(function(x){
    var n=0;c.students.forEach(function(s){if(x.scores&&x.scores[s.id]!=null)n++});
    h+='<div class="card"><div class="row"><b>'+esc(x.title)+'</b><span class="muted">'+esc(x.date)+'</span></div><div class="muted">نمره کل: '+fn(x.max)+' - نمره ثبت‌شده برای '+fa(n)+' از '+fa(c.students.length)+' نفر</div><div class="row" style="margin-top:10px"><button class="btn" data-act="openExam" data-id="'+x.id+'">ثبت و ویرایش نمره‌ها</button><button class="btn danger" data-act="delExam" data-id="'+x.id+'">حذف آزمون</button></div></div>';
  });
  return h+'<h2>آزمون جدید</h2><div class="card"><label for="xt">عنوان آزمون</label><input id="xt" placeholder="مثلاً: ریاضی فصل ۱"><label for="xm">نمره کل آزمون</label><input id="xm" inputmode="decimal" placeholder="مثلاً ۲۰"><label for="xd">تاریخ</label><input id="xd" value="'+new Date().toLocaleDateString('fa-IR')+'"><button class="btn" data-act="addExam">ساخت آزمون</button></div>';
}
function vExam(c,e){
  var h='<button class="back" data-act="closeExam">بازگشت به آزمون‌ها</button><h2>'+esc(e.title)+'</h2><div id="live">'+msgBox()+'</div>';
  h+='<div class="card"><label for="et">عنوان</label><input id="et" value="'+esc(e.title)+'"><label for="em">نمره کل</label><input id="em" inputmode="decimal" value="'+e.max+'"><label for="ed">تاریخ</label><input id="ed" value="'+esc(e.date)+'"><button class="btn ghost" data-act="editExam">ذخیره مشخصات آزمون</button></div>';
  if(!c.students.length)return h+'<div class="empty"><p>اول دانش‌آموزان کلاس را ثبت کنید.</p></div>';
  h+='<div class="card"><p class="muted">نمره هر دانش‌آموز را از ۰ تا '+fn(e.max)+' بنویسید. خالی بگذارید یعنی نمره ثبت نشده. برای اعشار از نقطه یا / استفاده کنید.</p>';
  c.students.forEach(function(s,i){
    var v=e.scores&&e.scores[s.id]!=null?e.scores[s.id]:'';
    h+='<div class="st"><span>'+fa(i+1)+'. '+esc(s.name)+'</span><input class="sc" id="sc_'+s.id+'" inputmode="decimal" autocomplete="off" aria-label="نمره '+esc(s.name)+'" value="'+v+'"></div>';
  });
  return h+'<div style="margin-top:12px"><button class="btn" data-act="saveScores">ذخیره نمره‌ها</button></div></div>';
}
function r2(n){return Math.round(n*100)/100}
function indTotals(c){
  var rows=c.students.map(function(s){
    var t=0,n=0;
    exs(c).forEach(function(e){var v=e.scores&&e.scores[s.id];if(v!=null){t+=v;n++}});
    var g=grp(c).filter(function(x){return x.id===s.groupId})[0];
    var ad=compIndAdj(c,s.id,nowMs());