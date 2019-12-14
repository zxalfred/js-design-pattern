// 享元模式是一种用于性能优化的模式，核心是运用共享技术来有效支持大量细粒度的对象
// 1. 初识享元模式
// 内衣厂有50种男士内衣和50种女士内衣，为了推销，需要50个男模特和50个女模特拍照，如果不使用享元模式：
{
  class Model {
    constructor(sex, underwear) {
      this.sex = sex
      this.underwear = underwear
    }

    takePhoto() {
      console.log(`sex= ${this.sex} underwear= ${this.underwear}`)
    }
  }

  for (let i = 1; i < 50; i++) {
    const maleModel = new Model('male', `underwear${i}`)
    maleModel.takePhoto()
  }

  for (let i = 1; i < 50; i++) {
    const femaleModel = new Model('female', `underwear${i}`)
    femaleModel.takePhoto()
  }
}
// 上述代码产生的对象过多，占用太多内存，男女模特只需各自一个就可以
{
  class Model {
    constructor(sex) {
      this.sex = sex
    }

    takePhoto() {
      console.log(`sex= ${this.sex} underwear= ${this.underwear}`)
    }
  }
  const maleModel = new Model('male')
  const femaleModel = new Model('female')

  for (let i = 1; i <= 50; i++) {
    maleModel.underwear = `underwear${i}`
    maleModel.takePhoto()
  }

  for (let i = 1; i <= 50; i++) {
    femaleModel.underwear = `underwear${i}`
    femaleModel.takePhoto()
  }
}

// 2. 享元模式的通用结构
// 上述代码还存在问题：
// 通过构造函数显示new出男女两个model对象，在其他系统中，也许并不是一开始就需要所有的共享对象
// 给 model 对象手动设置了 underwear 外部状态，在更复杂的系统中外部状态可能会很复杂，他们与共享对象的联系会变得困难

// 第一个问题痛殴对象工厂来解决，只有当某种共享对象被真正需要时，它才从工厂中被创建出来
// 第二个问题可以用一个管理器来记录对象相关的外部状态，使这些外部状态通过某个钩子和共享对象联系起来

// 3. 文件上传的例子
{
  class Upload {
    constructor(uploadType, fileName, fileSize) {
      this.uploadType = uploadType
      this.fileName = fileName
      this.fileSize = fileSize
      this.dom = null
    }

    delFile() {
      if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom)
      }
      if (window.confirm(`确定要删除该文件吗？${this.fileName}`)) {
        return this.dom.parentNode.removeChild(this.dom)
      }
    }

    init(id) {
      this.id = id
      this.dom = document.createElement('div')
      this.dom.innerHTML = `
        <span>文件名称：${this.fileName} 文件大小：${this.fileSize}</span>
        <button class="delFile">删除</button>
      `
      this.dom.querySelector('.delFile').onclick = function() {
        this.delFile()
      }
      document.body.appendChild(this.dom)
    }
  }

  let id = 0

  const startUpload = function(uploadType, files) {
    for (let i = 0, file; file = files[i++];) {
      const uploadObj = new Upload(uploadType, file.fileName, file.fileSize)
      uploadObj.init(id++)
    }
  }

  startUpload('plugin', [{
    fileName: '1.txt',
    fileSize: 1000,
  },
  {
    fileName: '2.html',
    fileSize: 3000,

  }, {
    fileName: '3.txt',
    fileSize: 5000,
  },
  ])
  startUpload('flash', [{
    fileName: '4.txt',
    fileSize: 1000,
  },
  { fileSize: 3000 },
  {
    fileName: '6.txt', fileSize: 5000,
  }])
}

// 3.2 享元模式重构文件上传
{
  class Upload {
    constructor(uploadType) {
      this.upload = uploadType
    }

    delFile(id) {
      uploadManager.setExternalState(id, this)

      if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom)
      }
      if (window.confirm(`确定要删除该文件吗？${this.fileName}`)) {
        return this.dom.parentNode.removeChild(this.dom)
      }
    }
  }
  const UploadFactory = (function() {
    const createdFlyWeightObjs = {}
    return {
      create(uploadType) {
        if (createdFlyWeightObjs[uploadType]) {
          return createdFlyWeightObjs[uploadType]
        }
        return createdFlyWeightObjs[uploadType] = new Upload(uploadType)
      },
    }
  }())
  const uploadManager = (function() {
    const uploadDatabase = {}

    return {
      add(id, uploadType, fileName, fileSize) {
        const flyWeightObj = UploadFactory.create(uploadType)

        const dom = document.createElement('div')
        dom.innerHTML = `
          <span>文件名称：${this.fileName} 文件大小：${this.fileSize}</span>
          <button class="delFile">删除</button>
        `

        dom.querySelector('.delFile').onclick = function() {
          flyWeightObj.delFile(id)
        }
        document.body.appendChild(dom)
        uploadDatabase[id] = {
          fileName,
          fileSize,
          dom,
        }
        return flyWeightObj
      },
      setExternalState(id, flyWeightObj) {
        const uploadData = uploadDatabase[id]
        for (const i in uploadData) {
          flyWeightObj[i] = uploadData[i]
        }
      },
    }
  }())
}
