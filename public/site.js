(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Position-light signal steps up to a clear aspect on load. */
  var lamps = ['lamp1','lamp2','lamp3'].map(function(id){return document.getElementById(id);});
  if(reduced){
    lamps.forEach(function(l){ if(l) l.classList.add('lit'); });
  } else {
    lamps.forEach(function(lamp, i){
      if(lamp) setTimeout(function(){ lamp.classList.add('lit'); }, 350 + i*280);
    });
  }

  /* Scroll reveal. Driven off the scroll loop rather than IntersectionObserver so
     that elements jumped over (anchor links, Cmd+End, fast scroll) still resolve. */
  var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if(reduced){
    pending.forEach(function(el){ el.classList.add('in'); });
    pending = [];
  } else {
    /* Stagger each element against its revealing siblings, computed once up front. */
    pending.forEach(function(el){
      var sibs = Array.prototype.filter.call(el.parentNode.children, function(c){
        return c.classList && c.classList.contains('reveal');
      });
      var i = sibs.indexOf(el);
      if(i > 0) el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
    });
  }

  function revealVisible(){
    if(!pending.length) return;
    var line = window.innerHeight * 0.94;
    pending = pending.filter(function(el){
      if(el.getBoundingClientRect().top >= line) return true;
      el.classList.add('in');
      return false;
    });
  }

  /* Sticky bar: show past the cover, track scroll progress and current section. */
  var bar = document.getElementById('bar');
  var progress = document.getElementById('progress');
  var cover = document.querySelector('header.cover');
  var links = Array.prototype.slice.call(document.querySelectorAll('.bar-nav a[href^="#"]'));
  var targets = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  var ticking = false;

  function update(){
    ticking = false;
    revealVisible();
    if(!bar || !progress || !cover) return;

    var y = window.pageYOffset || document.documentElement.scrollTop;
    bar.classList.toggle('show', y > cover.offsetHeight - 120);

    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';

    var current = -1;
    for(var i = 0; i < targets.length; i++){
      var t = targets[i];
      if(t && t.getBoundingClientRect().top <= 140) current = i;
    }
    links.forEach(function(a, i){ a.classList.toggle('here', i === current); });
  }

  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; window.requestAnimationFrame(update); }
  }, {passive:true});
  window.addEventListener('resize', update, {passive:true});
  window.addEventListener('load', update);
  update();
})();
