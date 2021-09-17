import {Logger} from "../../../main/logger/Logger.js";

export class TestExc {
    constructor() {
        this.log = Logger.createClassLogger.call(this, import.meta);
    }

    doSome() {
        throw new Error("problemos");
    }
}
