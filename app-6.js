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
  var imp=improveData(c),top=indTotals(c).filter(function(r){return r.total>0}).slice(0,6),cond=[],seen={};
  aws(c).slice().reverse().forEach(function(a){if(a.type==='conduct'&&!seen[a.sid]&&c.students.some(function(s){return s.id===a.sid})&&cond.length<8){seen[a.sid]=1;cond.push(a.sid)}});
  if(BD.init!==c.id){BD.init=c.id;BD.sel={c:{},s:{},i:{}};imp.forEach(function(r){BD.sel.i[r.id]=1});BD.link='';BD.text=''}
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
function vPh(t){return back()+'<div class="empty"><h2>'+esc(t)+'</h2><p>این بخش در مرحله‌های بعدی ساخته می‌شود.</p></div>'}
function render(keep){var y=window.scrollY;
  var h=view==='home'?vHome():view==='classes'?vClasses():view==='students'?vStudents():view==='groups'?vGroups():view==='backup'?vBackup():view==='exams'?vExams():view==='leagueInd'?vLeagueInd():view==='leagueGrp'?vLeagueGrp():view==='honors'?vHonors():view==='settings'?vSettings():view==='practice'?vPractice():view==='lottery'?vLottery():view==='gquiz'?vGQuiz():view==='gexam'?vGExam():vPh(view.slice(3));
  document.getElementById('app').innerHTML=h;window.scrollTo(0,keep?y:0);
  if(focusId){var f=document.getElementById(focusId);if(f)f.focus();focusId=null}
}
function arm(btn,key,label){
  if(armed===key)return true;
  armed=key;var old=btn.textContent;btn.textContent=label;btn.classList.add('armed');
  setTimeout(function(){if(armed===key){armed=null;if(btn.isConnected){btn.textContent=old;btn.classList.remove('armed')}}},3000);
  return false;
}
function hasName(c,n){return c.students.some(function(s){return s.name===n})}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-act]');if(!t)return;
  var a=t.dataset.act,id=t.dataset.id,c=active();
  if(a==='go'){view=t.dataset.v;armed=null;curExam=null;xferId=null;pr=null;GE.cur=null;render()}
  else if(a==='pick'){db.activeId=id;save();msg='کلاس فعال تغییر کرد.';render()}
  else if(a==='delClass'){
    if(!arm(t,'c'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;db.classes=db.classes.filter(function(x){return x.id!==id});
    if(db.activeId===id)db.activeId=firstActive();
    save();msg='کلاس حذف شد.';render();
  }
  else if(a==='addClass'){
    var n=val('cn');if(!n){msg='نام کلاس را بنویسید.';render();return}
    var k={id:uid('c'),name:n,grade:val('cg'),school:val('cs'),year:val('cy'),teacher:val('ct'),students:[],groups:[]};
    if(db.classes.some(function(x){return x.name===n&&x.year===k.year})){msg='کلاسی با همین نام و سال تحصیلی وجود دارد.';render();return}
    db.classes.push(k);db.activeId=k.id;save();msg='کلاس «'+n+'» ساخته شد و فعال است.';render();
  }
  else if(a==='addStu'&&c){
    var nm=val('sn');
    if(!nm)msg='نام را بنویسید.';
    else if(c.students.length>=MAX)msg='ظرفیت کلاس پر است (حداکثر '+fa(MAX)+' نفر).';
    else if(hasName(c,nm))msg='این نام قبلاً در این کلاس ثبت شده است.';
    else{c.students.push({id:uid('s'),name:nm});save();msg='«'+nm+'» اضافه شد.'}
    focusId='sn';render();
  }
  else if(a==='addBulk'&&c){
    var lines=(document.getElementById('sb').value||'').split(/\n/).map(norm).filter(Boolean),add=0,dup=0,full=0;
    lines.forEach(function(l){
      if(c.students.length>=MAX){full++;return}
      if(hasName(c,l)){dup++;return}
      c.students.push({id:uid('s'),name:l});add++;
    });
    save();msg=fa(add)+' نفر اضافه شد.'+(dup?' '+fa(dup)+' نام تکراری نادیده گرفته شد.':'')+(full?' '+fa(full)+' نام به‌خاطر پر بودن ظرفیت اضافه نشد.':'');render();
  }
  else if(a==='addGroup'&&c){
    var gn=val('gn'),gs=grp(c);
    if(!gn)msg='نام گروه را بنویسید.';
    else if(gs.some(function(g){return g.name===gn}))msg='گروهی با این نام در این کلاس وجود دارد.';
    else{gs.push({id:uid('g'),name:gn});save();msg='گروه «'+gn+'» ساخته شد.'}
    focusId='gn';render();
  }
  else if(a==='delGroup'&&c){
    if(!arm(t,'g'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.groups=grp(c).filter(function(g){return g.id!==id});
    c.students.forEach(function(s){if(s.groupId===id)s.groupId=null});
    save();msg='گروه حذف شد. اعضای آن بدون گروه شدند.';render();
  }
  else if(a==='openExam'){curExam=id;render()}
  else if(a==='closeExam'){curExam=null;render()}
  else if(a==='addExam'&&c){
    var xt=val('xt'),xm=num(val('xm')),xd=val('xd');
    if(!xt)note('عنوان آزمون را بنویسید.');
    else if(xm===null||isNaN(xm)||xm<=0||xm>1000)note('نمره کل آزمون را درست بنویسید (عددی بزرگ‌تر از صفر).');
    else if(exs(c).some(function(x){return x.title===xt&&x.date===xd}))note('آزمونی با همین عنوان و تاریخ قبلاً ثبت شده است.');
    else{var nx={id:uid('x'),title:xt,date:xd,max:xm,scores:{}};exs(c).push(nx);save();curExam=nx.id;msg='آزمون ساخته شد. حالا نمره‌ها را وارد کنید.';render()}
  }
  else if(a==='editExam'&&c){
    var ex=findExam(c,curExam);if(!ex)return;
    var et=val('et'),em=num(val('em')),ed=val('ed'),hi=0;
    Object.keys(ex.scores||{}).forEach(function(k){if(ex.scores[k]>hi)hi=ex.scores[k]});
    if(!et)note('عنوان آزمون را بنویسید.');
    else if(em===null||isNaN(em)||em<=0||em>1000)note('نمره کل آزمون را درست بنویسید.');
    else if(em<hi)note('نمره کل نمی‌تواند از بالاترین نمره ثبت‌شده ('+fn(hi)+') کمتر باشد.');
    else{ex.title=et;ex.max=em;ex.date=ed;save();msg='مشخصات آزمون ذخیره شد.';render(true)}
  }
  else if(a==='saveScores'&&c){
    var se=findExam(c,curExam);if(!se)return;
    var bad=[],ns={};
    c.students.forEach(function(s){
      var el=document.getElementById('sc_'+s.id);if(!el)return;
      var v=num(el.value);
      if(v===null)return;
      if(isNaN(v)||v<0||v>se.max)bad.push(s.name);else ns[s.id]=v;
    });
    if(bad.length){note('نمره نامعتبر برای: '+bad.slice(0,5).join('، ')+(bad.length>5?' و '+fa(bad.length-5)+' نفر دیگر':'')+'. نمره باید بین ۰ و '+fn(se.max)+' باشد. چیزی ذخیره نشد.');return}
    se.scores=ns;save();msg='نمره‌ها ذخیره شد: '+fa(Object.keys(ns).length)+' نفر.';render(true);
  }
  else if(a==='delExam'&&c){
    if(!arm(t,'x'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.exams=exs(c).filter(function(x){return x.id!==id});curExam=null;save();msg='آزمون حذف شد.';render(true);
  }
  else if(a==='addAward'&&c){
    var ty=document.getElementById('at').value,sid=document.getElementById('as').value,ad=val('ad'),an=val('an');
    var stu=c.students.filter(function(x){return x.id===sid})[0];
    if(!stu)note('دانش‌آموز را انتخاب کنید.');
    else if(!ad)note('تاریخ یا هفته را بنویسید.');
    else if(aws(c).some(function(w){return w.type===ty&&w.sid===sid&&w.date===ad}))note('این جایزه با همین تاریخ قبلاً برای این دانش‌آموز ثبت شده است.');
    else{aws(c).push({id:uid('w'),type:ty,sid:sid,nm:stu.name,date:ad,note:an,ts:new Date().toISOString()});save();msg='«'+stu.name+'» به‌عنوان '+AW[ty]+' ثبت شد.';render(true)}
  }
  else if(a==='awf'){awFilter=id;render(true)}
  else if(a==='delAward'&&c){
    if(!arm(t,'w'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.awards=aws(c).filter(function(w){return w.id!==id});save();msg='جایزه حذف شد.';render(true);
  }
  else if(a==='editClass'&&c){
    var kn=val('kn'),ky=val('ky');
    if(!kn)note('نام کلاس را بنویسید.');
    else if(db.classes.some(function(x){return x.id!==c.id&&x.name===kn&&x.year===ky}))note('کلاس دیگری با همین نام و سال تحصیلی وجود دارد.');
    else{c.name=kn;c.grade=val('kg');c.school=val('ks');c.year=ky;c.teacher=val('kt');save();msg='تغییرات کلاس ذخیره شد.';render(true)}
  }
  else if(a==='archiveClass'&&c){
    if(!arm(t,'ac','مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.archived=true;db.activeId=firstActive();save();msg='کلاس بایگانی شد. هر وقت خواستید از همین‌جا بازیابی کنید.';render(true);
  }
  else if(a==='restoreClass'){
    var rc=db.classes.filter(function(x){return x.id===id})[0];
    if(rc){rc.archived=false;if(!db.activeId)db.activeId=rc.id;save();msg='کلاس «'+rc.name+'» بازیابی شد.';render(true)}
  }
  else if(a==='xfer'&&c){xferId=id;render()}
  else if(a==='cancelXfer'){xferId=null;render(true)}
  else if(a==='doXfer'&&c&&xferId){
    if(!arm(t,'xf','مطمئنید؟ دوباره بزنید'))return;
    armed=null;
    var dest=db.classes.filter(function(k){return k.id===document.getElementById('tc').value})[0];
    var nmx=(c.students.filter(function(x){return x.id===xferId})[0]||{}).name;
    var er=transferStudent(c,dest,xferId);
    if(er)msg=er;else{save();msg='«'+nmx+'» به کلاس «'+dest.name+'» منتقل شد.';xferId=null}
    render(true);
  }
  else if(a==='csv'&&c){doCsv(c)}
  else if(a==='csvText'&&c){csvShow=buildCsv(c).replace('\uFEFF','');msg='متن CSV در کادر پایین است.';render(true)}
  else if(a==='gqdraw'&&c){if(GQ.stage==='menu')gqRead();gqDraw(c);GQ.stage='pick';render()}
  else if(a==='gqstart'&&c){gqStart();render()}
  else if(a==='gqshow'){GQ.shown=true;render(true)}
  else if(a==='gqgood'){gqJudge(true);render()}
  else if(a==='gqbad'){gqJudge(false);render()}
  else if(a==='gqback'){GQ.stage='menu';GQ.sel=[];GQ.q=null;render()}
  else if(a==='gqsave'&&c){
    if(!arm(t,'gqs','مطمئنید؟ دوباره بزنید'))return;
    armed=null;var gp=gqPoints();
    if(!c.gquiz)c.gquiz=[];
    c.gquiz.push({id:uid('q'),ts:new Date().toISOString(),ch:GQ.ch,lvl:GQ.lvl,pts:gp,n:GQ.res.length,ok:GQ.res.filter(function(r){return r.ok}).length,res:GQ.res.map(function(r){return{g:r.gid,s:r.sid,ok:r.ok}})});
    save();GQ.stage='menu';GQ.sel=[];GQ.q=null;msg='امتیاز پرسش گروهی در لیگ گروهی ثبت شد.';render();
  }
  else if(a==='gqdel'&&c){if(!arm(t,'gd'+id,'مطمئنید؟ دوباره بزنید'))return;armed=null;c.gquiz=(c.gquiz||[]).filter(function(x){return x.id!==id});save();msg='سابقه حذف شد.';render(true)}
  else if(a==='pwRand'&&c){c.pwd=c.pwd||{};c.students.forEach(function(s2){var e=document.getElementById('pw_'+s2.id),v=normPw(e?e.value:'');if(!v)v=pwRand();c.pwd[s2.id]=v});save();msg='رمزها ثبت شد.';render(true)}
  else if(a==='genParent'&&c){
    c.pwd=c.pwd||{};var badp=[];
    c.students.forEach(function(s2){var e=document.getElementById('pw_'+s2.id),v=normPw(e?e.value:'');if(v.length<4)badp.push(s2.name);else c.pwd[s2.id]=v});
    if(badp.length){note('رمز این دانش‌آموزان خالی یا کوتاه‌تر از ۴ حرف یا رقم است: '+badp.slice(0,6).join('، ')+(badp.length>6?' و ...':''));return}
    save();
    var po={rank:document.getElementById('pr').checked,avg:document.getElementById('pa').checked,aw:document.getElementById('pw').checked};
    if(!(window.crypto&&window.crypto.subtle)){note('این مرورگر یا این آدرس از رمزگذاری پشتیبانی نمی‌کند. برنامه را از آدرس https باز کنید.');return}
    var cards=parentCards(c,po),pbase=siteBase()+'karname.html#';PL={};
    (async function(){
      try{
        for(var ii=0;ii<cards.length;ii++){note('در حال ساخت لینک‌ها: '+fa(ii+1)+' از '+fa(cards.length));var cd=await encObj(cards[ii].obj,c.pwd[cards[ii].id]);PL[cards[ii].id]={name:cards[ii].name,link:pbase+cd,pw:c.pwd[cards[ii].id]}}
        msg='لینک‌ها ساخته شد: '+fa(cards.length)+' دانش‌آموز.';render(true);
      }catch(e){note('ساخت لینک‌ها ناموفق بود.')}
    })();
  }
  else if(a==='cpPar'&&c&&PL[id]){copyText(pmsg(c,PL[id])).then(function(ok){note(ok?'پیام کپی شد ✅ حالا در پیام خصوصی بچسبانید.':'کپی خودکار ممکن نشد.')})}
  else if(a==='bdMake'&&c){
    BD.month=val('bdm')||BD.month;
    var bsel={c:{},s:{},i:{}},bn={c:[],s:[],i:[]};
    c.students.forEach(function(s2){[['c','bc_'],['s','bs_'],['i','bi_']].forEach(function(k2){var e=document.getElementById(k2[1]+s2.id);if(e&&e.checked){bsel[k2[0]][s2.id]=1;bn[k2[0]].push(s2.name)}})});
    BD.sel=bsel;
    if(!bn.c.length&&!bn.s.length&&!bn.i.length){note('حداقل یک نفر را برای تابلو تأیید کنید (تیک بزنید).');return}
    var bdata={v:1,m:BD.month,s:c.school||'',c:c.name,t:c.teacher||'',d:new Date().toLocaleDateString('fa-IR'),cond:bn.c,study:bn.s,impr:bn.i};
    BD.link=siteBase()+'karname.html#B1.'+u8b64(new TextEncoder().encode(JSON.stringify(bdata)));
    BD.text=boardText(c,bdata,BD.link);msg='تابلو ساخته شد. متن زیر را کپی کنید.';render(true);
  }
  else if(a==='cpBd'){copyText(BD.text).then(function(ok){note(ok?'متن کپی شد ✅':'کپی خودکار ممکن نشد.')})}