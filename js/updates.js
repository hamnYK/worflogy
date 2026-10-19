(()=>{
 const card=document.getElementById('site-updates'),reopen=document.getElementById('updates-reopen');if(!card)return;
 const key='worflogy-updates-art-gallery-launch',today=()=>{const d=new Date();return [d.getFullYear(),d.getMonth()+1,d.getDate()].join('-')};
 let dismissed=false;try{dismissed=sessionStorage.getItem(key)==='closed'||localStorage.getItem(key)===today()}catch{}
 function display(show){card.hidden=!show;reopen.hidden=show;reopen.setAttribute('aria-expanded',String(show));}
 function close(forToday){try{if(forToday)localStorage.setItem(key,today());else sessionStorage.setItem(key,'closed')}catch{}display(false);reopen.focus();}
 document.getElementById('updates-close').addEventListener('click',()=>close(false));document.getElementById('updates-today').addEventListener('click',()=>close(true));
 reopen.addEventListener('click',()=>{display(true);document.getElementById('updates-close').focus()});
 card.querySelector('[data-updates-workshop]').addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const target=document.querySelector('.workshop-floating');if(target){event.preventDefault();target.click()}});
 const serviceWindows=new Map();
 for(const [selector,name]of [['[data-ai-policy-link]','worflogy-ai-policy'],['[data-art-gallery-link]','worflogy-art-contexton']])card.querySelector(selector)?.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const link=event.currentTarget;
  let opened=serviceWindows.get(name);
  if(!opened||opened.closed)opened=window.open('',name);if(!opened)return;
  serviceWindows.set(name,opened);
  event.preventDefault();
  try{if(opened.location.href==='about:blank')opened.location.replace(link.href);}catch{/* Retain the existing cross-origin page and its work. */}
  try{opened.focus();}catch{}
 });
 display(!dismissed);
})();
