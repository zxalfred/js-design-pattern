// 策略模式定义：定义一系列算法，把它们一个个封装起来，并且使它们可以相互替换

// 1.使用策略模式计算奖金
// 1.1 最初代码实现
{
  const calculateBonus = function(performanceLevel, salary) {
    if (performanceLevel === 'S') {
      return salary * 4
    }
    if (performanceLevel === 'A') {
      return salary * 3
    }
    if (performanceLevel === 'B') {
      return salary * 2
    }
    return 0
  }
}
// 存在的缺点：
// * 函数体庞大，包含很多if-else语句来覆盖所有的逻辑分支
// * 函数缺乏弹性，如果增加一种新的绩效等级C，或者想更改绩效等级S的洗漱，只能修改函数内部实现，违反了开放-封闭原则
// * 算法的复用性差，如果其他地方需要重用奖金算法，只能复制粘贴

// 1.2 使用组合函数重构代码
// 最容易想到的是，把算法封装到小函数里，可以一目了然知道对应哪种算法
{
  const performanceS = function(salary) {
    return salary * 4
  }

  const performanceA = function(salary) {
    return salary * 3
  }

  const performanceB = function(salary) {
    return salary * 2
  }

  const calculateBonus = function(performanceLevel, salary) {
    if (performanceLevel === 'S') {
      return performanceS(salary)
    }

    if (performanceLevel === 'A') {
      return performanceA(salary)
    }

    if (performanceLevel === 'B') {
      return performanceB(salary)
    }
    return 0
  }
}
// 有所改善但很有限，没有解决根本问题：
// 函数可能越来越大，在系统变化时缺乏弹性

// 1.3 使用策略模式重构
// 包含两部分
// * 策略类：封装了具体的算法，负责具体的计算过程
// * 环境类Context: 接收客户的请求，随后把请求委托给策略类。要做到这点，说明Context中要维持对某个策略对象的引用
{
  const PerformanceS = function() {}
  PerformanceS.prototype.calculate = function(salary) {
    return salary * 4
  }

  const PerformanceA = function() {}
  PerformanceA.prototype.calculate = function(salary) {
    return salary * 3
  }

  const PerformanceB = function() {}
  PerformanceB.prototype.calculate = function(salary) {
    return salary * 2
  }

  const Bonus = function() {
    this.salary = null
    this.strategy = null
  }

  Bonus.prototype.setSalary = function(salary) {
    this.salary = salary
  }

  Bonus.prototype.setStrategy = function(strategy) {
    this.strategy = strategy
  }

  Bonus.prototype.getBonus = function() {
    return this.strategy.calculate(this.salary)
  }

  const bonus = new Bonus()

  bonus.setSalary(10000)
  bonus.setStrategy(new PerformanceS())

  console.log(bonus.getBonus())

  bonus.setStrategy(new PerformanceA())
  console.log(bonus.getBonus())
}

// 上面的代码是基于对传统面向对象语言的模仿，strategy对象从各个策略类中创建而来，下面直接采用JavaScript实现的策略模式

// 2. JavaScript 版本的策略模式
// 在JS中，函数也是对象，更简单和直接的做法是把strategy直接定义为函数
{
  const strategies = {
    S(salary) {
      return salary * 4
    },
    A(salary) {
      return salary * 3
    },
    B(salary) {
      return salary * 2
    },
  }

  const calculateBonus = function(level, salary) {
    return strategies[level](salary)
  }
}

// 3. 多态在策略模式中的体现
// 通过策略模式，可以消除原程序中大片的条件分支语句。所有与计算奖金相关的逻辑都不再Context中，而是分布在各个策略对象中。
// 这正是对象多态性的体现，也是“它们可以相互替换”的目的。
// 替换Context中当前保存的策略对象，便能执行不同的算法来得到想要的结果

// 4. 表单校验
// 假设又一个用户注册的页面，提交表单前，有几条校验规则
// 4.1 第一个版本
{
  const registerForm = document.getElementById('registerForm')

  registerForm.onsubmit = () => {
    if (registerForm.userName.value === '') {
      console.log('用户名不能为空')
      return false
    }
    if (registerForm.password.value.length < 6) {
      console.log('密码长度不能少于 6 位')
      return false
    }
    if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
      console.log('手机号码格式不正确'); return false
    }
  }
}
// 缺点是包含大量if-else语句，巍峨饭开放-封闭原则，可复用性差

// 4.2 策略模式重构
{
  const strategies = {
    isNonEmpty(value, errorMsg) {
      if (value === '') {
        return errorMsg
      }
    },
    minLength(value, length, errorMsg) {
      if (value.length < length) {
        return errorMsg
      }
    },
    isMobile(value, errorMsg) {
      if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
        return errorMsg
      }
    },
  }

  const Validator = function() {
    this.cache = [] // 保存校验规则
  }

  Validator.prototype.add = (dom, rule, errorMsg) => {
    const ary = rule.split(':')
    this.cache.push(() => {
      const strategy = ary.shift()
      ary.unshift(dom.value)
      ary.push(errorMsg)
      return strategies[strategy].apply(dom, ary)
    })
  }

  Validator.prototype.start = () => {
    for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
      const msg = validatorFunc()
      if (msg) {
        return msg
      }
    }
  }

  const registerForm = document.getElementById('registerForm')

  const validateFunc = () => {
    const validator = new Validator()

    validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空')
    validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6位')
    validator.add(registerForm.phoneNumber, 'isMobile', '手机号膜格式不正确')

    return validator.start()
  }

  registerForm.onsubmit = () => {
    const errorMsg = validateFunc()
    if (errorMsg) {
      console.log(errorMsg)
      return false
    }
  }
}
