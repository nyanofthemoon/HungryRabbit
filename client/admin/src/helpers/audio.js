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
    {id: 'burp', track: new Howl({urls: ['/admin/assets/snd/burp.mp3'], volume: 1, loop: false})},
    {id: 'warning', track: new Howl({urls: ['/admin/assets/snd/warning.mp3'], volume: 1, loop: false})},
    {id: 'munch1', track: new Howl({urls: ['/admin/assets/snd/munch1.mp3'], volume: 1, loop: false})},
    {id: 'munch2', track: new Howl({urls: ['/admin/assets/snd/munch2.mp3'], volume: 1, loop: false})},
    {id: 'munch3', track: new Howl({urls: ['/admin/assets/snd/munch3.mp3'], volume: 1, loop: false})},
    {id: 'munch4', track: new Howl({urls: ['/admin/assets/snd/munch4.mp3'], volume: 1, loop: false})},
    {id: 'munch5', track: new Howl({urls: ['/admin/assets/snd/munch5.mp3'], volume: 1, loop: false})},
    {id: 'munch6', track: new Howl({urls: ['/admin/assets/snd/munch6.mp3'], volume: 1, loop: false})},
    {id: 'munch7', track: new Howl({urls: ['/admin/assets/snd/munch7.mp3'], volume: 1, loop: false})},
    {id: 'munch8', track: new Howl({urls: ['/admin/assets/snd/munch8.mp3'], volume: 1, loop: false})},
    {id: 'munch9', track: new Howl({urls: ['/admin/assets/snd/munch9.mp3'], volume: 1, loop: false})},
    {id: 'munch10', track: new Howl({urls: ['/admin/assets/snd/munch10.mp3'], volume: 1, loop: false})},
    {id: 'munch11', track: new Howl({urls: ['/admin/assets/snd/munch11.mp3'], volume: 1, loop: false})},
    {id: 'munch12', track: new Howl({urls: ['/admin/assets/snd/munch12.mp3'], volume: 1, loop: false})},
    {id: 'munch13', track: new Howl({urls: ['/admin/assets/snd/munch13.mp3'], volume: 1, loop: false})},
    {id: 'munch14', track: new Howl({urls: ['/admin/assets/snd/munch14.mp3'], volume: 1, loop: false})},
    {id: 'munch15', track: new Howl({urls: ['/admin/assets/snd/munch15.mp3'], volume: 1, loop: false})},
    {id: 'munch16', track: new Howl({urls: ['/admin/assets/snd/munch16.mp3'], volume: 1, loop: false})},
    {id: 'munch17', track: new Howl({urls: ['/admin/assets/snd/munch17.mp3'], volume: 1, loop: false})},
    {id: 'munch18', track: new Howl({urls: ['/admin/assets/snd/munch18.mp3'], volume: 1, loop: false})},
    {id: 'munch19', track: new Howl({urls: ['/admin/assets/snd/munch19.mp3'], volume: 1, loop: false})},
    {id: 'munch20', track: new Howl({urls: ['/admin/assets/snd/munch20.mp3'], volume: 1, loop: false})},
    {id: 'munch21', track: new Howl({urls: ['/admin/assets/snd/munch21.mp3'], volume: 1, loop: false})}
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