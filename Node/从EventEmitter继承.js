// 结合一个构造函数和 util.inherits 是创建自定义时间驱动的最简单也是最常见的方法。

var util = require('util')
var events = require('events')

var AudioDevice = {
  play: function (track) {
    console.log('play');
  },
  stop: function () {
    console.log('stop')
  }
}

function MusicPlay () {
  this.playing = false
  events.EventEmitter.call(this)
}
// 从原型中继承
util.inherits(MusicPlay, events.EventEmitter)

var musicPlayer = new MusicPlay()

musicPlayer.on('play', function () {
  this.playing = true
  AudioDevice.play()
})

musicPlayer.on('stop', function () {
  this.playing = false
  AudioDevice.stop()
})

musicPlayer.on('error', function (error) {
  console.log(error)
})

musicPlayer.emit('play')

setTimeout(function () {
  musicPlayer.emit('stop')
  musicPlayer.emit('error', 'unable to play!!!')
}, 2000)

// 除了 util.inherits 方法继承，还可以使用 for...in 循环来遍历自需要的属性
function MusicPlay () {
  for (var methodName in events.EventEmitter.prototype) {
    this[methodName] = events.EventEmitter.prototype[methodName]
  }
}

