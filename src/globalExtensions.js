import Vue      from 'vue'
import notifyMessages from './consts/notifyMessages'
import { detect }from 'detect-browser'

export default function(){        
    // регистрируем глобальные функции
    const locale = 'ru-RU'
    var dateTimeOptons = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };  
    var timeOptons = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };  
    globalThis.formatter         = new Intl.DateTimeFormat(locale);
    globalThis.formatterDateTime = new Intl.DateTimeFormat(locale, dateTimeOptons);
    globalThis.formatterTime     = new Intl.DateTimeFormat(locale, timeOptons);

    globalThis.isNullOrUndefined = (value, {y, n} = {}) => {
        var res = value === null || value === undefined || value == '00000000-0000-0000-0000-000000000000';
        if(res && y != undefined) {
            res = y(value);
            return res == null ? true : res;
        }
        if(!res && n != undefined) {
            res = n(value);
            return res == null ? false : res;
        }
        return res   
    };
    globalThis.clone             = function(obj){ return JSON.parse(JSON.stringify(obj)); };
    globalThis.formatDate        = function(value) { return value || false ? formatter.format(new Date(value)) : '' };
    globalThis.formatDateTime    = function(value) { return value || false ? formatterDateTime.format(new Date(value)).replace(',', '') : '' };
    globalThis.formatTime        = function(value) { return value || false ? formatterTime.format(new Date(value)).replace(',', '') : '' };
    globalThis.localePrice       = function(value, currency, digits = 2) { 
        value = value || 0;  
        //console.log({value,currency, digits,  })
        return currency || false ? 
        value.toLocaleString(locale, { style: 'currency', currency, maximumFractionDigits:digits, minimumFractionDigits:digits }):  
        value.toLocaleString(locale, { maximumFractionDigits:digits, useGrouping: false }); 
    };

    globalThis.localeString      = function(value, useGrouping = true ) { return value.toLocaleString(locale, { useGrouping }); }

    globalThis.toLocalISOString  = function(date){
        date = new Date(date);
        let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
        console.log(tzoffset)
        console.log(date)
        console.log(new Date(date - tzoffset))
        return (new Date(date - tzoffset)).toISOString().slice(0, -1);
    }

    globalThis.showMessage       = function(messageCode, props){
        var props = Object.assign({}, notifyMessages[messageCode], props);
        Vue.prototype.$windows.showMessage({ messageCode: 'notifyMessage', props })
        }
    globalThis.getDaysInMonth    = function(month,year) { 
        if(isNullOrUndefined(month)){
            let date = new Date();
            month = date.getMonth()+1;
            year = date.getFullYear();
        }
        return new Date(year, month, 0).getDate(); 
    };
    globalThis.parseISOString = function(s){
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }


    globalThis.browser = function(){  
    let browserDetect = detect();
    return browserDetect.name;
    };
    globalThis.stringToHex = function stringToHex (tmp) {
        let str = '',
            i = 0,
            tmp_len = tmp.length,
            c;

        for (; i < tmp_len; i += 1) {
            c = tmp.charCodeAt(i);
            if(i == tmp_len - 1)
                str += c.toString(16);
            else
                str += c.toString(16) + ' ';
        }
        return str;
    }
    globalThis.convertStorageValue = function(val){
        let unit = 'MB';
        let roundPlus = function (x, n) { //x - число, n - количество знаков
              if(isNaN(x) || isNaN(n)) return false;
              let m = Math.pow(10,n);
              return Math.round(x*m)/m;
            }
        let newVal = val;
        if(newVal>=1024){
            newVal = roundPlus(newVal/1024,1);
            unit = 'GB';
        }
        if(newVal>=1024){
            newVal = roundPlus(newVal/1024,1);
            unit = 'TB';
        }

        return {value: newVal, unit: unit}
            
    }
    globalThis.hexToString = function hexToString (tmp) {
        let arr = tmp.split(' '),
            str = '',
            i = 0,
            arr_len = arr.length,
            c;
        for (; i < arr_len; i += 1) {
            c = String.fromCharCode( parseInt(arr[i], 16) );
            str += c;
        }
        return str;
    }
    globalThis.qs = function(selector){
        return document.querySelector(selector)
    }

    globalThis.timeout = function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
    }
    globalThis.vue = Vue.prototype
    // Установка false отключает предупреждение о работе в режиме разработки при запуске Vue.
    Vue.config.productionTip = false
}