  if(t.dataset.act==='pickFile'){var f=t.files&&t.files[0];if(!f)return;var r=new FileReader();r.onload=function(){takeText(String(r.result))};r.onerror=function(){msg='خواندن فایل ممکن نشد.';render(true)};r.readAsText(f);return}
  if(t.dataset.act!=='setGroup')return;
  var c=active();if(!c)return;
  c.students.forEach(function(s){if(s.id===t.dataset.id)s.groupId=t.value||null});
  save();msg='گروه دانش‌آموز ذخیره شد.';render(true);
});
render();
