// Підключаємо технологію express для back-end сервера
const { query } = require('express')
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #List = []
  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }
  verifyPassord = (password) => password === this.password
  static add = (user) => {
    this.#List.push(user)
  }
  static getList = () => this.#List
  //стрілкова ф-я не вимагає фігурних дужок коли один рядок коду.Тоді можна і return не писати
  static getById = (id) =>
    this.#List.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#List.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#List.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, { email }) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач створений',
  })
})

// ================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('user-success-info', {
    style: 'user-success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body

  let result = false
  const user = User.getById(Number(id))

  if (user.verifyPassord(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('user-success-info', {
    style: 'user-success-info',
    info: result
      ? 'Email оновлено'
      : `Сталася помилка в оновленні`,
  })
})

// ================================================================
class Product {
  static #list = []
  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 100000)
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => this.#list

  // checkedId = (id) => this.id === id

  static add = (product) => this.#list.push(product)

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name, price, description } = data

    if (product) {
      product.name = name
      product.price = price
      product.description = description
      return true
    }
  }

  // static update = (name, { product }) => {
  //   if (name) {
  //     product.name = name
  //   }
  // }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
// ================================================================
router.get('/product-create', function (req, res) {
  const list = Product.getList()

  res.render('product-create', {
    style: 'product-create',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())

  let result = false

  if (product.name) {
    result = true
  }

  res.render('product-alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-alert',
    info: result
      ? 'Товар було успішно додано'
      : `Сталася помилка`,
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/product-list', function (req, res) {
  const list = Product.getList()
  // const { name, description, id, price } = req.query

  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
//
//
// ================================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  const product = Product.getById(Number(id))
  console.log(product)

  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        id: product.id,
      },
    })
  } else {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Продукту за таким ID не знайдено',
    })
  }
})
// ================================================================
router.post('/product-edit', function (req, res) {
  const { id, name, price, description } = req.body

  const product = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  console.log(id)
  console.log(product)
  if (product) {
    res.render('product-alert', {
      style: 'product-alert',
      info: 'Товар оновлено',
    })
  } else {
    res.render('product-alert', {
      style: 'product-alert',
      info: `Сталася помилка в оновленні`,
    })
  }
})
// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query

  Product.deleteById(Number(id))

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Продукт видалений',
  })
})
// =======================================================
// Підключаємо роутер до бек-енду
module.exports = router
