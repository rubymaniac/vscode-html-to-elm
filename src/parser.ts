'use strict';

import {Parser} from 'htmlparser2';
import * as utils from './utils';


if (!String.prototype.trim) {
    (function () {
        let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        }
    })();
}


export function convert(html: string, options: { indent: { with: string, size: number } }): string {
    let elm = '';
    let indentSize = options.indent.size;
    let indentWith = options.indent.with;
    let depth = -1;
    let context = [];
    let onOpenTag = (name: string, attributes: any): void => {
        let pre = '';
        let tag = [];
        let attrs = Object.keys(attributes).map((attribute) => {
            let value = attributes[attribute];
            if (attribute === 'style') {
                return attribute + ' [ ' + utils.styleToElm(value).join(', ') + ' ]';
            }
            if (attribute === 'type') {
                attribute = 'type_';
            }
            return attribute + ' "' + value + '"';
        });

        depth++;
        if (context[depth]) {
            pre = '\n' + utils.indent(depth, indentSize, indentWith) + ',';
        } else {
            context[depth] = true;
        }
        pre += (depth ? ' ' : '');
        tag.push(pre + name);
        tag.push(' [');
        if (attrs.length) {
            tag.push(' ' + attrs.join(', ') + ' ');
        }
        tag.push(']\n' + utils.indent(depth + 1, indentSize, indentWith) + '[');
        elm += tag.join('');
    };
    let onText = (rawText: string): void => {
        let text = rawText.trim();
        if (text.length !== 0) {
            elm += ` text "${text}" `;
        }
    };
    let onCloseTag = () => {
        if (context[depth + 1]) {
            delete context[depth + 1];
            elm += '\n' + utils.indent(depth + 1, indentSize, indentWith);
        }
        depth--;
        elm += ']';
    };
    let parser = new Parser({
        onopentag: onOpenTag,
        ontext: onText,
        onclosetag: onCloseTag
    }, { decodeEntities: true });

    parser.write(html);
    parser.end('');
    return elm;
}
