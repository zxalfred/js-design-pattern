// 单例模式定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点

// 1. 实现单例模式
// 用一个变量来标志当前是否已经为某个类创建过对象
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
  }
}