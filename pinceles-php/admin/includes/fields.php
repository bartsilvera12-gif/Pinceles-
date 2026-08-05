<?php

/** Renderiza un campo de formulario según su definición. */
function render_field(array $f, $value): void
{
    $name = $f['name'];
    $label = $f['label'];
    $type = $f['type'];
    $req = !empty($f['required']);
    $ph = $f['ph'] ?? '';
    $full = !empty($f['full']);
    $val = $value ?? '';
    echo '<div class="field"' . ($full ? ' style="grid-column:1 / -1;"' : '') . '>';

    if ($type === 'bool') {
        echo '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;">';
        echo '<input type="checkbox" name="' . e($name) . '" value="1" style="width:auto;min-height:auto;"' . ($value ? ' checked' : '') . '> ' . e($label);
        echo '</label></div>';
        return;
    }

    echo '<label>' . e($label) . ($req ? ' <span class="req">*</span>' : '') . '</label>';

    if ($type === 'textarea') {
        echo '<textarea name="' . e($name) . '" placeholder="' . e($ph) . '"' . ($req ? ' required' : '') . '>' . e((string) $val) . '</textarea>';
    } elseif ($type === 'select') {
        echo '<select name="' . e($name) . '">';
        foreach ($f['options'] as $o) {
            $sel = ((string) $val === (string) $o['value']) ? ' selected' : '';
            echo '<option value="' . e($o['value']) . '"' . $sel . '>' . e($o['label']) . '</option>';
        }
        echo '</select>';
    } elseif ($type === 'image') {
        echo '<div style="display:flex;gap:10px;align-items:center;">';
        echo '<img src="' . e(amedia((string) $val)) . '" alt="" style="width:56px;height:42px;object-fit:cover;border-radius:8px;background:#eee;' . ($val ? '' : 'display:none;') . '" class="img-preview">';
        echo '<input type="text" name="' . e($name) . '" value="' . e((string) $val) . '" placeholder="images/archivo.jpg o URL" class="img-url" style="flex:1;">';
        echo '<label class="btn btn-ghost" style="cursor:pointer;white-space:nowrap;">Subir<input type="file" accept="image/*" class="img-file" hidden></label>';
        echo '</div>';
    } elseif ($type === 'color') {
        echo '<div style="display:flex;gap:8px;"><input type="color" value="' . e((string) ($val ?: '#000000')) . '" onchange="this.nextElementSibling.value=this.value" style="width:46px;padding:2px;"><input type="text" name="' . e($name) . '" value="' . e((string) $val) . '" style="flex:1;"></div>';
    } else {
        $it = $type === 'number' ? 'number' : ($type === 'email' ? 'email' : 'text');
        echo '<input type="' . $it . '" name="' . e($name) . '" value="' . e((string) $val) . '" placeholder="' . e($ph) . '"' . ($req ? ' required' : '') . '>';
    }
    echo '</div>';
}

/** Convierte los valores POST según el tipo de cada campo. */
function coerce_fields(array $fields, array $post): array
{
    $out = [];
    foreach ($fields as $f) {
        $name = $f['name'];
        if ($f['type'] === 'bool') {
            $out[$name] = !empty($post[$name]) ? 1 : 0;
        } elseif ($f['type'] === 'number') {
            $out[$name] = ($post[$name] ?? '') === '' ? null : (int) $post[$name];
        } else {
            $v = trim((string) ($post[$name] ?? ''));
            $out[$name] = $v === '' ? null : $v;
        }
    }
    return $out;
}
