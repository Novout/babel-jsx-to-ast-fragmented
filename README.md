# Babel JSX to AST Fragmented

`@babel/parser` wrapper for simple JSX tree.

```jsx
export const Foo = (props) => {
  return (
    <div className="foo bar baz">
      <h1>Hello!</h1>
    </div>
  );
};
```

```ts
[
  [
    {
      name: 'div',
      position: { start: [Position], end: [Position] },
      attributes: [ [Object] ],
      children: [ [Object] ]
    }
  ]
]
```