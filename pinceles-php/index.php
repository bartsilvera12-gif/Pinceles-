<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/data.php';

$c        = get_site_content();
$s        = $c['settings'];
$wa       = wa_url(setting($s, 'whatsapp_number'), setting($s, 'whatsapp_default_message'));
$sec      = function (string $k, string $field, string $def = '') use ($c) {
    return isset($c['sections'][$k][$field]) && $c['sections'][$k][$field] !== null ? (string) $c['sections'][$k][$field] : $def;
};
$logo     = setting($s, 'logo_url', 'images/logo-pinceles.jpg');
$OCRE     = '#D9912F';
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e(setting($s, 'company_name', 'Pinceles')) ?> | Pintura, Obras y Soluciones Industriales</title>
<meta name="description" content="<?= e(setting($s, 'short_description')) ?>">
<meta property="og:title" content="<?= e(setting($s, 'company_name', 'Pinceles')) ?>">
<meta property="og:description" content="<?= e(setting($s, 'slogan')) ?>">
<meta property="og:image" content="<?= e($logo) ?>">
<link rel="icon" href="<?= e(setting($s, 'favicon_url', 'images/favicon-pinceles.png')) ?>">
<link rel="stylesheet" href="assets/css/site.css">
</head>
<body>

<!-- HEADER -->
<input type="checkbox" id="menu-toggle">
<header id="header" style="position:fixed;top:0;left:0;right:0;z-index:90;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(248,246,241,.55);box-shadow:none;transition:background .35s ease,box-shadow .35s ease;">
  <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;gap:20px;padding-top:12px;padding-bottom:12px;">
    <a href="#inicio" aria-label="Pinceles, inicio" style="display:flex;align-items:center;flex-shrink:0;">
      <img src="<?= e($logo) ?>" alt="<?= e(setting($s, 'logo_alt', 'Logo de Pinceles')) ?>" width="140" height="119" style="height:62px;width:auto;display:block;mix-blend-mode:multiply;">
    </a>
    <nav class="nav-desktop" aria-label="Navegación principal" style="align-items:center;gap:clamp(14px,1.8vw,30px);">
      <?php foreach ($c['nav'] as $l): ?>
        <a href="<?= e($l['href']) ?>" style="font-size:15px;font-weight:600;color:#050505;padding:6px 0;"><?= e($l['label']) ?></a>
      <?php endforeach; ?>
    </nav>
    <div class="contact-desktop" style="align-items:center;gap:12px;">
      <a href="<?= e($wa) ?>" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;border:1px solid rgba(5,5,5,.14);border-radius:12px;padding:8px 14px;color:#050505;">
        <span style="color:<?= $OCRE ?>;flex-shrink:0;"><?= wa_icon(20) ?></span>
        <span style="line-height:1.15;">
          <span style="display:block;font-size:15px;font-weight:700;"><?= e(setting($s, 'phone_display')) ?></span>
          <span style="display:block;font-size:11px;color:#4D4D4E;font-weight:500;">Atención por WhatsApp</span>
        </span>
      </a>
      <a href="#contacto" style="display:inline-flex;align-items:center;gap:9px;background:#050505;color:#fff;border-radius:12px;padding:13px 20px;font-size:14px;font-weight:700;"><?= icon('file-text', 18) ?>Solicitar presupuesto</a>
    </div>
    <label for="menu-toggle" class="burger" aria-label="Abrir menú" style="align-items:center;justify-content:center;width:48px;height:48px;border:1px solid rgba(5,5,5,.14);border-radius:12px;background:#fff;cursor:pointer;color:#050505;"><?= icon('menu', 24) ?></label>
  </div>
</header>

<!-- MENÚ MÓVIL -->
<div class="mobile-menu" style="position:fixed;inset:0;z-index:120;background:#F8F6F1;padding:20px clamp(18px,5vw,40px) 40px;flex-direction:column;overflow-y:auto;animation:pincelIn .28s ease both;">
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <img src="<?= e($logo) ?>" alt="Pinceles" style="height:58px;width:auto;mix-blend-mode:multiply;">
    <label for="menu-toggle" style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;border:1px solid rgba(5,5,5,.14);border-radius:12px;background:#fff;cursor:pointer;"><?= icon('x', 24) ?></label>
  </div>
  <nav style="display:flex;flex-direction:column;gap:4px;margin-top:32px;">
    <?php foreach ($c['nav'] as $l): ?>
      <a href="<?= e($l['href']) ?>" onclick="document.getElementById('menu-toggle').checked=false" style="font-family:var(--display);font-size:30px;font-weight:600;color:#050505;padding:14px 0;border-bottom:1px solid rgba(5,5,5,.08);"><?= e($l['label']) ?></a>
    <?php endforeach; ?>
  </nav>
  <div style="display:flex;flex-direction:column;gap:12px;margin-top:32px;">
    <a href="#contacto" onclick="document.getElementById('menu-toggle').checked=false" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#D9912F;color:#050505;font-weight:700;padding:18px;border-radius:14px;">Solicitar presupuesto</a>
    <a href="<?= e($wa) ?>" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;gap:10px;border:1px solid #050505;color:#050505;font-weight:700;padding:18px;border-radius:14px;"><?= wa_icon(20) ?>Contactar por WhatsApp</a>
  </div>
</div>

<?php if ($c['hero']): $h = $c['hero']; ?>
<!-- HERO -->
<section id="inicio" style="position:relative;background:#F8F6F1;padding:clamp(110px,13vw,150px) 0 0;">
  <div class="wrap" style="display:flex;flex-wrap:wrap;align-items:center;gap:clamp(28px,4vw,56px);">
    <div style="flex:1 1 420px;min-width:300px;animation:pincelIn .7s ease both;">
      <?php if ($h['eyebrow']): ?><p class="eyebrow"><?= e($h['eyebrow']) ?></p><?php endif; ?>
      <h1 style="margin:0;font-family:var(--display);font-weight:600;font-size:clamp(40px,5.6vw,72px);line-height:1.04;letter-spacing:-.02em;">
        <?= e($h['title_before_highlight']) ?><span style="color:<?= $OCRE ?>;"><?= e($h['highlighted_text']) ?></span><?= e($h['title_after_highlight']) ?>
      </h1>
      <?php if ($h['description']): ?><p style="margin:26px 0 0;max-width:54ch;font-size:clamp(16px,1.15vw,18px);line-height:1.65;color:#4D4D4E;"><?= e($h['description']) ?></p><?php endif; ?>
      <div style="display:flex;flex-wrap:wrap;gap:14px;margin-top:34px;">
        <a href="<?= e($h['primary_button_url'] ?: '#contacto') ?>" style="display:inline-flex;align-items:center;gap:10px;background:#D9912F;color:#050505;font-weight:700;font-size:16px;padding:17px 26px;border-radius:14px;box-shadow:0 8px 20px rgba(217,145,47,.28);"><?= icon('file-text', 20) ?><?= e($h['primary_button_text'] ?: 'Solicitar presupuesto') ?></a>
        <a href="<?= e($wa) ?>" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(5,5,5,.2);color:#050505;font-weight:700;font-size:16px;padding:17px 26px;border-radius:14px;background:#fff;"><span style="color:<?= $OCRE ?>;"><?= wa_icon(20) ?></span><?= e($h['secondary_button_text'] ?: 'Contactar por WhatsApp') ?></a>
      </div>
    </div>
    <div style="flex:1 1 420px;min-width:300px;position:relative;">
      <?php if ($h['image_url']): ?><img src="<?= e($h['image_url']) ?>" alt="<?= e($h['image_alt']) ?>" width="1280" height="720" style="position:relative;width:100%;height:clamp(280px,42vw,480px);object-fit:cover;border-radius:22px;box-shadow:0 26px 60px rgba(5,5,5,.16);"><?php endif; ?>
      <?php if ($h['image_badge']): ?><div style="position:relative;margin:-34px 0 0 auto;width:fit-content;background:#fff;border-radius:16px;padding:14px 20px;box-shadow:0 14px 34px rgba(5,5,5,.12);font-size:14px;font-weight:600;"><?= e($h['image_badge']) ?></div><?php endif; ?>
    </div>
  </div>
  <?php if ($c['trust']): ?>
  <div class="wrap" style="margin-top:clamp(34px,5vw,56px);">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));background:#fff;border:1px solid rgba(5,5,5,.07);border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(5,5,5,.05);">
      <?php foreach ($c['trust'] as $t): ?>
      <div style="display:flex;align-items:center;gap:14px;padding:22px 24px;border-right:1px solid rgba(5,5,5,.06);">
        <span style="color:<?= $OCRE ?>;flex-shrink:0;"><?= icon($t['icon'], 26) ?></span>
        <span><span style="display:block;font-size:15px;font-weight:700;"><?= e($t['title']) ?></span><?php if ($t['subtitle']): ?><span style="display:block;font-size:13px;color:#4D4D4E;"><?= e($t['subtitle']) ?></span><?php endif; ?></span>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
  <?php endif; ?>
  <div style="height:clamp(50px,7vw,90px);"></div>
</section>
<?php endif; ?>

<?php if ($c['services']): ?>
<!-- SERVICIOS -->
<section id="servicios" style="padding:clamp(64px,8vw,110px) 0;background:#fff;">
  <div class="wrap">
    <div data-reveal style="max-width:640px;">
      <p class="eyebrow"><?= e($sec('services','eyebrow','Servicios')) ?></p>
      <h2 class="h2"><?= e($sec('services','title','Soluciones para cada proyecto')) ?></h2>
      <?php if ($sec('services','description')): ?><p style="margin:18px 0 0;font-size:17px;line-height:1.65;color:#4D4D4E;"><?= e($sec('services','description')) ?></p><?php endif; ?>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:20px;margin-top:clamp(34px,4vw,54px);">
      <?php foreach ($c['services'] as $sv): ?>
      <article data-reveal style="display:flex;flex-direction:column;gap:12px;padding:28px;background:#fff;border:1px solid rgba(5,5,5,.08);border-radius:18px;">
        <span style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:14px;background:rgba(217,145,47,.12);color:<?= $OCRE ?>;"><?= icon($sv['icon'], 26) ?></span>
        <h3 style="margin:6px 0 0;font-size:19px;font-weight:700;"><?= e($sv['title']) ?></h3>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#4D4D4E;flex:1;"><?= e($sv['short_description']) ?></p>
        <a href="#contacto" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:#050505;">Conocer más<?= icon('arrow-right', 16) ?></a>
      </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($c['about']): $a = $c['about']; ?>
<!-- NOSOTROS -->
<section id="nosotros" style="padding:clamp(64px,8vw,110px) 0;background:#F8F6F1;">
  <div class="wrap" style="display:flex;flex-wrap:wrap;gap:clamp(30px,5vw,70px);align-items:center;">
    <div data-reveal style="flex:1 1 380px;min-width:290px;position:relative;">
      <?php if ($a['primary_image_url']): ?><img src="<?= e($a['primary_image_url']) ?>" alt="<?= e($a['primary_image_alt']) ?>" style="width:100%;height:clamp(300px,40vw,470px);object-fit:cover;border-radius:22px;"><?php endif; ?>
    </div>
    <div data-reveal style="flex:1 1 380px;min-width:290px;">
      <p class="eyebrow"><?= e($a['eyebrow'] ?: 'Sobre nosotros') ?></p>
      <h2 class="h2"><?= e($a['title']) ?></h2>
      <?php if ($a['description']): ?><p style="margin:20px 0 0;font-size:17px;line-height:1.7;color:#4D4D4E;"><?= e($a['description']) ?></p><?php endif; ?>
      <?php if ($c['values']): ?>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:26px;">
        <?php foreach ($c['values'] as $v): ?>
        <span style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:#fff;border:1px solid rgba(5,5,5,.07);border-radius:999px;font-size:14px;font-weight:600;"><span style="color:<?= $OCRE ?>;"><?= icon('check', 15) ?></span><?= e($v['name']) ?></span>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($c['process']): ?>
<!-- PROCESO -->
<section style="padding:clamp(64px,8vw,110px) 0;background:#fff;">
  <div class="wrap">
    <div data-reveal style="max-width:620px;">
      <p class="eyebrow"><?= e($sec('process','eyebrow','Proceso')) ?></p>
      <h2 class="h2"><?= e($sec('process','title','Así trabajamos')) ?></h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:24px;margin-top:clamp(34px,4vw,54px);">
      <?php foreach ($c['process'] as $ps): ?>
      <div data-reveal style="padding-top:26px;border-top:2px solid rgba(217,145,47,.35);">
        <h3 style="margin:0;font-size:18px;font-weight:700;"><?= e($ps['title']) ?></h3>
        <?php if ($ps['description']): ?><p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#4D4D4E;"><?= e($ps['description']) ?></p><?php endif; ?>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($c['projects']): $cats = active_categories($c['projects'], $c['categories']); ?>
<!-- PROYECTOS -->
<section id="proyectos" style="padding:clamp(64px,8vw,110px) 0;background:#F8F6F1;">
  <div class="wrap">
    <div data-reveal style="max-width:560px;margin-bottom:24px;">
      <p class="eyebrow"><?= e($sec('projects','eyebrow','Proyectos')) ?></p>
      <h2 class="h2"><?= e($sec('projects','title','Trabajos realizados')) ?></h2>
      <?php if ($sec('projects','description')): ?><p style="margin:16px 0 0;font-size:17px;line-height:1.65;color:#4D4D4E;"><?= e($sec('projects','description')) ?></p><?php endif; ?>
    </div>
    <div role="group" aria-label="Filtrar proyectos" style="display:flex;flex-wrap:wrap;gap:8px;">
      <?php foreach ($cats as $i => $label): ?>
      <button type="button" class="filter-btn<?= $i === 0 ? ' active' : '' ?>" data-filter="<?= e($label) ?>" style="padding:11px 18px;border-radius:999px;font-size:14px;font-weight:600;cursor:pointer;border:1px solid rgba(5,5,5,.14);background:#fff;color:#4D4D4E;"><?= e($label) ?></button>
      <?php endforeach; ?>
    </div>
    <div id="project-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px;margin-top:clamp(30px,4vw,46px);">
      <?php foreach ($c['projects'] as $i => $p): ?>
      <button type="button" class="project-card show" data-category="<?= e($p['category_name']) ?>" data-index="<?= $i ?>"
        data-src="<?= e($p['cover_image_url']) ?>" data-title="<?= e($p['title']) ?>" data-cat="<?= e($p['category_name']) ?>" data-place="<?= e($p['location']) ?>" data-alt="<?= e($p['cover_image_alt']) ?>"
        style="position:relative;padding:0;border:none;cursor:zoom-in;background:#050505;border-radius:18px;overflow:hidden;text-align:left;">
        <img src="<?= e($p['cover_image_url']) ?>" alt="<?= e($p['cover_image_alt']) ?>" loading="lazy" style="width:100%;height:260px;object-fit:cover;display:block;opacity:.92;">
        <span style="position:absolute;inset:auto 0 0 0;padding:44px 20px 18px;background:linear-gradient(to top,rgba(5,5,5,.86),rgba(5,5,5,0));color:#fff;display:block;">
          <span style="display:block;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#DEB97F;"><?= e($p['category_name']) ?></span>
          <span style="display:block;margin-top:6px;font-size:16px;font-weight:600;line-height:1.35;"><?= e($p['title']) ?></span>
          <span style="display:block;margin-top:4px;font-size:13px;color:rgba(255,255,255,.72);"><?= e($p['location']) ?></span>
        </span>
      </button>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($c['industries']): ?>
<!-- INDUSTRIAS -->
<section id="industrias" style="padding:clamp(64px,8vw,110px) 0;background:#fff;">
  <div class="wrap" style="display:flex;flex-wrap:wrap;gap:clamp(30px,5vw,64px);">
    <div data-reveal style="flex:1 1 320px;min-width:280px;">
      <p class="eyebrow"><?= e($sec('industries','eyebrow','Industrias y clientes')) ?></p>
      <h2 class="h2"><?= e($sec('industries','title','A quiénes acompañamos')) ?></h2>
      <?php if ($sec('industries','description')): ?><p style="margin:18px 0 0;font-size:17px;line-height:1.65;color:#4D4D4E;"><?= e($sec('industries','description')) ?></p><?php endif; ?>
    </div>
    <div style="flex:1 1 420px;min-width:290px;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;background:rgba(5,5,5,.09);border:1px solid rgba(5,5,5,.09);border-radius:18px;overflow:hidden;">
        <?php foreach ($c['industries'] as $ind): ?>
        <div data-reveal style="background:#fff;padding:26px 22px;display:flex;flex-direction:column;gap:12px;">
          <span style="color:<?= $OCRE ?>;"><?= icon($ind['icon'], 24) ?></span>
          <span style="font-size:15px;font-weight:600;"><?= e($ind['name']) ?></span>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($c['differentiators']): ?>
<!-- DIFERENCIALES -->
<section style="padding:clamp(64px,8vw,110px) 0;background:#F8F6F1;">
  <div class="wrap">
    <div data-reveal style="max-width:620px;">
      <p class="eyebrow"><?= e($sec('differentiators','eyebrow','Diferenciales')) ?></p>
      <h2 class="h2"><?= e($sec('differentiators','title','¿Por qué elegir Pinceles?')) ?></h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:clamp(30px,4vw,50px);border-top:1px solid rgba(5,5,5,.12);">
      <?php foreach ($c['differentiators'] as $d): ?>
      <div data-reveal style="padding:28px 24px 28px 0;border-bottom:1px solid rgba(5,5,5,.12);">
        <span style="display:block;font-size:17px;font-weight:700;"><?= e($d['title']) ?></span>
        <?php if ($d['description']): ?><span style="display:block;margin-top:6px;font-size:15px;line-height:1.6;color:#4D4D4E;"><?= e($d['description']) ?></span><?php endif; ?>
      </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if ($c['cta']): $ct = $c['cta']; $ctaTitle = str_replace($ct['highlighted_text'] ?? '', '', $ct['title'] ?? ''); ?>
<!-- CTA -->
<section style="position:relative;background:#050505;color:#fff;padding:clamp(64px,8vw,108px) 0;overflow:hidden;">
  <div class="wrap" style="position:relative;display:flex;flex-wrap:wrap;gap:clamp(28px,5vw,60px);align-items:center;justify-content:space-between;">
    <div data-reveal style="flex:1 1 420px;min-width:290px;">
      <h2 class="h2" style="font-size:clamp(32px,4.2vw,56px);"><?= e($ctaTitle) ?><?php if ($ct['highlighted_text']): ?><span style="color:<?= $OCRE ?>;"><?= e($ct['highlighted_text']) ?></span><?php endif; ?></h2>
      <?php if ($ct['description']): ?><p style="margin:22px 0 0;max-width:52ch;font-size:17px;line-height:1.7;color:rgba(255,255,255,.74);"><?= e($ct['description']) ?></p><?php endif; ?>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:14px;">
      <a href="<?= e($ct['primary_button_url'] ?: '#contacto') ?>" style="display:inline-flex;align-items:center;gap:10px;background:#D9912F;color:#050505;font-weight:700;font-size:16px;padding:18px 28px;border-radius:14px;"><?= icon('file-text', 20) ?><?= e($ct['primary_button_text'] ?: 'Solicitar presupuesto') ?></a>
      <a href="<?= e($wa) ?>" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.3);color:#fff;font-weight:700;font-size:16px;padding:18px 28px;border-radius:14px;"><?= wa_icon(20) ?><?= e($ct['secondary_button_text'] ?: 'Hablar por WhatsApp') ?></a>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- CONTACTO -->
<section id="contacto" style="padding:clamp(64px,8vw,110px) 0;background:#fff;">
  <div class="wrap" style="display:flex;flex-wrap:wrap;gap:clamp(30px,5vw,64px);">
    <div data-reveal style="flex:1 1 330px;min-width:280px;">
      <p class="eyebrow"><?= e($sec('contact','eyebrow','Contacto')) ?></p>
      <h2 class="h2"><?= e($sec('contact','title','Pedí tu presupuesto')) ?></h2>
      <?php if ($sec('contact','description')): ?><p style="margin:18px 0 0;font-size:17px;line-height:1.65;color:#4D4D4E;"><?= e($sec('contact','description')) ?></p><?php endif; ?>
      <div style="display:flex;flex-direction:column;gap:14px;margin-top:30px;">
        <a href="<?= e($wa) ?>" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:16px;padding:18px 20px;border:1px solid rgba(5,5,5,.08);border-radius:16px;color:#050505;">
          <span style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(217,145,47,.12);flex-shrink:0;color:<?= $OCRE ?>;"><?= wa_icon(22) ?></span>
          <span><span style="display:block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4D4D4E;">WhatsApp</span><span style="display:block;margin-top:3px;font-size:16px;font-weight:600;"><?= e(setting($s, 'phone_display')) ?></span></span>
        </a>
        <?php if (setting($s, 'email')): ?>
        <a href="mailto:<?= e(setting($s, 'email')) ?>" style="display:flex;align-items:center;gap:16px;padding:18px 20px;border:1px solid rgba(5,5,5,.08);border-radius:16px;color:#050505;">
          <span style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(217,145,47,.12);flex-shrink:0;color:<?= $OCRE ?>;"><?= icon('mail', 22) ?></span>
          <span><span style="display:block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4D4D4E;">Correo</span><span style="display:block;margin-top:3px;font-size:16px;font-weight:600;"><?= e(setting($s, 'email')) ?></span></span>
        </a>
        <?php endif; ?>
        <?php if (setting($s, 'business_hours')): ?>
        <div style="display:flex;align-items:center;gap:16px;padding:18px 20px;border:1px solid rgba(5,5,5,.08);border-radius:16px;color:#050505;">
          <span style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(217,145,47,.12);flex-shrink:0;color:<?= $OCRE ?>;"><?= icon('clock', 22) ?></span>
          <span><span style="display:block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4D4D4E;">Horario</span><span style="display:block;margin-top:3px;font-size:16px;font-weight:600;"><?= e(setting($s, 'business_hours')) ?></span></span>
        </div>
        <?php endif; ?>
      </div>
    </div>
    <div data-reveal style="flex:1 1 420px;min-width:290px;background:#F8F6F1;border-radius:22px;padding:clamp(22px,3vw,38px);">
      <form action="contacto.php" method="post" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;">
        <input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;" aria-hidden="true">
        <label style="grid-column:1 / -1;"><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Nombre *</span><input type="text" name="nombre" required placeholder="Tu nombre y apellido" style="width:100%;min-height:50px;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;"></label>
        <label><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Empresa</span><input type="text" name="empresa" placeholder="Opcional" style="width:100%;min-height:50px;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;"></label>
        <label><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Teléfono *</span><input type="text" name="telefono" required placeholder="09XX XXX XXX" style="width:100%;min-height:50px;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;"></label>
        <label><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Correo</span><input type="email" name="correo" placeholder="nombre@correo.com" style="width:100%;min-height:50px;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;"></label>
        <label><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Ubicación</span><input type="text" name="ubicacion" placeholder="Ciudad o barrio" style="width:100%;min-height:50px;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;"></label>
        <label style="grid-column:1 / -1;"><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Tipo de servicio</span>
          <select name="servicio" style="width:100%;min-height:50px;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;">
            <option value="">Seleccioná un servicio</option>
            <?php foreach ($c['services'] as $sv): ?><option value="<?= e($sv['title']) ?>"><?= e($sv['title']) ?></option><?php endforeach; ?>
          </select>
        </label>
        <label style="grid-column:1 / -1;"><span style="display:block;font-size:13px;font-weight:700;margin-bottom:7px;">Mensaje</span><textarea name="mensaje" rows="4" placeholder="Contanos qué necesitás: superficie, ubicación, plazos." style="width:100%;padding:13px 15px;border-radius:12px;border:1px solid rgba(5,5,5,.14);background:#fff;resize:vertical;"></textarea></label>
        <button type="submit" style="grid-column:1 / -1;display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:56px;background:#D9912F;color:#050505;font-weight:700;font-size:16px;border:none;border-radius:14px;cursor:pointer;"><?= wa_icon(20) ?>Enviar solicitud por WhatsApp</button>
      </form>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer style="background:#050505;color:rgba(255,255,255,.72);padding:clamp(50px,6vw,80px) 0 30px;">
  <div class="wrap" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:36px;">
    <div>
      <img src="<?= e($logo) ?>" alt="Pinceles" width="180" height="153" style="width:168px;height:auto;border-radius:10px;background:#fff;">
      <?php if (setting($s, 'slogan')): ?><p style="margin:18px 0 0;font-family:var(--display);font-size:17px;color:#DEB97F;"><?= e(setting($s, 'slogan')) ?></p><?php endif; ?>
    </div>
    <div>
      <h3 style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;">Navegación</h3>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <?php foreach ($c['nav'] as $l): ?><a href="<?= e($l['href']) ?>" style="font-size:15px;color:rgba(255,255,255,.72);"><?= e($l['label']) ?></a><?php endforeach; ?>
      </div>
    </div>
    <div>
      <h3 style="margin:0 0 16px;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;">Contacto</h3>
      <div style="display:flex;flex-direction:column;gap:10px;font-size:15px;">
        <a href="<?= e($wa) ?>" target="_blank" rel="noopener" style="color:rgba(255,255,255,.72);">WhatsApp <?= e(setting($s, 'phone_display')) ?></a>
        <?php if (setting($s, 'email')): ?><a href="mailto:<?= e(setting($s, 'email')) ?>" style="color:rgba(255,255,255,.72);"><?= e(setting($s, 'email')) ?></a><?php endif; ?>
        <?php if (setting($s, 'coverage')): ?><span><?= e(setting($s, 'coverage')) ?></span><?php endif; ?>
        <?php if (setting($s, 'business_hours')): ?><span><?= e(setting($s, 'business_hours')) ?></span><?php endif; ?>
      </div>
    </div>
  </div>
  <div class="wrap" style="margin-top:clamp(34px,4vw,54px);padding-top:24px;border-top:1px solid rgba(255,255,255,.12);display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;font-size:13px;">
    <span style="font-size:12px;color:rgba(255,255,255,.5);">Desarrollado por <a href="https://neura.com.py" target="_blank" rel="noopener" style="color:#D9912F;font-weight:700;">NEURA</a></span>
  </div>
</footer>

<!-- WhatsApp flotante -->
<a href="<?= e($wa) ?>" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" style="position:fixed;right:clamp(14px,2.4vw,28px);bottom:clamp(14px,2.4vw,28px);z-index:100;display:flex;align-items:center;gap:10px;background:#050505;color:#fff;border-radius:999px;padding:14px 18px;box-shadow:0 14px 30px rgba(5,5,5,.28);font-size:14px;font-weight:700;"><?= wa_icon(22) ?><span>Escribinos</span></a>

<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox" style="flex-direction:column;gap:18px;">
  <img id="lb-img" src="" alt="" style="max-width:100%;max-height:74vh;object-fit:contain;border-radius:12px;">
  <div style="text-align:center;color:#fff;">
    <p id="lb-cat" style="margin:0;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#DEB97F;"></p>
    <p id="lb-title" style="margin:8px 0 0;font-size:18px;font-weight:600;"></p>
    <p id="lb-place" style="margin:4px 0 0;font-size:14px;color:rgba(255,255,255,.7);"></p>
  </div>
  <div style="display:flex;gap:12px;">
    <button type="button" id="lb-prev" aria-label="Anterior" style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:14px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer;"><?= icon('chevron-left', 24) ?></button>
    <button type="button" id="lb-next" aria-label="Siguiente" style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:14px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer;"><?= icon('chevron-right', 24) ?></button>
    <button type="button" id="lb-close" aria-label="Cerrar" style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:14px;border:none;background:#D9912F;color:#050505;cursor:pointer;"><?= icon('x', 24) ?></button>
  </div>
</div>

<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script src="assets/js/site.js"></script>
</body>
</html>
