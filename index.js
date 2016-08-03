var fs = require('fs')
var path = require('path')

function regexMatchAll(content, replaceContent, indentContent, type) {
  var REGEX = /(\/\/js\sinject)([\s\S]*?)(\/\/end\sinject)/ig
  if(type === 'css'){
    REGEX = /(\/\/css\sinject)([\s\S]*?)(\/\/end\sinject)/ig
  }
  return content.replace(REGEX, '$1\n' + indentContent + replaceContent + '\n'+ indentContent + '$3')
}

function makeTags(file, assets, type) {
  var tags = ''
  assets.map(function (i) {
    if(i.substr(-4) !== '.map' && i.indexOf(file) !== -1){
      if(type === 'js'){
        tags += 'script(type="text/javascript" src="' + path.normalize(i) + '")'
      }else if(type === 'css'){
        tags += 'link(rel="stylesheet", href="' + path.normalize(i) + '")'
      }
    }
  })
  return tags
}

function getIndentContent(indent){
  var content = ''
  var indentContent = " "
  if(indent[0] === 'tab'){
    indentContent = '\t'
  }
  for(var i = 0; i < indent[1]; i++){
    content += indentContent
  }
  return content
}

function JadeInjectPlugin(options) {
  if(options && typeof(options) === 'object' && Object.keys(options.entry).length > 0){
    this.options = Object.assign({indent:['spaces',2]},options)
    this.indentContent = getIndentContent(this.options.indent)
  }else{
    throw new TypeError('缺少必要的参数.')
  }
}

JadeInjectPlugin.prototype.jadeInject = function (assets) {
  var entry = this.options.entry
  var jadeList = Object.keys(entry)
  var indentContent = this.indentContent

  jadeList.map(function (item) {
    var content = fs.readFileSync(item, 'utf-8')
    var jsLinks,cssLinks,output

    if(entry[item].js){
      jsLinks = entry[item].js.map(function (file) {
        return makeTags(file,assets,'js')
      })
      content = regexMatchAll(content,jsLinks.join('\n' + indentContent),indentContent)
    }
    if(entry[item].css){
      cssLinks = entry[item].css.map(function (file) {
        return makeTags(file,assets,'css')
      })
      content = regexMatchAll(content,cssLinks.join('\n' + indentContent),indentContent,'css')
    }
    if(!entry[item].output){
      output = item
    }else{
      output = entry[item].output +'/' + path.basename(item)
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