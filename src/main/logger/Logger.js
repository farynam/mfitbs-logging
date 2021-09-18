import Pino from "pino";
import {dirname} from "path";
import {fileURLToPath} from "url";
import {Maps} from "webdiff-utils";


const SEPARATOR = "/";

let srcRoot = null;
let logger = null;

const defaultPinoConfig = {
    level: 'debug'
}

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

function wrap (logger) {
    const { error, child } = logger;

    function errorRearranger (...args) {
        if (typeof args[0] === 'string' && args.length > 1) {
            for (let i = 1; i < args.length; i++) {
                const arg = args[i];
                if (arg instanceof Error) {
                    const [ err ] = args.splice(i, 1);
                    args.unshift(err);
                }
            }
        }
        return error.apply(this, args);
    }

    function childModifier (...args) {
        const c = child.apply(this, args);
        c.error = errorRearranger;
        c.child = childModifier;
        return c;
    }

    logger.error = errorRearranger;
    logger.child = childModifier;

    return logger;
}

function getSourcesRoot(config) {
    let sourcesRoot = config;
    if ((typeof config) !==  "string") {
        sourcesRoot = config.sourcesRoot;
    }
    return sourcesRoot;
}

function getPinoConfig(config) {
    const pinoConfigIn = config?.pinoConfig;
    const pinoConfigOut = {
        level: process.env.LOG_LEVEL || pinoConfigIn?.level || defaultPinoConfig.level
    };

    if (pinoConfigIn) {
        Maps.copyProperties(pinoConfigIn, pinoConfigOut);
    }

    return pinoConfigOut;
}

function getPinoTransport(config) {
    if (config?.pinoTransport) {
        if (config.pinoConfig) {
            Maps.copyProperties(config.pinoConfig, config.pinoTransport);
        } else {
            config.pinoConfig = config.pinoTransport;
        }

        return getPinoConfig(config);
    }
    return null;
}

export class Logger {

    /**
     * for efficiency create one parent logger
     * @type {WebAssembly.Instance}
     */
    static init(config) {
        if (!logger) {
            srcRoot = getSourcesRoot(config);
            if (!srcRoot) {
                throw Error("Sources root not defined");
            }

            let pinoConfig = getPinoTransport(config);
            if (pinoConfig) {
                pinoConfig = Pino.transport(pinoConfig);
            } else {
                pinoConfig = getPinoConfig(config);
            }

            logger = wrap(Pino(pinoConfig));
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


