// 命令指的是一个执行某些特定事情的指令
// 1.命令模式的用途
// 命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道请求的操作是什么。
// 此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系

// 2.命令模式的例子——菜单程序
// 设计模式的主题是把不变的事物和变化的事物分离开来
// 按下按钮后会发生一些事情是不变的，而具体会发生什么事情是可变的
// 通过 command 对象的帮助，将来可以轻易改变这种关联，因此也可以在将来再次改变按钮的行为
{
  const html = `
    <body>
      <button id="button1>点击按钮1</button>
      <button id="button2>点击按钮2</button>
      <button id="button3>点击按钮3</button>
    </body>
  `
  const button1 = document.getElementById('button1')
  const button2 = document.getElementById('button2')
  const button3 = document.getElementById('button3')
  const setCommand = (button, command) => {
    button.onclick = () => {
      command.execute()
    }
  }
  const MenuBar = {
    refresh() {
      console.log('刷新菜单目录')
    },
  }
  const SubMenu = {
    add() {
      console.log('增加子菜单')
    },
    del() {
      console.log('删除子菜单')
    },
  }
  class RefreshMenuBarCommand {
    constructor(receiver) {
      this.receiver = receiver
    }

    execute() {
      this.receiver.refresh()
    }
  }
  class AddSubMenuCommand {
    constructor(receiver) {
      this.receiver = receiver
    }

    execute() {
      this.receiver.add()
    }
  }
  class DelSubMenuCommand {
    constructor(receiver) {
      this.receiver = receiver
    }

    execute() {
      this.receiver.del()
    }
  }
  const refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar)
  const addSubMenuCommand = new AddSubMenuCommand(SubMenu)
  const delSubMenuCommand = new DelSubMenuCommand(SubMenu)
  setCommand(button1, refreshMenuBarCommand)
  setCommand(button2, addSubMenuCommand)
  setCommand(button3, delSubMenuCommand)
}

// 3.JS 中的命令模式
// JS中即使不引入command对象和receiver也能实现相同的功能：
{
  const bindClick = (button, func) => {
    button.onclick = func
  }
  const MenuBar = {
    refresh() {
      console.log('刷新菜单界面')
    },
  }
  const SubMenu = {
    add() {
      console.log('增加子菜单')
    },
    del() {
      console.log('删除子菜单')
    },
  }
  bindClick(button1, MenuBar.refresh)
  bindClick(button2, SubMenu.add)
  bindClick(button3, SubMenu.del)
}

// 第2节中的代码是模拟传统面向对象语言的命令模式实现。命令模式将过程式的请求调用封装在command对象的execute方法里，通过封装方法调用，我们可以把运算块包装成形
// command对象可以被四处传递，所以在调用命令的时候，客户(Client)不需要关心事情是如何进行的。
// 命令模式的由来，其实是回调(callback)函数的一个面向对象的替代品
// 在面向对象设计中，命令模式的接收者被当成 command 对象的属性保存起来，同时约定执行 命令的操作调用 command.execute 方法
{
  const RefreshMenuBarCommand = (receiver) => ({
    execute() {
      receiver.refresh()
    },
  })

  const setCommand = (button, command) => {
    button.onclick = () => {
      command.execute()
    }
  }

  const refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar)
  setCommand(button1, refreshMenuBarCommand)
}
