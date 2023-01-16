import parser from '@babel/parser';

export interface PositionItem { line: number, column: number, index: number }

export interface Position {
  start: PositionItem,
  end: PositionItem,
}

export interface NodeAttribute {
  name?: string,
  value?: string
  position: Position,
}

export interface Node {
  name?: string,
  position: Position,
  children?: Node[],
  attributes: NodeAttribute[]
}

const astDFS = (prev, current): Node[] => {
  let element = {} as Node

  if (current.type === 'JSXElement') {
    const el = current.openingElement

    element = {
      name: el.name.name,
      position: {
        start: el.loc.start,
        end: el.loc.end,
      },
      attributes: [],
      children: [],
    };

    el.attributes.forEach(attr => {
      if (attr?.name?.name && attr?.value?.value) {
        element.attributes?.push({
          name: attr.name.name,
          position: {
            start: attr.loc.start,
            end: attr.loc.end,
          },
          value: attr.value.value
        })
      }
    })

    prev.push(element);
  }

  current.children?.forEach(
    (node) => astDFS(prev.length > 0 ? element.children : prev, node)
  );

  return prev;
};

export const parse = (content: string): Node[][] => {
  const tree = parser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  if (!tree) return []

  const functions = tree.program.body.filter(
    (astNode) => astNode.type === 'ExportNamedDeclaration',
  )

  if (!functions) return []

  return functions.reduce((sum, fn) => {
    const target = (fn as Record<string, any>).declaration.declarations[0].init.body.body[0].argument;

    const ast = astDFS([], target);

    sum.push(ast)

    return sum
  }, [] as Node[][])
};