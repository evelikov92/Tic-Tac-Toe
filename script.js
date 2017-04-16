let model = (function () {
  return {
    cpuCharacter: 'O',
    userCharacter: 'X',
    freeCells: [2, 6, 8, 0, 4, 1, 3, 5, 7],
    userCells: [],
    cpuCells: [],
    winningCombinations: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
  }
})()

let controller = (function () {
  function arrayDiff (first, second) {
    var ret = []
    for (var i = 0; i < first.length; i++) {
      if (second.indexOf(first[i]) > -1) {
        ret.push(first[i])
      }
    }
    return ret
  }

  function moveToNextCell (arr, player) {
    let nextMove = arr.filter((i) => { return player.indexOf(i) < 0 })[0]
    for (let i = 0; i < model.freeCells.length; i++) {
      if (model.freeCells[i] === nextMove) {
        model.freeCells.splice(i, 1)
        return [nextMove]
      }
    }

    return []
  }

  function getDefenseMove (playerMoves) {
    for (let i = 0; i < 8; i++) {
      if (arrayDiff(model.winningCombinations[i], playerMoves).length === 2) {
        return moveToNextCell(model.winningCombinations[i], playerMoves)
      }
    }
  }

  return {
    getCpuCharacter: () => { return model.cpuCharacter },
    getUserCharacter: () => { return model.userCharacter },
    setCpuMove: index => {
      model.cpuCells.push(model.freeCells[index])
      model.freeCells.splice(index, 1)
    },
    setUserMove: cell => {
      model.userCells.push(cell)

      for (let i = 0, len = model.freeCells.length; i < len; i++) {
        if (cell === model.freeCells[i]) {
          model.freeCells.splice(i, 1)
          return
        }
      }
    },
    getFreeCell: index => { return model.freeCells[index] },
    removeFreeCell: index => { model.freeCells.splice(index, 1) },
    checkForWinner: () => {
      model.userCells.sort()
      model.cpuCells.sort()
      for (let i = 0; i < 8; i++) {
        if (arrayDiff(model.winningCombinations[i], model.cpuCells).length === 3) {
          return 'Cpu'
        } else if (arrayDiff(model.winningCombinations[i], model.userCells).length === 3) {
          return 'User'
        }
      }

      if (model.freeCells.length === 0) {
        return 'Draw'
      }
    },
    checkForNextCpuMove: () => {
      let arr = []

      arr = getDefenseMove(model.cpuCells)
      if (arr.length === 0) {
        arr = getDefenseMove(model.userCells)
      }

      if (arr.length === 0) {
        let nextMove = model.freeCells[0]
        model.freeCells.splice(0, 1)
        model.cpuCells.push(nextMove)
        return nextMove
      } else {
        model.cpuCells.push(arr[0])
        return arr[0]
      }
    }
  }
}())

let view = (function () {
  const cells = document.getElementsByClassName('tick')

  function render () {
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].addEventListener('click', function () {
        if (this.innerHTML === '') {
          this.innerHTML = controller.getUserCharacter()
          let id = Number(this.id)
          controller.setUserMove(id)

          if (controller.checkForWinner() === 'User') {
            window.alert('user win')
            window.location.reload(false)
          }

          setTimeout(() => {
            let id = controller.checkNextCpuMove()
            document.getElementById(id).innerHTML = controller.getCpuCharacter()

            if (controller.checkForWinner() === 'Cpu') {
              window.alert('cpu Win')
              window.location.reload(false)
            } else if (controller.checkForWinner() === 'Draw') {
              window.alert('The result is Draw')
              window.location.reload(false)
            }
          }, 700)

          if (controller.checkForWinner() === 'Draw') {
            window.alert('The result is Draw')
            window.location.reload(false)
          }
        } else {

        }
      })
    }
  }

  return {
    init: () => {
      setTimeout(() => {
        document.getElementById(controller.getFreeCell(0)).innerHTML = controller.getCpuCharacter()
        controller.setCpuMove(0)
      }, 500)
      render()
    }
  }
})()

view.init()
