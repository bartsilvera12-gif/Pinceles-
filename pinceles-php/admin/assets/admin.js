// Subida de imágenes en campos tipo "image"
document.addEventListener('change', function (ev) {
  var input = ev.target;
  if (!input.classList || !input.classList.contains('img-file')) return;
  var file = input.files && input.files[0];
  if (!file) return;
  var wrap = input.closest('.field') || document;
  var urlInput = wrap.querySelector('.img-url');
  var preview = wrap.querySelector('.img-preview');
  var label = input.closest('label');
  var original = label ? label.textContent : '';
  if (label) label.firstChild && (label.childNodes[0].textContent = 'Subiendo…');

  var fd = new FormData();
  fd.append('file', file);
  fetch('subir.php', { method: 'POST', body: fd })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (j.ok) {
        if (urlInput) urlInput.value = j.url;
        if (preview) { preview.src = '../' + j.url; preview.style.display = ''; }
      } else {
        alert(j.error || 'No se pudo subir la imagen.');
      }
    })
    .catch(function () { alert('Error de red al subir la imagen.'); })
    .finally(function () { if (label && label.childNodes[0]) label.childNodes[0].textContent = 'Subir'; });
});

// Confirmación en acciones con data-confirm
document.addEventListener('submit', function (ev) {
  var f = ev.target;
  if (f.dataset && f.dataset.confirm && !confirm(f.dataset.confirm)) ev.preventDefault();
});
