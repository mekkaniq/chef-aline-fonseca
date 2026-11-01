(function(){
var reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
function q(s){return document.querySelector(s)}
function cl(v){return v<0?0:v>1?1:v}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}

/* 1. creme/calda escorrendo: no topo de uma seção, com a cor da seção anterior (SVG redesenhado a cada quadro) */
var NS='http://www.w3.org/2000/svg', bordas=[];
['#para-quem','#sobre','#triagem'].forEach(function(sel,k){
  var s=q(sel); if(!s) return; var ant=s.previousElementSibling; if(!ant) return;
  var e=document.createElement('div'); e.className='escorre'; e.setAttribute('aria-hidden','true');
  e.style.setProperty('--cor',getComputedStyle(ant).backgroundColor);
  var sv=document.createElementNS(NS,'svg'); sv.setAttribute('class','sv'); var pa=document.createElementNS(NS,'path'); sv.appendChild(pa); e.appendChild(sv);
  var seed=k*11+5; function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
  var n=9+Math.round(rnd()*3), gs=[];
  for(var i=0;i<n;i++){
    var longa=rnd()<.45;
    gs.push({x:(i+.2+rnd()*.6)/n, w:7+rnd()*9, L:longa?(.55+rnd()*.45):(.12+rnd()*.3), d:rnd()*.4});
  }
  var gotas=[]; gs.forEach(function(g){ if(g.L>.8){var gt=document.createElement('i'); gt.className='gota'; e.appendChild(gt); gotas.push({el:gt,g:g});} });
  s.insertBefore(e,s.firstChild); bordas.push({s:s,e:e,sv:sv,pa:pa,gs:gs,gotas:gotas});
});
function desenha(b,p,vh){
  var W=b.s.clientWidth, mob=innerWidth<700, Lmax=mob?150:230, k=mob?.8:1;
  var lab=4+6*cl(p*2.5);
  b.sv.setAttribute('viewBox','0 0 '+W+' '+(Lmax+40)); b.sv.style.width=W+'px'; b.sv.style.height=(Lmax+40)+'px';
  var d='M0 -2H'+W+'V'+lab.toFixed(1)+'H0Z';
  b.gs.forEach(function(g){
    var pi=ease(cl((p-g.d)/(1-g.d))); var r=g.w*k/2, L=lab+pi*g.L*Lmax; if(L<lab+1) return;
    var cx=g.x*W, rb=r*1.18, f=r*1.7, nk=r*.82;
    /* ombro largo colado na borda, pescoço fino e bolinha na ponta */
    d+='M'+(cx-r-f).toFixed(1)+' '+lab.toFixed(1)+
       'C'+(cx-r).toFixed(1)+' '+lab.toFixed(1)+' '+(cx-nk).toFixed(1)+' '+(lab+f*.6).toFixed(1)+' '+(cx-nk).toFixed(1)+' '+Math.min(L-rb,lab+f).toFixed(1)+
       'L'+(cx-nk).toFixed(1)+' '+(L-rb).toFixed(1)+
       'C'+(cx-nk).toFixed(1)+' '+(L-rb*.4).toFixed(1)+' '+(cx-rb).toFixed(1)+' '+(L-rb*.6).toFixed(1)+' '+(cx-rb).toFixed(1)+' '+L.toFixed(1)+
       'A'+rb.toFixed(1)+' '+rb.toFixed(1)+' 0 0 0 '+(cx+rb).toFixed(1)+' '+L.toFixed(1)+
       'C'+(cx+rb).toFixed(1)+' '+(L-rb*.6).toFixed(1)+' '+(cx+nk).toFixed(1)+' '+(L-rb*.4).toFixed(1)+' '+(cx+nk).toFixed(1)+' '+(L-rb).toFixed(1)+
       'L'+(cx+nk).toFixed(1)+' '+Math.min(L-rb,lab+f).toFixed(1)+
       'C'+(cx+nk).toFixed(1)+' '+(lab+f*.6).toFixed(1)+' '+(cx+r).toFixed(1)+' '+lab.toFixed(1)+' '+(cx+r+f).toFixed(1)+' '+lab.toFixed(1)+'Z';
  });
  b.pa.setAttribute('d',d);
  b.gotas.forEach(function(o){
    var g=o.g, pg=cl((p-.86)/.14), r=g.w*k/2*.9;
    if(pg<=0||reduz){o.el.style.opacity=0;return}
    var L=lab+g.L*Lmax+r*1.2;
    o.el.style.cssText='width:'+(2*r).toFixed(1)+'px;height:'+(2.4*r).toFixed(1)+'px;left:'+(g.x*W-r).toFixed(1)+'px;opacity:'+(pg<.8?1:(1-pg)/.2).toFixed(2)+';transform:translateY('+(L+pg*pg*vh*.3).toFixed(1)+'px)';
  });
}

/* 2. fouet caindo do manifesto até a seção da chef, girando e se desenhando */
var f=null, mani=q('.mani'), paraq=q('#para-quem'), sobre=q('#sobre');
if(!reduz && mani && sobre){
  f=document.createElement('div'); f.className='fouet'; f.setAttribute('aria-hidden','true');
  f.innerHTML='<svg viewBox="0 0 60 160"><path pathLength="1" d="M27 112V150Q27 158 30 158Q33 158 33 150V112"/><path pathLength="1" d="M24 112H36"/><path pathLength="1" d="M30 112C6 96 6 28 30 6C54 28 54 96 30 112"/><path pathLength="1" d="M30 112C16 92 16 34 30 6C44 34 44 92 30 112"/><path pathLength="1" d="M30 112V6"/><path pathLength="1" d="M30 112C-2 92 2 30 30 6"/><path pathLength="1" d="M30 112C62 92 58 30 30 6"/></svg>';
  document.body.appendChild(f);
}
var paths=f?f.querySelectorAll('path'):[];

var pend=false;
function quadro(){
  pend=false; var vh=innerHeight, y=scrollY;
  bordas.forEach(function(b){
    var t=b.s.getBoundingClientRect().top; if(t>vh+50||t<-vh*1.2) return;
    desenha(b,reduz?1:cl((vh-t)/(vh*.85)),vh);
  });
  if(f){
    var s0=mani.getBoundingClientRect().top+y-vh*.55, s1=sobre.getBoundingClientRect().top+y-vh*.45;
    var p=(y-s0)/(s1-s0);
    if(p<=0||p>=1){f.style.opacity=0;}
    else{
      var mob=innerWidth<700, fw=f.offsetWidth, fh=fw*160/60;
      var ty=-fh+p*(vh+fh*1.6);
      var tx=(mob?innerWidth*.80:innerWidth*.84)-fw/2+Math.sin(p*Math.PI*3.2)*(mob?14:38);
      var rot=-28+ease(p)*560+Math.sin(p*Math.PI*6)*8;
      f.style.transform='translate('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px) rotate('+rot.toFixed(1)+'deg)';
      f.style.opacity=(p<.06?p/.06:p>.92?(1-p)/.08:1).toFixed(2);
      var d=1-cl(p*4.5); for(var i=0;i<paths.length;i++) paths[i].style.strokeDashoffset=cl(d+i*.04).toFixed(3);
      var cy=ty+fh/2, el=null;
      [mani,paraq,sobre].forEach(function(s){var r=s.getBoundingClientRect(); if(cy>=r.top&&cy<r.bottom) el=s;});
      f.classList.toggle('claro',!!(el&&el.classList.contains('on-light')));
    }
  }
}
function pede(){if(!pend){pend=true;requestAnimationFrame(quadro)}}
addEventListener('scroll',pede,{passive:true}); addEventListener('resize',pede); pede();
})();
