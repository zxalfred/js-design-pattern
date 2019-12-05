// 发布-订阅者模式又称观察者模式，它定义对象间的一种一对多关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知
// 在JS中，我们一般用时间模型来代替传统的发布-订阅模式
// 1.自定义事件

// 首先指定好谁充当发布者
// 给发布者添加一个缓存列表，存放回调函数以便通知订阅者
// 最后发布消息的时候，发布者会遍历缓存列表，一次出发里面存放的订阅者回调函数
// 另外回调函数里可以填入参数，订阅者可以接收这些参数
{
  const event = {
    clientList: [],
    listen(key, fn) {
      if (!this.clientList[key]) {
        this.clientList[key] = []
      }
      this.clientList[key].push(fn)
    },
    trigger(...args) {
      const key = args.shift()
      const fns = this.clientList[key]

      if (!fns || fns.length === 0) {
        return false
      }
      const l = fns.length
      for (let i = 0; i < l; i++) {
        fns[i].apply(this, args)
      }
    },
  }

  const installEvent = (obj) => {
    Reflect.ownKeys(event).forEach((key) => {
      obj[key] = event[key]
    })
  }

  const salesOffices = {}

  installEvent(salesOffices)
  salesOffices.listen('squareMeter88', (price) => {
    console.log(`价格= ${price}`)
  })
  salesOffices.listen('squareMeter100', (price) => {
    console.log(`价格= ${price}`)
  })
  salesOffices.trigger('squareMeter88', 2000000) // 输出:2000000
  salesOffices.trigger('squareMeter100', 3000000) // 输出:3000000
}
