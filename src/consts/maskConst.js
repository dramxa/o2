export default {
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

      currency_4: {
        mask: Number,  
        scale: 4,  // digits after point, 0 for integers
        signed: false,  // disallow negative
        thousandsSeparator: '',  // any single char
        padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
        normalizeZeros: true,  // appends or removes zeros at ends
        radix: ',',  // fractional delimiter
        mapToRadix: ['.'],  // symbols to process as radix
      },

      currency_6: {
        mask: Number,  
        scale: 6,  // digits after point, 0 for integers
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
      },

      justCapsLetters: {
        mask: /^[A-Z]+$/
      },

      hours: {
        mask: Number,
        min: 0,
        max: 23,
      },
      minutes: {
        mask: Number,
        min: 0,
        max: 59,
      },
      seconds: {
        mask: Number,
        min: 0,
        max: 59,
      },
}