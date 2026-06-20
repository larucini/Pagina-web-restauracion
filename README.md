# RAÍZ — Restauración de Muebles
## Estructura del proyecto

```
raiz/
├── index.html          ← Página principal (single page)
├── css/
│   └── styles.css      ← Todos los estilos (variables, secciones, responsive)
├── js/
│   └── main.js         ← Interactividad (nav, reveal, contadores, parallax)
└── assets/             ← Carpeta para imágenes y recursos
    └── (imágenes propias del proyecto)
```

## Fuentes (Google Fonts — incluidas vía CDN)
- **Playfair Display** — Títulos display, bold + italic
- **DM Serif Display** — Serif complementario para quotes y numerales
- **DM Sans** — Cuerpo, eyebrows, navegación

## Paleta
| Variable CSS      | Hex       | Uso                        |
|-------------------|-----------|----------------------------|
| `--cream`         | `#f1ede4` | Fondo principal            |
| `--sand`          | `#e3d6c5` | Fondos secundarios         |
| `--slate`         | `#788990` | Textos secundarios         |
| `--terracota`     | `#984516` | Acento principal           |
| `--bark`          | `#6f533b` | Acento secundario          |
| `--ink`           | `#21191a` | Fondo oscuro / texto       |

## Secciones
1. **Hero** — Título de dos líneas + CTA doble + hint de scroll
2. **Marquee** — Banda animada de palabras clave
3. **Stats** — 4 indicadores con contador animado
4. **Filosofía** — Texto editorial + imagen grande
5. **Proceso** — 4 pasos en grid
6. **Proyectos** — Cards antes/después × 3
7. **Materiales** — Lista de especies nativas
8. **Contacto** — CTA oscuro + info de contacto
9. **Footer**

## Para usar con imágenes reales
Reemplazá los bloques con clase:
- `.filosofia__img-placeholder` → `<img src="assets/foto-proceso.jpg" alt="..." />`
- `.proceso__step-img--N` → `<img src="assets/paso-N.jpg" alt="..." />`
- `.proyecto-card__img-ph--*` → `<img src="assets/proyecto-X.jpg" alt="..." />`

## Comportamiento responsivo
- ≥1024px: layout completo de escritorio
- 768–1023px: grids de 2 columnas
- <768px: mobile stack, menú hamburguesa
- <480px: single column

## Accesibilidad
- `prefers-reduced-motion` respetado
- Foco visible en todos los elementos interactivos
- `aria-label` en iconos y menú
- Jerarquía semántica h1 → h2 → h3 → h4
