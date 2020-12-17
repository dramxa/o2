module.exports = { 
  devServer: { port: 8080, open: true }, 
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/o2/' : '/' 
};

