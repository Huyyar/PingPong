/* ========================================================
   PING PONG - GAME IMPLEMENTATION (MAIN.JS)
   ======================================================== */

// 1. CÁC PHẦN TỬ GIAO DIỆN CHÍNH
const gameArea = document.getElementById("game-area");
const gameField = document.getElementById("game-field");
const paddle = document.getElementById("paddle");
const ballElement = document.getElementById("ball");

// HUD & Sidebar
const hudScore = document.getElementById("hud-score");
const hudLives = document.getElementById("hud-lives");
const hudBossRow = document.getElementById("hud-boss-row");
const hudBossVal = document.getElementById("hud-boss-val");
const hudEffectsList = document.getElementById("hud-effects-list");
const levelSelect = document.getElementById("level-select");

// Modals
const modalPause = document.getElementById("modal-pause");
const modalGameOver = document.getElementById("modal-gameover");
const gameoverTitle = document.getElementById("gameover-title");
const gameoverSubtitle = document.getElementById("gameover-subtitle");
const gameoverScore = document.getElementById("gameover-score");

// btn
const btnPause = document.getElementById("btn-pause");
const btnResume = document.getElementById("btn-resume");
const btnReset = document.getElementById("btn-reset");
const btnPauseRestart = document.getElementById("btn-pause-restart");
const btnReplay = document.getElementById("btn-replay");
const btnNextLevel = document.getElementById("btn-next-level");
const btnSoundToggle = document.getElementById("btn-sound-toggle");
const btnOpenGuide = document.getElementById("btn-open-guide");

//
const gameWidth = gameArea.clientWidth || 960;
const gameHeight = gameArea.clientHeight || 620;

// paddle value
const paddleWidth = 100;
const paddleHeight = 14;
const paddleBottomOffset = 30; // Trùng khớp với CSS bottom: 30px
const paddleY = gameHeight - paddleBottomOffset - paddleHeight;
const paddleSpeed = 8;
let paddleX = (gameWidth - paddleWidth) / 2;

// ball value
const ballSize = 12;
const baseBallSpeed = 5;

// move
let moveLeft = false;
let moveRight = false;
let isLaunched = false;
let isPaused = false;
let isGameOver = false;

// Trạng thái hiệu ứng
let isFrozen = false;
let freezeTimer = null;

// status
let currentLevel = 1;
let score = 0;
let lives = 3;
let soundEnabled = true;

// entity
let balls = [];
let activeBricks = [];
let fallItems = [];
let monsters = [];
let monsterBullets = [];
let boss = null;

// ========================================================
// 2. CẤU HÌNH BỐ CỤC LEVEL
// ========================================================

const BRICK_TYPES = {
  EMPTY: 0,
  NORMAL: 1,
  UNBREAKABLE: 2, // Gạch không thể phá (Level 2)
  MULTI_HIT: 3,   // Gạch nhiều hit (Level 3, HP từ 2-5)
  MOVING: 5       // Gạch di chuyển (Level 5)
};

const LEVEL_CONFIGS = {
  1: {
    name: "Màn 1: Căn bản",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 60,

    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  2: {
    name: "Màn 2: Gạch không thể phá",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 60,

    grid: [
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
      [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ]
  },
  3: {
    name: "Màn 3: Gạch nhiều hit",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 60,

    // Cấu trúc tương tự Màn 2, kết hợp xen kẽ giữa gạch 1-hit (1) và gạch nhiều hit (3)
    grid: [
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2],
      [2, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2],
      [2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2],
      [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
      [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2],
      [2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2],
      [2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2],
      [2, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 0, 0, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2],
      [2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2],
      [2, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 0, 0, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2],
      [2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 0, 0, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 2],
      [2, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 0, 0, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 2],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ]
  },
  4: {
    name: "Màn 4: Đảo ngược điều khiển",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 60,

    // Bản đồ kết hợp 0, 1, 2, 3: Pháo đài lõi, mê cung khe hở và các cột phản xạ
    grid: [
  [1,3,1,3,3,1,3,1,1,3,1,3,0,1,3,1,3,3,1,3,1,1,3,1,3,1],
  [3,1,3,1,3,1,1,3,1,3,3,1,0,3,1,3,1,3,1,1,3,1,3,1,3,1],
  [1,3,3,1,1,3,1,3,3,1,3,1,0,3,1,3,1,1,3,1,3,3,1,3,1,3],
  [3,1,1,3,1,3,3,1,3,1,1,3,0,1,3,1,3,1,1,3,1,3,1,1,3,1],
  [1,3,1,3,3,1,3,1,1,3,1,3,0,1,1,3,1,3,1,3,3,1,3,1,1,3],
  [3,1,3,1,1,3,1,3,3,1,3,1,0,3,1,3,1,3,1,1,3,1,3,3,1,3],
  [1,3,1,3,1,3,1,3,1,3,1,3,0,3,1,3,1,3,1,3,1,3,1,3,1,3],
  [3,1,3,1,3,1,3,1,3,1,3,1,0,1,3,1,3,1,3,1,3,1,3,1,3,1],
  [1,1,3,3,1,3,1,1,3,1,3,3,0,3,1,3,1,1,3,1,3,1,3,3,1,3],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,3,1,3,1,3,1,3,3,1,3,1,0,1,1,3,1,3,1,3,1,3,1,3,1,3],
  [3,1,3,1,3,1,3,1,1,3,1,3,0,3,3,1,3,1,3,1,3,1,3,1,3,1],
  [1,3,1,3,1,3,1,3,1,3,1,3,0,1,3,1,3,1,3,1,3,1,3,1,3,1],
  [3,1,3,1,3,1,3,1,3,1,3,1,0,3,1,3,1,3,1,3,1,3,1,3,1,3],
  [1,3,1,3,3,1,3,1,3,1,3,1,0,3,1,3,1,3,3,1,3,1,3,1,3,1],
  [3,1,3,1,3,1,3,1,3,1,3,1,0,1,3,1,3,1,3,1,3,1,3,1,3,3],
  [1,3,1,3,1,3,1,3,1,3,3,1,0,1,3,1,3,1,3,1,3,1,3,1,3,1],
  [3,1,3,1,3,1,3,1,3,1,3,3,0,3,1,3,1,3,1,3,1,3,1,3,1,3],
  [1,3,1,3,1,3,3,1,3,1,3,1,0,3,3,1,3,1,3,1,3,3,1,3,1,3],
  [2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2]
]
  },
  5: {
    name: "Màn 5: Gạch di chuyển",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 60,

    // Bản đồ kết hợp gạch di chuyển (5) và gạch không thể phá (2)
    // Mỗi dòng di chuyển chỉ gồm 4 viên gạch ít ỏi để không bị rối mắt và đủ không gian lướt qua lại
    grid: [
      [2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
      [2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 2],
      [2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2],
      [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
      [2, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 2],
      [2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2],
      [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2],
      [2, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2]
    ]
  },
  6: {
    name: "Màn 6: Đánh quái",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 95,
    isMonsterLevel: true,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  },
  7: {
    name: "Màn 7: Trùm cuối",
    brickWidth: 35,
    brickHeight: 12,
    gap: 3,
    spaceToTop: 220, // Cách xa boss và quái
    isBossLevel: true,
    grid: [
      [3, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 1, 1, 3, 3, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
  }
};

// ========================================================
// 2.1. CÁC HÀM XỬ LÝ MÀN 6 & MÀN 7 (QUÁI & BOSS)
// ========================================================

function clearMonstersAndBullets() {
  monsters.forEach(m => {
    if (m.element && m.element.parentNode) {
      m.element.parentNode.removeChild(m.element);
    }
  });
  monsters = [];

  monsterBullets.forEach(b => {
    if (b.element && b.element.parentNode) {
      b.element.parentNode.removeChild(b.element);
    }
  });
  monsterBullets = [];

  if (boss) {
    if (boss.element && boss.element.parentNode) {
      boss.element.parentNode.removeChild(boss.element);
    }
    boss = null;
  }
}

function initMonsters() {
  const currentAreaWidth = gameArea.clientWidth || 1000;
  const monsterCount = 5;
  const monsterSize = 42;
  const monsterY = 35; // Nằm phía trên 5 hàng gạch
  const speeds = [2, -2, 2.2, -2.2, 2];
  const spacing = (currentAreaWidth - monsterCount * monsterSize) / (monsterCount + 1);

  for (let i = 0; i < monsterCount; i++) {
    const initialX = spacing + i * (monsterSize + spacing);

    const monsterEl = document.createElement("div");
    monsterEl.className = "monster";
    monsterEl.style.left = initialX + "px";
    monsterEl.style.top = monsterY + "px";

    const nameEl = document.createElement("div");
    nameEl.textContent = "Quái";

    const hpEl = document.createElement("div");
    hpEl.textContent = "10";
    hpEl.style.fontSize = "10px";

    monsterEl.appendChild(nameEl);
    monsterEl.appendChild(hpEl);
    gameField.appendChild(monsterEl);

    monsters.push({
      x: initialX,
      y: monsterY,
      width: monsterSize,
      height: monsterSize,
      hp: 10,
      maxHp: 10,
      vx: speeds[i % speeds.length],
      element: monsterEl,
      hpEl: hpEl,
      shootCooldown: Math.floor(Math.random() * 80) + 60,
      minX: 10,
      maxX: currentAreaWidth - 10 - monsterSize
    });
  }
}

function initBoss() {
  const currentAreaWidth = gameArea.clientWidth || 1000;
  const bossWidth = 140;
  const bossHeight = 44;
  const initialX = (currentAreaWidth - bossWidth) / 2;
  const initialY = 35;

  const bossEl = document.createElement("div");
  bossEl.className = "boss-entity";
  bossEl.style.left = initialX + "px";
  bossEl.style.top = initialY + "px";

  const nameEl = document.createElement("div");
  nameEl.className = "boss-name";
  nameEl.textContent = "BOSS";

  const hpEl = document.createElement("div");
  hpEl.className = "boss-hp";
  hpEl.textContent = "100 / 100";

  bossEl.appendChild(nameEl);
  bossEl.appendChild(hpEl);
  gameField.appendChild(bossEl);

  boss = {
    x: initialX,
    y: initialY,
    width: bossWidth,
    height: bossHeight,
    hp: 100,
    maxHp: 100,
    vx: 2.2,
    element: bossEl,
    hpEl: hpEl,
    shootCooldown: 90,
    minX: 10,
    maxX: currentAreaWidth - 10 - bossWidth,
    phase2Triggered: false
  };

  if (hudBossRow) hudBossRow.style.display = "flex";
  if (hudBossVal) hudBossVal.textContent = "100 / 100";
}

function triggerBossPhase2() {
  if (!boss || boss.phase2Triggered) return;
  boss.phase2Triggered = true;

  const currentAreaWidth = gameArea.clientWidth || 1000;
  const monsterCount = 3;
  const monsterSize = 42;
  const monsterY = 100; // Bên dưới con boss
  const speeds = [2, -2.2, 2.2];
  const spacing = (currentAreaWidth - monsterCount * monsterSize) / (monsterCount + 1);

  for (let i = 0; i < monsterCount; i++) {
    const initialX = spacing + i * (monsterSize + spacing);

    const monsterEl = document.createElement("div");
    monsterEl.className = "monster";
    monsterEl.style.left = initialX + "px";
    monsterEl.style.top = monsterY + "px";

    const nameEl = document.createElement("div");
    nameEl.textContent = "Quái";

    const hpEl = document.createElement("div");
    hpEl.textContent = "10";
    hpEl.style.fontSize = "10px";

    monsterEl.appendChild(nameEl);
    monsterEl.appendChild(hpEl);
    gameField.appendChild(monsterEl);

    monsters.push({
      x: initialX,
      y: monsterY,
      width: monsterSize,
      height: monsterSize,
      hp: 10,
      maxHp: 10,
      vx: speeds[i % speeds.length],
      element: monsterEl,
      hpEl: hpEl,
      shootCooldown: Math.floor(Math.random() * 60) + 40,
      minX: 10,
      maxX: currentAreaWidth - 10 - monsterSize
    });
  }
}

function spawnBullet(x, y, vx = 0, vy = 3.5, type = "monster") {
  const bulletEl = document.createElement("div");
  // Đạn của quái màu tím (.monster-bullet), đạn của Boss màu đỏ (.boss-bullet)
  bulletEl.className = (type === "boss") ? "boss-bullet" : "monster-bullet";
  bulletEl.style.left = x + "px";
  bulletEl.style.top = y + "px";
  gameArea.appendChild(bulletEl);

  monsterBullets.push({
    x: x,
    y: y,
    vx: vx,
    vy: vy,
    width: 6,
    height: 14,
    type: type,
    element: bulletEl
  });
}

function spawnMonsterBullet(x, y, vx = 0, vy = 3.5) {
  spawnBullet(x, y, vx, vy, "monster");
}

function spawnBossBullet(x, y, vx = 0, vy = 3.5) {
  spawnBullet(x, y, vx, vy, "boss");
}

function updateMonstersAndBullets() {
  if (currentLevel !== 6 && currentLevel !== 7) return;

  const currentAreaWidth = gameArea.clientWidth || 1000;

  // 1. Quái di chuyển qua lại & bắn đạn
  for (let i = 0; i < monsters.length; i++) {
    const m = monsters[i];
    m.x += m.vx;
    m.maxX = currentAreaWidth - 10 - m.width;

    if (m.x <= m.minX) {
      m.x = m.minX;
      m.vx = Math.abs(m.vx);
    } else if (m.x >= m.maxX) {
      m.x = m.maxX;
      m.vx = -Math.abs(m.vx);
    }
    m.element.style.left = m.x + "px";

    // Quái bắn đạn đỏ định kỳ khi bóng đã được phóng
    if (isLaunched && !isPaused && !isGameOver) {
      m.shootCooldown--;
      if (m.shootCooldown <= 0) {
        spawnMonsterBullet(m.x + m.width / 2 - 3, m.y + m.height, 0, 3.5);
        m.shootCooldown = Math.floor(Math.random() * 120) + 110;
      }
    }
  }

  // 2. Cập nhật đạn đỏ (của cả Quái và Boss)
  for (let i = monsterBullets.length - 1; i >= 0; i--) {
    const bullet = monsterBullets[i];
    bullet.x += (bullet.vx || 0);
    bullet.y += bullet.vy;
    bullet.element.style.left = bullet.x + "px";
    bullet.element.style.top = bullet.y + "px";

    // Va chạm với thanh đỡ (paddle) -> trừ 1 life
    if (
      bullet.y + bullet.height >= paddleY &&
      bullet.y <= paddleY + paddleHeight &&
      bullet.x + bullet.width >= paddleX &&
      bullet.x <= paddleX + paddleWidth
    ) {
      if (bullet.element.parentNode) {
        bullet.element.parentNode.removeChild(bullet.element);
      }
      monsterBullets.splice(i, 1);

      paddle.classList.add("paddle-hit");
      setTimeout(() => paddle.classList.remove("paddle-hit"), 200);

      lives--;
      if (hudLives) hudLives.textContent = `${lives} / 3`;

      if (lives <= 0) {
        handleGameOver();
      }
      continue;
    }

    // Đạn bay ra ngoài mép sân
    if (bullet.y > gameHeight || bullet.x < -30 || bullet.x > currentAreaWidth + 30) {
      if (bullet.element.parentNode) {
        bullet.element.parentNode.removeChild(bullet.element);
      }
      monsterBullets.splice(i, 1);
    }
  }
}

function updateBoss() {
  if (currentLevel !== 7 || !boss) return;

  const currentAreaWidth = gameArea.clientWidth || 1000;
  boss.x += boss.vx;
  boss.maxX = currentAreaWidth - 10 - boss.width;

  if (boss.x <= boss.minX) {
    boss.x = boss.minX;
    boss.vx = Math.abs(boss.vx);
  } else if (boss.x >= boss.maxX) {
    boss.x = boss.maxX;
    boss.vx = -Math.abs(boss.vx);
  }
  boss.element.style.left = boss.x + "px";

  // Boss bắn đạn theo chu kỳ khi bóng đã được phóng
  if (isLaunched && !isPaused && !isGameOver) {
    boss.shootCooldown--;
    if (boss.shootCooldown <= 0) {
      if (boss.hp >= 50) {
        // Mỗi lần bắn 3 tia
        spawnBossBullet(boss.x + 20, boss.y + boss.height, -1.2, 3.5);
        spawnBossBullet(boss.x + boss.width / 2 - 3, boss.y + boss.height, 0, 3.5);
        spawnBossBullet(boss.x + boss.width - 20, boss.y + boss.height, 1.2, 3.5);
        boss.shootCooldown = 110;
      } else {
        // Dưới 50 máu bắn 5 tia
        spawnBossBullet(boss.x + 10, boss.y + boss.height, -2.0, 3.5);
        spawnBossBullet(boss.x + 35, boss.y + boss.height, -1.0, 3.5);
        spawnBossBullet(boss.x + boss.width / 2 - 3, boss.y + boss.height, 0, 3.5);
        spawnBossBullet(boss.x + boss.width - 35, boss.y + boss.height, 1.0, 3.5);
        spawnBossBullet(boss.x + boss.width - 10, boss.y + boss.height, 2.0, 3.5);
        boss.shootCooldown = 90;
      }
    }
  }
}

function checkBallMonsterCollision(ball) {
  if ((currentLevel !== 6 && currentLevel !== 7) || monsters.length === 0) return;

  for (let i = monsters.length - 1; i >= 0; i--) {
    const m = monsters[i];

    // Va chạm hình hộp (AABB) giữa bóng và quái
    if (
      ball.x + ballSize >= m.x &&
      ball.x <= m.x + m.width &&
      ball.y + ballSize >= m.y &&
      ball.y <= m.y + m.height
    ) {
      const overlapLeft = (ball.x + ballSize) - m.x;
      const overlapRight = (m.x + m.width) - ball.x;
      const overlapTop = (ball.y + ballSize) - m.y;
      const overlapBottom = (m.y + m.height) - ball.y;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      if (minOverlapX < minOverlapY) {
        if (overlapLeft < overlapRight) {
          ball.x = m.x - ballSize;
          ball.dx = -Math.abs(ball.dx);
        } else {
          ball.x = m.x + m.width;
          ball.dx = Math.abs(ball.dx);
        }
      } else {
        if (overlapTop < overlapBottom) {
          ball.y = m.y - ballSize;
          ball.dy = -Math.abs(ball.dy);
        } else {
          ball.y = m.y + m.height;
          ball.dy = Math.abs(ball.dy);
        }
      }

      ball.element.style.left = ball.x + "px";
      ball.element.style.top = ball.y + "px";

      // Trừ 1 máu của quái
      m.hp--;
      score += 15;
      if (hudScore) hudScore.textContent = score;

      m.element.classList.add("hit");
      setTimeout(() => {
        if (m.element) m.element.classList.remove("hit");
      }, 80);

      if (m.hp > 0) {
        m.hpEl.textContent = m.hp;
      } else {
        // Quái hết máu -> xóa quái
        if (m.element && m.element.parentNode) {
          m.element.parentNode.removeChild(m.element);
        }
        score += 100;
        if (hudScore) hudScore.textContent = score;
        dropItem(m.x + m.width / 2 - 12, m.y + m.height / 2 - 7);
        monsters.splice(i, 1);

        // Ở Màn 6: Tiêu diệt hết 5 quái -> Thắng màn 6
        if (currentLevel === 6 && monsters.length === 0) {
          handleWin();
        }
      }
      break;
    }
  }
}

function checkBallBossCollision(ball) {
  if (currentLevel !== 7 || !boss) return;

  if (
    ball.x + ballSize >= boss.x &&
    ball.x <= boss.x + boss.width &&
    ball.y + ballSize >= boss.y &&
    ball.y <= boss.y + boss.height
  ) {
    const overlapLeft = (ball.x + ballSize) - boss.x;
    const overlapRight = (boss.x + boss.width) - ball.x;
    const overlapTop = (ball.y + ballSize) - boss.y;
    const overlapBottom = (boss.y + boss.height) - ball.y;

    const minOverlapX = Math.min(overlapLeft, overlapRight);
    const minOverlapY = Math.min(overlapTop, overlapBottom);

    if (minOverlapX < minOverlapY) {
      if (overlapLeft < overlapRight) {
        ball.x = boss.x - ballSize;
        ball.dx = -Math.abs(ball.dx);
      } else {
        ball.x = boss.x + boss.width;
        ball.dx = Math.abs(ball.dx);
      }
    } else {
      if (overlapTop < overlapBottom) {
        ball.y = boss.y - ballSize;
        ball.dy = -Math.abs(ball.dy);
      } else {
        ball.y = boss.y + boss.height;
        ball.dy = Math.abs(ball.dy);
      }
    }

    ball.element.style.left = ball.x + "px";
    ball.element.style.top = ball.y + "px";

    boss.hp--;
    score += 20;
    if (hudScore) hudScore.textContent = score;

    boss.element.classList.add("hit");
    setTimeout(() => {
      if (boss && boss.element) boss.element.classList.remove("hit");
    }, 80);

    if (boss.hp > 0) {
      boss.hpEl.textContent = `${boss.hp} / 100`;
      if (hudBossVal) hudBossVal.textContent = `${boss.hp} / 100`;

      // Dưới 50 máu: sinh thêm 3 con quái bên dưới
      if (boss.hp < 50 && !boss.phase2Triggered) {
        triggerBossPhase2();
      }
    } else {
      // Boss chết -> Hoàn thành trò chơi!
      if (boss.element && boss.element.parentNode) {
        boss.element.parentNode.removeChild(boss.element);
      }
      boss = null;
      score += 500;
      if (hudScore) hudScore.textContent = score;
      if (hudBossVal) hudBossVal.textContent = "0 / 100";
      handleWin();
    }
  }
}

// ========================================================
// 3. KHỞI TẠO VÀ TẢI MÀN CHƠI (LOAD LEVEL)
// ========================================================

function loadLevel(levelNum) {
  currentLevel = levelNum;
  if (levelSelect) levelSelect.value = levelNum;

  // delete old
  gameField.innerHTML = "";
  clearBalls();
  clearAllItems();
  clearMonstersAndBullets();

  activeBricks = [];
  fallItems = [];

  const config = LEVEL_CONFIGS[levelNum];
  if (!config) return;

  const { grid, brickWidth, brickHeight, gap, spaceToTop } = config;
  const rows = grid.length;
  const cols = grid[0].length;

  // can giua gach
  const totalGridWidth = cols * brickWidth + (cols - 1) * gap;
  const spaceToLeft = (gameWidth - totalGridWidth) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = grid[r][c];
      if (type === BRICK_TYPES.EMPTY) continue;

      const x = spaceToLeft + c * (brickWidth + gap);
      const y = spaceToTop + r * (brickHeight + gap);

      const brickEl = document.createElement("div");
      let hp = 1;
      const isMovingBrick = (type === BRICK_TYPES.MOVING);
      let vx = 0;

      if (isMovingBrick) {
        // Hàng 1 qua phải, hàng 3 qua trái, hàng 5 qua phải, hàng 7 qua trái, hàng 9 qua phải
        const movingRows = [1, 3, 5, 7, 9];
        const rowIdx = movingRows.indexOf(r);
        vx = (rowIdx % 2 === 0) ? 2 : -2;
      }

      if (type === BRICK_TYPES.UNBREAKABLE) {
        brickEl.className = "brick indestr"; // Gạch xám không thể vỡ
      } else if (type === BRICK_TYPES.MULTI_HIT) {
        brickEl.className = "brick";
        hp = Math.floor(Math.random() * 4) + 2; // Random máu từ 2 đến 5
        brickEl.textContent = hp;
        brickEl.style.fontWeight = "bold";
        brickEl.style.fontSize = "10px";
        brickEl.style.color = "#ffffff";
        brickEl.style.border = "1px solid rgba(255, 255, 255, 0.4)";
        // Màu xanh Cyan hiện đại, đồng nhất với gạch 1-hit
        brickEl.style.backgroundColor = "#008001";
      } else if (type === BRICK_TYPES.MOVING) {
        brickEl.className = "brick moving"; // Gạch di chuyển có viền trắng
        brickEl.style.backgroundColor = "#008001";
        brickEl.style.border = "1px solid #ffffff";
      } else {
        brickEl.className = "brick";
        // Đồng nhất 1 màu duy nhất hài hòa trên nền đen
        brickEl.style.backgroundColor = "#008001";
        brickEl.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      }

      brickEl.style.width = brickWidth + "px";
      brickEl.style.height = brickHeight + "px";
      brickEl.style.left = x + "px";
      brickEl.style.top = y + "px";

      gameField.appendChild(brickEl);

      activeBricks.push({
        x: x,
        y: y,
        width: brickWidth,
        height: brickHeight,
        type: type,
        hp: hp,
        maxHp: hp,
        element: brickEl,
        isMoving: isMovingBrick,
        vx: vx,
        minX: spaceToLeft + 1 * (brickWidth + gap),
        maxX: spaceToLeft + (cols - 1) * (brickWidth + gap)
      });
    }
  }

  // Khởi tạo quái vật nếu là Màn 6 (nằm ở phía trên 5 hàng gạch)
  if (config.isMonsterLevel) {
    initMonsters();
  }

  // Khởi tạo Boss nếu là Màn 7
  if (config.isBossLevel) {
    initBoss();
  }

  // Cập nhật hiển thị HUD Máu Boss
  if (hudBossRow) {
    hudBossRow.style.display = (currentLevel === 7) ? "flex" : "none";
  }

  // Reset trạng thái hiệu ứng
  isFrozen = false;
  clearTimeout(freezeTimer);
  paddle.classList.remove("frozen");

  if (currentLevel === 4) {
    paddle.classList.add("reversed");
    if (hudEffectsList) hudEffectsList.textContent = "Đảo ngược";
  } else {
    paddle.classList.remove("reversed");
    if (hudEffectsList) hudEffectsList.textContent = "Bình thường";
  }

  // Đặt lại bóng và thanh đỡ
  resetPaddleAndBall();
}

// ========================================================
// 4. QUẢN LÝ BÓNG VÀ THANH ĐỠ
// ========================================================

function resetPaddleAndBall() {
  paddleX = (gameWidth - paddleWidth) / 2;
  paddle.style.left = paddleX + "px";

  clearBalls();
  clearAllItems();
  if (monsterBullets && monsterBullets.length > 0) {
    monsterBullets.forEach(b => {
      if (b.element && b.element.parentNode) b.element.parentNode.removeChild(b.element);
    });
    monsterBullets = [];
  }

  isLaunched = false;

  // Khởi tạo quả bóng mặc định
  const startX = paddleX + (paddleWidth - ballSize) / 2;
  const startY = paddleY - ballSize;

  ballElement.style.display = "block";
  ballElement.style.left = startX + "px";
  ballElement.style.top = startY + "px";

  balls = [
    {
      x: startX,
      y: startY,
      dx: 0,
      dy: -baseBallSpeed,
      element: ballElement,
      isPrimary: true
    }
  ];
}

function clearBalls() {
  balls.forEach(b => {
    if (!b.isPrimary && b.element && b.element.parentNode) {
      b.element.parentNode.removeChild(b.element);
    }
  });
  balls = [];
}

// phóng bóng ban đầu
function launchBall() {
  if (isLaunched || isPaused || isGameOver) return;
  isLaunched = true;
}

function spawnExtraBall(x, y, dx, dy) {
  const extraEl = document.createElement("div");
  extraEl.className = "ball";
  extraEl.style.left = x + "px";
  extraEl.style.top = y + "px";
  gameArea.appendChild(extraEl);

  balls.push({
    x: x,
    y: y,
    dx: dx || baseBallSpeed,
    dy: dy || -baseBallSpeed,
    element: extraEl,
    isPrimary: false
  });
}

// ========================================================
// 5. VẬT PHẨM RƠI (ITEMS +1, +3)
// ========================================================

function dropItem(x, y) {
  // 35% tỷ lệ rơi item khi vỡ gạch
  if (Math.random() > 0.35) return;

  let type;
  if (currentLevel === 4 || currentLevel === 7) {
    // Màn 4 và Màn 7: có thêm item đóng băng
    const rand = Math.random();
    if (rand < 0.4) type = "+1";
    else if (rand < 0.7) type = "+3";
    else type = "freeze";
  } else {
    // Màn 1, 2, 3, 5, 6: Xuất hiện +1 (70%) hoặc +3 (30%)
    type = Math.random() < 0.7 ? "+1" : "+3";
  }

  const itemEl = document.createElement("div");

  if (type === "freeze") {
    // Khối vuông màu xanh biển, không text
    itemEl.className = "item-fall freeze";
    itemEl.style.width = "14px";
    itemEl.style.height = "14px";
    itemEl.style.backgroundColor = "#0044ff";
    itemEl.style.border = "1px solid #ffffff";
    itemEl.style.borderRadius = "2px";
    itemEl.textContent = "";
    itemEl.style.left = (x + 5) + "px";
    itemEl.style.top = y + "px";
    gameArea.appendChild(itemEl);

    fallItems.push({
      x: x + 5,
      y: y,
      width: 14,
      height: 14,
      vy: 2.5,
      type: type,
      element: itemEl
    });
    return;
  }

  itemEl.className = `item-fall ${type === "+1" ? "plus1" : "plus3"}`;
  itemEl.textContent = type;
  itemEl.style.left = x + "px";
  itemEl.style.top = y + "px";
  gameArea.appendChild(itemEl);

  fallItems.push({
    x: x,
    y: y,
    width: 24,
    height: 14,
    vy: 2.5,
    type: type,
    element: itemEl
  });
}

function clearAllItems() {
  fallItems.forEach(item => {
    if (item.element && item.element.parentNode) {
      item.element.parentNode.removeChild(item.element);
    }
  });
  fallItems = [];
}

// Cộng trực tiếp bóng vào TẤT CẢ các quả bóng đang bay & xử lý hiệu ứng
function applyItemEffect(type) {
  // Hiệu ứng đóng băng (Freeze)
  if (type === "freeze") {
    isFrozen = true;
    paddle.classList.add("frozen");
    if (hudEffectsList) hudEffectsList.textContent = "Đóng băng (2s)";

    clearTimeout(freezeTimer);
    freezeTimer = setTimeout(() => {
      isFrozen = false;
      paddle.classList.remove("frozen");
      if (hudEffectsList) {
        hudEffectsList.textContent = (currentLevel === 4) ? "Đảo ngược" : "Bình thường";
      }
    }, 2000);
    return;
  }

  if (balls.length === 0) {
    if (type === "+1") {
      spawnExtraBall(paddleX + paddleWidth / 2, paddleY - ballSize, (Math.random() - 0.5) * 4, -baseBallSpeed);
    } else if (type === "+3") {
      spawnExtraBall(paddleX + paddleWidth / 2, paddleY - ballSize, -3, -baseBallSpeed);
      spawnExtraBall(paddleX + paddleWidth / 2, paddleY - ballSize, 0, -baseBallSpeed);
      spawnExtraBall(paddleX + paddleWidth / 2, paddleY - ballSize, 3, -baseBallSpeed);
    }
    return;
  }

  // Giới hạn an toàn tối đa 80 quả bóng để tránh giật lag trình duyệt
  if (balls.length >= 80) return;

  // Lấy danh sách snapshot tất cả các quả bóng hiện tại
  const currentFlyingBalls = [...balls];

  currentFlyingBalls.forEach(ball => {
    const spawnX = ball.x;
    const spawnY = ball.y;
    const speed = Math.hypot(ball.dx, ball.dy) || baseBallSpeed;
    const baseAngle = Math.atan2(ball.dy, ball.dx);

    if (type === "+1") {
      // Mỗi quả bóng đang bay tách thêm 1 bóng tỏa hướng
      const spread = (Math.random() > 0.5 ? 1 : -1) * 0.45;
      const newAngle = baseAngle + spread;
      spawnExtraBall(spawnX, spawnY, speed * Math.cos(newAngle), speed * Math.sin(newAngle));
    } else if (type === "+3") {
      // Mỗi quả bóng đang bay bắn tỏa ra 3 bóng
      spawnExtraBall(spawnX, spawnY, speed * Math.cos(baseAngle - 0.5), speed * Math.sin(baseAngle - 0.5));
      spawnExtraBall(spawnX, spawnY, speed * Math.cos(baseAngle + 0.5), speed * Math.sin(baseAngle + 0.5));
      spawnExtraBall(spawnX, spawnY, -speed * Math.cos(baseAngle), speed * Math.sin(baseAngle));
    }
  });
}

// ========================================================
// 6. XỬ LÝ VA CHẠM (COLLISION DETECTION)
// ========================================================

function checkBallBrickCollision(ball) {
  for (let i = activeBricks.length - 1; i >= 0; i--) {
    const brick = activeBricks[i];

    // Kiểm tra va chạm hộp (AABB)
    if (
      ball.x + ballSize >= brick.x &&
      ball.x <= brick.x + brick.width &&
      ball.y + ballSize >= brick.y &&
      ball.y <= brick.y + brick.height
    ) {
      // Tính độ lún vào từng cạnh để xác định hướng nảy
      const overlapLeft = (ball.x + ballSize) - brick.x;
      const overlapRight = (brick.x + brick.width) - ball.x;
      const overlapTop = (ball.y + ballSize) - brick.y;
      const overlapBottom = (brick.y + brick.height) - ball.y;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      // Đẩy lùi bóng ra ngoài mép gạch để tránh kẹt, xuyên hoặc xoay vòng quanh gạch
      if (minOverlapX < minOverlapY) {
        if (overlapLeft < overlapRight) {
          ball.x = brick.x - ballSize;
          ball.dx = -Math.abs(ball.dx);
        } else {
          ball.x = brick.x + brick.width;
          ball.dx = Math.abs(ball.dx);
        }
      } else {
        if (overlapTop < overlapBottom) {
          ball.y = brick.y - ballSize;
          ball.dy = -Math.abs(ball.dy);
        } else {
          ball.y = brick.y + brick.height;
          ball.dy = Math.abs(ball.dy);
        }
      }

      // Cập nhật vị trí hiển thị ngay lập tức
      ball.element.style.left = ball.x + "px";
      ball.element.style.top = ball.y + "px";

      // NẾU LÀ GẠCH KHÔNG THỂ PHÁ (UNBREAKABLE):
      // Chỉ nảy bóng lại, không phá gạch, không cộng điểm và không rơi item
      if (brick.type === BRICK_TYPES.UNBREAKABLE) {
        break;
      }

      // NẾU LÀ GẠCH NHIỀU HIT (MULTI_HIT):
      if (brick.type === BRICK_TYPES.MULTI_HIT) {
        brick.hp--;
        if (brick.hp > 0) {
          brick.element.textContent = brick.hp;
          score += 5;
          if (hudScore) hudScore.textContent = score;
          break; // Chưa vỡ, chỉ nảy bóng ra
        } else {
          // Khi hết máu -> phá hủy
          if (brick.element && brick.element.parentNode) {
            brick.element.parentNode.removeChild(brick.element);
          }
          score += 20;
          if (hudScore) hudScore.textContent = score;
          dropItem(brick.x + brick.width / 2 - 12, brick.y + brick.height / 2 - 7);
          activeBricks.splice(i, 1);
        }
      } else {
        // NẾU LÀ GẠCH THƯỜNG (NORMAL) HOẶC GẠCH DI CHUYỂN (MOVING):
        if (brick.element && brick.element.parentNode) {
          brick.element.parentNode.removeChild(brick.element);
        }
        score += 10;
        if (hudScore) hudScore.textContent = score;
        dropItem(brick.x + brick.width / 2 - 12, brick.y + brick.height / 2 - 7);
        activeBricks.splice(i, 1);
      }

      // Kiểm tra điều kiện thắng (Màn 1-5): Phá hết toàn bộ gạch có thể phá (NORMAL, MULTI_HIT, MOVING)
      if (currentLevel < 6) {
        const remainingTargets = activeBricks.filter(
          b => b.type === BRICK_TYPES.NORMAL || b.type === BRICK_TYPES.MULTI_HIT || b.type === BRICK_TYPES.MOVING
        ).length;

        if (remainingTargets === 0) {
          handleWin();
        }
      }
      break;
    }
  }
}

// ========================================================
// 7. VÒNG LẶP CẬP NHẬT TRÒ CHƠI (GAME LOOP)
// ========================================================

function updateGame() {
  if (!isPaused && !isGameOver) {
    // Cập nhật quái và đạn đỏ (Màn 6 & Màn 7)
    updateMonstersAndBullets();

    // Cập nhật Boss (Màn 7)
    updateBoss();

    // Cập nhật vị trí gạch di chuyển (Màn 5)
    for (let i = 0; i < activeBricks.length; i++) {
      const b = activeBricks[i];
      if (b.isMoving) {
        b.x += b.vx;

        // Đổi hướng khi chạm mép trái hoặc phải
        if (b.x <= b.minX) {
          b.x = b.minX;
          b.vx = Math.abs(b.vx);
        } else if (b.x + b.width >= b.maxX) {
          b.x = b.maxX - b.width;
          b.vx = -Math.abs(b.vx);
        }

        b.element.style.left = b.x + "px";
      }
    }

    // 1. Di chuyển thanh đỡ qua bàn phím (nếu không bị đóng băng)
    if (!isFrozen) {
      const isReversed = (currentLevel === 4);
      if (isReversed) {
        // Đảo ngược: bấm phím Trái thì di chuyển sang Phải, phím Phải thì di chuyển sang Trái
        if (moveLeft) paddleX += paddleSpeed;
        if (moveRight) paddleX -= paddleSpeed;
      } else {
        if (moveLeft) paddleX -= paddleSpeed;
        if (moveRight) paddleX += paddleSpeed;
      }

      paddleX = Math.max(0, Math.min(gameWidth - paddleWidth, paddleX));
      paddle.style.left = paddleX + "px";
    }

    // 2. Nếu bóng chưa phóng, giữ bóng chính trên thanh đỡ
    if (!isLaunched) {
      if (balls.length > 0) {
        const primaryBall = balls[0];
        primaryBall.x = paddleX + (paddleWidth - ballSize) / 2;
        primaryBall.y = paddleY - ballSize;
        primaryBall.element.style.left = primaryBall.x + "px";
        primaryBall.element.style.top = primaryBall.y + "px";
      }
    } else {
      // 3. Cập nhật các quả bóng đang bay
      for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];

        ball.x += ball.dx;
        ball.y += ball.dy;

        // Va chạm tường trái / phải
        if (ball.x <= 0) {
          ball.x = 0;
          ball.dx = Math.abs(ball.dx);
        } else if (ball.x + ballSize >= gameWidth) {
          ball.x = gameWidth - ballSize;
          ball.dx = -Math.abs(ball.dx);
        }

        // Va chạm trần
        if (ball.y <= 0) {
          ball.y = 0;
          ball.dy = Math.abs(ball.dy);
        }

        // Va chạm thanh đỡ
        if (
          ball.dy > 0 &&
          ball.y + ballSize >= paddleY &&
          ball.y <= paddleY + paddleHeight &&
          ball.x + ballSize >= paddleX &&
          ball.x <= paddleX + paddleWidth
        ) {
          ball.y = paddleY - ballSize;

          // Điều chỉnh góc nảy theo vị trí tiếp xúc trên thanh đỡ
          const hitPos = (ball.x + ballSize / 2 - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
          const maxBounceAngle = Math.PI / 3; // 60 độ
          const bounceAngle = hitPos * maxBounceAngle;

          ball.dx = baseBallSpeed * Math.sin(bounceAngle);
          ball.dy = -baseBallSpeed * Math.cos(bounceAngle);
        }

        // Kiểm tra va chạm với gạch
        checkBallBrickCollision(ball);

        // Kiểm tra va chạm với quái (Màn 6 & Màn 7)
        checkBallMonsterCollision(ball);

        // Kiểm tra va chạm với Boss (Màn 7)
        checkBallBossCollision(ball);

        // Kiểm tra bóng rơi xuống đáy
        if (ball.y > gameHeight) {
          if (!ball.isPrimary && ball.element.parentNode) {
            ball.element.parentNode.removeChild(ball.element);
          }
          balls.splice(i, 1);
        } else {
          ball.element.style.left = ball.x + "px";
          ball.element.style.top = ball.y + "px";
        }
      }

      // Nếu tất cả bóng đều rơi khỏi sân
      if (balls.length === 0) {
        handleLoseLife();
      }
    }

    // 4. Cập nhật các vật phẩm đang rơi
    for (let i = fallItems.length - 1; i >= 0; i--) {
      const item = fallItems[i];
      item.y += item.vy;

      // Nhặt item bằng thanh đỡ
      if (
        item.y + item.height >= paddleY &&
        item.y <= paddleY + paddleHeight &&
        item.x + item.width >= paddleX &&
        item.x <= paddleX + paddleWidth
      ) {
        applyItemEffect(item.type);
        if (item.element.parentNode) item.element.parentNode.removeChild(item.element);
        fallItems.splice(i, 1);
        continue;
      }

      // Rơi ra ngoài sân
      if (item.y > gameHeight) {
        if (item.element.parentNode) item.element.parentNode.removeChild(item.element);
        fallItems.splice(i, 1);
        continue;
      }

      item.element.style.top = item.y + "px";
    }
  }

  requestAnimationFrame(updateGame);
}

// ========================================================
// 8. ĐIỀU KIỆN MẠNG, THẮNG / THUA
// ========================================================

function handleLoseLife() {
  lives--;
  if (hudLives) hudLives.textContent = `${lives} / 3`;
  if (lives <= 0) {
    handleGameOver();
  } else {
    resetPaddleAndBall();
  }
}

function handleGameOver() {
  isGameOver = true;
  if (gameoverTitle) gameoverTitle.textContent = "Thua Cuộc!";
  if (gameoverSubtitle) gameoverSubtitle.textContent = "Bạn đã hết mạng chơi.";
  if (gameoverScore) gameoverScore.textContent = score;
  if (modalGameOver) modalGameOver.classList.add("active");
}

function handleWin() {
  isGameOver = true;
  const levelName = LEVEL_CONFIGS[currentLevel]?.name || `Màn ${currentLevel}`;
  if (gameoverTitle) gameoverTitle.textContent = "Chiến Thắng!";
  if (gameoverSubtitle) gameoverSubtitle.textContent = `Bạn đã hoàn thành xuất sắc ${levelName}!`;
  if (gameoverScore) gameoverScore.textContent = score;
  if (modalGameOver) modalGameOver.classList.add("active");
}

function restartCurrentLevel() {
  isGameOver = false;
  isPaused = false;
  lives = 3;
  score = 0;

  if (hudScore) hudScore.textContent = score;
  if (hudLives) hudLives.textContent = `${lives} / 3`;

  if (modalGameOver) modalGameOver.classList.remove("active");
  if (modalPause) modalPause.classList.remove("active");

  loadLevel(currentLevel);
}

function togglePause() {
  if (isGameOver) return;
  isPaused = !isPaused;
  if (isPaused) {
    if (modalPause) modalPause.classList.add("active");
  } else {
    if (modalPause) modalPause.classList.remove("active");
  }
}

// ========================================================
// 9. LẮNG NGHE SỰ KIỆN (EVENT LISTENERS)
// ========================================================

// Phím điều khiển
document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLeft = true;
    e.preventDefault();
  }
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveRight = true;
    e.preventDefault();
  }
  if (e.code === "Space") {
    e.preventDefault();
    launchBall();
  }
  if (e.key === "p" || e.key === "P") {
    togglePause();
  }
  if (e.key === "r" || e.key === "R") {
    restartCurrentLevel();
  }
});

document.addEventListener("keyup", function(e) {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    moveLeft = false;
  }
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    moveRight = false;
  }
});

// Điều khiển chuột trong sân
gameArea.addEventListener("mousemove", function(e) {
  if (isPaused || isGameOver || isFrozen) return;
  const rect = gameArea.getBoundingClientRect();
  const cursorX = e.clientX - rect.left;

  if (currentLevel === 4) {
    // Đảo ngược chuột: rê qua trái thì thanh lướt qua phải, rê qua phải thì thanh lướt qua trái
    paddleX = (gameWidth - cursorX) - paddleWidth / 2;
  } else {
    paddleX = cursorX - paddleWidth / 2;
  }

  paddleX = Math.max(0, Math.min(gameWidth - paddleWidth, paddleX));
  paddle.style.left = paddleX + "px";

  if (!isLaunched && balls.length > 0) {
    const primaryBall = balls[0];
    primaryBall.x = paddleX + (paddleWidth - ballSize) / 2;
    primaryBall.y = paddleY - ballSize;
    primaryBall.element.style.left = primaryBall.x + "px";
    primaryBall.element.style.top = primaryBall.y + "px";
  }
});

gameArea.addEventListener("click", function() {
  launchBall();
});

// Nút bấm trên giao diện
if (btnPause) btnPause.addEventListener("click", togglePause);
if (btnResume) btnResume.addEventListener("click", togglePause);
if (btnReset) btnReset.addEventListener("click", restartCurrentLevel);
if (btnPauseRestart) btnPauseRestart.addEventListener("click", restartCurrentLevel);
if (btnReplay) btnReplay.addEventListener("click", restartCurrentLevel);

if (btnNextLevel) {
  btnNextLevel.addEventListener("click", function() {
    if (modalGameOver) modalGameOver.classList.remove("active");
    if (currentLevel < 7) {
      loadLevel(currentLevel + 1);
    } else {
      alert("Chúc mừng bạn đã hoàn thành xuất sắc tất cả 7 màn chơi!");
      restartCurrentLevel();
    }
  });
}

if (btnSoundToggle) {
  btnSoundToggle.addEventListener("click", function() {
    soundEnabled = !soundEnabled;
    btnSoundToggle.textContent = soundEnabled ? "Âm thanh: Bật" : "Âm thanh: Tắt";
  });
}

if (btnOpenGuide) {
  btnOpenGuide.addEventListener("click", function() {
    window.open("instruction.html", "_blank");
  });
}

if (levelSelect) {
  levelSelect.addEventListener("change", function(e) {
    loadLevel(parseInt(e.target.value, 10));
  });
}

// ========================================================
// 10. KHỞI CHẠY GAME
// ========================================================

loadLevel(1);
requestAnimationFrame(updateGame);
