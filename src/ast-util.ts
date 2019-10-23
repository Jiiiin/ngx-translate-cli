import * as ts from 'typescript';
import {StringList} from './type';

const zhMatchReg = /((([0-9]+([.、]\s)*)?([A-Za-z.]+)?[，；。！？：（）“”、《》‘’【】]?[\u4e00-\u9fa5]+[^\n\t\r"'`<>${}\\]*)+)/g;

export function getZhFromTs<T extends ts.Node>(fileKey: string, translateJson: StringList): ts.TransformerFactory<T> {
    return (context) => {
    const visit: any = (node: T) => {
        if (node.kind === ts.SyntaxKind.StringLiteral) {
        let zhMatch = node.getText().match(zhMatchReg);
        zhMatch = Array.from(new Set(zhMatch));
        if (zhMatch && zhMatch.length) {
            translateJson[fileKey] = translateJson[fileKey] ? translateJson[fileKey] : [];
            translateJson[fileKey].push(...zhMatch);
            }
        }
        return ts.visitEachChild(node, (child) => visit(child), context);
    }
    return (node: T) => ts.visitNode(node, visit);
    };
}

export function translateTs<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
    const visit: any = (node: T) => {
        if (node.kind === ts.SyntaxKind.StringLiteral) {
            let zhMatch = node.getText().match(zhMatchReg);
            if (zhMatch && zhMatch.length) {
                return ts.createElementAccess(
                    ts.createIdentifier("i18values"),
                    ts.createStringLiteral("aaa")
                  );
                }
            }
        return ts.visitEachChild(node, (child) => visit(child), context);
    }
    return (node: T) => ts.visitNode(node, visit);
    };
}


export function setImportTranslate() {
    return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamedImports([ts.createImportSpecifier(
            undefined,
            ts.createIdentifier("tanslate")
          )])
        ),
        ts.createStringLiteral("ngx-translate")
      )
}
export function findNodes(node: ts.Node, kind: ts.SyntaxKind, max = Infinity, recursive = false): ts.Node[] {
    if (!node || max == 0) {
      return [];
    }
  
    const arr: ts.Node[] = [];
    if (node.kind === kind) {
      arr.push(node);
      max--;
    }
    if (max > 0 && (recursive || node.kind !== kind)) {
      for (const child of node.getChildren()) {
        findNodes(child, kind, max).forEach(node => {
          if (max > 0) {
            arr.push(node);
          }
          max--;
        });
  
        if (max <= 0) {
          break;
        }
      }
    }
  
    return arr;
  }

  export function transformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
    const visit: any = (node: T) => {
        if (node.kind === ts.SyntaxKind.SourceFile) {
            return ts.visitEachChild(node, visit, context)
          }
      
          if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            let node2 =  ts.createImportDeclaration(
              undefined,
              undefined,
              ts.createImportClause(
                ts.createIdentifier("Button"),
                undefined
              ),
              ts.createStringLiteral("antd/lib/button")
            );
            return node2
          }
          return node
    }
    return (node: T) => ts.visitNode(node, visit);
    };
}
  
  function updateImportNode(node: ts.Node, ctx: ts.TransformationContext): ts.Node {
    let identifierName: string
  
    const visitor: ts.Visitor = node => {
      if (node.kind === ts.SyntaxKind.NamedImports) {
        identifierName = node.getChildAt(1).getText()
        return ts.createIdentifier(identifierName)
      }
  
      if (node.kind === ts.SyntaxKind.StringLiteral) {
        const libName = node.getText().replace(/[\"\']/g, '')
        if (identifierName) {
          const fileName = camel2Dash(identifierName)
          return ts.createLiteral(`${libName}/lib/${fileName}`)
        }
      }
  
      if (node.getChildCount()) {
        return ts.visitEachChild(node, visitor, ctx)
      }
      console.log(node)
      return node
    }
  
    return ts.visitEachChild(node, visitor, ctx)
  }
  
  // from: https://github.com/ant-design/babel-plugin-import
  function camel2Dash(_str: string) {
    const str = _str[0].toLowerCase() + _str.substr(1)
    return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)
  }
