var fs = require('fs');
var path = require('path')

function JadeInjectPlugin(options) {
  if(options && typeof(options) === 'object' && Object.keys(options).length > 0){
    this.options = options
  }else{
    throw new TypeError('缺少必要的参数.')
  }
}

JadeInjectPlugin.prototype.apply = function (compiler) {
  var _this = this;
  compiler.plugin('emit', function (compilation,callback) {
    //处理默认options
    var assetList = (Object.keys(compilation.assets))
    _this.jadeInject(assetList)
    callback();
  })
}

// JadeInjectPlugin.prototype.defaultOptions = function (assets) {
//   var optionKeys = Object.keys(this.options);
//   if(optionKeys.length > 0){
//     optionKeys.map(function (item) {
//       if(!this.options[item].output){
//         this.options[item].output = item
//       }
//     })
//   }else{
//     assets.map(function (file) {
//       var filename = file.slice(file.lastIndexOf('/'));
//       var arr = filename.splice('.').reserve()
//     })
//   }
// }

JadeInjectPlugin.prototype.jadeInject = function (assets) {
  var _this = this;
  var jadeList = Object.keys(_this.options)
  
  jadeList.map(function (item) {
    var content = fs.readFileSync(item, 'utf-8');
    var jsLinks,cssLinks,output;
    if(_this.options[item].js){
      jsLinks = _this.options[item].js.map(function (file) {
        return _this.makeTags(file,assets,'js')
      })
      content = regexMatchAll(content,jsLinks.join('\n  '))
    }
    if(_this.options[item].css){
      cssLinks = _this.options[item].css.map(function (file) {
        return _this.makeTags(file,assets,'css')
      })
      content = regexMatchAll(content,cssLinks.join('\n  '),'css')
    }
    if(!_this.options[item].output){
      output = item
    }else{
      output = _this.options[item].output +'/' + path.basename(item)
    }
    fs.writeFileSync(output, content, 'utf-8')
  })
}

function regexMatchAll(content, replaceContent, type) {
  var REGEX = /(\/\/js\sinject)([\s\S]*?)(\/\/end\sinject)/ig;
  if(type === 'css'){
    var REGEX = /(\/\/css\sinject)([\s\S]*?)(\/\/end\sinject)/ig;
  }
  return content.replace(REGEX, '$1\n  '+ replaceContent + '\n  $3')
}

JadeInjectPlugin.prototype.makeTags = function (file, assets, type) {
  var tags = '';
  assets.map(function (i) {
    if(i.indexOf(file) !== -1){
      if(type === 'js'){
        tags += 'script(type="text/javascript" src="' + path.normalize(i) + '")'
      }else if(type === 'css'){
        tags += 'link(rel="stylesheet", href="' + path.normalize(i) + '")'
      }
    }
  })
  return tags;
}

module.exports = JadeInjectPlugin;