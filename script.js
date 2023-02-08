// DOM及所需变量
const Reminder = document.querySelector(".overlay-text")
const timeRemianing = document.querySelector("#time-remaining")
const flips = document.querySelector("#flips")
const gameOverReminder = document.querySelector("#game-over-text")

let flipCount = 0
let flipedCardRecord = []

// 获取音乐
const bgMusic = new Audio("Assets/Audio/creepy.mp3")
bgMusic.volume = 0.5
bgMusic.loop = true
const flipSound = new Audio("Assets/Audio/flip.wav")
const matchSound = new Audio("Assets/Audio/match.wav")
const victorySound = new Audio("Assets/Audio/victory.wav")
const gameOverSound = new Audio("Assets/Audio/gameOver.wav")

// 页面挂载时
timeRemianing.innerText = 200
flips.innerText = `${flipCount}`

document.addEventListener("click", e => {
  if (e.target.matches(".overlay-text")) clickStart() // 1.去掉提示页面

  if (e.target.matches(".spider")) recordFlips(e) // 2.记录翻牌次数
})

function clickStart() {
  bgMusic.play()
  Reminder.classList.remove("visible")
  countDown() // 1.1 时间倒计时
}

function countDown() {
  let timeInit = 200
  timeRemianing.innerText = `${timeInit}`

  const preInterval = setInterval(gameOver, 1000)
  // 倒计时到0，提示Game Over且计时不会继续走了
  function gameOver() {
    if (timeInit <= 0) {
      if (timeInit === 0) gameOverReminder.classList.add("visible")
      if ((e = "click")) {
        bgMusic.pause()
        gameOverSound.play()
        reStart(e) // 1.2 游戏重新开始
      }

      return (timeInit = -1)
    } else {
      timeInit = timeInit - 1
      timeRemianing.innerText = `${timeInit}`
    }
  }

  // 清理上一次的定时器
  document.addEventListener("click", e => {
    if (e.target.matches(".overlay-text")) clearInterval(preInterval)
  })
}

// 1.2再次点击，重新开始游戏(重新开始倒计时,重新记flips，所有的card移除类)
function reStart(e) {
  const vitoryReminder = document.querySelector("#victory-text")

  document.addEventListener(e, event => {
    if (event.target.matches(".overlay-text")) {
      gameOverReminder.classList.remove("visible")
      vitoryReminder.classList.remove("visible")
      countDown()  //重新计时
      clearFlips()  //重置Flips
      clearVisible() //给卡牌移除visible类
    }
  })
}

// 点击 ---> Flips++ ----> 卡片翻面
// 如果页面中有匹配成功的两张卡片，则会摆动

// 2.0你每点一次卡片，那么Flips就会加1
function recordFlips(e) {
  flipCount++
  flips.innerText = `${flipCount}`
  flipCard(e) // 2.1翻牌
}

// 2.1点击卡片后，把卡片翻过来
function flipCard(e) {
  flipSound.play()
  const card = e.target.closest(".card")
  card.classList.add("visible")

  const flipedCard = card.querySelector(".card-value")
  match(flipedCard) // 2.2匹配卡片
}

function clearFlips() {
  flipCount = 0
  flips.innerText = `${flipCount}`
}

// 2.2当你翻的两张卡片不一样，那么你第二张翻的卡就会翻回去
// 用数组来记录，如果不匹配，一直删掉数组里索引号为1的元素
function match(flipedCard) {
  flipedCardRecord.push(flipedCard.src)

  const notMatch =
    flipedCardRecord.length > 1 && flipedCardRecord[0] !== flipedCardRecord[1]
  if (notMatch) matchFailed(flipedCard) //2.3匹配失败

  const match =
    flipedCardRecord.length > 1 && flipedCardRecord[0] === flipedCardRecord[1]
  if (match) matchSuccess(flipedCard) //2.4匹配成功
}

// 2.3如果不匹配，那么永远删掉数组[1]，直到匹配为止
function matchFailed(flipedCard) {
  const card2 = flipedCard.closest(".card")

  setTimeout(() => {
    card2.classList.remove("visible")
  }, 1000)
  flipedCardRecord.splice(1)
}

// 2.4如果匹配成功，有特效且清空数组
// 思路：通过遍历card列表，找到哪个跟第二个card一样src的card，给他俩分别添加matched
function matchSuccess(flipedCard) {
  matchSound.play()
  const Imgs = Array.from(document.querySelectorAll(".card-value"))

  const ImgSame = Imgs.filter(i => i.src === flipedCard.src)
  ImgSame.forEach(i => {
    const card = i.closest(".card")
    card.classList.add("matched")
  })

  allMatched() //2.5检测是否全部匹配(boolean)

  flipedCardRecord = []
}

// 2.5全部匹配时，那么就提示成功页面，并且有音乐
// 问题是，怎么表示全部匹配呢？---->检测每个card类上是否有matched
function allMatched() {
  const cards = Array.from(document.querySelectorAll(".card"))
  const vitory = document.querySelector("#victory-text")

  const successCondition = cards.every(card =>
    card.classList.contains("matched")
  )
  if (successCondition) {
    cards.forEach(card => card.classList.remove("matched"))
    setTimeout(addVisible, 500)
  }

  function addVisible() {
    bgMusic.pause()
    victorySound.play()
    vitory.classList.add("visible")
  }
  reStart("click")
}

function clearVisible() {
  const cards = Array.from(document.querySelectorAll(".card"))
  cards.forEach(card => card.classList.remove("visible"))
}
