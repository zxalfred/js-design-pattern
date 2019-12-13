{
  const MacroCommand = function() {
    return {
      commandsList: [],
      add(command) {
        this.commandsList.push(command)
      },
      execute() {
        for (let i = 0, command; command = this.commandsList[i++];) {
          command.execute()
        }
      },
    }
  }
  const openAcCommand = {
    execute() {
      console.log('打开空调')
    },
  }
  const openTvCommand = {
    execute() {
      console.log('打开电视')
    },
  }
  const openSoundCommand = {
    execute() {
      console.log('打开音响')
    },
  }
  const macroCommand1 = MacroCommand()
  macroCommand1.add(openTvCommand)
  macroCommand1.add(openSoundCommand)

  const closeDoorCommand = {
    execute() {
      console.log('关门')
    },
  }
  const openQQCommand = {
    execute() {
      console.log('登录 QQ')
    },
  }
  const macroCommand2 = MacroCommand()
  macroCommand2.add(closeDoorCommand)
  macroCommand2.add(openQQCommand)

  //  组合所有命令为一个超级命令
  const macroCommand = MacroCommand()
  macroCommand.add(openAcCommand)
  macroCommand.add(macroCommand1)
  macroCommand.add(macroCommand2)
}
