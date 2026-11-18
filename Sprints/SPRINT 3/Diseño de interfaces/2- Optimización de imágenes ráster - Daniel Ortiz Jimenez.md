## Tarea T-3.2 · Optimización de imágenes ráster

Páginas donde se usarán: Productos (fotografías de los artículos del catálogo).

Se han optimizado 9 fotografías de producto tomadas en el almacén, convirtiéndolas a formatos modernos (AVIF y WebP) y preparándolas para que se adapten a cada pantalla.

### 1. Material de origen

| Imagen | Descripción | Origen | Licencia |
| --- | --- | --- | --- |
| claveles, gerberas, girasoles, rosas-blancas, rosas-rojas, calas, lilium, nardos, margaritas-blancas | Fotografías de producto, JPG de 1204×1600 px | Fotografías propias, tomadas en el almacén del cliente | Propia (con permiso del cliente) |

Las fotografías muestran las flores y su embalaje; no aparecen personas.

### 2. Herramientas

- [x] `ffmpeg` (libwebp y libaom-av1) para convertir y redimensionar.
- [x] Script `convertir-imagenes.sh` para repetir el proceso con todas las fotos.

### 3. Conversión

- [x] Conservados los originales en `assets/img/originales/`.
- [x] Convertidas a **WebP** (calidad 80).
- [x] Convertidas a **AVIF** (crf 32).
- [x] Generadas en tres anchuras (480, 800 y 1200 px) con JPG de respaldo, en `assets/img/productos/`.

```bash
# WebP (calidad 80)
ffmpeg -i original.jpg -c:v libwebp -quality 80 salida.webp
# AVIF (AV1, crf 32)
ffmpeg -i original.jpg -c:v libaom-av1 -crf 32 -b:v 0 -still-picture 1 -cpu-used 6 salida.avif
# Versión responsiva (ejemplo a 800 px de ancho)
ffmpeg -i original.jpg -vf scale=800:-2 -c:v libwebp -quality 80 imagen-800.webp
```

### 4. Comparación de pesos

| Imagen | JPG original | WebP q80 | AVIF crf 32 |
|---|---:|---:|---:|
| calas | 103 KB | 57 KB (−45 %) | 18 KB (−82 %) |
| claveles | 130 KB | 81 KB (−38 %) | 29 KB (−78 %) |
| gerberas | 103 KB | 58 KB (−44 %) | 23 KB (−78 %) |
| girasoles | 202 KB | 137 KB (−33 %) | 58 KB (−71 %) |
| lilium | 184 KB | 123 KB (−33 %) | 48 KB (−74 %) |
| margaritas-blancas | 114 KB | 65 KB (−43 %) | 25 KB (−78 %) |
| nardos | 136 KB | 80 KB (−41 %) | 29 KB (−78 %) |
| rosas-blancas | 126 KB | 75 KB (−40 %) | 29 KB (−77 %) |
| rosas-rojas | 133 KB | 82 KB (−38 %) | 29 KB (−78 %) |
| **Total** | **1.230 KB** | **757 KB (−38,5 %)** | **288 KB (−76,6 %)** |

Versiones que se sirven en la web (suma de las 9 fotos):

| Anchura | JPG | WebP | AVIF | WebP vs original | AVIF vs original |
|---|---:|---:|---:|---:|---:|
| 480 px | 332 KB | 264 KB | 121 KB | −78,6 % | −90,2 % |
| 800 px | 625 KB | 467 KB | 195 KB | −62,0 % | −84,1 % |
| 1200 px | 1.035 KB | 737 KB | 281 KB | −40,1 % | −77,2 % |

- [x] Reducción mínima del 40 %: cumplida con AVIF (−76,6 %) y con las versiones responsivas (−62 % a 800 px, −79 % a 480 px). A igual tamaño, WebP queda en −38,5 %, porque los originales ya venían comprimidos.
- [x] Revisión visual: sin pérdida apreciable de calidad (SSIM 0,985 en WebP y 0,981 en AVIF).

### 5. Uso en la web

```html
<picture>
  <source type="image/avif"
    srcset="assets/img/productos/rosas-rojas-480.avif 480w,
            assets/img/productos/rosas-rojas-800.avif 800w,
            assets/img/productos/rosas-rojas-1200.avif 1200w"
    sizes="(max-width: 600px) 100vw, 400px">
  <source type="image/webp"
    srcset="assets/img/productos/rosas-rojas-480.webp 480w,
            assets/img/productos/rosas-rojas-800.webp 800w,
            assets/img/productos/rosas-rojas-1200.webp 1200w"
    sizes="(max-width: 600px) 100vw, 400px">
  <img src="assets/img/productos/rosas-rojas-800.jpg"
    srcset="assets/img/productos/rosas-rojas-480.jpg 480w,
            assets/img/productos/rosas-rojas-800.jpg 800w,
            assets/img/productos/rosas-rojas-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw, 400px"
    width="800" height="1067" loading="lazy"
    alt="Caja de rosas rojas">
</picture>
```

- [x] `width` y `height` con la proporción 3:4, para evitar deformaciones y saltos de diseño (CLS).
- [x] `loading="lazy"` para no descargar las imágenes que no se ven.
- [x] `alt` descriptivo en cada imagen.

### 6. Comprobaciones

- [ ] Las imágenes se ven correctamente en Chrome, Firefox y Edge.
- [ ] Comprobado en la pestaña Red que no hay errores 404 y que se carga el formato adecuado.
- [ ] Comprobado en modo responsive (móvil y tablet) que las imágenes no se deforman.
- [ ] Anotadas en `LICENSES.md` las fotografías (autor, origen y licencia).

### Archivos nuevos

- `assets/img/originales/` (9 JPG)
- `assets/img/productos/` (81 archivos: 9 fotos × 3 anchuras × AVIF, WebP y JPG)
