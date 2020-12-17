// базовый модуль REST запросов
import Vue from 'vue'

const moduleName = 'export';

const module = { 
        csv: function(objArray, filename) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            if(array.length == 0)
              return;

            var headers = Object.keys(array[0]);
            var lineH = ''
            headers.forEach(str => {
              if (lineH != '') lineH += ';'
              lineH+= str
            });
            str+= lineH + '\r\n';

            array.forEach(item => {
              var line = '';
              headers.forEach(str => {
                if (line != '') line += ';'
                line+= item[str];
              });
              str += line + '\r\n';
            });

            this.download(str, filename, 'text/csv;encoding:utf-8');
        },

        download: function(content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';
          
            if (navigator.msSaveBlob) { // IE10
              navigator.msSaveBlob(new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], {
                type: mimeType
              }), fileName);
            } else if (URL && 'download' in a) { //html5 A[download]
              a.href = URL.createObjectURL(new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), content], {
                type: mimeType
              }));
              a.setAttribute('download', fileName);
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            } else {
              location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
            }
        },

        downloadBlob: function(data, filename){
          if(!data) {
              console.error('Console.save: No data')
              return;
          }
      
          if(!filename) filename = 'console.json'
      
          if(typeof data === "object"){
              data = JSON.stringify(data, undefined, 4)
          }
      
          var blob = new Blob([data], {type: 'text/json'}),
              e    = document.createEvent('MouseEvents'),
              a    = document.createElement('a')
      
          a.download = filename
          a.href = window.URL.createObjectURL(blob)
          a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
          e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
          a.dispatchEvent(e)
       }
    }


export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = module;
  }
      