import pino from "pino";
import {dirname} from "path";
import {fileURLToPath} from "url";

const SEPARATOR = "/";

let srcRoot = null;
let logger = null;

function getAllAfter(str, part) {
    const begin = str.indexOf(part);
    return str.substr(begin + part.length);
}

function getPackageName(str, separator) {
    separator = separator || SEPARATOR;
    let pack = getAllAfter(str, srcRoot);

    if (pack.length === 0) {
        pack = ".";
    } else if (pack.startsWith(separator)) {
        pack = pack.substr(1);
    }

    return pack.replaceAll(separator, ".");
}

function getCanonicalName(pack, className) {
    if (pack.length === 1) {
        return className;
    }

    return `${pack}.${className}`;
}

export class Logger {

    /**
     * for efficiency create one parent logger
     * @type {WebAssembly.Instance}
     */
    static init(sourcesRoot) {
        if (!logger) {
            srcRoot = sourcesRoot;
            logger = pino({
                level: process.env.LOG_LEVEL || 'debug'
            });
        }
    }

    /**
     * Create classless logger
     * @param someImport
     * @returns {*}
     */
    static createLogger(someImport) {
        const __dirname = dirname(fileURLToPath(someImport.url));
        let pack = `${getPackageName(__dirname)}`;

        return logger.child(
            {
                name: pack
            });
    }

    /**
     * Create logger for a class
     * @param someImport
     * @returns {*}
     */
    static createClassLogger(someImport) {
        const __dirname = dirname(fileURLToPath(someImport.url));
        const pack = getPackageName(__dirname);

        return logger.child(
            {
                name: getCanonicalName(pack, this.constructor.name)
            });
    }
}


