(function(){
  var WA="5569996000030";
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)document.documentElement.classList.add('noanim');
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var vh=window.innerHeight;

  /* revela ao entrar */
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target._t||e.target).classList.add('in');io.unobserve(e.target)}})},{threshold:.14,rootMargin:'0px 0px -6% 0px'}):null;
  $$('.rv,.cv').forEach(function(el){if(!io){el.classList.add('in');return}
    if(el.classList.contains('cv')){var h=el.parentElement;h._t=el;io.observe(h)}else io.observe(el)});

  /* manifesto palavra a palavra */
  var m=$('#mani'),words=[];
  if(m){var t=m.textContent.trim().split(/\s+/);m.innerHTML=t.map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');words=$$('.w',m)}

  /* galeria horizontal */
  var hz=$('.hz'),track=$('#track'),hzMax=0;
  function sizeHz(){if(!hz||!track)return;hzMax=Math.max(0,track.scrollWidth-window.innerWidth);hz.style.height=(hzMax+window.innerHeight)+'px'}

  /* passos */
  var passos=$$('#passos li');
  var pio=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('on',e.isIntersecting)})},{rootMargin:'-38% 0px -38% 0px'}):null;
  passos.forEach(function(li){pio?pio.observe(li):li.classList.add('on')});

  var hd=$('#hd'),prog=$('#prog'),fab=$('#fab'),lastY=0,ticking=false;
  var pars=$$('[data-par]');

  function frame(){
    ticking=false;
    var y=window.scrollY,H=document.documentElement.scrollHeight-vh;
    prog.style.transform='scaleX('+(H>0?y/H:0)+')';
    hd.classList.toggle('solid',y>40);
    hd.classList.toggle('hide',y>vh*.6&&y>lastY+4);
    if(y<lastY-4)hd.classList.remove('hide');
    lastY=y;
    if(fab)fab.classList.toggle('on',y>vh*.7&&!isInView('#triagem')&&!isInView('#como'));
    if(reduce)return;
    pars.forEach(function(el){
      var r=el.getBoundingClientRect();if(r.bottom<-100||r.top>vh+100)return;
      var p=(r.top+r.height/2-vh/2)/vh;
      var k=el.dataset.par==='hero'?-8:-6;
      if(el.dataset.par==='hero'){el.firstElementChild.style.transform='translate3d(0,'+(y*.18)+'px,0)'}
      else{el.style.transform='translate3d(0,'+(p*k*3)+'px,0)'}
    });
    var mr=m&&m.getBoundingClientRect();
    if(mr){var pr=Math.min(1,Math.max(0,(vh*.82-mr.top)/(mr.height+vh*.1)));var n=words.length,cut=pr*n*1.15;words.forEach(function(w,i){w.style.opacity=Math.min(1,.14+Math.max(0,(cut-i))/3*.86)})}
    if(hz&&track){var hr=hz.getBoundingClientRect();var pp=Math.min(1,Math.max(0,-hr.top/(hr.height-vh)));track.style.transform='translate3d('+(-pp*hzMax)+'px,0,0)'}
  }
  function isInView(sel){var e=$(sel);if(!e)return false;var r=e.getBoundingClientRect();return r.top<vh*.8&&r.bottom>vh*.2}
  function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  window.addEventListener('scroll',req,{passive:true});
  window.addEventListener('resize',function(){vh=window.innerHeight;sizeHz();req()});
  window.addEventListener('load',function(){sizeHz();frame()});
  sizeHz();frame();

  /* fundo animado do hero (shader próprio) */
  (function(){
    var cv=$('#sh');if(!cv||reduce)return;
    var start=function(){
      var gl;try{gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'})}catch(e){}
      if(!gl){cv.remove();return}
      var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      var fs='precision highp float;uniform vec2 r;uniform float t;'+
      'vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}'+
      'vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}'+
      'float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);'+
      'vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);'+
      'vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);'+
      'vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));'+
      'float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);'+
      'vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);'+
      'vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;'+
      'vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);'+
      'vec4 nm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=nm.x;p1*=nm.y;p2*=nm.z;p3*=nm.w;'+
      'vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}'+
      'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=(uv-.5)*vec2(r.x/r.y,1.);float a=radians(50.);'+
      'vec2 q=vec2(cos(a)*p.x-sin(a)*p.y,sin(a)*p.x+cos(a)*p.y);'+
      'float n=snoise(vec3(q*1.45,t*.15))+.35*snoise(vec3(q*2.9+7.,t*.22));'+
      'float s=q.y*.95+n*.36;'+
      'vec3 c1=vec3(.557,.608,.471),c2=vec3(.184,.290,.227),c3=vec3(.788,.722,.557);'+
      'vec3 col=mix(c1,c2,smoothstep(-.75,-.02,s));col=mix(col,c3,smoothstep(.12,.95,s)*.72);'+
      'col*=.93+.07*snoise(vec3(q*3.,t*.1));'+
      'float w=smoothstep(.04,.95,uv.x);col=mix(c2*.8,col,.2+.8*w);'+
      'gl_FragColor=vec4(col,1.);}';
      function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(s))}return s}
      var pr;try{pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0}catch(e){cv.remove();return}
      gl.useProgram(pr);var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
      var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      var ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t');
      function size(){var k=.55;cv.width=Math.max(2,Math.round(cv.clientWidth*k));cv.height=Math.max(2,Math.round(cv.clientHeight*k));gl.viewport(0,0,cv.width,cv.height);gl.uniform2f(ur,cv.width,cv.height)}
      size();window.addEventListener('resize',size);
      var run=true,t0=performance.now(),shown=false;
      function draw(now){if(run){gl.uniform1f(ut,(now-t0)/1000);gl.drawArrays(gl.TRIANGLES,0,3);if(!shown){shown=true;cv.classList.add('on')}}requestAnimationFrame(draw)}
      requestAnimationFrame(draw);
      if('IntersectionObserver' in window)new IntersectionObserver(function(es){run=es[0].isIntersecting&&!document.hidden}).observe($('.hero'));
      document.addEventListener('visibilitychange',function(){if(document.hidden)run=false});
    };
    if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:1500});else setTimeout(start,400);
  })();

  /* triagem */
  var form=$('#form'),erro=$('#erro'),aviso=$('#aviso');
  var NIV={nenhuma:'Nenhuma restrição',pref:'Preferência ou escolha alimentar',intol:'Intolerância ou sensibilidade (desconforto, sem risco de vida)',alerg:'Alergia ou doença celíaca, com reação importante',grave:'ALERGIA GRAVE, COM RISCO DE VIDA'};
  var AV={alerg:'Obrigada por contar. Nesses casos, cada situação é avaliada antes de aceitar: numa cozinha de casa, utensílios, panos e superfícies também pedem cuidado. Se não der para atender com segurança, ela diz com clareza.',grave:'Obrigada por contar com clareza. Isso é levado muito a sério, e já houve casos assim, com protocolo próprio: higiene reforçada ao chegar, até banho na entrada quando o caso pede, e cuidado com o lixo, que não fica na sua casa. Antes de aceitar, ela conversa com você e pode pedir a orientação do seu médico ou alergista. Se não puder garantir a segurança, ela não atende, e diz isso com respeito.'};
  var det=$('#det'),cross=$('#cross');
  function nivel(){var c=$('input[name=nivel]:checked',form);return c?c.value:''}
  function upd(){var n=nivel(),tem=n&&n!=='nenhuma',sev=(n==='alerg'||n==='grave');
    det.classList.toggle('on',!!tem);cross.classList.toggle('on',sev);
    if(sev){aviso.textContent=AV[n];aviso.classList.add('on')}else aviso.classList.remove('on');
    $('#erro3').textContent=''}
  $$('input[name=nivel]').forEach(function(i){i.addEventListener('change',upd)});
  function vals(n){return $$('input[name='+n+']:checked',form).map(function(i){return i.value})}
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var nome=form.nome.value.trim(),local=form.local.value.trim(),e2=$('#erro2');e2.textContent='';
    if(!nome||!local){erro.textContent='Precisamos do seu nome e do seu bairro e cidade para a Aline saber por onde começar.';(!nome?form.nome:form.local).focus();return}
    erro.textContent='';
    if(!$('#ciente').checked){e2.textContent='Para enviar, confirme que leu como funciona e entendeu os combinados.';$('#ciente').focus();return}
    if(!$('#lgpd').checked){e2.textContent='Para enviar, marque o aceite da Política de Privacidade.';$('#lgpd').focus();return}
    var n=nivel();
    if(!n){$('#erro3').textContent='Conte como é a sua restrição, ou marque "Nenhuma restrição".';$('#p-nivel').scrollIntoView({behavior:'smooth',block:'center'});return}
    var al=vals('alim'),sev=(n==='alerg'||n==='grave');
    if(n!=='nenhuma'&&!al.length&&!form.nao.value.trim()){$('#erro3').textContent='Marque quais alimentos, ou escreva no campo ao lado.';return}
    var alerta=n==='grave'?'*ATENÇÃO: ALERGIA GRAVE, COM RISCO DE VIDA*\n\n':(n==='alerg'?'*Atenção: alergia ou restrição com reação importante*\n\n':'');
    var g=vals('gosto');
    var msg='Olá, Aline! Vim pelo seu site e gostaria de um lugar na sua agenda.\n\n'+alerta+
      'Nome: '+nome+'\n'+
      'Bairro e cidade: '+local+'\n'+
      'Para quem é a comida: '+(vals('quem').length?vals('quem').join(', '):'não informei')+'\n'+
      'Plano de nutricionista: '+form.plano.value+'\n'+
      'Pessoas na casa: '+form.pessoas.value+'\n'+
      'Frequência: '+form.freq.value+'\n'+
      'O que eu gosto: '+(g.length?g.join(', '):'ainda não marquei')+'\n'+
      'Restrição: '+NIV[n]+'\n'+(n!=='nenhuma'?'Alimentos: '+(al.length?al.join(', '):'conto abaixo')+'\n':'')+(sev?'Contaminação cruzada: '+form.cross.value+'\n':'')+
      (form.nao.value.trim()?'Outro alimento a evitar: '+form.nao.value.trim()+'\n':'')+
      (form.obs.value.trim()?'Mais um detalhe: '+form.obs.value.trim()+'\n':'')+
      'Li como funciona: sim, ciente dos combinados (acesso à cozinha, ingredientes em casa, descongelamento, contrato).\n'+
      'Fotos/vídeos dos pratos para divulgação: '+($('#img').checked?'autorizo (só pratos, preparo e panelas, sem mostrar a casa)':'não autorizo')+'\n\nPodemos conversar?';
    window.track&&window.track('triagem_envio');
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
  });
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
