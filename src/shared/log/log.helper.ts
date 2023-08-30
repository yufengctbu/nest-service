import { inspect } from 'util';
import { format, Logform } from 'winston';
import safeStringify from 'fast-safe-stringify';

import * as pkg from '@root/package.json';

const clc = {
    bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
    green: (text: string) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
    red: (text: string) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const nestColorMap: Record<string, (text: string) => string> = {
    info: clc.green,
    error: clc.red,
    warn: clc.yellow,
    debug: clc.magentaBright,
    verbose: clc.cyanBright,
};

export const nestConsoleFormat = (): Logform.Format => {
    const appName = pkg.name || 'Nest';
    return format.printf(({ context, timestamp, level, message, ...meta }) => {
        if ('undefined' !== typeof timestamp) {
            try {
                if (timestamp === new Date(timestamp).toISOString()) {
                    timestamp = new Date(timestamp).toLocaleString();
                }
            } catch (error) {}
        }

        const color = nestColorMap[level] || ((text: string): string => text);
        const stringifiedMeta = safeStringify(meta);
        const formattedMeta = inspect(JSON.parse(stringifiedMeta));

        message = message ? (formattedMeta === '{}' ? message : `${message} - ${formattedMeta}`) : formattedMeta;

        return `${color(`[${appName}] ${level.charAt(0).toUpperCase() + level.slice(1)}`)}\t${
            context ? clc.yellow(`[${context}] `) : ''
        }${color(message || '')}${timestamp ? clc.yellow('[' + timestamp + ']') : ''}`;
    });
};
