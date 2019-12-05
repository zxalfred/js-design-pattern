// 迭代器模式：提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
// 1.jQuery中的迭代器
$.each([1, 2, 3], (i, n) => {
  console.log(`当前下标为：${i}`)
  console.log(`当前值为：${n}`)
})

// 2.实现自己的迭代器

const each = (ary, callback) => {
  const l = ary.length
  for (let i = 0; i < l; i++) {
    callback(ary[i], i, ary[i])
  }
}

each([1, 2, 3], (i, n) => {
  console.log([i, n])
})

// 3.内部迭代器和外部迭代器
// 3.1 内部迭代器
// 迭代函数的内部已经定义好了迭代规则，它完全接手整个迭代过程，外部只需要一次初始调用
{
  const compare = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      throw new Error('arr1和arr2不相等')
    }
    each(arr1, (i, n) => {
      if (n !== arr2[i]) {
        throw new Error('arr1和arr2不相等')
      }
    })
    console.log('arr1和arr2相等')
  }
}

// 3.2 外部迭代器
// 外部迭代器必须显式地请求迭代下一个元素
// 增加了一些调用的复杂度，但相对也增强了迭代器的灵活性，可以手动控制迭代过程或顺序
{
  const Iterator = function(obj) {
    let current = 0

    const next = function() {
      current += 1
    }

    const isDone = function() {
      return current >= obj.length
    }

    const getCurrItem = function() {
      return obj[current]
    }

    return {
      next,
      isDone,
      getCurrItem,
    }
  }

  const compare = function(iterator1, iterator2) {
    while (!iterator1.isDone() || !iterator2.isDone()) {
      if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
        throw new Error('arr1和arr2不相等')
      }
      iterator1.next()
      iterator2.next()
    }
    console.log('arr1和arr2相等')
  }

  const iterator1 = Iterator([1, 2, 3])
  const iterator2 = Iterator([1, 2, 3, 4])

  compare(iterator1, iterator2)
}

// 4.迭代器模式应用
// 在不同浏览器环境选择不同的上传方式
{
  const getActiveUploadObj = function() {
    try {
      return new ActiveXObject('TXFTNActiveX.FTNUpload')
    } catch (e) {
      return false
    }
  }

  const getFlashUploadObj = function() {
    if (supportFlash()) { // 此函数未提供
      const str = '<object type="application/x-shockwave-flash></object>'
      return document.body.appendChild(str)
    }
    return false
  }

  const getFormUploadObj = function() {
    const str = '<input name="file" type="file" />'
    return document.body.appendChild(str)
  }

  const iteratorObj = function(...args) {
    const l = args.length
    for (let i = 0; i < l; i++) {
      const uploadObj = args[i]()
      if (uploadObj !== false) {
        return uploadObj
      }
    }
  }

  const uploadObj = iteratorObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj)
}
