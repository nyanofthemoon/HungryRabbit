import {Howl} from 'howler'

let audio = {
  music: [
    {id: 'title-screen', track: new Howl({urls: ['/admin/assets/snd/title.wav'], volume: 1, loop: true})},
    {id: 'wait-screen' , track: new Howl({urls: ['/admin/assets/snd/wait.wav'], volume: 1, loop: true})},
    {id: 'game-screen',  track: new Howl({urls: ['/admin/assets/snd/play.wav'], volume: 0.5, loop: true})},
    {id: 'over-screen',  track: new Howl({urls: ['/admin/assets/snd/over.wav'], volume: 1, loop: false})}
  ],
  sound: [
    {id: 'munch',  track: new Howl({urls: ['/admin/assets/snd/munch.wav'], loop: false})}
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