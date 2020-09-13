# React context

## React 的渲染时机

react 一共有两种方式触发 rerender：

1. setState // this.setState(), this.forceUpdate(), useState()[1], useReducer()[1]
2. parent rerender

相应的，控制组件 rerender 的时候是否触发 update (useEffect, componentDidUpdate) 也有两种方式：

1. 比较 state: shouldComponentUpdate, React.PureComponent
2. 比较 props: React.memo, shouldComponentUpdate, React.PureComponent

可以看出，class component 可以控制 state 变化是否 update，而 functional component 只能控制 props 的比较。

## 怎么解决 drilling 问题

drilling 问题是组件设计时经常遇到的问题 —— 我们怎么在 react 的世界观里面把一个 data 跨越很多层级去渗透到更深层次的组件中去。

react 官网给我们提供了几种不用 context 的设计方式：

1. 最常用的直接传递，把需要深层传递的直接传下去

```tsx
<User user={user} />
// ... 渲染出 ...
<UserProfile user={user} />
// ... 渲染出 ...
<Avatar avatar={user.avatar} />
```

这种方式导致可能一个中间层级组件不需要的 prop，由于深层组件需要，所以必须传递，很恶心。

2. 定义很多的 slots，antd 的惯用做法

```tsx
<Card title={<span>{"123"}</span>} />
```

这种方式可以把 child slot 的逻辑提升到祖先节点去处理，这样很干净很舒服，但是官网也提到了，一些风险

> 这种对组件的控制反转减少了在你的应用中要传递的 props 数量，这在很多场景下会使得你的代码更加干净，使你对根组件有更多的把控。但是，这并不适用于每一个场景：这种将逻辑提升到组件树的更高层次来处理，会使得这些高层组件变得更复杂，并且会强行将低层组件适应这样的形式，这可能不会是你想要的。

3. render prop

render prop 是上面 slots 的一种升级用法，用于父组件需要给 slot 传递一些信息。

```tsx
<List renderItem={(item) => <span>{item.name}</span>} />
```

出了上面的方式以外，就是使用 context，官方主要是认为在全局共享 locale，theme 时 context 比较有用，其实还有一个场景就是我们在使用外部 state 管理工具的时候，一般都会有一个 rootStore，我们可以把 rootStore 进行深层传递。

## 用 context 解决 drilling 问题

使用 `React.createContext(defaultValue?: any)` 可以创建一个 context，context 提供两个 ReactComponent，一个 Provider，一个 Consumer，Consumer 通过就近原则选取 Provide 的值。react hooks 提供了一个 useContext hook 来消费 context，所以 context 的用法比以前更灵活。

```tsx
<context.Provider value={store}></context.Provider>
```

我们分两种情况来分析，context 对子组件 rerender 的影响。

第一，context value 引用变化。

如果 context value 引用变化，说明 Provider 的 value prop 传入了新的值，那么一定是包含 Provider 的组件进行的 rerender。由于该组件进行了 rerender 所以所有的深层组件全部都会挨个进行 rerender 判断，如果没有订阅 context 的组件就会通过 props 和 state 变化对比来判断是否 rerender，而如果是订阅了 context 的组件则会还会独立判断 context value 的引用是否变化，来判断是否 rerender。

第二，context value 内部值变化。

如果 context value 的值内部变化，则直到 useContext 的组件进行 rerender 以后数据才会变化。

所以使用 context 的时候最好不要在 value prop 处构建 value 对象，这样可以一定程度上减少
rerender 的次数。

## 更高级的 context 用法，`use-context-selector`

react 世界里，state 管理主要有 redux 和 mobx 两支，redux 在使用的时候是通过手动设置依赖进行数据变化的订阅，而 mobx 在使用的时候是自动获取依赖，自动订阅。redux 使用 connect hoc 去做订阅操作，在有了 hook 以后又提供了 useSelector hook 来做组件的订阅。如果我们想对 react context 也提供类似 reselect 的能力该如何去做呢，这里有一个比较好的实现[@fluentui/react-context-selector](https://github.com/microsoft/fluentui/tree/master/packages/fluentui/react-context-selector)。

其主要的思路是利用 createContext 被隐藏的第二个参数 calculateChangedBits，强行让 context value 引用的变化不触发 rerender，并使用自己实现的订阅系统来做 forceUpdate。
