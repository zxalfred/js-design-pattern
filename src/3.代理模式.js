// 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问
// 1. 小明给女神A送花
// 如果不用代理模式
{
  const Flower = function() {}

  const xiaoming = {
    sendFlower(target) {
      const flower = new Flower()
      target.receiveFlower(flower)
    },
  }

  const A = {
    receiveFlower(flower) {
      console.log(`收到花${flower}`)
    },
  }

  xiaoming.sendFlower(A)
}

// 接下来我们引入代理B
{
  const Flower = function() {}

  const xiaoming = {
    sendFlower(target) {
      const flower = new Flower()
      target.receiveFlower(flower)
    },
  }

  const A = {
    receiveFlower(flower) {
      console.log(`收到花${flower}`)
    },
  }

  const B = {
    receiveFlower(flower) {
      A.receiveFlower(flower)
    },
  }

  xiaoming.sendFlower(B)
}
// 这样看起来没什么区别
// 但是B会监听A的心情，只有当她心情好时，才会把花转交
{
  const Flower = function() {}

  const xiaoming = {
    sendFlower(target) {
      const flower = new Flower()
      target.receiveFlower(flower)
    },
  }

  const A = {
    receiveFlower(flower) {
      console.log(`收到花${flower}`)
    },
    listenGoodMood(fn) {
      setTimeout(() => { fn() }, 10000)
    },
  }

  const B = {
    receiveFlower(flower) {
      A.listenGoodMood(() => {
        A.receiveFlower(flower)
      })
    },
  }

  xiaoming.sendFlower(B)
}

// 2.保护代理和虚拟代理
// 代理B可以帮A过滤掉一些请求，控制了A的访问
// 另外， new Flower可能是代价高昂的操作，那么就可以交给代理B去执行，B在A心情好时，执行new Flower，这就是虚拟代理，把一些开销很大的对象，延迟到真正需要的时候创建
{
  const B = {
    receiveFlower(flower) {
      A.listenGoodMood(() => {
        const flower = new Flower()
        A.receiveFlower(flower)
      })
    },
  }
}
// 保护代理用于控制不同权限对象对目标对象的访问，但在JS中并不容易实现保护代理，因为我们无法判断谁访问了某个对象。而虚拟代理是最常用的一种代理模式，下面主要讨论的也是虚拟代理

// 3.虚拟代理实现图片预加载
// 先用一张loading图片占位，然后异步加载图片，等图片好了再填充到img节点里
{
  const myImage = (function() {
    const imgNode = document.createElement('img')
    document.body.appendChild(imgNode)

    return {
      setSrc(src) {
        imgNode.src = src
      },
    }
  }())

  const proxyImage = (function() {
    const img = new Image()
    img.onload = function() {
      myImage.setSrc(this.src)
    }
    return {
      setSrc(src) {
        myImage.setSrc('./loading.gif')
        img.src = src
      },
    }
  }())

  proxyImage.setSrc('./target.jpg')
}

// 4. 虚拟代理合并http请求
{
  const html = `
    <body>
      <input type="checkbox" id="1"></input>1
      <input type="checkbox" id="2"></input>2
      <input type="checkbox" id="3"></input>3
      <input type="checkbox" id="4"></input>4
      <input type="checkbox" id="5"></input>5
      <input type="checkbox" id="6"></input>6
      <input type="checkbox" id="7"></input>7
      <input type="checkbox" id="8"></input>8
      <input type="checkbox" id="9"></input>9
    </body>
  `
  const synchronousFile = function(id) {
    console.log(`开始同步文件，ID为：${id}`)
  }

  const proxySynchronousFile = (function() {
    const cache = [] // 保存一段时间需要同步的ID
    let timer // 定时器

    return function(id) {
      caches.push(id)
      if (timer) {
        return
      }
      timer = setTimeout(() => {
        synchronousFile(cache.join(','))
        clearTimeout(timer)
        timer = null
        cache.length = 0
      }, 2000)
    }
  }())

  const checkbox = document.getElementsByTagName('input')
  for (let i = 0, c; c = checkbox[i++];) {
    c.onclick = () => {
      if (this.checked) {
        proxySynchronousFile(this.id)
      }
    }
  }
}

// 5.缓存代理
{
  const mult = (...args) => {
    console.log('开始计算乘积')
    let a = 1
    const l = args.length
    for (let i = 0; i < l; i++) {
      a *= args[i]
    }
    return a
  }

  const proxyMult = (function() {
    const cache = {}
    return function(...args) {
      const argStr = args.join(',')
      if (argStr in cache) {
        return cache[args]
      }
      return cache[args] = mult.apply(this, args)
    }
  }())
}
