import {Test} from "./abc/abd/Test.js";
import {Test2} from "./xyz/Test2.js";
import {Logger} from "../main/logger/Logger.js";

Logger.init("/src/test")
const loger = Logger.createLogger(import.meta);

loger.info("application started");

new Test().run();
new Test2().run();
