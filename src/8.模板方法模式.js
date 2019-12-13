// 模板方法模式是一种只需要使用继承就可以实现的非常简单的模式
{
  const Beverage = function() {}
  Beverage.prototype.boilWater = function() {
    console.log('把水煮沸')
  }
  Beverage.prototype.brew = function() {
    throw new Error('子类必须重写 brew 方法') // 确保子类中实现了该抽象方法
  }
  Beverage.prototype.pourInCup = function() {
    throw new Error('子类必须重写 pourInCup 方法')
  }
  Beverage.prototype.addCondiments = function() {
    throw new Error('子类必须重写 addCondiments 方法')
  }
  Beverage.prototype.customerWantsCondiments = function() {
    return true // 默认需要调料
  }
  Beverage.prototype.init = function() {
    this.boilWater()
    this.brew()
    this.pourInCup()
    if (this.customerWantsCondiments()) { // 钩子方法
      this.addCondiments()
    }
  }

  const CoffeeWithHook = function() {}
  CoffeeWithHook.prototype = new Beverage()
  CoffeeWithHook.prototype.brew = function() {
    console.log('用沸水冲泡咖啡')
  }
  CoffeeWithHook.prototype.pourInCup = function() {
    console.log('把咖啡倒进杯子')
  }
  CoffeeWithHook.prototype.addCondiments = function() {
    console.log('加糖和牛奶')
  }
  CoffeeWithHook.prototype.customerWantsCondiments = function() {
    return window.confirm('请问需要调料吗?')
  }

  const coffeeWithHook = new CoffeeWithHook(); coffeeWithHook.init()
}
