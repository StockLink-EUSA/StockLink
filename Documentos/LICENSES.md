# Licencias de recursos multimedia

Revisión de los recursos gráficos de las 8 páginas de StockLink (Login, Registro, Dashboard, Productos, Categorías, Almacenes, Movimientos y Empresas).

La parte gráfica de la interfaz son SVG, y el único recurso SVG con `<img>` es el logotipo (`assets/svg/logo.svg`), usado 10 veces. Además, en el Sprint 3 se han añadido recursos multimedia (vídeo, audio y fotografías de producto), recogidos en su propia tabla más abajo.

## Inventario

| Recurso | Dónde se usa | Origen | Licencia |
|---|---|---|---|
| Logotipo (`logo.svg`, 3 hexágonos) | 8 páginas (10 usos) | Creación propia del proyecto | Propia |
| Icono Multiempresa (rectángulo con líneas) | Login y Registro | Creación propia del proyecto | Propia |
| Icono Visibilidad total (ojo) | Login y Registro | Creación propia del proyecto | Propia |
| Icono Alertas de stock (campana) | Login y Registro | Creación propia del proyecto | Propia |
| `nav-panel.svg` (cuadrícula) | Barra lateral | Creación propia, hecha para el proyecto con ayuda de IA (Claude) | Propia |
| `nav-productos.svg` (caja) | Barra lateral | Ídem | Propia |
| `nav-categorias.svg` (etiqueta) | Barra lateral | Ídem | Propia |
| `nav-almacenes.svg` (almacén) | Barra lateral | Ídem | Propia |
| `nav-movimientos.svg` (flechas) | Barra lateral | Ídem | Propia |
| `nav-empresas.svg` | Barra lateral | Reutiliza el icono Multiempresa | Propia |

## Recursos multimedia (Sprint 3)

| Recurso | Dónde se usa | Origen | Licencia |
|---|---|---|---|
| `assets/media/fondo-acceso.mp4` y `fondo-acceso.webm` (vídeo de fondo en bucle) | Login y Registro | Creación propia: animación generada con código (HTML/Canvas) y codificada con ffmpeg, hecha con ayuda de IA (Claude) | Propia |
| `assets/media/fondo-acceso.webp` (póster del vídeo de fondo) | Login y Registro | Creación propia: fotograma del vídeo de fondo | Propia |
| `assets/media/alerta-stock.mp3` y `alerta-stock.ogg` (sonido de alerta) | Preparado para las alertas de stock | Creación propia: sonido generado por síntesis de audio, hecho con ayuda de IA (Claude) | Propia |
| `assets/img/video-poster.webp` (póster del vídeo demo) | No se usa en la web (el vídeo demo se retiró) | Creación propia: fotograma de una captura de la aplicación | Propia |
| Fotografías de producto: `claveles`, `gerberas`, `girasoles`, `rosas-blancas`, `rosas-rojas`, `calas`, `lilium`, `nardos`, `margaritas-blancas` (`assets/img/originales/`; versiones optimizadas y miniaturas de 80×80 px en `assets/img/productos/`) | Productos y Movimientos (miniaturas de las tablas) | Fotografías propias de Daniel Ortiz, tomadas en el almacén del cliente | Propia, con autorización del cliente para su uso en el proyecto |

Observaciones sobre las fotografías:
- En algunas se ve el embalaje de los proveedores (etiquetas y cajas con su marca) como parte de la escena. No se ha usado ningún logotipo ni imagen de terceros como recurso gráfico.
- No aparecen personas.
- Las versiones AVIF, WebP y JPG de cada foto (3 anchuras) y las miniaturas de 80×80 px derivan de los mismos originales y tienen su misma licencia.

Herramientas utilizadas para crear y optimizar estos recursos (no afectan a la licencia de los archivos): ffmpeg, Playwright y Pillow, software libre.

## Fuentes tipográficas (recurso externo cargado desde Google Fonts)

| Recurso | Uso | Licencia | Enlace a la licencia |
|---|---|---|---|
| JetBrains Mono | Textos monoespaciados, etiquetas y cifras | SIL Open Font License 1.1 | https://openfontlicense.org/ |
| Work Sans | Texto general | SIL Open Font License 1.1 | https://openfontlicense.org/ |

## Derechos de utilización

- **Creative Commons:** no se utiliza ningún recurso con licencia Creative Commons.
- **Dominio público:** no se utiliza ningún recurso de dominio público.
- **Creación propia:** el logotipo, los iconos, el vídeo de fondo, el sonido de alerta y las fotografías de producto son de creación propia, sin elementos de terceros identificados.
- **Recursos externos:** solo las dos fuentes tipográficas, con licencia SIL OFL 1.1, que permite usarlas libremente, también en proyectos comerciales, sin obligación de mostrar al autor en la web.
- **Atribución:** no es necesario mencionar a ningún autor, porque no se usan iconos ni imágenes externas.

## Conclusión

Todos los recursos gráficos y multimedia de StockLink son de creación propia, salvo las dos fuentes tipográficas de Google Fonts, que usan una licencia libre. No hay recursos con derechos de terceros que impidan su uso en el proyecto.