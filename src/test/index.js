import {Logger} from "../main/logger/Logger.js";
import {TestBase} from "./TestBase.js";

Logger.init({
    sourcesRoot: "/src/test"
});

const loger = Logger.createLogger(import.meta);

loger.info("application started");

new TestBase().doSome();
