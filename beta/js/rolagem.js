(function(){
/* Beta, direção "Völlerei": fios com uma gota entre seções, vitrine com prato recortado e
   pontos de anotação, navegação lateral e o fouet caindo. Tudo injetado por JS para funcionar
   tanto em /beta quanto por cima do site publicado (beta-teste). */
var reduz=matchMedia('(prefers-reduced-motion: reduce)').matches;
function q(s){return document.querySelector(s)}
function cl(v){return v<0?0:v>1?1:v}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
var NS='http://www.w3.org/2000/svg';
function el(n,a){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);return e}
var VIN='#963030', CRE='#EAD8B6';

/* 1. vitrine: prato recortado em círculo, letra gigante e anotações */
var mani=q('.mani'), vit=null;
if(mani){
  vit=document.createElement('section');
  vit.className='vitrine on-light'; vit.setAttribute('aria-labelledby','t-vit');
  vit.innerHTML=
   '<div class="vit-pin">'+
     '<span class="vit-letra" aria-hidden="true">A</span>'+
     '<div class="vit-cab"><p class="vit-rot">Na sua mesa:</p><h2 id="t-vit">Cozinha de chef, do jeito da <em>sua casa</em></h2><i class="vit-tr" aria-hidden="true"></i></div>'+
     '<div class="vit-obj">'+
       '<div class="vit-prato"><img src="/img/autoral.webp" alt="Prato autoral da Aline visto de cima: desfiado com tomates, farofa e creme amarelo" width="900" height="1044"></div>'+
       '<div class="ponto esq" style="--x:24%;--y:60%"><i class="dot"><b>1</b></i><span class="lin"></span><div class="txt"><h3>Sabores com memória</h3><p>Receitas que lembram casa, adaptadas ao que você pode e gosta de comer.</p></div></div>'+
       '<div class="ponto dir" style="--x:63%;--y:30%"><i class="dot"><b>2</b></i><span class="lin"></span><div class="txt"><h3>Feito na sua cozinha</h3><p>Ela cozinha na sua casa, com o que foi combinado, e deixa tudo pronto.</p></div></div>'+
       '<div class="ponto dir" style="--x:70%;--y:66%"><i class="dot"><b>3</b></i><span class="lin"></span><div class="txt"><h3>Do jeito que o plano pede</h3><p>Restrições e plano de nutricionista seguidos à risca, com cuidado contra contaminação cruzada.</p></div></div>'+
     '</div>'+
     '<ol class="vit-lista" aria-hidden="true"></ol>'+
   '</div>';
  mani.parentNode.insertBefore(vit,mani.nextSibling);
  /* no celular, os textos vão numa lista abaixo do prato */
  var lista=vit.querySelector('.vit-lista');
  [].forEach.call(vit.querySelectorAll('.ponto .txt'),function(t){var li=document.createElement('li');li.innerHTML='<div>'+t.innerHTML+'</div>';lista.appendChild(li)});
}
var pontos=vit?[].slice.call(vit.querySelectorAll('.ponto')):[], itens=vit?[].slice.call(vit.querySelectorAll('.vit-lista li')):[];
var prato=vit&&vit.querySelector('.vit-prato'), letra=vit&&vit.querySelector('.vit-letra'), cab=vit&&vit.querySelector('.vit-cab');

/* 2. fios: linha fina que se desenha entre seções e solta uma única gota (efeito gooey) */
var fios=[];
[['.vitrine',VIN],['#sobre',VIN],['#como',VIN],['#triagem',CRE]].forEach(function(a,k){
  var s=q(a[0]); if(!s) return;
  var e=document.createElement('div'); e.className='fio'; e.setAttribute('aria-hidden','true'); e.style.color=a[1];
  var sv=el('svg',{viewBox:'0 0 40 260',preserveAspectRatio:'xMidYMin meet'});
  var id='gt'+k, fi=el('filter',{id:id,x:'-50%',y:'-20%',width:'200%',height:'140%','color-interpolation-filters':'sRGB'});
  fi.appendChild(el('feGaussianBlur',{'in':'SourceGraphic',stdDeviation:'2.4',result:'b'}));
  fi.appendChild(el('feColorMatrix',{'in':'b',mode:'matrix',values:'1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10'}));
  var df=el('defs',{}); df.appendChild(fi); sv.appendChild(df);
  var lin=el('rect',{x:'19.5',y:'0',width:'1',height:'0',fill:'currentColor'}); sv.appendChild(lin);
  var g=el('g',{filter:'url(#'+id+')',fill:'currentColor'});
  var pesc=el('rect',{x:'17.5',width:'5',y:'0',height:'0',rx:'2.5'}), gota=el('circle',{cx:'20',cy:'0',r:'0'});
  g.appendChild(pesc); g.appendChild(gota); sv.appendChild(g); e.appendChild(sv);
  s.insertBefore(e,s.firstChild); fios.push({s:s,e:e,lin:lin,pesc:pesc,gota:gota});
});
function fio(o,vh){
  var r=o.s.getBoundingClientRect(); if(r.top>vh+40||r.bottom<-40) return;
  var pad=parseFloat(getComputedStyle(o.s).paddingTop)||120, H=Math.max(60,pad*.72);
  o.e.style.height=H+'px'; o.e.firstChild.setAttribute('viewBox','0 0 40 '+H.toFixed(0));
  var p=reduz?.62:cl((vh*.96-r.top)/(vh*.62)), Lh=H;
  var lp=cl(p/.55), ll=Lh*.78*ease(lp);
  o.lin.setAttribute('height',ll.toFixed(1));
  var u=cl((p-.5)/.5);
  if(u<=0){o.gota.setAttribute('r',0);o.pesc.setAttribute('height',0);return}
  var r0=4.6, cy, rr, nk, op=1;
  if(u<.45){rr=r0*ease(u/.45); cy=ll+rr*.6; nk=0}                          /* gota se formando na ponta */
  else if(u<.7){var v=(u-.45)/.25; rr=r0; cy=ll+r0*.6+v*9; nk=v*9}          /* estica: o pescoço afina */
  else{var w=(u-.7)/.3; rr=r0*(1-.25*w); cy=ll+r0*.6+9+w*w*Lh*.3; nk=9*(1-w*2.2); op=1-cl((w-.6)/.4)} /* solta e cai */
  o.gota.setAttribute('cy',cy.toFixed(1)); o.gota.setAttribute('r',rr.toFixed(2)); o.gota.style.opacity=op.toFixed(2);
  o.pesc.setAttribute('y',(ll-1).toFixed(1)); o.pesc.setAttribute('height',Math.max(0,nk).toFixed(1));
}

/* 3. navegação lateral (computador) */
var SEC=[['#topo','Início'],['.vitrine','Na sua mesa'],['#para-quem','Para quem'],['#sobre','A chef'],['#cozinha','A cozinha'],['#como','Como funciona'],['#triagem','Agenda'],['#perguntas','Perguntas']];
var nav=document.createElement('div'); nav.className='lado'; nav.setAttribute('aria-hidden','true');
nav.innerHTML='<span class="lado-n">01</span><span class="lado-t">Início</span><span class="lado-ticks">'+SEC.map(function(){return '<i></i>'}).join('')+'</span>';
document.body.appendChild(nav);
var ln=nav.querySelector('.lado-n'), lt=nav.querySelector('.lado-t'), ticks=[].slice.call(nav.querySelectorAll('.lado-ticks i')), atual=-1;
function lado(vh){
  var idx=0;
  SEC.forEach(function(a,i){var s=q(a[0]); if(s&&s.getBoundingClientRect().top<vh*.5) idx=i});
  if(idx!==atual){atual=idx; ln.textContent=(idx<9?'0':'')+(idx+1); lt.textContent=SEC[idx][1]; ticks.forEach(function(t,i){t.classList.toggle('on',i===idx)})}
  var s=q(SEC[idx][0]); nav.classList.toggle('claro',!!(s&&s.classList.contains('on-light')));
}

/* 4. fouet caindo do manifesto até a seção "Para quem" */
var f=null, paraq=q('#para-quem');
if(!reduz && mani && paraq){
  f=document.createElement('div'); f.className='fouet'; f.setAttribute('aria-hidden','true');
  f.innerHTML='<svg viewBox="0 0 60 160"><path pathLength="1" d="M27 112V150Q27 158 30 158Q33 158 33 150V112"/><path pathLength="1" d="M24 112H36"/><path pathLength="1" d="M30 112C6 96 6 28 30 6C54 28 54 96 30 112"/><path pathLength="1" d="M30 112C16 92 16 34 30 6C44 34 44 92 30 112"/><path pathLength="1" d="M30 112V6"/><path pathLength="1" d="M30 112C-2 92 2 30 30 6"/><path pathLength="1" d="M30 112C62 92 58 30 30 6"/></svg>';
  document.body.appendChild(f);
}
var paths=f?f.querySelectorAll('path'):[];

function vitrine(vh){
  if(!vit) return;
  var r=vit.getBoundingClientRect(); if(r.top>vh||r.bottom<0) return;
  var P=reduz?1:cl(-r.top/(r.height-vh)), mob=innerWidth<820;
  var a=ease(cl(P/.32));
  prato.style.transform='scale('+(.68+.32*a).toFixed(3)+') rotate('+(-14*(1-a)).toFixed(2)+'deg)';
  letra.style.transform='translate(-50%,'+(-46+(1-P)*14).toFixed(1)+'%)';
  cab.style.opacity=reduz?1:cl(P/.12+.25).toFixed(2);
  pontos.forEach(function(pt,i){
    var v=reduz?1:ease(cl((P-.34-i*.15)/.12));
    pt.style.setProperty('--v',v.toFixed(3)); pt.classList.toggle('on',v>.5);
    if(itens[i]) itens[i].classList.toggle('on',v>.5);
  });
}

var pend=false;
function quadro(){
  pend=false; var vh=innerHeight, y=scrollY;
  fios.forEach(function(o){fio(o,vh)});
  vitrine(vh); lado(vh);
  if(f){
    var s0=mani.getBoundingClientRect().top+y-vh*.55, s1=(vit||paraq).getBoundingClientRect().top+y+vh*.1;
    var p=(y-s0)/(s1-s0);
    if(p<=0||p>=1){f.style.opacity=0}
    else{
      var mob=innerWidth<700, fw=f.offsetWidth, fh=fw*160/60;
      var ty=-fh+p*(vh+fh*1.6);
      var tx=(mob?innerWidth*.82:innerWidth*.86)-fw/2+Math.sin(p*Math.PI*3.2)*(mob?12:34);
      var rot=-28+ease(p)*560+Math.sin(p*Math.PI*6)*8;
      f.style.transform='translate('+tx.toFixed(1)+'px,'+ty.toFixed(1)+'px) rotate('+rot.toFixed(1)+'deg)';
      f.style.opacity=(p<.06?p/.06:p>.92?(1-p)/.08:1).toFixed(2);
      for(var i=0;i<paths.length;i++){var of=cl(1-(p*4.5-i*.08)); paths[i].style.strokeDashoffset=of.toFixed(3); paths[i].style.strokeDasharray=of<=0?'none':'1'} /* cada traço começa um pouco depois; pronto, o tracejado sai (o Chrome erra o tracejado girando) */
      var cy=ty+fh/2, sec=null;
      [mani,vit].forEach(function(s){if(!s)return;var rr=s.getBoundingClientRect(); if(cy>=rr.top&&cy<rr.bottom) sec=s});
      f.classList.toggle('claro',!!(sec&&sec.classList.contains('on-light')));
    }
  }
}
function pede(){if(!pend){pend=true;requestAnimationFrame(quadro)}}
addEventListener('scroll',pede,{passive:true}); addEventListener('resize',pede); addEventListener('load',pede); pede();
})();
