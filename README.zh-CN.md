# 2interface

## 技术栈

- **Vue 3**: 使用 Vue 3 作为前端框架，提供响应式数据管理和组件化开发
- **TypeScript**: 使用 TypeScript 进行类型检查和开发，提供更好的代码提示和类型安全
- **Vite**: 使用 Vite 作为构建工具，提供快速的开发体验和高效的构建性能
- **Monaco Editor**: 集成 VS Code 的编辑器组件，提供强大的代码编辑功能
- **WindiCSS**: 使用 WindiCSS 作为原子化 CSS 框架，提供灵活的样式开发方案
- **VueUse**: 使用 VueUse 提供的组合式 API 工具集，简化 Vue 组件开发
- **Heroicons**: 使用 Heroicons 提供的图标库，提供美观的界面图标

## 开发工具推荐

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (需要禁用 Vetur)
- [Vue DevTools](https://github.com/vuejs/vue-devtools) 用于 Vue 应用调试

## TypeScript 支持

本项目使用 `vue-tsc` 进行类型检查。在编辑器中，需要安装 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 以获得 `.vue` 文件的 TypeScript 支持。

## 项目设置

```sh
pnpm install
```

### 开发环境运行

```sh
pnpm dev
```

### 生产环境构建

```sh
pnpm build
```

## 项目结构

```
2interface/
├── src/                # 源代码目录
│   ├── components/    # Vue 组件
│   ├── composables/   # 组合式函数
│   ├── types/        # TypeScript 类型定义
│   └── App.vue       # 根组件
├── public/           # 静态资源
└── index.html        # HTML 入口文件
```

## 代码规范

- 使用 ESLint 进行代码检查
- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 组合式 API 的最佳实践
