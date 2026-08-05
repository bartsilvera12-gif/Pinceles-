<?php
require_once __DIR__ . '/db.php';

/** Carga todo el contenido público del sitio desde la base. */
function get_site_content(): array
{
    $settings = q1("SELECT * FROM site_settings LIMIT 1") ?? [];

    $sections = [];
    foreach (q("SELECT * FROM sections WHERE is_visible = 1") as $s) {
        $sections[$s['section_key']] = $s;
    }

    $projects = q("SELECT p.*, c.name AS category_name
                   FROM projects p
                   LEFT JOIN project_categories c ON c.id = p.category_id
                   WHERE p.is_visible = 1 AND p.status = 'published'
                   ORDER BY p.sort_order");
    // imágenes por proyecto
    foreach ($projects as &$p) {
        $p['images'] = q("SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order", [$p['id']]);
    }
    unset($p);

    return [
        'settings'        => $settings,
        'sections'        => $sections,
        'nav'             => q("SELECT * FROM navigation_items WHERE is_visible = 1 ORDER BY sort_order"),
        'hero'            => q1("SELECT * FROM hero WHERE is_visible = 1 LIMIT 1"),
        'trust'           => q("SELECT * FROM trust_items WHERE is_visible = 1 ORDER BY sort_order"),
        'services'        => q("SELECT * FROM services WHERE is_visible = 1 ORDER BY sort_order"),
        'about'           => q1("SELECT * FROM about WHERE is_visible = 1 LIMIT 1"),
        'values'          => q("SELECT * FROM company_values WHERE is_visible = 1 ORDER BY sort_order"),
        'stats'           => q("SELECT * FROM statistics WHERE is_visible = 1 ORDER BY sort_order"),
        'process'         => q("SELECT * FROM process_steps WHERE is_visible = 1 ORDER BY sort_order"),
        'categories'      => q("SELECT * FROM project_categories WHERE is_visible = 1 ORDER BY sort_order"),
        'projects'        => $projects,
        'industries'      => q("SELECT * FROM industries WHERE is_visible = 1 ORDER BY sort_order"),
        'differentiators' => q("SELECT * FROM differentiators WHERE is_visible = 1 ORDER BY sort_order"),
        'testimonials'    => q("SELECT * FROM testimonials WHERE is_visible = 1 AND status = 'published' ORDER BY sort_order"),
        'cta'             => q1("SELECT * FROM cta WHERE is_visible = 1 LIMIT 1"),
        'footer_links'    => q("SELECT * FROM footer_links WHERE is_visible = 1 ORDER BY sort_order"),
    ];
}

/** Categorías que tienen al menos un proyecto publicado (para los filtros). */
function active_categories(array $projects, array $categories): array
{
    $present = [];
    foreach ($projects as $p) {
        if (!empty($p['category_name'])) $present[$p['category_name']] = true;
    }
    $out = ['Todos'];
    foreach ($categories as $c) {
        if (isset($present[$c['name']])) $out[] = $c['name'];
    }
    return $out;
}

function setting(array $settings, string $key, string $default = ''): string
{
    return isset($settings[$key]) && $settings[$key] !== null ? (string) $settings[$key] : $default;
}
