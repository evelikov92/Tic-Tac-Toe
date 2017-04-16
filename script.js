let model = (function () {
  this.cpuCharacter = 'O'
  this.userCharacter = 'X'
  this.freeCells = [2, 6, 8, 0, 4, 1, 3, 5, 7]
  this.userCells = []
  this.cpuCells = []
  this.winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
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
        return nextMove
      } else {
        return arr[0]
      }
    }
  }
})()

let view = (function ($) {
  return {
    init: function () {
      this.render()
    },
    render: function () {

    }
  }
})(jQuery)


(function ($) {
  let cpuCharacter = 'O'
  let userCharacter = 'X'
  let freeCells = [2, 6, 8, 0, 4, 1, 3, 5, 7]
  let userCells = []
  let cpuCells = []
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  // That function is get from
  // http://stackoverflow.com/questions/12433604/how-can-i-find-matching-values-in-two-arrays
  function arrayDiff (first, second) {
    var ret = []
    for (var i = 0; i < first.length; i++) {
      if (second.indexOf(first[i]) > -1) {
        ret.push(first[i])
      }
    }
    return ret
  }

  function checkNextCpuMove () {
    let arr = []

    for (let i = 0; i < 8; i++) {
      if (arrayDiff(winningCombinations[i], cpuCells).length === 2) {
        arr = moveToNextCell(winningCombinations[i], cpuCells)
        break
      }
    }

    if (arr.length === 0) {
      for (let i = 0; i < 8; i++) {
        if (arrayDiff(winningCombinations[i], userCells).length === 2) {
          arr = moveToNextCell(winningCombinations[i], userCells)
          break
        }
      }
    }

    if (arr.length === 0) {
      let nextMove = freeCells[0]
      freeCells.splice(0, 1)
      return nextMove
    } else {
      return arr[0]
    }
  }

  function moveToNextCell (arr, player) {
    let nextMove = arr.filter((i) => { return player.indexOf(i) < 0 })[0]
    for (let i = 0; i < freeCells.length; i++) {
      if (freeCells[i] === nextMove) {
        freeCells.splice(i, 1)
        return [nextMove]
      }
    }

    return []
  }

  function checkForWinner () {
    userCells.sort()
    cpuCells.sort()

    for (let i = 0; i < 8; i++) {
      if (arrayDiff(winningCombinations[i], cpuCells).length === 3) {
        return 'Cpu'
      } else if (arrayDiff(winningCombinations[i], userCells).length === 3) {
        return 'User'
      }
    }
  }

  $('button').on('click', function () {
    if (this.textContent === 'X') {
      cpuCharacter = 'O'
      userCharacter = 'X'
    } else {
      cpuCharacter = 'X'
      userCharacter = 'O'
    }
    $('.active-section').removeClass('active-section')
    $('#game').addClass('active-section')

    setTimeout(() => {
      $(`#${freeCells[0]}`).html(cpuCharacter)
      cpuCells.push(freeCells[0])
      freeCells.splice(0, 1)
    }, 700)
  })

  $('.tick').on('click', function () {
    if (!$(this).html()) {
      $(this).html(userCharacter)
      let id = Number(this.id)
      userCells.push(id)

      if (checkForWinner() === 'User') {
        window.alert('user win')
        window.location.reload(false)
      }

      for (let i = 0, len = freeCells.length; i < len; i++) {
        if (id === freeCells[i]) {
          freeCells.splice(i, 1)
          break
        }
      }

      setTimeout(() => {
        let id = checkNextCpuMove()
        cpuCells.push(id)
        $(`#${id}`).html(cpuCharacter)

        if (checkForWinner() === 'Cpu') {
          window.alert('cpu Win')
          window.location.reload(false)
        } else if (freeCells.length === 0) {
          window.alert('The result is Draw')
          window.location.reload(false)
        }
      }, 700)
    }

    if (freeCells.length === 0) {
      window.alert('The result is Draw')
      window.location.reload(false)
    }
  })
})(jQuery)
