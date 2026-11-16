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
  else if(a==='rcNav'&&c&&c.students.length){
    var rids=c.students.map(function(x){return x.id}),rpos=Math.max(0,rids.indexOf(RC.sid));
    rpos=(rpos+Number(id)+rids.length)%rids.length;RC.sid=rids[rpos];RC.img='';render(true);
  }
  else if(a==='rcImg'&&c){
    var rs=rcStudent(c);if(!rs)return;
    try{RC.img=rcDraw(rcData(c,rs.id,rcOpt()),rcOpt()).toDataURL('image/png')}catch(e){RC.img='';note('ساخت عکس در این مرورگر ممکن نشد. از صفحه کارنامه اسکرین‌شات بگیرید.');return}
    render(true);
  }
  else if(a==='rcShare'&&c){
    var rs2=rcStudent(c);if(!rs2)return;
    rcSave(c,rcData(c,rs2.id,rcOpt()),rcOpt(),c.students.indexOf(rs2));
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
  if(t.dataset.act==='cpMonth'){CP.month=t.value;render(true);return}
  if(t.dataset.act==='rcStu'){RC.sid=t.value;RC.img='';render(true);return}
  if(t.dataset.act==='rcOpt'){RC[t.dataset.k]=!!t.checked;RC.img='';render(true);return}
  if(t.dataset.act==='pickFile'){var f=t.files&&t.files[0];if(!f)return;var r=new FileReader();r.onload=function(){takeText(String(r.result))};r.onerror=function(){msg='خواندن فایل ممکن نشد.';render(true)};r.readAsText(f);return}
  if(t.dataset.act!=='setGroup')return;
  var c=active();if(!c)return;
  c.students.forEach(function(s){if(s.id===t.dataset.id)s.groupId=t.value||null});
  save();msg='گروه دانش‌آموز ذخیره شد.';render(true);
});
render();
