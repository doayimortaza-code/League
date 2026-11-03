  if(!c.students.length)return h+'<div class="empty"><p>هنوز دانش‌آموزی ثبت نشده است.</p><button class="btn" data-act="go" data-v="students">رفتن به دانش‌آموزان</button></div>';
  if(!CP.month)CP.month=mKey(nowMs());
  var tabs=[['rec','ثبت رفتار'],['twk','کار گروهی'],['exm','نمونه ماه']];
  h+='<div class="row" style="margin-bottom:10px">'+tabs.map(function(t){return '<button class="btn'+(CP.tab===t[0]?'':' ghost')+'" data-act="cpTab" data-id="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div>';
  return h+(CP.tab==='rec'?cpRec(c):CP.tab==='twk'?cpTwk(c):cpExm(c));
}
function vPh(t){return back()+'<div class="empty"><h2>'+esc(t)+'</h2><p>این بخش در مرحله‌های بعدی ساخته می‌شود.</p></div>'}
function render(keep){var y=window.scrollY;
  var h=view==='home'?vHome():view==='classes'?vClasses():view==='students'?vStudents():view==='groups'?vGroups():view==='backup'?vBackup():view==='exams'?vExams():view==='leagueInd'?vLeagueInd():view==='leagueGrp'?vLeagueGrp():view==='honors'?vHonors():view==='settings'?vSettings():view==='practice'?vPractice():view==='lottery'?vLottery():view==='gquiz'?vGQuiz():view==='gexam'?vGExam():view==='comp'?vComp():vPh(view.slice(3));
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
  if(a==='go'){view=t.dataset.v;armed=null;curExam=null;xferId=null;pr=null;GE.cur=null;CP.open=null;render()}
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
  else if(a==='cpBdLink'){copyText(BD.link).then(function(ok){note(ok?'لینک کپی شد ✅':'کپی خودکار ممکن نشد.')})}
  else if(a==='pchapter'){
    PS.sid=document.getElementById('pstu').value||'';PS.mode=document.getElementById('pmode').value;PS.n=Number(document.getElementById('pcnt').value);
    pr={stage:'chapter',ch:id};render();
  }
  else if(a==='pmenu'){pr=null;render()}
  else if(a==='preport'){pr={stage:'report'};render()}
  else if(a==='pstartlv'&&pr){var lsel=document.getElementById('plsn');pStart(pr.ch,Number(id),lsel?lsel.value:'all');render()}
  else if(a==='pcheck'&&pr){
    var v=numS(document.getElementById('pa').value);
    if(v===null||isNaN(v)){note('جواب را به‌صورت عدد بنویسید.');return}
    var okk=Math.abs(v-pr.q.ans)<1e-6;pAnswer(okk,v,okk?'':detect(pr.q,v));render();
  }
  else if(a==='ppick'&&pr){
    var sel=pr.q.opts[Number(id)],ok2=String(sel)===String(pr.q.ans);
    pAnswer(ok2,sel,ok2?'':tagFrac(pr.q,sel));render();
  }
  else if(a==='pnext'&&pr){pAdvance();render()}
  else if(a==='pshow'&&pr){pr.shown=true;render(true)}
  else if(a==='pgood'&&pr){pAnswer(true,null,'');pAdvance();render()}
  else if(a==='pbad'&&pr){pAnswer(false,null,pr.q.op==='frac'?'frac':(['add','sub','mul'].indexOf(pr.q.op)>=0?'other':pr.q.op));pAdvance();render()}
  else if(a==='pagain'&&pr){var ch0=pr.ch,lv0=pr.lvl,ls0=pr.ls;pStart(ch0,lv0,ls0);render()}
  else if(a==='pquit'){
    var ch1=pr&&pr.ch;
    if(pr&&pr.stage==='play'&&pr.log.length>0){pr.n=pr.log.length;pFinish()}
    pr=ch1?{stage:'chapter',ch:ch1}:null;render();
  }
  else if(a==='ldraw'){
    ltRead();
    var pool=ltPool(),k=LT.count;
    if(!pool.length){LT.msg=LT.norep&&LT.used.length?'همه شماره‌ها قبلاً انتخاب شده‌اند. «پاک کردن سابقه» را بزنید.':'شماره‌ای برای انتخاب وجود ندارد. «از» و «تا» را بررسی کنید.';LT.last=[];render(true);return}
    var got=ltPick(pool,k);
    if(got.length<k)LT.msg='فقط '+fa(got.length)+' شماره باقی مانده بود و همه آن‌ها انتخاب شدند.';
    LT.last=got;got.forEach(function(x){if(LT.used.indexOf(x)<0)LT.used.push(x)});render(true);
  }
  else if(a==='lreset'){ltRead();LT.used=[];LT.last=[];LT.msg='سابقه پاک شد. همه شماره‌ها دوباره شرکت می‌کنند.';render(true)}
  else if(a==='gexAdd'&&c){
    var gt=val('gt'),gm=num(val('gm')),gd=val('gd');
    if(!gt)note('عنوان آزمون را بنویسید.');
    else if(gm===null||isNaN(gm)||gm<=0||gm>1000)note('نمره کل آزمون را درست بنویسید (عددی بزرگ‌تر از صفر).');
    else if((c.gexams||[]).some(function(x){return x.title===gt&&x.date===gd}))note('آزمونی با همین عنوان و تاریخ قبلاً ثبت شده است.');
    else{if(!c.gexams)c.gexams=[];var ng={id:uid('y'),title:gt,date:gd,max:gm,scores:{}};c.gexams.push(ng);save();GE.cur=ng.id;msg='آزمون گروهی ساخته شد. حالا نمره هر گروه را وارد کنید.';render()}
  }
  else if(a==='gexOpen'){GE.cur=id;render()}
  else if(a==='gexBack'){GE.cur=null;render()}
  else if(a==='gexEdit'&&c){
    var ge1=gexFind(c,GE.cur);if(!ge1)return;
    var et=val('gt'),em=num(val('gm')),ed=val('gd'),hi=0;
    Object.keys(ge1.scores||{}).forEach(function(k){if(ge1.scores[k]>hi)hi=ge1.scores[k]});
    if(!et)note('عنوان آزمون را بنویسید.');
    else if(em===null||isNaN(em)||em<=0||em>1000)note('نمره کل آزمون را درست بنویسید.');
    else if(em<hi)note('نمره کل نمی‌تواند از بالاترین نمره ثبت‌شده ('+fn(hi)+') کمتر باشد.');
    else{ge1.title=et;ge1.max=em;ge1.date=ed;save();msg='مشخصات آزمون ذخیره شد.';render(true)}
  }
  else if(a==='gexSave'&&c){
    var ge2=gexFind(c,GE.cur);if(!ge2)return;
    var badg=[],ns2={};
    gexGroups(c).forEach(function(g){var el=document.getElementById('ge_'+g.id);if(!el)return;var v=num(el.value);if(v===null)return;if(isNaN(v)||v<0||v>ge2.max)badg.push(g.name);else ns2[g.id]=v});
    if(badg.length){note('نمره نامعتبر برای گروه: '+badg.join('، ')+'. نمره باید بین ۰ و '+fn(ge2.max)+' باشد. چیزی ذخیره نشد.');return}
    ge2.scores=ns2;save();msg='نمره‌های گروه‌ها ذخیره شد.';render(true);
  }
  else if(a==='gexDel'&&c){
    if(!arm(t,'gx'+id,'مطمئنید؟ دوباره بزنید'))return;
    armed=null;c.gexams=(c.gexams||[]).filter(function(x){return x.id!==id});if(GE.cur===id)GE.cur=null;save();msg='آزمون گروهی حذف شد.';render(true);
  }
  else if(a==='cpTab'){CP.tab=id;CP.open=null;render()}
  else if(a==='cpArea'){CP.text=val('cpt');CP.area=id;render(true)}
  else if(a==='cpOpen'){CP.open=id;render()}
  else if(a==='cpCloseOpen'){CP.open=null;render(true)}
  else if(a==='cpAdd'&&c){
    var cs=t.dataset.s,cst=c.students.filter(function(x){return x.id===id})[0];
    if(!cst||(cs!=='+'&&cs!=='-'))return;
    if(!c.comp)c.comp=[];
    var ce={id:uid('p'),sid:id,area:CP.area,sign:cs,text:val('cpt').slice(0,300),ts:new Date(nowMs()).toISOString()};
    c.comp.push(ce);CP.last={k:'c',id:ce.id};CP.text='';save();
    var cng=compNeg(c,id,nowMs());
    msg=(cs==='+'?'مثبت':'منفی')+' برای «'+cst.name+'» ثبت شد ('+AREAS[CP.area]+').'+(cs==='-'?' منفی‌های فعال او: '+fa(cng.act)+(cng.pen?' - کسر شایستگی اعمال شد.':''):'');
    render(true);
  }
  else if(a==='twAdd'&&c){
    var ts2=t.dataset.s,tg=grp(c).filter(function(x){return x.id===id})[0];
    if(!tg||(ts2!=='+'&&ts2!=='-'))return;
    if(!c.twork)c.twork=[];
    var te={id:uid('t'),gid:id,sign:ts2,text:val('cpt').slice(0,300),ts:new Date(nowMs()).toISOString()};
    c.twork.push(te);CP.last={k:'t',id:te.id};CP.text='';save();
    msg=(ts2==='+'?'مثبت':'منفی')+' برای گروه «'+tg.name+'» ثبت شد.';render(true);
  }
  else if(a==='cpUndo'&&c&&CP.last){
    var lk=CP.last;if(lk.k==='c')c.comp=(c.comp||[]).filter(function(x){return x.id!==lk.id});else c.twork=(c.twork||[]).filter(function(x){return x.id!==lk.id});
    CP.last=null;save();msg='آخرین ثبت برگردانده شد.';render(true);
  }
  else if(a==='cpDel'&&c){if(!arm(t,'pd'+id,'مطمئنید؟ دوباره بزنید'))return;armed=null;c.comp=(c.comp||[]).filter(function(x){return x.id!==id});if(CP.last&&CP.last.id===id)CP.last=null;save();msg='رفتار حذف شد.';render(true)}
  else if(a==='twDel'&&c){if(!arm(t,'td'+id,'مطمئنید؟ دوباره بزنید'))return;armed=null;c.twork=(c.twork||[]).filter(function(x){return x.id!==id});if(CP.last&&CP.last.id===id)CP.last=null;save();msg='رفتار گروه حذف شد.';render(true)}
  else if(a==='twClose'&&c){
    if(!arm(t,'twc','مطمئنید؟ دوباره بزنید'))return;
    armed=null;var tk=CP.month,tres={};
    gexGroups(c).forEach(function(g2){tres[g2.id]=twDelta(c,g2.id,tk)});
    if(!c.twclose)c.twclose={};c.twclose[tk]=tres;save();msg='نتیجه کار گروهی '+mName(tk)+' در لیگ گروهی ثبت شد.';render(true);
  }
  else if(a==='exSave'&&c){
    var exk=CP.month,exids=[];
    c.students.forEach(function(s2){var e=document.getElementById('ex_'+s2.id);if(e&&e.checked)exids.push(s2.id)});
    if(!exids.length){note('حداقل یک نفر را انتخاب کنید.');return}
    if(exids.length>3){note('در هر ماه حداکثر ۳ نفر قابل ثبت است. تعداد انتخاب‌شده: '+fa(exids.length));return}
    if((c.exem||{})[exk]&&!arm(t,'exs','مطمئنید؟ فهرست قبلی عوض می‌شود'))return;
    armed=null;if(!c.exem)c.exem={};c.exem[exk]=exids;save();
    msg='نمونه‌های '+mName(exk)+' ثبت شد: '+exids.map(function(x){return gqName(c,x)}).join('، ')+'. هر نفر ۱ نمره فردی و ۱ امتیاز برای گروهش گرفت.';render(true);
  }
  else if(a==='exDel'&&c){if(!arm(t,'xd'+id,'مطمئنید؟ دوباره بزنید'))return;armed=null;if(c.exem)delete c.exem[id];save();msg='نمونه‌های آن ماه حذف شد و امتیازشان برداشته شد.';render(true)}
  else if(a==='exCopy'&&c&&c.exem&&c.exem[id]){copyText(exText(c,id)).then(function(ok){note(ok?'متن کپی شد ✅':'کپی خودکار ممکن نشد.')})}
  else if(a==='export'){doExport()}
  else if(a==='showText'){showText=encodeBackup();msg='متن پشتیبان در کادر پایین است.';render(true)}
  else if(a==='checkText'){takeText((document.getElementById('pt').value||'').trim())}
  else if(a==='restoreCancel'){pending=null;msg='بازیابی لغو شد.';render(true)}
  else if(a==='restoreMerge'&&pending){
    var added=0;pending.data.classes.forEach(function(k){if(!db.classes.some(function(x){return x.id===k.id})){if(!k.groups)k.groups=[];db.classes.push(k);added++}});
    if(!db.activeId)db.activeId=firstActive();
    save();pending=null;msg=fa(added)+' کلاس جدید اضافه شد. کلاس‌های موجود دست‌نخورده ماندند.';render(true);
  }
  else if(a==='restoreReplace'&&pending){
    if(!arm(t,'rep','مطمئنید؟ دوباره بزنید'))return;
    armed=null;
    try{localStorage.setItem(KEY+'_prev',JSON.stringify(db))}catch(e){}
    var nd=pending.data;nd.classes.forEach(function(k){if(!k.groups)k.groups=[]});
    db={v:1,classes:nd.classes,activeId:nd.classes.some(function(k){return k.id===nd.activeId})?nd.activeId:(function(){var f=nd.classes.filter(function(k){return !k.archived})[0];return f?f.id:null})()};
    save();pending=null;msg='اطلاعات بازیابی شد.';render(true);
  }
  else if(a==='delStu'&&c){
    if(!arm(t,'s'+id,'مطمئنید؟'))return;
    armed=null;c.students=c.students.filter(function(s){return s.id!==id});save();msg='دانش‌آموز حذف شد.';render();
  }
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='pa'){var b=document.querySelector('[data-act="pcheck"]');if(b)b.click()}});
document.addEventListener('change',function(e){
  var t=e.target;if(!t.dataset)return;
  if(t.dataset.act==='cpMonth'){CP.month=t.value;render(true);return}