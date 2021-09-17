#Description
Simple Node.js logging library for es6 classes 
based on Pino and Pino-pretty. Package like logging structure 
similar to java.

##Idea behind
The main purpose is to use intellij idea logging features (logs tab in some configurations).  

###Dir descr:
* scripts/convert_logs - for intellij idea node.js log filtering features   
* src/main - main logger class
* src/test - test classes 

###Usage:
1.Configure your logs dir and file names in scripts/convert_logs/config.bsh. 
There will be two log files. One is for input from intellij and second for filtered content by pino-pretty.

2.Configure 'Run configuration' in intellij idea for logging:
* define "log file entry point" to an output log file (logs filtered through pino-pretty)
* define "save console output to file" with input log (input to pino-pretty)
* define before launch configuration with script convert_cleanup.bsh
