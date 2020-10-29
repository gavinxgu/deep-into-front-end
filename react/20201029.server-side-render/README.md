# React SSR Typescript Guide 17.0.1

## Server-Sider Render

ssr 老生常谈，其实最早的基于 template 的前后端开发就可以认为是 ssr。html css 是标记语言，js 是解释型语言，所以都是可以用字符串拼接的方式去生成，前端页面内的动态变化则是借助 jquery 之类的库。

后来经过发展，前后端出现前后分离的思想，前端出现 angular vue react 等框架，利用 virtual dom 实现 data -> view，只需要定义好 data，定义好 data -> view 的映射方式，框架就可以通过 data 去更新 dom 节点。除此以外，也可以通过 ajax 获取异步数据，再配合上述能力，实现复杂的页面渲染逻辑。框架提供的组件化能力也能够让复杂页面可以更容易做代码拆分。

在后来，前端路由出现了，每个页面都可以认为是一个组件，通过 hashchange，h5 history api 控制页面的切换，实现前端路由，SPA 坐稳了。

SPA 有一些天生的缺陷，fetch after render 导致 LCP 很长，初始化 html 没有有效内容，不利于 SEO（这个问题我一直觉得应该是爬虫系统应该优化，介入 headless browser）。在 react 场景下，利用 ReactDOMServer.renderToString 可以将后端预先得到的数据注入到入口组件，得到带内容的首屏 html string，发给前端，之后 react 再通过 ReactDOM.hydrate 来做组件做元素绑定和事件绑定。

## SSR 和传统 template 有什么区别

这里可以看出，react ssr 和以往的 template 基本没啥区别，唯一变化就是 template 引擎变成了一个更复杂的 render 框架。但是这也就导致 ssr 的生成器只能是 node.js，或者 node.js 做一个 render rpc 服务给其他语言的后端调，或者就是其他语言实现一个 react（reason react-dom？）。

## Server-side Render 默认行为

React 的 ssr 和 client render 在组件行为上有一些区别，某些生命周期函数和 hook 不会执行，并且使用 useLayoutEffect 还会出现大量的 warning，参照 [Alex Reardon's article](https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a)。有封装好的 [useIsomorphicLayoutEffect](https://github.com/streamich/react-use/blob/master/docs/useIsomorphicLayoutEffect.md) 可以在 ssr 的时候使用。

```tsx
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

言归正传，以下函数会在 ReactDOMServer.renderToString 时调用

- Class Component
  - constructor
  - getDerivedStateFromProps
  - render
- Functional Component
  - render

```
0 AppFC render
┌─────────┬───────────────┐
│ (index) │    Values     │
├─────────┼───────────────┤
│  props  │     '{}'      │
│  state  │ '{"count":0}' │
└─────────┴───────────────┘
1 AppCC constructor
┌─────────┐
│ (index) │
├─────────┤
└─────────┘
2 AppCC getDerivedStateFromProps
┌───────────┬───────────────┐
│  (index)  │    Values     │
├───────────┼───────────────┤
│ nextProps │     '{}'      │
│ prevState │ '{"count":0}' │
└───────────┴───────────────┘
3 AppCC render
┌──────────────┬───────────────┐
│   (index)    │    Values     │
├──────────────┼───────────────┤
│ currentProps │     '{}'      │
│ currentState │ '{"count":0}' │
└──────────────┴───────────────┘
```

以下函数不会在 ReactDOMServer.renderToString 时调用

- Class Component
  - componentDidMount
  - shouldComponentUpdate
  - getSnapshotBeforeUpdate
  - componentDidUpdate
- Functional Component
  - useEffect（包括 cleanup）
  - useLayoutEffect（包括 cleanup）

## 如何写一个简单的 React SSR demo

### 罗列一下 ssr 的要素

- 组件
  - 一个示例组件
- web 前端
  - index.html
  - ReactDOM.hydrate
  - watch 构建
- server
  - render html string
  - watch 重启服务

### 定义一下目录结构

```
├── config
│   ├── build.ts
│   └── tsconfig.json
├── client
│   └── index.tsx
├── dist
│   └── client
│       └── index.js
├── server
│   ├── index.tsx
│   └── tsconfig.json
├── shared
│   └── App.tsx
├── index.html
├── nodemon.json
├── package.json
├── tsconfig.base.json
└── tsconfig.json
```

### 启动

```bash
yarn start:client
yarn start:server
# http://localhost:3006
```
