import Vue from 'vue'

const locale     = 'ru-RU'
const options    = { year: 'numeric', month: 'numeric', day: 'numeric',  hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
const formatter  = new Intl.DateTimeFormat(locale, options);
const formatDate = function(value) { return value || false ? formatter.format(new Date(value)) : '' };
const isNullOrUndefined = (value) => value === null || value === undefined;

const MODULE_UNKNOWN = 'moduleUnknown'

const logMgr = {
    config:{
        showLog           : true,
        collectLog        : false,
        showLogTags       : [],//'auth', 'security'],
        showLogExceptTags : ['_bus', '_mixin', 'websocket','router'],

        collectFrom      : 'debug',
        historyLength    : 200,
        sendFrom         : 'warning',
        sendHistoryCount : 20
    },

    loglevels: [ 'debug', 'info', 'warning', 'error' ],

    colors:{
        date: 'color: #90a4ae',

        debug   : { type: 'color:#bcaaa4', text: 'color:#3e2723' },
        info    : { type: 'color:#2196f3', text: 'color:#37474f' },
        warning : { type: 'color:#e65100', text: 'color:#e65100; background-color:#fff3e0' },
        error   : { type: 'color:#e53935', text: 'color:#d50000; background-color:#ffebee' },

        success : { type: 'color:#1b5e20', text: 'color:#1b5e20; background-color:#e8f5e9' }
    },

    messages : [],

    log : function(logLevel, context, message, args, logTag){
        if(!stand.isDevelop)
          return;
          
        var stackTrace = this.stacktrace.bind(context)();

        var info = {
            date : (new Date).toISOString(),
            logTag,
            logLevel,
            logFnc: stackTrace ? stackTrace[2].functionName : '',
            message,
            messageType : this.toType(message),
            //arguments : clone(args),
            functionName : stackTrace ? stackTrace[3].functionName : '',
            stackTrace  : stackTrace ? stackTrace.slice(3,6) : ''
        }
        var currentLvl = this.loglevels.indexOf(logLevel);
        var collectFrom = this.loglevels.indexOf(this.config.collectFrom);
        var sendFrom = this.loglevels.indexOf(this.config.sendFrom);
        var historyLength = this.config.historyLength;
        if(currentLvl >= collectFrom && this.config.collectLog){ 
            if(this.messages.length >= historyLength) // контролируем количество сообщений в истории
                this.messages = this.messages.slice((this.messages.length - historyLength) + 1, historyLength);            
            this.messages.push(info);
        }
        if(currentLvl >= sendFrom)
            this.sendHistory();
        
        
        if(this.config.showLog && 
            (this.config.showLogTags.length == 0 || this.config.showLogTags.includes(logTag) || logLevel == MODULE_UNKNOWN) &&
            (!this.config.showLogExceptTags.includes(logTag))
            ){
            if(info.messageType == 'event' || info.messageType == 'object' || info.messageType == 'array')
                console.log(`%c[${formatDate(info.date)}]%c[${info.logLevel.padStart(5, ' ')}]%c[${info.logTag}->${info.functionName}]`, this.colors.date, this.colors[info.logFnc].type, this.colors[info.logFnc].text, info.message)
            else
                console.log(`%c[${formatDate(info.date)}]%c[${info.logLevel.padStart(5, ' ')}]%c[${info.logTag}->${info.functionName}]\t${info.message}`, this.colors.date, this.colors[info.logFnc].type, this.colors[info.logFnc].text)
 
        }
    },

    sendHistory: function(){
        //var msgs = this.getHistory(this.config.sendHistoryCount);
        //console.log('sendHistory')
        // -- send here
    },

    getHistoryFile: function(){
        var fName = 'historyLog ' + this.getDate() + '.bhl'
        const data = this.getHistory();
        const blob = new Blob([data], {type: 'text/plain'})
        const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
        a.download = fName;
        a.href = globalThis.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, globalThis, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    },

    getHistory: function(length){
        var msgs = this.messages.length >= length ? 
            this.messages.slice((this.messages.length - length) + 1, length) 
            : this.messages;
        
        
        return JSON.stringify(msgs);
    },

    serializer: function (replacer, cycleReplacer) {
        var stack = [], keys = []
      
        if (cycleReplacer == null) cycleReplacer = function(key, value) {
          if (stack[0] === value) return "[Circular ~]"
          return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
        }
      
        return function(key, value) {
          if (stack.length > 0) {
            var thisPos = stack.indexOf(this)
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
          }
          else stack.push(value)
      
          return replacer == null ? value : replacer.call(this, key, value)
        }
    },


    toType: function(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    },

    stacktrace: function() {
       try{
            const originalPrepareStackTrace = Error.prepareStackTrace;
            Error.prepareStackTrace = (error, stack) => { return stack; };
            let e = new Error();
            Error.captureStackTrace(e, this.stacktrace);
            const stack = e.stack;
        
            var res = []
            Object.entries(stack).forEach(entry=>{
            // if(entry[0]>2 && entry[0] < 5)
            res.push({ functionName : entry[1].getFunctionName(), lineNumber : entry[1].getLineNumber()})
            });
            Error.prepareStackTrace = originalPrepareStackTrace;
            return res;
        }
        catch{
            try{
                var stack = Error().stack.split("\n");
                var res = []
                stack.forEach(item=>{
                    var data1 = item.split("@");
                    if (data1.length<2)
                        return;
                    var data2 = data1[1].split(":");
                    res.push({ functionName : data1[0], lineNumber : data2[data2.length - 2]})
                })
                return res;
            }
            catch{
                return null;
            }
        }
    },

    getDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();        
        return `${yyyy}-${mm}-${dd}`;
    }
}


export default function (){    
    var log = {
        debug   : function(message, logTag, arg){ logMgr.log('debug'  , this, message, arg, logTag)  },
        info    : function(message, logTag, arg){ logMgr.log('info'   , this, message, arg, logTag)  },
        warning : function(message, logTag, arg){ logMgr.log('warning', this, message, arg, logTag)  },
        error   : function(message, logTag, arg){ logMgr.log('error'  , this, message, arg, logTag)  },

        success : function(message, logTag, arg){ logMgr.log('info'   , this, message, arg, logTag)  },

        logMgr
    }

    globalThis.log = log;
    Vue.prototype.$log = log;    
}