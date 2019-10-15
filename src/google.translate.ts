/**
 * 使用谷歌翻译API翻译的方法，
 * 中国大陆请将 node_modules/google-translate-api/index.js 和 node_modules/google-translate-token/index.js中的
 * https://translate.google.com全部替换为 https://translate.google.cn，node_modules/google-translate-api/index.js
 * 中的client: 't'改为client: 'gtx'
 */
const translateApi = require('google-translate-api');
export function translate(text: string, targetLanguage: string = 'en') {
    translateApi(text, {to: targetLanguage}).then((res: any) => {
        text = res.text;
        console.log(text);
    }).catch((err: any) => {
        text = '';
        console.log(text)
    });
}