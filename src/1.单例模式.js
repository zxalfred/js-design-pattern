// 单例模式定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点

// 1. 实现单例模式
// 用一个变量来标志当前是否已经为某个类创建过对象
// 如果是，则在下次获取该类的实例时候，直接返回之前创建的对象
{
  const Singleton = function(name) {
    this.name = name
    this.instance = null
  }

  Singleton.prototype.getName = function() {
    console.log(this.name)
  }

  Singleton.getInstance = function(name) {
    if (!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }

  const a = Singleton.getInstance('alfred1')
  const b = Singleton.getInstance('alfred2')
  console.log(a === b)
}

// 或者将instance保存在闭包中
{
  const Singleton = function(name) {
    this.name = name
  }

  Singleton.prototype.getName = function() {
    console.log(this.name)
  }

  Singleton.getInstance = (function() {
    let instance = null
    return function() {
      if (!instance) {
        instance = new Singleton()
      }
      return instance
    }
  }())

  const a = Singleton.getInstance('alfred1')
  const b = Singleton.getInstance('alfred2')
  console.log(a === b)
}

// 2.透明的单例模式
// 用户从这个类中创建对象的时候，可以像使用其他任何普通类一样
// 下面的例子负责在页面中创建唯一的div节点
{
  const CreateDiv = (function() {
    let instance

    const MakeDiv = function(html) {
      if (instance) {
        return instance
      }
      this.html = html
      this.init()
      return instance = this
    }

    MakeDiv.prototype.init = function() {
      const div = document.createElement('div')
      div.innerHTML = this.html
      document.body.appendChild(div)
    }

    return MakeDiv
  }())
}

// 上面的例子缺乏通用性，不符合“单一职责原则”,
// 如果要让这个类从单例类变成一个普通的可以产生多个实例的类
// 就必须得修改MakeDiv构造函数，造成不必要的麻烦

// 3. 用代理实现单例模式
// 现在通过引入代理类的方式解决这个问题
// 起本质也是分离函数的职责，将确保单例的任务交给代理类
{
  const CreateDiv = function(html) {
    this.html = html
    this.init()
  }

  CreateDiv.prototype.init = function() {
    const div = document.createElement('div')
    div.innerHTML = this.html
    document.body.appendChild(div)
  }

  const ProxySingletonCreateDiv = (function() {
    let instance
    return function(html) {
      if (!instance) {
        instance = new CreateDiv(html)
      }
      return instance
    }
  }())
}

// 4. JavaScript 中的单例模式
// 上述单例模式的实现，更多是接近传统的面向对象语言中的实现，单例从“类”中创建而来
// 但是JS是无类语言，不需要生搬硬套传统的单例概念
// 单例模式的核心是确保只有一个实例，并提供全局访问
const obj = {}

// 这样的问题是容易导致全局变量污染，可以使用一下几种方式避免
// 4.1 使用 ES6 块级作用域
{
  const a = {}
}

// 4.2 使用命名空间
{
  const namespace = {
    a() {
      console.log(1)
    },
    b() {
      console.log(2)
    },
  }
}

// 4.3 使用闭包封装私有变量
{
  const user = (function() {
    const _name = 'alfred'
    const _age = '24'

    return {
      getUserInfo() {
        return `${_name}-${_age}`
      },
    }
  }())
}

// 5. 惰性单例
// 在需要使用时，才创建对象单例

// 假设有个id为loginBtn的按钮，点击后显示登录框
{
  const loginLayer = (function() {
    const div = document.createElement('div')
    div.innerHTML = '我是登录悬浮窗'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
  }())

  document.getElementById('loginBtn').onclick = function() {
    loginLayer.style.display = 'block'
  }
}

// 上面的问题在于一开始进入就会加载DOM，可能我们进入页面后根本就不想登录，浪费了DOM节点
// 改写代码，使点击按钮后再添加DOM
{
  const createLoginLayer = function() {
    const div = document.createElement('div')
    div.innerHTML = '我是登录悬浮窗'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
  }

  document.getElementById('loginBtn').onclick = function() {
    const loginLayer = createLoginLayer()
    loginLayer.style.display = 'block'
  }
}

// 上述虽然实现了惰性，但是缺失去了单例的效果
// 我们通过一个变量来判断是否已经创建过悬浮窗
{
  const createLoginLayer = (function() {
    let div
    return function() {
      if (!div) {
        div = document.createElement('div')
        div.innerHTML = '我是一个登录悬浮窗'
        div.style.display = 'none'
        document.body.appendChild(div)
      }
      return div
    }
  }())

  document.getElementById('loginBtn').onclick = function() {
    const loginLayer = createLoginLayer()
    loginLayer.style.display = 'block'
  }
}

// 6. 通用的惰性单例
// 上面的代码还存在如下问题：
// * 违反单一职责原则，创建对象和管理单例的逻辑都放在createLoginLayer对象内部
// * 如果我们下次需要创建页面中唯一的iframe，或者script标签，用来跨域请求数据，就必须如法炮制，把createLoginLayer照抄一遍

// 现在我们把管理单例的逻辑抽离出来
{
  const getSingle = function(fn) {
    let result
    return function(...args) {
      return result || (result = fn.apply(this, args))
    }
  }

  const createLoginLayer = function() {
    const div = document.createElement('div')
    div.innerHTML = '我是登录悬浮窗'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
  }

  const createSingleLoginLayer = getSingle(createLoginLayer)

  document.getElementById('loginBtn').onclick = function() {
    const loginLayer = createSingleLoginLayer()
    loginLayer.style.display = 'block'
  }
}
