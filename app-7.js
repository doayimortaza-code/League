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
  if(t.dataset.act==='pickFile'){var f=t.files&&t.files[0];if(!f)return;var r=new FileReader();r.onload=function(){takeText(String(r.result))};r.onerror=function(){msg='خواندن فایل ممکن نشد.';render(true)};r.readAsText(f);return}
  if(t.dataset.act!=='setGroup')return;
  var c=active();if(!c)return;
  c.students.forEach(function(s){if(s.id===t.dataset.id)s.groupId=t.value||null});
  save();msg='گروه دانش‌آموز ذخیره شد.';render(true);
});
render();
