// Shared background stars + soft glitter
(function createAtmosphere(){
  const stars = document.getElementById('stars');
  const glitter = document.getElementById('glitter');
  if(stars){
    for(let i=0;i<65;i++){
      const s=document.createElement('span');
      s.className='star';
      const size=(Math.random()*3+1)+'px';
      s.style.width=size;s.style.height=size;
      s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
      s.style.animationDelay=(Math.random()*5)+'s';
      stars.appendChild(s);
    }
  }
  if(glitter){
    for(let i=0;i<18;i++){
      const g=document.createElement('span');
      g.className='glitter-dot';
      g.textContent=['✦','✧','⋆'][Math.floor(Math.random()*3)];
      g.style.left=Math.random()*100+'%';g.style.top=(Math.random()*100)+'%';
      g.style.animationDelay=(Math.random()*7)+'s';
      glitter.appendChild(g);
    }
  }
})();

// Audio handling logic
let isPlaying = false;

function enableAudio(play) {
  const modal = document.getElementById('audioModal');
  const audio = document.getElementById('birthdayMusic');
  const icon = document.getElementById('musicIcon');

  if (modal) modal.classList.add('hidden');

  if (play && audio) {
    audio.play().then(() => {
      isPlaying = true;
      if (icon) icon.textContent = '🔊';
    }).catch(err => {
      console.log('Autoplay error:', err);
    });
  } else {
    if (icon) icon.textContent = '🔇';
  }
}

function toggleAudio() {
  const audio = document.getElementById('birthdayMusic');
  const icon = document.getElementById('musicIcon');
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    if (icon) icon.textContent = '🔇';
  } else {
    audio.play();
    isPlaying = true;
    if (icon) icon.textContent = '🔊';
  }
}

// Countdown: September 6, 2026 at midnight, India Standard Time.
const params = new URLSearchParams(window.location.search);
const testBirthday = params.get('test') === 'birthday';

const birthday = testBirthday
  ? Date.now() - 1000
  : new Date('2026-09-06T00:00:00+05:30').getTime();

function updateCountdown(){
  const diff=birthday-Date.now();
  if(diff<=0){
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.textContent='0';
    });
    const screen=document.getElementById('countdownScreen');
    const reveal=document.getElementById('birthdayReveal');
    if(screen && reveal && !reveal.dataset.started){
      reveal.dataset.started='true';
      screen.classList.add('hidden');
      reveal.classList.remove('hidden');
      launchConfetti();
    }
    return;
  }
  const d=Math.floor(diff/86400000);
  const h=Math.floor((diff%86400000)/3600000);
  const m=Math.floor((diff%3600000)/60000);
  const s=Math.floor((diff%60000)/1000);
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
  set('cd-days',d);set('cd-hours',h);set('cd-mins',m);set('cd-secs',s);
  setTimeout(updateCountdown,1000);
}
updateCountdown();

function launchConfetti(){
  const canvas=document.getElementById('confetti');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=innerWidth;canvas.height=innerHeight;
  const pieces=[];
  const symbols=['✦','✧','⋆','♡','✦'];
  for(let i=0;i<180;i++){
    pieces.push({
      x:Math.random()*canvas.width,y:-Math.random()*canvas.height*.4,
      vx:(Math.random()-.5)*3,vy:Math.random()*4+2,
      size:Math.random()*15+7,rot:Math.random()*Math.PI*2,
      vr:(Math.random()-.5)*.15,life:Math.random()*120+120,
      text:symbols[Math.floor(Math.random()*symbols.length)]
    });
  }
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=.018;p.rot+=p.vr;p.life--;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.globalAlpha=Math.max(0,Math.min(1,p.life/50));
      ctx.font=`${p.size}px serif`;ctx.fillStyle='rgba(240,210,255,.9)';
      ctx.fillText(p.text,0,0);ctx.restore();
    });
    frame++;
    if(frame<260)requestAnimationFrame(draw);else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}