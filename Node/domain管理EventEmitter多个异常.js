var util = require('util')
var domain = require('domain')
var events = require('events')
var audioDomain = domain.create()

function AudioDevice () {
  events.EventEmitter.call(this)
}

util.inherits(AudioDevice, events.EventEmitter)

AudioDevice.prototype.play = function () {
  console.log('audioDevice playing');
  this.emit('error', 'not implemented yet~~')
}

function MusicPlay () {
  events.EventEmitter.call(this)

  this.audioDevice = new AudioDevice()
  this.audioDevice.on('error', function (error) {
    console.log(error);
  })
  this.on('play', this.play.bind(this))
  this.on('error', function (error) {
    console.log(error);
  })
  this.emit('error', 'No audio tracks are avaliable')
}
// 从原型中继承
util.inherits(MusicPlay, events.EventEmitter)

MusicPlay.prototype.play = function () {
  this.audioDevice.emit('play')
  console.log('Now playing~~')
}

audioDomain.on('error', function (error) {
  console.log('audioDomain error', error);
})

// audioDomain.run(function () {
//   var musicPlayer = new MusicPlay()
//   musicPlayer.play()
// })

var musicPlayer = new MusicPlay()
  musicPlayer.play()
