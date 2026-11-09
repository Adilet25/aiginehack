# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Muras desktop design

The homepage is an original living atlas: an imagined interactive landscape,
place search, a photographic petroglyph story, a seasonal chapter and creative tools.
The terrain is an artistic sketch, not geographic or historical evidence.
Interior pages have task-specific layouts: a route strip above the map, calendar
controls alongside the month, an exhibition list and a canvas with a tool rail.
Existing routes, local prototype features and KG/RU/EN remain available.

### Run and verify

- Install: `npm ci`
- Develop: `npm run dev`
- Production build: `npm run build`
- Preview: `npm run preview`
- Scene lint: `npx eslint src/components/scenes src/pages/HomePage.tsx`

### Design files

- `src/pages/HomePage.tsx`: localized chapters and working destination links.
- `src/pages/MurasHome.css`: homepage composition and typography.
- `src/components/scenes/LandscapeScene.tsx`: scene lifecycle and motion controls.
- `src/components/scenes/journeyScene.ts`: procedural Three.js terrain and contours.
- `src/components/layout/MurasStructure.css`: interior page layouts.

Three.js loads dynamically; its renderer pauses offscreen and when the document
is hidden. Reduced motion and the manual pause control retain a static scene.
A CSS fallback preserves the composition if WebGL is unavailable. Photography
credits are shown next to the image. Dedicated mobile refinement is pending.

### Deployment

Use the Vite preset, build command `npm run build`, output `dist`.
Configure SPA fallback to `/index.html` for application routes. No deployment
has been performed. Set an absolute OpenGraph image URL for the public domain.
