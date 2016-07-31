var fs = require('fs')
var path = require('path')

function regexMatchAll(content, replaceContent, type) {
  var REGEX = /(\/\/js\sinject)([\s\S]*?)(\/\/end\sinject)/ig
  if(type === 'css'){
    REGEX = /(\/\/css\sinject)([\s\S]*?)(\/\/end\sinject)/ig
  }
  return content.replace(REGEX, '$1\n  '+ replaceContent + '\n  $3')
}

function makeTags(file, assets, type) {
  var tags = ''
  assets.map(function (i) {
    if(i.indexOf(file) !== -1){
      if(type === 'js'){
        tags += 'script(type="text/javascript" src="' + path.normalize(i) + '")'
      }else if(type === 'css'){
        tags += 'link(rel="stylesheet", href="' + path.normalize(i) + '")'
      }
    }
  })
  return tags
}

function JadeInjectPlugin(options) {
  if(options && typeof(options) === 'object' && Object.keys(options).length > 0){
    this.options = options
  }else{
    throw new TypeError('缺少必要的参数.')
  }
}

JadeInjectPlugin.prototype.jadeInject = function (assets) {
  var _options = this.options
  var jadeList = Object.keys(_options)
  
  jadeList.map(function (item) {
    var content = fs.readFileSync(item, 'utf-8')
    var jsLinks,cssLinks,output

    if(_options[item].js){
      jsLinks = _options[item].js.map(function (file) {
        return makeTags(file,assets,'js')
      })
      content = regexMatchAll(content,jsLinks.join('\n  '))
    }
    if(_options[item].css){
      cssLinks = _options[item].css.map(function (file) {
        return makeTags(file,assets,'css')
      })
      content = regexMatchAll(content,cssLinks.join('\n  '),'css')
    }
    if(!_options[item].output){
      output = item
    }else{
      output = _options[item].output +'/' + path.basename(item)
    }
    fs.writeFileSync(output, content, 'utf-8')
  })
}

JadeInjectPlugin.prototype.apply = function (compiler) {
  var _this = this
  compiler.plugin('emit', function (compilation,callback) {
    _this.jadeInject(Object.keys(compilation.assets))
    callback()
  })
}

module.exports = JadeInjectPlugin