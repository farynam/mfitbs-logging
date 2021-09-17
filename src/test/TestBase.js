import {Logger} from "../main/logger/Logger.js";
import {Test} from "./abc/abd/Test.js";
import {Test2} from "./xyz/Test2.js";
import {TestExc} from "./abc/abd/TestExc.js";



export class TestBase {
    constructor() {
        this.log = Logger.createClassLogger.call(this, import.meta);
    }

    doSome() {
        this.log.info("test");
        new Test().run();
        new Test2().run();
        try {
            new TestExc().doSome();
        } catch (err) {
            this.log.error("some problemos", err);
        }
    }
}
