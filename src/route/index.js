// Підключаємо технологію express для back-end сервера
const { query } = require('express')
const express = require('express')
const { render } = require('sass')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9800)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList = () => {
    return this.#list.reverse()
  }
}
Track.create(
  'Інь Янь',
  'MONATIK & ROXOLANA',
  '/img/monatik.jpg',
)

Track.create(
  'Baila Comingo (Remix)',
  'Selena Gomez & Rauw Alejandro',
  '/img/baila.jpg',
)
Track.create(
  'Shaneless',
  'Camilla Cabello',
  '/img/shameless.jpg',
)
Track.create(
  'DAKITI',
  'BAD BUNNY & JHAY',
  '/img/dakiti.jpg',
)
Track.create('11PM', 'Maluna', '/img/11PM.jpg')
Track.create('Інша Любов', 'Enleo', '/img/enleo.jpg')
console.log(Track.getList())
// ================================================================
class Playlist {
  static #list = []
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9800)
    this.name = name
    this.tracks = []
  }
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }
  static getlist = () => {
    return this.#list.reverse()
  }
  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks)
    return playlist
  }

  deleteTrackById(id) {
    this.tracks = this.tracks.filter((track) => {
      track.id !== id
    })
  }
}
// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// =======================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)

  res.render('spotify-create', {
    style: 'spotify-create',

    data: {
      isMix,
    },
  })
})

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name
  if (!name) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',

      data: {
        message: 'Помилка',
        info: `Відсутня назва`,
        link: isMix
          ? `/spotify-create?isMix=true`
          : `/spotify-create`,
      },
    })
  }
  const playlist = Playlist.create(name)
  if (isMix) {
    Playlist.makeMix(playlist)
  }
  console.log(playlist)

  res.render('spotify-alert', {
    style: 'spotify-alert',
    data: {
      message: 'Успішно',
      info: `Плейліст створений`,
      link: `/spotify-playlist?id=${playlist.id} `,
    },
  })
})

//=======================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)
  if (!playlist) {
    res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: `Відсутній плейліст`,
        link: `/ `,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// =======================================================
// ================================================================
// Підключаємо роутер до бек-енду
module.exports = router
