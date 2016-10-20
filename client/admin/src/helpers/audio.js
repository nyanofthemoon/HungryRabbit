import {Howl} from 'howler'

let audio = {
  music: [
    {id: 'title-screen', track: new Howl({urls: ['/admin/assets/snd/title.mp3'], volume: 1, loop: true})},
    {id: 'wait-screen' , track: new Howl({urls: ['/admin/assets/snd/wait.mp3'], volume: 1, loop: true})},
    {id: 'game-screen', track: new Howl({urls: ['/admin/assets/snd/play.mp3'], volume: 0.75, loop: true})},
    {id: 'over-screen', track: new Howl({urls: ['/admin/assets/snd/over.mp3'], volume: 1, loop: false})
      .on('end', function(){
        playSound('burp')
      })
    }
  ],
  sound: [
    {id: 'munch', track: new Howl({urls: ['/admin/assets/snd/munch.wav'], volume: 1, loop: false})},
    {id: 'burp', track: new Howl({urls: ['/admin/assets/snd/burp.mp3'], volume: 1, loop: false})},
    {id: 'warning', track: new Howl({urls: ['/admin/assets/snd/warning.mp3'], volume: 1, loop: false})}
  ]
}

export function playSound(id) {
  audio.sound.forEach(function(sound) {
    if (id === sound.id) {
      sound.track.play()
      return
    }
  })
}

export function playMusic(id) {
  audio.music.forEach(function(music) {
    music.track.stop();
    if (id === music.id) {
      music.track.play()
    }
  })
}