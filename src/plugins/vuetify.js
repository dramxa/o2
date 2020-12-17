// Плагин VUETIFY
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify, {
  options: {
    customProperties: true
  }
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  breakpoint: {
    thresholds: {
      xs: 1024,
      sm: 1264,
      md: 1600,
      lg: 1904,
    },
    scrollbarWidth: 10
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        background: '#fafafa',
      },
    },
  }
});
