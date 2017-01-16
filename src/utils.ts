'use strict';

export function indent(depth: number, size?: number, str?: string): string {
    return (str || ' ').repeat(depth * (size || 2));
}

export function styleToElm(value: string): string[] {
    let valueArray = value.split(/\s*;+\s*/g).filter((s) => !!s.length);
    return valueArray.map((s) => {
        let arr = s.split(/\s*:\s*(.+)/).filter((s) => !!s.length);
        return '( "' + arr.join('", "') + '" )';
    });
}