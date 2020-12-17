// базовый модуль REST запросов
import Vue from 'vue'
import { mapActions } from 'vuex'
import colorsys from 'colorsys'

var store = Vue.prototype.$store

const moduleName = 'ct';

const moduleCls = {
    store,

    data(){
        return {
            color: '#357FD4'
        }
    },

    methods:{
        ...mapActions(['glb_setColorStyleVars']),

        default(){
            let colorStyles = {
                '--var-accent000' : '#EBF3F9',
                '--var-accent050' : '#E1EEF4',
                '--var-accent100' : '#D4E7F7',
                '--var-accent200' : '#B0D2FF',
                '--var-accent300' : '#98C7FD',
                '--var-accent400' : '#6CAAF0',
                '--var-accent500' : '#4E91DE',
                '--var-accent600' : '#357FD4',
                '--var-accent700' : '#1E6CC6',
                '--var-accent800' : '#175298',
                '--var-accent900' : '#1C4480'               
            }

            this.glb_setColorStyleVars(colorStyles)
        },

        prepareStyles(color = this.color){
            // console.log(color
            let colorScheme = this.calculateScheme(color);
            let colorStyles = {
                '--var-accent000' : colorScheme[0],
                '--var-accent050' : colorScheme[1],
                '--var-accent100' : colorScheme[2],
                '--var-accent200' : colorScheme[3],
                '--var-accent300' : colorScheme[4],
                '--var-accent400' : colorScheme[5],
                '--var-accent500' : colorScheme[6],
                '--var-accent600' : colorScheme[7],
                '--var-accent700' : colorScheme[8],
                '--var-accent800' : colorScheme[9],
                '--var-accent900' : colorScheme[10]               
            }

            this.glb_setColorStyleVars(colorStyles)
        },

        calculateScheme(baseColor){
            var {h, s, v} = colorsys.hexToHsv(baseColor);

            var fColor = function(hh, ss, vv){
              // hh = hh > 360 ? hh - 360 : hh;
              // hh = hh < 0 ? 360 - hh : hh;
      
              ss=Math.round(ss);        
              ss = ss > 100 ? 100 : ss;
              ss = ss < 0 ? 0 : ss;
      
              // var k = ss < 110 ? (ss / 10)  : 0;
              // console.log(Math.round(k))
              // vv += 4 * (10 - Math.round(k));
              
              vv = Math.round(vv);        
              vv = vv > 100 ? 100 : vv;
              vv = vv < 0 ? 0 : vv;
      
            //    console.log( `${hh}, ${ss}, ${vv}`)
              return colorsys.hsvToHex(hh, ss, Math.round(vv))
            }
      
            var res = [];
/*000*/     res.push(fColor(h , s - s * .92, v + v * .89))
/*050*/     res.push(fColor(h  , s - s * .79, v + v * .75));
/*100*/     res.push(fColor(h  , s - s * .68, v + v * .55));
/*200*/     res.push(fColor(h  , s - s * .42, v + v * .34));
/*300*/     res.push(fColor(h  , s - s * .26, v + v * .21));
/*400*/     res.push(fColor(h  , s - s * .16, v + v * .13));
/*500*/     res.push(fColor(h  , s, v));
            var ss =  s + s * .13
            var k =0;
            k += ss >= 100 ? 3 : 0;
            var vv = ss >= 100 ? v - 2 : v - v * .05
/*600*/     res.push(fColor(h + 1, ss, vv));
            ss = s + s * .21
            k += ss >= 100 ? (h > 180 ? -3: 3) : 0;
            vv = ss >= 100 ? vv - 4 : v - v * .13
/*700*/     res.push(fColor(h + 2 - k, ss, vv));
            ss = s + s * .34
            k += ss >= 100 ? (h > 180 ? -3: 3) : 0;
            vv = ss >= 100 ? vv - 4 : v - v * .34
/*800*/     res.push(fColor(h + 2 - k, s + s * .42, vv));
            ss = s + s * .68
            k += ss >= 100 ? (h > 180 ? -3: 3) : 0;
            vv = ss >= 100 ? vv - 12 : v - v * .55
/*900*/     res.push(fColor(h + 2 - k, s + s * .68, vv));
      
            return res;    
        }
    },

    created(){
        this.default();
    }
}

export default function () {
    let key = `$${moduleName}`;
    Vue.prototype[key] = new Vue(moduleCls);
}
      