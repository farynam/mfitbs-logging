import {Logger} from "../../main/logger/Logger.js";


export class Test2 {

    constructor() {
        this.logger = Logger.createClassLogger.call(this, import.meta);
    }

    run() {
        this.logger.info('hello info');
        this.logger.warn('hello warn');
        this.logger.debug('hello debug');
    }
}
