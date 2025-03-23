# 2interface

A tool for transforming JSON data into TypeScript types and interfaces.

[中文](README.zh-CN.md)

## Tech Stack

- **Vue 3**: Frontend framework providing reactive data management and component-based development
- **TypeScript**: Type checking and development with enhanced code intelligence and type safety
- **Vite**: Build tool offering fast development experience and efficient production builds
- **Monaco Editor**: VS Code editor component integration for powerful code editing capabilities
- **WindiCSS**: Atomic CSS framework for flexible styling solutions
- **VueUse**: Collection of Vue Composition API utilities to simplify component development
- **Heroicons**: Icon library for beautiful interface elements

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
- [Vue DevTools](https://github.com/vuejs/vue-devtools) for Vue application debugging

## TypeScript Support

This project uses `vue-tsc` for type checking. In your editor, you need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to get TypeScript support for `.vue` files.

## Project Setup

```sh
pnpm install
```

### Development

```sh
pnpm dev
```

### Production Build

```sh
pnpm build
```

## Project Structure

```
2interface/
├── src/                # Source code
│   ├── components/    # Vue components
│   ├── composables/   # Composition functions
│   ├── types/        # TypeScript type definitions
│   └── App.vue       # Root component
├── public/           # Static assets
└── index.html        # HTML entry point
```

## Code Style

- ESLint for code linting
- TypeScript for type checking
- Following Vue 3 Composition API best practices
