Object.getOwnPropertyNames(Math).map(function(p) {
    window[p] = Math[p];
  });
  
  /* yeah, doing this is a bad idea... 
   * whatever... 
   * this thing checks whether a number is 
   * in the specified range, 
   * with flag dictating whether the limits are 
   * strict or not 
   * b = upper limit, defaults to 1 
   * a = lower limit, defaults to 0 
   * flag: 
   * strict limits if not specified or 0 
   * non-strict lower limit if divisible by 2 
   * non-strict upper limit if divisible by 3
   */
  Number.prototype.ξ = function(b, a, flag) {
    var b = ((b - 1) || 0) + 1, 
        a = a || 0, 
        c1 = (flag && flag%2 === 0) 
                        ? (this >= a) 
                        : (this > a), 
        c2 = (flag && flag%3 === 0) 
                        ? (this <= b) 
                        : (this < b);
    
    return c1 && c2;
  };
  
  var rand = function(max, min, is_int) {
    var max = ((max - 1) || 0) + 1, 
        min = min || 0, 
        gen = min + (max - min)*random();
    
    return (is_int)?round(gen):gen;
  };
  
  var svg = document.querySelector('svg'), 
      stars = svg.querySelectorAll('use'), 
      n = stars.length, 
      d = .4*svg.getAttribute('viewBox')
                  .split(' ')[2], 
      α = 360/n, 
      β = rand(α, 0, 1), 
      θ = 90, f = .2, 
      t_unit = 120, t = 3*t_unit, 
      r_id = null, 
      running = false;
  
  var ani = function() {
    var rt, γ, t_val, cd, φ, cc, cf;
    
    if(t.ξ(t_unit, 0, 2)) {
      rt = t;
      for(var i = 0; i < n; i++) {
        γ = (i*α + β)*rt/t_unit;
        t_val = 'rotate(' + γ + ')';
        stars[i].setAttribute('transform', t_val);
        stars[i].style.fill = 
          'hsl(' + γ + ',100%, 80%)';
      }
    }
    
    if(t.ξ(2*t_unit, t_unit, 2)) {
      rt = t - t_unit;
      cd = d*rt/t_unit;
      cf = 1 + (f - 1)*rt/t_unit;
      
      for(var i = 0; i < n; i++) {
        γ = (i*α + β);
        t_val = 'rotate(' + γ + ') ' + 
          'translate(' + cd + ') ' + 
          'scale(' + cf + ')';
        stars[i].setAttribute('transform', t_val);
      }
    }
    
    if(t.ξ(3*t_unit, 2*t_unit, 2)) {
      rt = t - 2*t_unit;
      φ = θ*rt/t_unit;
      cc = cos(φ*PI/180);
      
      for(var i = 0; i < n; i++) {
        γ = (i*α + β);
        t_val = 'rotate(' + γ + ') ' + 
          'translate(' + d + ') ' + 
          'skewY(' + φ + ') ' + 
          'scale(' + cc*f + ' ' + f + ') ';
        stars[i].setAttribute('transform', t_val);
      }
    }
    
    if(t.ξ(4*t_unit, 3*t_unit, 2)) {
      rt = t - 3*t_unit;
      cf = rt/t_unit;
      t_val = 'scale(' + cf + ') ';
      
      for(var i = 0; i < n; i++) {
        stars[i].setAttribute('transform', t_val);
        
        γ = (i*α + β)*rt/t_unit;
        stars[i].style.fill = 
          'hsl(' + γ + ',100%, 80%)';
      }
    }
    
    if(t === 4*t_unit) {
      t = 0;
      β = rand(α, 0, 1)
    }
    
    t++;
    
    if(running) {
      r_id = requestAnimationFrame(ani);
    }
  };
  
  ani();
  
  addEventListener('click', function() {
    running = !running;
    
    if(running) ani();
    else {
      cancelAnimtionFrame(r_id);
      r_id = null;
    }
  }, false);