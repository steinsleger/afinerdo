# Afinerdo

[afinerdo.com.ar](https://afinerdo.com.ar)

Un afinador para nerds: cromático, para cualquier instrumento, con nota de referencia o micrófono. A tuner for nerds: chromatic, for any instrument, with a reference note or the microphone.

[Español](#español) · [English](#english)

## Español

Afinerdo es un afinador cromático para nerds, que funciona en el navegador y como app de Android. En inglés se llama Nerd Tuner. Toque una nota para escucharla, o pase al modo micrófono para saber si lo que suena está más abajo o más arriba. La app de Android funciona sin conexión, y el audio nunca sale de su dispositivo.

### Funciones

- Grilla con las 12 notas de la escala cromática. Al tocar una nota suena un tono puro sostenido, hasta que usted la vuelve a tocar o elige otra.
- La4 ajustable de 400 a 480 Hz, con 440 Hz por defecto. La app recuerda el último valor elegido.
- Octavas de la 2 a la 7, empezando por la 4.
- Modo micrófono: elija una nota y la pantalla indica si lo que suena está más abajo o más arriba, en cents, y marca cuándo está afinado, a 5 cents o menos durante un instante. Compara sin importar la octava, así sirve para cualquier instrumento sin ajustar nada.
- En castellano si el sistema está en castellano, y si no en inglés, con los nombres de las notas de cada idioma: Do, Re, Mi en castellano y C, D, E en inglés. Cada idioma tiene su página, [`/es/`](https://afinerdo.com.ar/es/) y [`/en/`](https://afinerdo.com.ar/en/), y la raíz manda a cada persona a la de su idioma.
- Accesible según las pautas WCAG 2.2, nivel AA: contraste suficiente en los dos temas, uso completo con teclado y con lector de pantalla, que anuncia la lectura del micrófono, y respeto por la preferencia de reducir el movimiento.
- Tema claro y oscuro. Por defecto siguen la configuración del sistema, y se pueden cambiar en Ajustes.

Las notas más graves, por debajo de unos 100 Hz, casi no se oyen en el parlante de un teléfono. Para escucharlas, use auriculares.

### Uso local

Hacen falta [Node.js](https://nodejs.org) 24 y pnpm 12. La forma más simple de usar la versión exacta del proyecto es Corepack, que viene con Node:

```sh
corepack enable
pnpm install
pnpm dev
```

Si tiene instalada de forma global una versión de pnpm anterior a la 12, actualícela o asegúrese de que Corepack tenga prioridad en su `PATH`.

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Levanta el sitio en modo desarrollo |
| `pnpm test` | Corre los tests |
| `pnpm build` | Revisa los tipos, genera el sitio estático en `dist/` y pre-renderiza una página por idioma |
| `pnpm preview` | Sirve `dist/` para probarlo antes de publicar |
| `pnpm android` | Genera el sitio y lo copia al proyecto de Android |

El micrófono solo funciona en `localhost` o con HTTPS, porque los navegadores no lo habilitan en otros orígenes.

El resultado es un sitio estático, publicado en [Vercel](https://vercel.com), con una página pre-renderizada por idioma. Cada una trae su título, descripción, URL canónica, enlaces `hreflang`, imagen para redes y datos estructurados, armados en [`src/seo.ts`](src/seo.ts). [`scripts/prerender.mjs`](scripts/prerender.mjs) también escribe la página raíz y el `sitemap.xml`. [`vercel.json`](vercel.json) define los comandos.

### Android

La app de Android es el mismo sitio, empaquetado con [Capacitor](https://capacitorjs.com). Hacen falta además el JDK 21 y el Android SDK, que vienen con [Android Studio](https://developer.android.com/studio).

```sh
pnpm android
pnpm exec cap run android
```

El primer comando copia el sitio a [`android/`](android) y el segundo instala la app en un emulador o en un teléfono conectado. `pnpm exec cap open android` abre el proyecto en Android Studio.

Google Play pide un AAB firmado. Genérelo desde Android Studio, en Build > Generate Signed App Bundle, con su clave de carga. La clave nunca se sube al repositorio.

### Cómo funciona

El tono es un oscilador senoidal de Web Audio. La detección de la altura usa el método de McLeod (Philip McLeod y Geoff Wyvill, «A Smarter Way to Find Pitch», 2005), implementado en [`src/pitch.ts`](src/pitch.ts) sin dependencias, sobre ventanas de 1/12 de segundo, 4096 muestras a 48 kHz: alcanza para notas desde unos 25 Hz. La lectura se dibuja directamente en la pantalla en cada cuadro, sin pasar por React.

### Comentarios

Su opinión es muy útil. Puede [reportar un error o sugerir una mejora](https://github.com/steinsleger/afinerdo/issues/new?template=feedback.yml). Si no tiene cuenta de GitHub, escriba a [asteins@gmail.com](mailto:asteins@gmail.com).

Para colaborar con código, consulte [CONTRIBUTING.md](CONTRIBUTING.md).

### Privacidad

El audio del micrófono se analiza en su dispositivo y no se graba ni se envía. El sitio web cuenta las visitas de forma anónima con [Vercel Web Analytics](https://vercel.com/docs/analytics), sin cookies de terceros; la app de Android no envía ningún dato. Los detalles están en [PRIVACY.md](PRIVACY.md).

### Créditos

Creado por **Adrián Steinsleger**: [LinkedIn](https://www.linkedin.com/in/adriansteinsleger/) · [YouTube](https://www.youtube.com/@AdrianSteinsleger) · [asteins@gmail.com](mailto:asteins@gmail.com).

Desarrollado con **Claude Opus 5.5**, de Anthropic. Las tipografías son [Martian Mono](https://github.com/evilmartians/mono) y, para los signos ♯ y ♭, [Noto Sans Mono](https://github.com/notofonts/latin-greek-cyrillic).

### Licencia

[CC BY-NC 4.0](LICENSE): usted puede compartir y adaptar este proyecto sin fines comerciales, dando crédito a su autor. No se puede vender.

---

## English

Nerd Tuner is a chromatic tuner for nerds that runs in the browser and as an Android app. In Spanish it is called Afinerdo. Tap a note to hear it, or switch to microphone mode to find out whether what you play is too low or too high. The Android app works offline, and the audio never leaves your device.

### Features

- A grid with the 12 notes of the chromatic scale. Tapping a note plays a sustained pure tone until you tap it again or choose another one.
- A4 adjustable from 400 to 480 Hz, 440 Hz by default. The app remembers the last value you chose.
- Octaves 2 to 7, starting at 4.
- Microphone mode: choose a note and the screen shows whether what you play is too low or too high, in cents, and marks it in tune once it holds within 5 cents for a moment. It compares regardless of octave, so it works with any instrument without adjusting anything.
- In Spanish when the system is in Spanish and in English otherwise, with each language's note names: Do, Re, Mi in Spanish and C, D, E in English. Each language has its own page, [`/es/`](https://afinerdo.com.ar/es/) and [`/en/`](https://afinerdo.com.ar/en/), and the root sends each person to theirs.
- Accessible to WCAG 2.2 level AA: enough contrast in both themes, fully usable with a keyboard and with a screen reader, which announces the microphone reading, and respect for the reduced motion setting.
- Light and dark themes. By default they follow the system setting, and you can change them in Settings.

The lowest notes, below about 100 Hz, are barely audible on a phone speaker. Use headphones to hear them.

### Running it locally

You need [Node.js](https://nodejs.org) 24 and pnpm 12. Corepack, which ships with Node, is the simplest way to get the project's exact version:

```sh
corepack enable
pnpm install
pnpm dev
```

If you have a global pnpm older than 12, update it or make sure Corepack comes first in your `PATH`.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the development server |
| `pnpm test` | Runs the tests |
| `pnpm build` | Type-checks, builds the static site into `dist/` and prerenders one page per language |
| `pnpm preview` | Serves `dist/` to try it before publishing |
| `pnpm android` | Builds the site and copies it into the Android project |

The microphone only works on `localhost` or over HTTPS, because browsers don't enable it on other origins.

The output is a static site, deployed on [Vercel](https://vercel.com), with one prerendered page per language. Each one has its own title, description, canonical URL, `hreflang` links, social preview image and structured data, built in [`src/seo.ts`](src/seo.ts). [`scripts/prerender.mjs`](scripts/prerender.mjs) also writes the root page and the `sitemap.xml`. [`vercel.json`](vercel.json) sets the commands.

### Android

The Android app is the same site, packaged with [Capacitor](https://capacitorjs.com). You also need JDK 21 and the Android SDK, both included with [Android Studio](https://developer.android.com/studio).

```sh
pnpm android
pnpm exec cap run android
```

The first command copies the site into [`android/`](android) and the second installs the app on an emulator or a connected phone. `pnpm exec cap open android` opens the project in Android Studio.

Google Play requires a signed AAB. Generate it from Android Studio, under Build > Generate Signed App Bundle, with your upload key. The key never goes into the repository.

### How it works

The tone is a Web Audio sine oscillator. Pitch detection uses the McLeod Pitch Method (Philip McLeod and Geoff Wyvill, "A Smarter Way to Find Pitch", 2005), implemented in [`src/pitch.ts`](src/pitch.ts) without dependencies, over windows of 1/12 of a second, 4096 samples at 48 kHz, enough for notes from about 25 Hz. The reading is drawn straight onto the screen every frame, without going through React.

### Feedback

Your feedback helps. You can [report a bug or suggest an improvement](https://github.com/steinsleger/afinerdo/issues/new?template=feedback.yml). If you don't have a GitHub account, write to [asteins@gmail.com](mailto:asteins@gmail.com).

To contribute code, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Privacy

Microphone audio is analyzed on your device and is never recorded or sent anywhere. The website counts visits anonymously with [Vercel Web Analytics](https://vercel.com/docs/analytics), without third-party cookies; the Android app sends no data. See [PRIVACY.md](PRIVACY.md) for the details.

### Credits

Created by **Adrián Steinsleger**: [LinkedIn](https://www.linkedin.com/in/adriansteinsleger/) · [YouTube](https://www.youtube.com/@AdrianSteinsleger) · [asteins@gmail.com](mailto:asteins@gmail.com).

Developed with **Claude Opus 5.5**, by Anthropic. The typefaces are [Martian Mono](https://github.com/evilmartians/mono) and, for the ♯ and ♭ signs, [Noto Sans Mono](https://github.com/notofonts/latin-greek-cyrillic).

### License

[CC BY-NC 4.0](LICENSE): you may share and adapt this project for noncommercial purposes, crediting its author. It may not be sold.
