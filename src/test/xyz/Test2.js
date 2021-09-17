import {Logger} from "../../main/logger/Logger.js";


export class Test2 {

    constructor() {
        this.log = Logger.createClassLogger.call(this, import.meta);
    }

    run() {
        this.log.info('hello info');
        this.log.warn('hello warn');
        this.log.debug('hello debug');
    }
}
