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