// 职责链定义：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系
// 将这些对象连成一条链，并沿着这条链传递该请求，直到又一个对象处理它为止
// 1. 实际开发中的职责链
// 假设有一售卖手机流程，orderType 表示订单类型，pay 表示是否已经支付定金，stock 表示当前用于普通购买的手机库存数量，已经支付过定金的用户不受此限制
{
  const order = (orderType, pay, stock) => {
    if (orderType === 1) {
      if (pay) {
        console.log('500元定金预购，得到100优惠券')
      } else if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    } else if (orderType === 2) {
      if (pay) {
        console.log('200元定金预购，得到50优惠券')
      } else if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    } else if (orderType === 3) {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  }
}
// 虽然可以运行，但是order函数不仅巨大到难以阅读，而且需要经常进行修改

// 2. 用职责链重构代码
{
  const orderNormal = (orderType, pay, stock) => {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }

  const order200 = (orderType, pay, stock) => {
    if (orderType === 2 && pay) {
      console.log('200元定金预购，得到50优惠券')
    } else {
      orderNormal(orderType, pay, stock)
    }
  }

  const order500 = (orderType, pay, stock) => {
    if (orderType === 1 && pay) {
      console.log('500元定金预购，得到100优惠券')
    } else {
      order200(orderType, pay, stock)
    }
  }

  order500(1, true, 500)
  order500(1, false, 500)
  order500(2, true, 500)
  order500(3, false, 500)
  order500(3, false, 0)
}
// 代码结构清晰了很多，但链条传递的顺序过于僵硬，传递请求的代码被耦合在了业务函数中，者违反了开放-封闭原则

// 3. 灵活可拆分的职责链节点
// 首先需要改写一下分别表示3中购买模式的节点函数
// 约定如果某个节点不能处理请求，则返回一个特定的字符串'nextSuccessor'来表示该需求需要继续往后面传递
{
  const order500 = (orderType, pay, stock) => {
    if (orderType === 1 && pay) {
      console.log('500元定金预购，得到100优惠券')
    } else {
      return 'nextSuccessor'
    }
  }

  const order200 = (orderType, pay, stock) => {
    if (orderType === 2 && pay) {
      console.log('200元定金预购，得到50优惠券')
    } else {
      return 'nextSuccessor'
    }
  }

  const orderNormal = (orderType, pay, stock) => {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }
  // 接下来需要把函数包进职责链节点
  // 我们定义一个构造函数Chain，在new Chain的时候传递的参数即为需要被包装的函数
  // 同事它还拥有一个实例属性this.successor，表示在链中的下一个节点
  class Chain {
    constructor(fn) {
      this.fn = fn
      this.successor = null
    }

    setNextSuccessor(successor) {
      return this.successor = successor
    }

    passRequest(...args) {
      const ret = this.fn(...args)
      if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest(...args)
      }
      return ret
    }
  }
  // 将订单函数包装成职责链
  const chainOrder500 = new Chain(order500)
  const chainOrder200 = new Chain(order200)
  const chainOrderNormal = new Chain(orderNormal)
  // 指定节点在职责链中的顺序
  chainOrder500.setNextSuccessor(chainOrder200)
  chainOrder200.setNextSuccessor(chainOrderNormal)
  // 最后把请求传递给第一个节点
  chainOrder500.passRequest(1, true, 500)

  // 若后续想加入300元定金购买，只要增加一个节点即可
  const order300 = () => {}
  const chainOrder300 = new Chain(order300)
  chainOrder500.setNextSuccessor(chainOrder300)
  chainOrder300.setNextSuccessor(chainOrder200)
}

// 4. 异步的职责链
// 给 Chain 类再增加一个next方法，表示手动传递请求给职责链中的下一个节点
{
  class Chain {
    constructor(fn) {
      this.fn = fn
      this.successor = null
    }

    setNextSuccessor(successor) {
      return this.successor = successor
    }

    passRequest(...args) {
      const ret = this.fn(...args)
      if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest(...args)
      }
      return ret
    }

    next(...args) {
      return this.successor && this.successor.passRequest(...args)
    }
  }

  const fn1 = new Chain(() => {
    console.log(1)
    return 'nextSuccessor'
  })

  const fn2 = new Chain(() => {
    console.log(2)
    setTimeout(() => {
      this.next()
    }, 1000)
  })

  const fn3 = new Chain(() => {
    console.log(3)
  })

  fn1.setNextSuccessor(fn2).setNextSuccessor(fn3)
  fn1.passRequest()
}

// 用AOP（面向切面编程）实现职责链
{
  const order500 = (orderType, pay, stock) => {
    if (orderType === 1 && pay) {
      console.log('500元定金预购，得到100优惠券')
    } else {
      return 'nextSuccessor'
    }
  }

  const order200 = (orderType, pay, stock) => {
    if (orderType === 2 && pay) {
      console.log('200元定金预购，得到50优惠券')
    } else {
      return 'nextSuccessor'
    }
  }

  const orderNormal = (orderType, pay, stock) => {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }
  Function.prototype.after = function(fn) {
    return (...args) => {
      const ret = this(...args)
      if (ret === 'nextSuccessor') {
        return fn(...args)
      }
      return ret
    }
  }

  const order = order500.after(order200).after(orderNormal)

  order(1, true, 500)
}
