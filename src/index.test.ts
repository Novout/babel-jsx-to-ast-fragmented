import { describe, expect, it } from 'vitest'
import { parse } from '.'

describe('parse', () => {
  it('div name case', () => {
    expect(parse(`export const Foo = (props) => {
  return (
    <div className="foo bar baz">
      <h1>{props.test}</h1>
    </div>
  );
};
`)[0][0].name).toBe('div')
  })

  it('div other name case', () => {
    const file = `export const Foo = (props) => {
      return (
        <div className="foo bar baz">
          <h1>{props.test}</h1>
        </div>
      );
    };
    
    export const Bar = (props) => {
      return (
        <a className="foo bar baz">
          <h1>{props.test}</h1>
        </a>
      );
    };
    
    export const Baz = (props) => {
      return (
        <section className="foo bar baz">
          <h1>{props.test}</h1>
        </section>
      );
    };`

    expect(parse(file)[0][0].name).toBe('div')

    expect(parse(file)[1][0].name).toBe('a')

    expect(parse(file)[2][0].name).toBe('section')
  })
})