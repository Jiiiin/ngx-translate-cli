import * as ts from 'typescript';
import {sync as glob} from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import {translateByApi} from './google.translate';
import {getZhFromTs, translateTs, transformer} from './ast-util';
import {StringList} from './type';
import * as child_process from 'child_process';

const shell = require('shelljs');
const sourceDir = path.join(__dirname, '../source');
const distDir = path.join(__dirname, '../dist');
const translateJson: StringList = {};

function getAllZhString(codeDir: string) {
    console.log(`==> start get zh`);
    glob('**/*.ts', {cwd: codeDir}).forEach(fileName => {
    const filePath = path.join(codeDir, fileName);
    let code = fs.readFileSync(filePath).toString();
    code = ts.transpileModule(code, {
    compilerOptions: {module: ts.ModuleKind.ESNext},
    transformers: {before: [transformer()]}
           });
    console.log(code)

       });
   }

getAllZhString(sourceDir);
