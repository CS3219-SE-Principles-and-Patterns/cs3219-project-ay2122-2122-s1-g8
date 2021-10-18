module.exports = (api) => {
    const presets = ["react-app"];
    const plugins = [
        "@babel/plugin-transform-modules-commonjs",
        "inline-react-svg"
    ]; 
  
    api.cache(false); 
   
    return {
        presets,
        plugins
    };
};

//"NODE_ENV=test mocha --require @babel/register --require       ignore-styles src/test/*.test.js"
//./node_modules/.bin/mocha --require @babel/register --require ignore-styles ./src/test/App.test.js --reporter progress