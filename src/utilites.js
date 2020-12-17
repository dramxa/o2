var isNullOrUndefined = (value) => value === null || value === undefined;

function isDate(d){
    return isObject(d) && objectToString(d) === '[object Date]';
}

function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

export function isArray(obj) {
    return Array.isArray(obj);
}

function objectToString(o) {
    return Object.prototype.toString.call(o);
}

export function defaultSort(unsorted, key, isDesc){
    console.log({ unsorted, key, isDesc })
    unsorted.sort((objA, objB)=>{
        try{
            let a = Object.byString(objA, key);
            let b = Object.byString(objB, key);
            
            if(isDate(a) && isDate(b)){
                return b.date - a.date
            }else{
                if(isNullOrUndefined(a) && isNullOrUndefined(b))
                return 0;
                
                if(isNullOrUndefined(a))
                    return  isDesc ?  1 : -1;
                
                if(isNullOrUndefined(b))
                    return  isDesc ?  -1 : 1;                

                if (a < b)
                    return isDesc ?  1 : -1;
                if (a > b)
                    return isDesc ? -1 :  1;
            }
        }catch{}

        return 0;
    
    })
    return unsorted;
}

export function deepSort(unsorted, key, isDesc){   
    var split = function(data){
        var res = [];
        var i = 0;
        var prevTypeInt = false;
        if(isNullOrUndefined(data))
            return res;

        while(i < data.length){ 
        let letter = data[i];
        let similarInt = !isNaN(letter)
        if (!res.length) {
            res.push(letter);
            prevTypeInt = similarInt
        }else{
            if(prevTypeInt){
            if(similarInt)
                res[res.length - 1] += letter
            else{
                res.push(letter)
                prevTypeInt = similarInt
            }
            }else{
            if(similarInt){
                res.push(letter)  
                prevTypeInt = similarInt
            }
            else
                res[res.length - 1] += letter
            }        
        }
        i++;
        }  
        return res;
    } 

    var mapped = unsorted.map(function(el, i){
        var value = el[key];
        if(isNullOrUndefined(value) || value == '')
            value = ''
        else
            value = value.toLowerCase();
        return { index: i, value: split(value) }
    })

    
    mapped.sort(function(a, b) {
        var resFound = null;
        a.value.forEach((partA, index)=>{
        if(resFound!=null)
            return;
        // если в б нет больше кусков, то его нужно поднять вверх (теоретически)
        if(b.value.length -1 < index){
            resFound = 1;
            return;
        }
    
        var partB = b.value[index];
        var partAisInt = !isNaN(partA)
        var partBisInt = !isNaN(partB)
        partA = partAisInt ? parseInt(partA) : partA;
        partB = partBisInt ? parseInt(partB) : partB;
        // если куски а и б разные по типу
        if(partAisInt != partBisInt && partAisInt){
            resFound = -1;
            return;
        }
    
        if(partA > partB){
            resFound = 1;
            return;
        }
    
        if(partA < partB){
            resFound = -1;
            return;
        }
        
        });
    
        // если оба равны
        if(resFound == null && a.value.length == b.value.length)
            return 0;
        
        // если в а меньше кусков чем в б но они равны б
        if(resFound == null)
            return -1;
        
        return isDesc ? resFound * -1 : resFound;
        }
    );
  
    let result = mapped.map(function(el) {
        return unsorted[el.index];
    });

    return result;
}

export function toKeyValuePair(data, key = 'id', value = null){
    return data.reduce((r, e)=>{ r[e[key]] = isNullOrUndefined(value) ? e : e[value]; return r;  }, {});
}
export function toCN(data, key = 'code', value = 'name'){
    return data.reduce((r, e)=>{ r[e[key]] = isNullOrUndefined(value) ? e : e[value]; return r;  }, {});
}

export function objectValuesToString(data, ignoreProp){
    const innerFnc = (nested, ignoreProp, str = '') => {
        var data = ''
        Object.entries(nested).forEach(([k, v])=>{ 
          if(v != null && k != ignoreProp) 
            data += v instanceof Object ? '|' + innerFnc(v, ignoreProp, str) : '|' + v.toString() 
        })
        return str + data.toLowerCase();
    }
    return innerFnc(clone(data), ignoreProp)
}

// наблюдаемый
export function Observable ( fnc ){  
    var self = this;
    var observers = [];

    var Observer = function ( behavior ){
        this.notify = function( msg ){
          behavior( msg );
        };
    }
    
    this.finished = false;
    
    // отправить сообщение
    this.run = async function(){

      var msg = null;
      try{
        var result = await fnc();
        msg = { success: true, result };
      }
      catch(ex){
        msg = { success: false, result: ex };
      }

      for(let i = 0, len = observers.length; i < len; i++){
        observers[i].notify( msg )
      }
      self.finished = true;
    };
    
    // добавить наблюдателя
    this.addObserver = function( observer ){
      observers.push(observer)
    };
    this.observPromise  = ()=> new Promise(
        (resolve, reject)=>
            self.addObserver(new Observer(msg=> msg.success ? resolve(msg.result) : reject(msg.result)))
        )
}

export function WaitObject (){
    this.finished = false;
    var holderObj = { stateFinished : false }
       
    this.unhold = function(){
      holderObj.stateFinished = true;
      this.finished = true;
    } 
  
    
    var observable = new Observable(function(){
       return new Promise((resolve)=>{
           Object.defineProperty(holderObj, 'stateFinished', {
            //  get: function () { return value;  },
             set: function (newValue) {
                resolve();
             },
            enumerable: true,
            configurable: true,
            writeable: true
          });
       })
    });
    
    this.wait = async function(){
      await observable.observPromise()
     
    } 
    
    observable.run();
}


export  default{
    // конвертация массива в KeyValuePair, с произвольным ключем (по умолчанию id) 
    toKeyValuePair: function(data, key = 'id', value = null){
        return data.reduce((r, e)=>{ r[e[key]] = isNullOrUndefined(value) ? e : e[value]; return r;  }, {});
    },

    /** поиск в массиве 
     * 
     */ 
    findInArr : function(arr, value, param = 'id', match = false){
        var res = null;
        arr.forEach(item => {
            if(match)
            {
                if(item[param] == value)
                {                
                    res = item;
                    return;
                }
            }else
                if(item[param].toLowerCase() == value.toLowerCase())
                {                
                    res = item;
                    return;
                }
        });
        return res;
    }
}