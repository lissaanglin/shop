/* "From my videos" renderer for lissaanglin.com/links.
   Reads shop.json from GitHub and draws the newest posts into <div id="ll-shop">.
   To add a post: put it FIRST in the "posts" list in shop.json. Edit shop.json, not this file. */
(function () {
  var mount = document.getElementById('ll-shop');
  if (!mount) return;
  var DATA = 'https://raw.githubusercontent.com/lissaanglin/shop/main/shop.json';
  function esc(s){return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  fetch(DATA + '?v=' + Date.now(), {cache: 'no-store'})
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var posts = (d.posts || []).slice(0, d.limit || 3);
      if (!posts.length) { mount.style.display = 'none'; return; }
      var h = '<h3>' + esc(d.heading || 'From my videos') + '</h3>';
      if (posts.length > 1) {
        h += '<div class="ll-jump">';
        posts.forEach(function (p) { h += '<a href="#' + esc(p.id) + '">' + esc(p.title) + '</a>'; });
        h += '</div>';
      }
      posts.forEach(function (p) {
        h += '<div class="ll-post" id="' + esc(p.id) + '"><h4>' + esc(p.title) + '</h4>';
        if (p.intro) h += '<p class="ll-small">' + esc(p.intro) + '</p>';
        if (p.video) h += '<p class="ll-small"><a href="' + esc(p.video) + '" target="_blank" rel="noopener">Watch the video →</a></p>';
        p.groups.forEach(function (g, i) {
          h += '<div class="ll-sub"><h5>' + esc(g.heading) + '</h5>';
          g.items.forEach(function (it) {
            h += '<a class="ll-btn' + (i % 2 ? ' pink' : '') + '" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
                 esc(it.name) + (it.detail ? '<span>' + esc(it.detail) + '</span>' : '') + '</a>';
          });
          h += '</div>';
        });
        h += '</div>';
      });
      mount.innerHTML = h;
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    })
    .catch(function () { mount.style.display = 'none'; });
})();
