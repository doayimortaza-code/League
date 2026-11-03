    var okn=GQ.res.filter(function(r){return r.ok}).length;
    h+='<p class="muted">'+fa(okn)+' پاسخ درست از '+fa(GQ.res.length)+' سؤال. فقط با زدن دکمه زیر در لیگ گروهی ثبت می‌شود.</p><div class="row"><button class="btn" data-act="gqsave">ثبت امتیاز در لیگ گروهی</button><button class="btn ghost" data-act="gqback">ثبت نشود</button></div></div>';
  }
  var hist=(c.gquiz||[]).slice().reverse();
  if(GQ.stage==='menu'&&hist.length){
    h+='<h2>سابقه پرسش‌های گروهی</h2><div class="card">';
    hist.forEach(function(r){
      var line=Object.keys(r.pts).map(function(gid){var g=grp(c).filter(function(x){return x.id===gid})[0];return esc(g?g.name:'؟')+': '+fa(r.pts[gid])}).join(' - ');
      h+='<div class="st"><span>'+esc(new Date(r.ts).toLocaleDateString('fa-IR'))+' - '+esc(chInfo(r.ch).s)+'<br><span class="muted">'+line+'</span></span><button class="btn danger" data-act="gqdel" data-id="'+r.id+'">حذف</button></div>';
    });
    h+='</div>';
  }
  return h;
}
function normPw(t){return String(t||'').replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632}).trim()}
function u8b64(u){var s='',i;for(i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
async function encObj(obj,pw){
  var enc=new TextEncoder(),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  var km=await crypto.subtle.importKey('raw',enc.encode(normPw(pw)),'PBKDF2',false,['deriveKey']);
  var key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:KDF_IT,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt']);
  var ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,enc.encode(JSON.stringify(obj))));
  var all=new Uint8Array(16+12+ct.length);all.set(salt,0);all.set(iv,16);all.set(ct,28);
  return 'E1.'+u8b64(all);
}
function siteBase(){return location.href.replace(/[#?].*$/,'').replace(/[^\/]*$/,'')}
function copyText(t){
  return new Promise(function(res){
    function fb(){try{var e=document.createElement('textarea');e.value=t;e.setAttribute('readonly','');e.style.position='fixed';e.style.opacity='0';document.body.appendChild(e);e.select();var ok=document.execCommand('copy');document.body.removeChild(e);return ok}catch(x){return false}}
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){res(true)},function(){res(fb())});return}}catch(e){}
    res(fb());
  });
}
function pwRand(){return ('000000'+rndInt(1000000)).slice(-6)}
function pmsg(c,it){return 'اولیای محترم '+it.name+'\nکارنامه فرزندتان ('+c.name+' - '+(c.school||'')+') آماده است.\nلینک کارنامه:\n'+it.link+'\nدر صفحه باز شده، نام دانش‌آموز ('+it.name+') و رمز ورود را بنویسید.\nرمز ورود: '+it.pw+'\n(این پیام و رمز فقط برای شما است. لطفاً برای دیگران نفرستید.)'}
function boardText(c,d,link){
  var t='🏆 دانش‌آموزان نمونه '+d.m+' - '+d.c+' ('+d.s+')\n';
  if(d.cond.length)t+='\n🌟 نمونه اخلاقی: '+d.cond.join('، ');
  if(d.study.length)t+='\n📚 نمونه درسی: '+d.study.join('، ');
  if(d.impr.length)t+='\n📈 بیشترین پیشرفت: '+d.impr.join('، ');
  return t+'\n\nبه همه عزیزان تبریک می‌گوییم 🌹\nمشاهده تابلو:\n'+link;
}
function vParentCard(c){
  var pw=c.pwd||{};
  var h='<div class="card"><b>کارنامه اولیا (با رمز)</b><p class="muted">برای هر دانش‌آموز یک رمز بنویسید (یا «ساخت رمز تصادفی» را بزنید). کارنامه او با همان رمز رمزگذاری می‌شود و فقط کسی که رمز را بداند آن را می‌بیند. رمز و لینک را جداگانه و فقط برای والدین همان دانش‌آموز بفرستید. رمز حداقل ۴ حرف یا رقم باشد (۶ رقم یا بیشتر امن‌تر است). با ثبت نمره جدید، لینک‌ها باید دوباره ساخته شوند. این بخش فقط در نسخه نصب‌شده روی سایت درست کار می‌کند.</p>';
  c.students.forEach(function(s){h+='<div class="st"><span>'+esc(s.name)+'</span><input class="sc" id="pw_'+s.id+'" value="'+esc(pw[s.id]||'')+'" autocomplete="off" style="width:120px"></div>'});
  h+='<label><input type="checkbox" id="pr" checked style="width:auto;margin:0 6px"> نمایش رتبه کلاس و گروه</label><br><label><input type="checkbox" id="pa" checked style="width:auto;margin:0 6px"> نمایش میانگین کلاس</label><br><label><input type="checkbox" id="pw" checked style="width:auto;margin:0 6px"> نمایش افتخارات شخصی (نمونه هفته و اخلاق)</label>';
  h+='<div class="row" style="margin-top:10px"><button class="btn ghost" data-act="pwRand">ساخت رمز تصادفی برای خالی‌ها</button><button class="btn" data-act="genParent">ساخت لینک‌های کارنامه</button></div></div>';
  var ids=Object.keys(PL).filter(function(id){return c.students.some(function(s){return s.id===id})});
  if(ids.length){
    h+='<div class="card"><b>پیام آماده برای هر خانواده</b><p class="muted">هر دکمه، پیام همان خانواده (لینک و رمز) را کپی می‌کند تا در پیام خصوصی بفرستید.</p>';
    c.students.forEach(function(s){if(PL[s.id])h+='<div class="st"><span>'+esc(s.name)+'</span><button class="btn ghost" data-act="cpPar" data-id="'+s.id+'">کپی پیام</button></div>'});
    h+='</div>';
  }
  return h;
}
function vBoardCard(c){
  var imp=improveData(c),top=indTotals(c).filter(function(r){return r.total>0}).slice(0,6),cond=[],seen={},ekm=(c.exem||{})[mKey(nowMs())]||[];
  ekm.forEach(function(id){if(!seen[id]&&c.students.some(function(s){return s.id===id})){seen[id]=1;cond.push(id)}});
  aws(c).slice().reverse().forEach(function(a){if(a.type==='conduct'&&!seen[a.sid]&&c.students.some(function(s){return s.id===a.sid})&&cond.length<8){seen[a.sid]=1;cond.push(a.sid)}});
  if(BD.init!==c.id){BD.init=c.id;BD.sel={c:{},s:{},i:{}};imp.forEach(function(r){BD.sel.i[r.id]=1});ekm.forEach(function(id){BD.sel.c[id]=1});BD.link='';BD.text=''}
  if(!BD.month)BD.month=new Date().toLocaleDateString('fa-IR',{month:'long',year:'numeric'});
  var h='<div class="card"><b>تابلوی افتخارات ماه (برای همه)</b><p class="muted">فقط نام‌هایی که شما تأیید کنید (تیک بزنید) در تابلو می‌آید و برای هر کس که لینک را داشته باشد قابل دیدن است. نمره‌ها در تابلو نیست. گزینه‌های پیشنهادی پایین را بررسی و اصلاح کنید.</p><label for="bdm">عنوان ماه</label><input id="bdm" value="'+esc(BD.month)+'">';
  function list(title,items,pref,key,sub){
    var o='<p><b>'+title+'</b></p>';
    if(!items.length)return o+'<p class="muted">موردی برای پیشنهاد نیست.</p>';
    items.forEach(function(r){var id=r.id||r,nm=r.name||gqName(c,id);o+='<label style="display:block"><input type="checkbox" id="'+pref+id+'"'+(BD.sel[key][id]?' checked':'')+' style="width:auto;margin:0 6px">'+esc(nm)+(sub&&r.delta!==undefined?' <span class="muted">(+'+fn(r.delta)+' درصد)</span>':'')+'</label>'});
    return o;
  }
  h+=list('🌟 نمونه اخلاقی (از جایزه‌های ثبت‌شده)',cond.map(function(id){return {id:id,name:gqName(c,id)}}),'bc_','c');
  h+=list('📚 نمونه درسی (برترین‌های لیگ فردی)',top.map(function(r){return {id:r.id,name:r.name}}),'bs_','s');
  h+=list('📈 سه نفر با بیشترین پیشرفت',imp,'bi_','i',true);
  h+='<div style="margin-top:10px"><button class="btn" data-act="bdMake">تأیید و ساخت لینک تابلو</button></div></div>';
  if(BD.link)h+='<div class="card"><b>متن آماده برای گروه</b><textarea id="bdt" rows="8" readonly>'+esc(BD.text)+'</textarea><div class="row" style="margin-top:8px"><button class="btn" data-act="cpBd">کپی متن</button><button class="btn ghost" data-act="cpBdLink">فقط کپی لینک</button></div></div>';
  return h;
}
var GE={cur:null};
function gexTotals(c){var b={};(c.gexams||[]).forEach(function(e){Object.keys(e.scores||{}).forEach(function(g){b[g]=(b[g]||0)+e.scores[g]})});return b}
function gexGroups(c){return grp(c).filter(function(g){return c.students.some(function(s){return s.groupId===g.id})})}
function gexFind(c,id){return (c.gexams||[]).filter(function(e){return e.id===id})[0]||null}
function vGExam(){
  var c=active(),h=back()+'<h2>آزمون گروهی 📋</h2><div id="live">'+msgBox()+'</div>';
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';
  var gs=gexGroups(c);
  if(!gs.length)return h+'<div class="empty"><p>گروهی که عضو داشته باشد وجود ندارد.</p><button class="btn" data-act="go" data-v="groups">رفتن به گروه‌ها</button></div>';
  var e=GE.cur?gexFind(c,GE.cur):null;
  if(GE.cur&&!e)GE.cur=null;
  if(e){
    h='<button class="back" data-act="gexBack">بازگشت به آزمون‌های گروهی</button><h2>'+esc(e.title)+'</h2><div id="live">'+msgBox()+'</div>';
    h+='<div class="card"><label for="gt">عنوان</label><input id="gt" value="'+esc(e.title)+'"><label for="gm">نمره کل</label><input id="gm" inputmode="decimal" value="'+e.max+'"><label for="gd">تاریخ</label><input id="gd" value="'+esc(e.date)+'"><button class="btn ghost" data-act="gexEdit">ذخیره مشخصات آزمون</button></div>';
    h+='<div class="card"><p class="muted">نمره هر گروه را از ۰ تا '+fn(e.max)+' بنویسید. خالی بگذارید یعنی نمره ثبت نشده. این نمره فقط به لیگ گروهی اضافه می‌شود.</p>';
    gs.forEach(function(g){var v=e.scores&&e.scores[g.id]!=null?e.scores[g.id]:'';h+='<div class="st"><span>'+esc(g.name)+'</span><input class="sc" id="ge_'+g.id+'" inputmode="decimal" autocomplete="off" aria-label="نمره گروه '+esc(g.name)+'" value="'+v+'"></div>'});
    return h+'<div style="margin-top:12px"><button class="btn" data-act="gexSave">ذخیره نمره‌ها</button></div></div>';
  }
  h+='<div class="card"><p class="muted">در این بخش برای هر گروه یک نمره ثبت می‌کنید. این نمره <b>فقط به لیگ گروهی</b> اضافه می‌شود و در نمره و لیگ فردی دانش‌آموزان هیچ اثری ندارد.</p></div>';
  var list=(c.gexams||[]);
  if(!list.length)h+='<div class="empty"><p>هنوز آزمون گروهی ثبت نشده است.</p></div>';
  list.slice().reverse().forEach(function(x){
    var line=gs.map(function(g){var v=x.scores&&x.scores[g.id];return esc(g.name)+': '+(v==null?'ثبت نشده':fn(v))}).join(' - ');
    h+='<div class="card"><div class="row"><b>'+esc(x.title)+'</b><span class="muted">'+esc(x.date)+'</span></div><div class="muted">نمره کل: '+fn(x.max)+'<br>'+line+'</div><div class="row" style="margin-top:10px"><button class="btn" data-act="gexOpen" data-id="'+x.id+'">ثبت و ویرایش نمره‌ها</button><button class="btn danger" data-act="gexDel" data-id="'+x.id+'">حذف آزمون</button></div></div>';
  });
  return h+'<h2>آزمون گروهی جدید</h2><div class="card"><label for="gt">عنوان آزمون</label><input id="gt" placeholder="مثلاً: مسابقه ریاضی گروه‌ها"><label for="gm">نمره کل آزمون</label><input id="gm" inputmode="decimal" placeholder="مثلاً ۲۰"><label for="gd">تاریخ</label><input id="gd" value="'+new Date().toLocaleDateString('fa-IR')+'"><button class="btn" data-act="gexAdd">ساخت آزمون گروهی</button></div>';
}
var NOWF=function(){return Date.now()};
var CP={tab:'rec',area:'d',text:'',month:'',open:null,last:null};
var AREAS={d:'انضباط',h:'حل تکالیف',t:'کار گروهی'},MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function nowMs(){return NOWF()}
function mKey(ts){var y='',m='';new Intl.DateTimeFormat('en-u-ca-persian',{year:'numeric',month:'numeric'}).formatToParts(new Date(ts)).forEach(function(x){if(x.type==='year')y=x.value;if(x.type==='month')m=x.value});return y+'-'+('0'+m).slice(-2)}
function mName(k){var m=Number(String(k).slice(5));return (MONTHS[m-1]||'')+' '+pf(String(k).slice(0,4))}
function compNeg(c,sid,now){
  var W=14*86400000;
  var es=(c.comp||[]).filter(function(e){return e.sid===sid&&e.sign==='-'}).map(function(e){return{e:e,t:Date.parse(e.ts)}}).sort(function(a,b){return a.t-b.t});
  var out=[],act=0;
  es.forEach(function(x,i){
    var rep=es.some(function(y,j){return j!==i&&Math.abs(y.t-x.t)<=W});
    var until=x.t+W,active=rep||now<=until;
    if(active)act++;
    out.push({e:x.e,perm:rep,active:active,until:until});
  });
  return{list:out,act:act,pen:Math.floor(act/3)};
}
function exemCount(c,sid){var n=0,ex=c.exem||{};Object.keys(ex).forEach(function(k){if(ex[k].indexOf(sid)>=0)n++});return n}
function compIndAdj(c,sid,now){var ng=compNeg(c,sid,now),ex=exemCount(c,sid);return{v:ex-4*ng.pen,pen:ng.pen,exm:ex,act:ng.act}}
function gcomp(c,gid,now){
  var pen=0,ex=0,tw=0;
  c.students.forEach(function(s){if(s.groupId!==gid)return;var a=compIndAdj(c,s.id,now);pen+=a.pen;ex+=a.exm});
  Object.keys(c.twclose||{}).forEach(function(k){tw+=(c.twclose[k][gid]||0)});
  return{v:ex-pen+tw,pen:pen,exm:ex,tw:tw};
}
function mStats(c,sid,key){var p=0,n=0;(c.comp||[]).forEach(function(e){if(e.sid===sid&&mKey(e.ts)===key){if(e.sign==='+')p++;else n++}});return{p:p,n:n,net:p-n}}
function twStats(c,gid,key){var p=0,n=0;(c.twork||[]).forEach(function(e){if(e.gid===gid&&mKey(e.ts)===key){if(e.sign==='+')p++;else n++}});return{p:p,n:n,net:p-n}}
function twDelta(c,gid,key){var s=twStats(c,gid,key);return s.net>0?1:(s.net<0?-1:0)}
function cpMonths(c){
  var set={};set[mKey(nowMs())]=1;
  (c.comp||[]).forEach(function(e){set[mKey(e.ts)]=1});(c.twork||[]).forEach(function(e){set[mKey(e.ts)]=1});
  Object.keys(c.twclose||{}).forEach(function(k){set[k]=1});Object.keys(c.exem||{}).forEach(function(k){set[k]=1});
  return Object.keys(set).sort().reverse();
}
function cpMonthSel(c){
  return '<label for="cpm">ماه</label><select id="cpm" class="fs" data-act="cpMonth">'+cpMonths(c).map(function(k){return '<option value="'+k+'"'+(CP.month===k?' selected':'')+'>'+mName(k)+'</option>'}).join('')+'</select>';
}
function sgn(n){return n>0?'+'+fa(n):(n<0?'−'+fa(Math.abs(n)):fa(0))}
function dFa(ts){return new Date(ts).toLocaleDateString('fa-IR')}
function cpDetail(c,st,now){
  var h='<button class="back" data-act="cpCloseOpen">بازگشت به فهرست</button><h2>'+esc(st.name)+'</h2>';
  var ng=compNeg(c,st.id,now),ad=compIndAdj(c,st.id,now);
  h+='<div class="card"><p class="muted">منفی‌های فعال: '+fa(ng.act)+' (هر ۳ منفی: ۴ نمره از لیگ فردی و ۱ امتیاز از لیگ گروهی کم می‌شود). کسر فعلی شایستگی در لیگ فردی: '+sgn(ad.v)+(ad.exm?' (شامل '+fa(ad.exm)+' بار نمونه ماه)':'')+'</p></div>';
  var es=(c.comp||[]).filter(function(e){return e.sid===st.id}).slice().sort(function(a,b){return Date.parse(b.ts)-Date.parse(a.ts)});
  h+='<div class="card">';
  if(!es.length)h+='<p class="muted">هنوز رفتاری ثبت نشده است.</p>';
  es.forEach(function(e){
    var nx=ng.list.filter(function(x){return x.e.id===e.id})[0],stt='';
    if(e.sign==='-'&&nx)stt=nx.perm?'ماندگار':(nx.active?'موقت تا '+dFa(nx.until):'حذف‌شده خودکار (بعد از ۲ هفته)');
    h+='<div class="st"><span>'+(e.sign==='+'?'➕':'➖')+' '+esc(AREAS[e.area]||'')+' - '+dFa(e.ts)+'<br><span class="muted">'+esc(e.text||'بدون توضیح')+(stt?' - '+stt:'')+'</span></span><button class="btn danger" data-act="cpDel" data-id="'+e.id+'">حذف</button></div>';
  });
  return h+'</div>';
}
function cpRec(c){
  var now=nowMs(),key=mKey(now),h='';
  if(CP.open){var st=c.students.filter(function(s){return s.id===CP.open})[0];if(st)return cpDetail(c,st,now);CP.open=null}
  h+='<div class="card"><p class="muted">اول بخش را انتخاب کنید و در صورت نیاز رفتار مشاهده‌شده را بنویسید، بعد جلوی نام دانش‌آموز ➕ یا ➖ را بزنید. منفی تا ۲ هفته می‌ماند و اگر تکرار نشود خودکار حذف می‌شود؛ اگر تکرار شود ماندگار می‌شود. هر ۳ منفی: ۴ نمره از لیگ فردی و ۱ امتیاز از لیگ گروهی کم می‌شود.</p>';
  h+='<div class="row" style="margin-bottom:8px">'+['d','h','t'].map(function(a){return '<button class="btn'+(CP.area===a?'':' ghost')+'" data-act="cpArea" data-id="'+a+'">'+AREAS[a]+'</button>'}).join('')+'</div>';
  h+='<label for="cpt">رفتار مشاهده‌شده (اختیاری)</label><input id="cpt" value="'+esc(CP.text)+'" placeholder="مثلاً: بدون اجازه صحبت کرد">';
  if(CP.last)h+='<button class="btn ghost" data-act="cpUndo">بازگرداندن آخرین ثبت</button>';
  h+='</div><div class="card"><b>'+AREAS[CP.area]+' - '+mName(key)+'</b>';
  c.students.forEach(function(s,i){
    var ms=mStats(c,s.id,key),ng=compNeg(c,s.id,now);
    h+='<div class="st"><span>'+fa(i+1)+'. '+esc(s.name)+'<br><span class="muted">این ماه: +'+fa(ms.p)+' / −'+fa(ms.n)+(ng.act?' - منفی فعال: '+fa(ng.act)+(ng.pen?' (کسر شده)':''):'')+'</span></span><span class="row" style="gap:6px"><button class="btn" data-act="cpAdd" data-id="'+s.id+'" data-s="+" aria-label="مثبت برای '+esc(s.name)+'">➕</button><button class="btn danger" data-act="cpAdd" data-id="'+s.id+'" data-s="-" aria-label="منفی برای '+esc(s.name)+'">➖</button><button class="btn ghost" data-act="cpOpen" data-id="'+s.id+'">سابقه</button></span></div>';
  });
  return h+'</div>';
}
function cpTwk(c){
  var gs=gexGroups(c);
  if(!gs.length)return '<div class="empty"><p>گروهی که عضو داشته باشد وجود ندارد.</p><button class="btn" data-act="go" data-v="groups">رفتن به گروه‌ها</button></div>';
  var mk=CP.month,h='<div class="card"><p class="muted">برای هر گروه بر اساس عملکردش ➕ یا ➖ ثبت کنید. در پایان ماه: اگر مثبت‌ها بیشتر از منفی‌ها باشد ۱ امتیاز به گروه اضافه و اگر منفی‌ها بیشتر باشد ۱ امتیاز از گروه کم می‌شود (با دکمه «پایان ماه» ثبت می‌شود).</p>'+cpMonthSel(c)+'<label for="cpt">رفتار مشاهده‌شده (اختیاری)</label><input id="cpt" value="'+esc(CP.text)+'" placeholder="مثلاً: همکاری خوب در کار گروهی"></div>';
  h+='<div class="card"><b>'+mName(mk)+'</b>';
  gs.forEach(function(g){
    var st=twStats(c,g.id,mk),d=twDelta(c,g.id,mk);
    h+='<div class="st"><span>'+esc(g.name)+'<br><span class="muted">+'+fa(st.p)+' / −'+fa(st.n)+' - نتیجه ماه: '+sgn(d)+'</span></span><span class="row" style="gap:6px"><button class="btn" data-act="twAdd" data-id="'+g.id+'" data-s="+" aria-label="مثبت برای گروه '+esc(g.name)+'">➕</button><button class="btn danger" data-act="twAdd" data-id="'+g.id+'" data-s="-" aria-label="منفی برای گروه '+esc(g.name)+'">➖</button></span></div>';
  });
  var closed=(c.twclose||{})[mk];
  h+='<div style="margin-top:10px">'+(closed?'<p class="muted">این ماه بسته شده است ('+gs.map(function(g){return esc(g.name)+': '+sgn(closed[g.id]||0)}).join('، ')+'). اگر بعد از آن رفتار جدیدی ثبت کردید، دوباره «پایان ماه» را بزنید.</p>':'')+'<button class="btn" data-act="twClose">پایان ماه و ثبت نتیجه در لیگ گروهی</button></div></div>';
  var es=(c.twork||[]).filter(function(e){return mKey(e.ts)===mk}).slice().sort(function(a,b){return Date.parse(b.ts)-Date.parse(a.ts)});
  if(es.length){
    h+='<div class="card"><b>رفتارهای ثبت‌شده این ماه</b>';
    es.forEach(function(e){var g=grp(c).filter(function(x){return x.id===e.gid})[0];h+='<div class="st"><span>'+(e.sign==='+'?'➕':'➖')+' '+esc(g?g.name:'؟')+' - '+dFa(e.ts)+'<br><span class="muted">'+esc(e.text||'بدون توضیح')+'</span></span><button class="btn danger" data-act="twDel" data-id="'+e.id+'">حذف</button></div>'});
    h+='</div>';
  }
  return h;
}
function cpExm(c){
  var mk=CP.month,reg=(c.exem||{})[mk]||null;
  var rows=c.students.map(function(s){return{s:s,st:mStats(c,s.id,mk)}}).sort(function(a,b){return b.st.net-a.st.net||a.s.name.localeCompare(b.s.name,'fa')});
  var pre={};
  if(reg)reg.forEach(function(id){pre[id]=1});else rows.filter(function(r){return r.st.net>0}).slice(0,3).forEach(function(r){pre[r.s.id]=1});
  var h='<div class="card"><p class="muted">هر ماه حداکثر ۳ دانش‌آموز نمونه اخلاق و شایسته انتخاب می‌شود. هر نفر ۱ نمره در لیگ فردی و ۱ امتیاز برای گروهش می‌گیرد. فهرست بر اساس (مثبت‌ها − منفی‌های) همان ماه مرتب شده است؛ تصمیم نهایی با شماست.</p>'+cpMonthSel(c)+'</div>';
  h+='<div class="card"><b>انتخاب نمونه‌های '+mName(mk)+'</b>'+(reg?'<p class="muted">برای این ماه قبلاً ثبت شده است. با ثبت دوباره، فهرست قبلی عوض می‌شود.</p>':'');
  rows.forEach(function(r){h+='<label style="display:block;padding:4px 0"><input type="checkbox" id="ex_'+r.s.id+'"'+(pre[r.s.id]?' checked':'')+' style="width:auto;margin:0 6px">'+esc(r.s.name)+' <span class="muted">(+'+fa(r.st.p)+' / −'+fa(r.st.n)+')</span></label>'});
  h+='<div style="margin-top:10px"><button class="btn" data-act="exSave">ثبت نمونه‌های ماه</button></div></div>';
  var keys=Object.keys(c.exem||{}).sort().reverse();
  if(keys.length){
    h+='<div class="card"><b>نمونه‌های ثبت‌شده</b>';
    keys.forEach(function(k){h+='<div class="st"><span>'+mName(k)+'<br><span class="muted">'+c.exem[k].map(function(id){return esc(gqName(c,id))}).join('، ')+'</span></span><span class="row" style="gap:6px"><button class="btn ghost" data-act="exCopy" data-id="'+k+'">کپی متن</button><button class="btn danger" data-act="exDel" data-id="'+k+'">حذف</button></span></div>'});
    h+='</div>';
  }
  return h;
}
function exText(c,k){return '🌟 دانش‌آموزان نمونه اخلاق و شایسته '+mName(k)+' - '+c.name+' ('+(c.school||'')+')\n\n'+c.exem[k].map(function(id){return '⭐ '+gqName(c,id)}).join('\n')+'\n\nبه این عزیزان تبریک می‌گوییم 🌹'}
function vComp(){
  var c=active(),h=back()+'<h2>شایستگی 🌟</h2><div id="live">'+msgBox()+'</div>';
  if(!c)return h+'<div class="empty"><div class="ic">🏫</div><p>اول یک کلاس بسازید یا انتخاب کنید.</p><button class="btn" data-act="go" data-v="classes">رفتن به کلاس‌ها</button></div>';