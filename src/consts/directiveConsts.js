import Vue from 'vue'

export const JustDigits = () => {
    Vue.directive('digitsonly', (el, binding) => {
      if (/^\d+$/i.test(el.value)) {
        // console.log('ok');
      } else {
        let newValue = el.value.replace(/[^0-9]/ig, '');
        el.value = newValue;
        // console.log('should fix', newValue);
        binding.value = el.value;
      }
    });
  };

  export const JustLatinLetterAndDigits = () => {
      Vue.directive('digits-and-latin', (el, binding) => {
        if (/^[A-Za-z0-9]+$/.test(el.value)) {
          // console.log('ok');
        } else {
          let newValue = el.value.replace(/[^0-9A-Za-z]/g, '');
          el.value = newValue;
          // console.log('should fix', newValue);
          binding.value = el.value;
        }
      });
    };

  export const NoFirstDigit = () => {
      Vue.directive('no-first-digits', (el, binding) => {
          if (/^[a-zA-Z](?:([A-Za-z0-9])?)+$/.test(el.value)) {
              // console.log('ok');
              binding.value = el.value;
          } else {
              let preValue = el.value;
              if(/^[0-9]/.test(el.value)){
                  // console.log('asdfasf');
                  let pos = preValue.search(/[a-z]/i);
                  if(pos != -1){
                      preValue = preValue.slice(pos);
                  }else{
                      preValue = '';
                  }
              }
              let newValue = preValue.replace(/[^0-9A-Za-z]/g, '');
              el.value = newValue;
              // console.log('should fix');
              binding.value = el.value;
          }
      });
  };

  export const Currency = () => {
    Vue.directive('currency', (el, binding) => {
      if (/^\d+(?:[.]\d{1,2}|$)$/.test(el.value)) {
        binding.value = el.value;
      } else {
        let preValue = el.value;
        let newValue = preValue.replace(/[^0-9.]/g, '');
        if(newValue[newValue.length - 1] == '.')
          newValue += '00'
        
        var k = newValue.indexOf('.', 0);
        if(newValue.length - k > 3)
          newValue = newValue.substring(0, k + 3);

        el.value = newValue;
      }
    });
  };


  export const masks = {
    currency: {
      mask: Number,  
      scale: 2,  // digits after point, 0 for integers
      signed: false,  // disallow negative
      thousandsSeparator: '',  // any single char
      padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
      normalizeZeros: true,  // appends or removes zeros at ends
      radix: ',',  // fractional delimiter
      mapToRadix: ['.'],  // symbols to process as radix
    },

    justDigits: {
      mask: Number,
      scale: 0
    },

    noFirstDigits: {
      mask: /^[a-zA-Z](?:([A-Za-z0-9])?)+$/
    },

    justLetters: {
      mask: /^[A-Za-zА-Яа-я]+$/
    }
  }