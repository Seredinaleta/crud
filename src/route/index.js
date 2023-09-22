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

  static getTrackById(id) {
    return Track.#list.find((track) => track.id === id)
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
  constructor(name, img) {
    this.id = Math.floor(1000 + Math.random() * 9800)
    this.name = name
    this.tracks = []
    this.img = img || `https://picsum.photos/250/250`
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

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  addTrack(playlist, track) {
    playlist.tracks.push(track)
    return playlist
  }

  static findListByName(value) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
  }
}
Playlist.makeMix(Playlist.create('Test 1'))

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
// router.get('/', function (req, res) {
//   res.render('spotify-choose', {
//     style: 'spotify-choose',

//     data: {},
//   })
//   // ↑↑ сюди вводимо JSON дані
// })

router.get('/spotify-choose', function (req, res) {
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

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })

  // res.render('spotify-alert', {
  //   style: 'spotify-alert',
  //   data: {
  //     message: 'Успішно',
  //     info: `Плейліст створений`,
  //     link: `/spotify-playlist?id=${playlist.id} `,
  //   },
  // })
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
router.get('/spotify-track-delete', function (req, res) {
  const trackId = Number(req.query.trackId)
  const playlistId = Number(req.query.playlistId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: `Playlist не знайдено`,
        link: `/spotify-playlist?id=${playlistId} `,
      },
    })
  }

  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//=======================================================
router.get('/spotify-playlist-add', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)
  if (!playlist) {
    res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: `Відсутній плейліст`,
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }

  const tracks = Track.getList()

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,

      name: playlist.name,
      tracks,
    },
  })
})
//=======================================================
router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)
  if (!playlist) {
    res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: `Відсутній плейліст`,
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  const track = Track.getTrackById(trackId)
  console.log(track)
  // playlist.addTrack(track)
  playlist.addTrack(playlist, track)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',

    data: {
      playlistId: playlistId,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
// =======================================================
router.get('/', function (req, res) {
  const allTracks = Track.getList()
  const playlistAll = Playlist.create(
    'Пісні, що сподобались',
  )
  playlistAll.tracks.push(...allTracks)

  const playlistMix = Playlist.create('Мішаніна')
  Playlist.makeMix(playlistMix)

  const allPlaylists = Playlist.getlist()
  if (!allPlaylists) {
    res.render('spotify-alert', {
      style: 'spotify-alert',
      data: {
        message: 'Помилка',
        info: `Нема плейлистів`,
        link: `/spotify-choose `,
      },
    })
  }
  res.render('spotify-index', {
    style: 'spotify-index',

    data: {
      list: allPlaylists.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
    },
  })
})
//=======================================================
router.get('/spotify-search', function (req, res) {
  const value = ''
  const list = Playlist.findListByName(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

//=======================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''
  const list = Playlist.findListByName(value)
  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
//================================================================
// Підключаємо роутер до бек-енду
module.exports = router
