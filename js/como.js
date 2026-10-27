(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)document.documentElement.classList.add('noanim');
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target._t||e.target).classList.add('in');io.unobserve(e.target)}})},{threshold:.14,rootMargin:'0px 0px -6% 0px'}):null;
  $$('.rv,.cv').forEach(function(el){if(!io){el.classList.add('in');return}if(el.classList.contains('cv')){var h=el.parentElement;h._t=el;io.observe(h)}else io.observe(el)});
  var li=$$('#lista li');
  var pio=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('on',e.isIntersecting)})},{rootMargin:'-38% 0px -38% 0px'}):null;
  li.forEach(function(x){pio?pio.observe(x):x.classList.add('on')});
  var hd=$('#hd'),prog=$('#prog'),lastY=0,tk=false,vh=innerHeight;
  function frame(){tk=false;var y=scrollY,H=document.documentElement.scrollHeight-vh;prog.style.transform='scaleX('+(H>0?y/H:0)+')';hd.classList.toggle('solid',y>40);hd.classList.toggle('hide',y>vh*.5&&y>lastY+4);if(y<lastY-4)hd.classList.remove('hide');lastY=y;
    if(!reduce)$$('[data-par]').forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;el.style.transform='translate3d(0,'+(((r.top+r.height/2-vh/2)/vh)*-18)+'px,0)'})}
  addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(frame)}},{passive:true});
  addEventListener('resize',function(){vh=innerHeight});frame();
})();
;
/* medição sem cookies (Vercel Web Analytics): só eventos de navegação, nunca dados de saúde */
window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};
window.track=function(n,p){try{window.va('event',p?{name:n,data:p}:{name:n})}catch(e){}};
(function(){
  var MAP=[['wa.me','whatsapp_direto'],['#triagem','ir_triagem'],['como-funciona','abrir_como_funciona'],['#como','cta_saber_mais'],['instagram.com','instagram'],['privacidade','ver_privacidade'],['termos','ver_termos']];
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var h=a.getAttribute('href')||'';
    for(var i=0;i<MAP.length;i++){if(h.indexOf(MAP[i][0])>-1){window.track(MAP[i][1],{pagina:location.pathname});break}}
  },true);
  var f=document.getElementById('form');
  if(f){var ini=false;f.addEventListener('input',function(){if(!ini){ini=true;window.track('triagem_inicio')}});}
  var secs=[['como','viu_como_funciona'],['triagem','viu_triagem']],vistos={};
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting&&!vistos[x.target.id]){vistos[x.target.id]=1;window.track(x.target.dataset.ev)}})},{threshold:.35});
    secs.forEach(function(s){var el=document.getElementById(s[0]);if(el){el.dataset.ev=s[1];io.observe(el)}});}
})();
