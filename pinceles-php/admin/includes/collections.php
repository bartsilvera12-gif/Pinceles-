<?php
/**
 * Configuración declarativa de módulos administrables (colecciones y singletons).
 * Cada campo: [name, label, type], type ∈ text|textarea|number|bool|select|image|slug|color|email
 */

function COLLECTIONS(): array
{
    $status = [['value' => 'draft', 'label' => 'Borrador'], ['value' => 'published', 'label' => 'Publicado'], ['value' => 'archived', 'label' => 'Archivado']];
    return [
        'services' => [
            'table' => 'services', 'title' => 'Servicios', 'singular' => 'servicio',
            'list_title' => 'title', 'list_sub' => 'short_description', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'title', 'label' => 'Título', 'type' => 'text', 'required' => true],
                ['name' => 'slug', 'label' => 'Slug', 'type' => 'slug', 'required' => true],
                ['name' => 'icon', 'label' => 'Ícono (lucide)', 'type' => 'text', 'ph' => 'paint-roller'],
                ['name' => 'short_description', 'label' => 'Descripción corta', 'type' => 'textarea', 'full' => true],
                ['name' => 'is_featured', 'label' => 'Destacado', 'type' => 'bool'],
            ],
        ],
        'process_steps' => [
            'table' => 'process_steps', 'title' => 'Proceso', 'singular' => 'paso',
            'list_title' => 'title', 'list_sub' => 'description', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'step_number', 'label' => 'Número', 'type' => 'text', 'ph' => '01'],
                ['name' => 'title', 'label' => 'Título', 'type' => 'text', 'required' => true],
                ['name' => 'description', 'label' => 'Descripción', 'type' => 'textarea', 'full' => true],
            ],
        ],
        'industries' => [
            'table' => 'industries', 'title' => 'Industrias', 'singular' => 'industria',
            'list_title' => 'name', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'name', 'label' => 'Nombre', 'type' => 'text', 'required' => true],
                ['name' => 'slug', 'label' => 'Slug', 'type' => 'slug', 'required' => true],
                ['name' => 'icon', 'label' => 'Ícono (lucide)', 'type' => 'text', 'ph' => 'factory'],
            ],
        ],
        'differentiators' => [
            'table' => 'differentiators', 'title' => 'Diferenciales', 'singular' => 'diferencial',
            'list_title' => 'title', 'list_sub' => 'description', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'number_label', 'label' => 'Número', 'type' => 'text', 'ph' => '01'],
                ['name' => 'title', 'label' => 'Título', 'type' => 'text', 'required' => true],
                ['name' => 'description', 'label' => 'Descripción', 'type' => 'textarea', 'full' => true],
            ],
        ],
        'testimonials' => [
            'table' => 'testimonials', 'title' => 'Testimonios', 'singular' => 'testimonio',
            'list_title' => 'client_name', 'list_sub' => 'testimonial', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'client_name', 'label' => 'Cliente', 'type' => 'text', 'required' => true],
                ['name' => 'client_company', 'label' => 'Empresa', 'type' => 'text'],
                ['name' => 'testimonial', 'label' => 'Testimonio', 'type' => 'textarea', 'required' => true, 'full' => true],
                ['name' => 'rating', 'label' => 'Calificación (1-5)', 'type' => 'number'],
                ['name' => 'status', 'label' => 'Estado', 'type' => 'select', 'options' => $status],
            ],
        ],
        'company_values' => [
            'table' => 'company_values', 'title' => 'Valores', 'singular' => 'valor',
            'list_title' => 'name', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'name', 'label' => 'Nombre', 'type' => 'text', 'required' => true],
                ['name' => 'icon', 'label' => 'Ícono (lucide)', 'type' => 'text', 'ph' => 'check'],
            ],
        ],
        'statistics' => [
            'table' => 'statistics', 'title' => 'Estadísticas', 'singular' => 'cifra',
            'list_title' => 'label', 'list_sub' => 'value', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'value', 'label' => 'Valor', 'type' => 'text', 'required' => true, 'ph' => '+120'],
                ['name' => 'label', 'label' => 'Etiqueta', 'type' => 'text', 'required' => true],
            ],
        ],
        'trust_items' => [
            'table' => 'trust_items', 'title' => 'Barra de confianza', 'singular' => 'ítem',
            'list_title' => 'title', 'list_sub' => 'subtitle', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'icon', 'label' => 'Ícono (lucide)', 'type' => 'text', 'ph' => 'badge-check'],
                ['name' => 'title', 'label' => 'Título', 'type' => 'text', 'required' => true],
                ['name' => 'subtitle', 'label' => 'Subtítulo', 'type' => 'text'],
            ],
        ],
        'sections' => [
            'table' => 'sections', 'title' => 'Secciones', 'singular' => 'sección',
            'list_title' => 'internal_name', 'list_sub' => 'title', 'orderable' => true, 'has_visible' => true, 'no_create' => true, 'no_delete' => true,
            'fields' => [
                ['name' => 'eyebrow', 'label' => 'Etiqueta superior', 'type' => 'text'],
                ['name' => 'title', 'label' => 'Título', 'type' => 'text'],
                ['name' => 'description', 'label' => 'Descripción', 'type' => 'textarea', 'full' => true],
            ],
        ],
        'navigation_items' => [
            'table' => 'navigation_items', 'title' => 'Navegación', 'singular' => 'ítem',
            'list_title' => 'label', 'list_sub' => 'href', 'orderable' => true, 'has_visible' => true,
            'fields' => [
                ['name' => 'label', 'label' => 'Etiqueta', 'type' => 'text', 'required' => true],
                ['name' => 'href', 'label' => 'Enlace', 'type' => 'text', 'required' => true, 'ph' => '#seccion'],
            ],
        ],
    ];
}

function SINGLETONS(): array
{
    return [
        'hero' => [
            'table' => 'hero', 'title' => 'Hero',
            'fields' => [
                ['name' => 'eyebrow', 'label' => 'Etiqueta superior', 'type' => 'text'],
                ['name' => 'title_before_highlight', 'label' => 'Título (antes del resaltado)', 'type' => 'text'],
                ['name' => 'highlighted_text', 'label' => 'Texto resaltado', 'type' => 'text'],
                ['name' => 'title_after_highlight', 'label' => 'Título (después del resaltado)', 'type' => 'text'],
                ['name' => 'description', 'label' => 'Descripción', 'type' => 'textarea', 'full' => true],
                ['name' => 'image_url', 'label' => 'Imagen', 'type' => 'image', 'full' => true],
                ['name' => 'image_alt', 'label' => 'Alt de la imagen', 'type' => 'text'],
                ['name' => 'image_badge', 'label' => 'Badge sobre la imagen', 'type' => 'text'],
                ['name' => 'primary_button_text', 'label' => 'Botón primario (texto)', 'type' => 'text'],
                ['name' => 'primary_button_url', 'label' => 'Botón primario (URL)', 'type' => 'text'],
                ['name' => 'secondary_button_text', 'label' => 'Botón secundario (texto)', 'type' => 'text'],
                ['name' => 'secondary_button_url', 'label' => 'Botón secundario (URL)', 'type' => 'text'],
            ],
        ],
        'about' => [
            'table' => 'about', 'title' => 'Nosotros',
            'fields' => [
                ['name' => 'eyebrow', 'label' => 'Etiqueta superior', 'type' => 'text'],
                ['name' => 'title', 'label' => 'Título', 'type' => 'text'],
                ['name' => 'description', 'label' => 'Descripción', 'type' => 'textarea', 'full' => true],
                ['name' => 'primary_image_url', 'label' => 'Imagen principal', 'type' => 'image', 'full' => true],
                ['name' => 'primary_image_alt', 'label' => 'Alt imagen principal', 'type' => 'text'],
                ['name' => 'secondary_image_url', 'label' => 'Imagen secundaria', 'type' => 'image', 'full' => true],
                ['name' => 'secondary_image_alt', 'label' => 'Alt imagen secundaria', 'type' => 'text'],
            ],
        ],
        'cta' => [
            'table' => 'cta', 'title' => 'CTA',
            'fields' => [
                ['name' => 'title', 'label' => 'Título', 'type' => 'text'],
                ['name' => 'highlighted_text', 'label' => 'Texto resaltado', 'type' => 'text'],
                ['name' => 'description', 'label' => 'Descripción', 'type' => 'textarea', 'full' => true],
                ['name' => 'primary_button_text', 'label' => 'Botón primario (texto)', 'type' => 'text'],
                ['name' => 'primary_button_url', 'label' => 'Botón primario (URL)', 'type' => 'text'],
                ['name' => 'secondary_button_text', 'label' => 'Botón secundario (texto)', 'type' => 'text'],
                ['name' => 'secondary_button_url', 'label' => 'Botón secundario (URL)', 'type' => 'text'],
            ],
        ],
        'site_settings' => [
            'table' => 'site_settings', 'title' => 'Configuración y contacto',
            'fields' => [
                ['name' => 'company_name', 'label' => 'Nombre de la empresa', 'type' => 'text'],
                ['name' => 'slogan', 'label' => 'Eslogan', 'type' => 'text'],
                ['name' => 'short_description', 'label' => 'Descripción corta', 'type' => 'textarea', 'full' => true],
                ['name' => 'logo_url', 'label' => 'Logo', 'type' => 'image', 'full' => true],
                ['name' => 'favicon_url', 'label' => 'Favicon', 'type' => 'text'],
                ['name' => 'phone_display', 'label' => 'Teléfono (visible)', 'type' => 'text'],
                ['name' => 'whatsapp_number', 'label' => 'WhatsApp (internacional, sin +)', 'type' => 'text', 'ph' => '595982897118'],
                ['name' => 'whatsapp_default_message', 'label' => 'Mensaje por defecto de WhatsApp', 'type' => 'textarea', 'full' => true],
                ['name' => 'email', 'label' => 'Correo', 'type' => 'email'],
                ['name' => 'address', 'label' => 'Dirección', 'type' => 'text'],
                ['name' => 'coverage', 'label' => 'Cobertura', 'type' => 'text'],
                ['name' => 'business_hours', 'label' => 'Horario', 'type' => 'text'],
                ['name' => 'map_url', 'label' => 'URL del mapa', 'type' => 'text', 'full' => true],
            ],
        ],
    ];
}
