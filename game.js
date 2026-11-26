/**
 * TANK TROUBLE 2026 - GAME LOGIC & RENDER ENGINE
 * Hỗ trợ: Đồ họa Tank phong cách Tank Trouble 4 người chơi
 * Tính năng: Đạn nảy tường, Nhiều Map (Mê cung, Đấu trường, Băng tuyết), Bot AI thông minh, Chế độ Cướp Cờ (CTF)
 */

// ==========================================
// 1. CẤU HÌNH & HỆ THỐNG MAP (BẢN ĐỒ)
// ==========================================
const MAPS = [
  {
    id: 'maze_classic',
    name: 'Mê Cung Kinh Điển',
    icon: '🧱',
    walls: [
      // Viền ngoài
      { x: 0, y: 0, w: 900, h: 14 },
      { x: 0, y: 586, w: 900, h: 14 },
      { x: 0, y: 0, w: 14, h: 600 },
      { x: 886, y: 0, w: 14, h: 600 },
      // Các bức tường bên trong
      { x: 150, y: 80, w: 14, h: 220 },
      { x: 150, y: 300, w: 160, h: 14 },
      { x: 300, y: 150, w: 14, h: 160 },
      { x: 440, y: 70, w: 20, h: 200 },
      { x: 440, y: 340, w: 20, h: 190 },
      { x: 590, y: 150, w: 14, h: 160 },
      { x: 590, y: 300, w: 160, h: 14 },
      { x: 740, y: 300, w: 14, h: 220 },
      { x: 260, y: 440, w: 220, h: 14 },
      { x: 300, y: 80, w: 150, h: 14 }
    ],
    playerSpawn: { x: 70, y: 70, angle: 0 },
    flagSpawn: { x: 820, y: 520 }, // Vị trí cờ địch trong CTF
    playerBase: { x: 70, y: 70, r: 40 }
  },
  {
    id: 'crossfire_arena',
    name: 'Giao Lộ Bắn Tỉa',
    icon: '⚔️',
    walls: [
      { x: 0, y: 0, w: 900, h: 14 },
      { x: 0, y: 586, w: 900, h: 14 },
      { x: 0, y: 0, w: 14, h: 600 },
      { x: 886, y: 0, w: 14, h: 600 },
      // Bức tường chữ X ở giữa
      { x: 380, y: 240, w: 140, h: 14 },
      { x: 440, y: 180, w: 14, h: 140 },
      // 4 góc phòng thủ
      { x: 180, y: 120, w: 120, h: 14 },
      { x: 180, y: 120, w: 14, h: 120 },
      { x: 600, y: 120, w: 120, h: 14 },
      { x: 706, y: 120, w: 14, h: 120 },
      { x: 180, y: 466, w: 120, h: 14 },
      { x: 180, y: 360, w: 14, h: 120 },
      { x: 600, y: 466, w: 120, h: 14 },
      { x: 706, y: 360, w: 14, h: 120 }
    ],
    playerSpawn: { x: 80, y: 300, angle: 0 },
    flagSpawn: { x: 810, y: 300 },
    playerBase: { x: 80, y: 300, r: 40 }
  },
  {
    id: 'fortress_havoc',
    name: 'Pháo Đài Boong-ke',
    icon: '🏰',
    walls: [
      { x: 0, y: 0, w: 900, h: 14 },
      { x: 0, y: 586, w: 900, h: 14 },
      { x: 0, y: 0, w: 14, h: 600 },
      { x: 886, y: 0, w: 14, h: 600 },
      // Tường chướng ngại boong ke
      { x: 220, y: 80, w: 20, h: 160 },
      { x: 220, y: 360, w: 20, h: 160 },
      { x: 660, y: 80, w: 20, h: 160 },
      { x: 660, y: 360, w: 20, h: 160 },
      { x: 340, y: 180, w: 220, h: 18 },
      { x: 340, y: 400, w: 220, h: 18 }
    ],
    playerSpawn: { x: 90, y: 90, angle: 0.5 },
    flagSpawn: { x: 810, y: 510 },
    playerBase: { x: 90, y: 90, r: 40 }
  }
];

// Màu sắc xe tank (Chuẩn 4 người chơi Tank Trouble: Xanh dương, Đỏ, Xanh lá, Vàng)
const TANK_COLORS = {
  player: { body: '#00f2fe', turret: '#00a8ff', track: '#1e2230', name: 'Người chơi (Bạn)' },
  enemy1: { body: '#ff3366', turret: '#c70039', track: '#1e2230', name: 'Địch Đỏ' },
  enemy2: { body: '#2ecc71', turret: '#27ae60', track: '#1e2230', name: 'Địch Xanh Lá' },
  enemy3: { body: '#f1c40f', turret: '#f39c12', track: '#1e2230', name: 'Địch Vàng' },
  enemy4: { body: '#9b59b6', turret: '#8e44ad', track: '#1e2230', name: 'Địch Tím' },
  enemy5: { body: '#e67e22', turret: '#d35400', track: '#1e2230', name: 'Địch Cam' }
};

// ==========================================
// 2. KHỞI TẠO STATE & CÁC ĐỐI TƯỢNG GAME
// ==========================================
const Game = {
  canvas: document.getElementById('gameCanvas'),
  ctx: null,
  mode: 'deathmatch', // 'deathmatch' hoặc 'capture_flag'
  selectedMap: MAPS[0],
  enemyCount: 3,
  botDifficulty: 'medium', // 'easy', 'medium', 'hard'
  paused: false,
  over: false,
  score: 0,
  
  player: null,
  enemies: [],
  bullets: [],
  particles: [],
  flag: null,
  
  keys: {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false
  },
  
  lastFrameTime: performance.now(),
  audioCtx: null
};

// ==========================================
// 3. SOUND SYNTHESIZER (m thanh Web Audio chân thực)
// ==========================================
function playSound(type) {
  try {
    if (!Game.audioCtx) {
      Game.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = Game.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'fire') {
      // Tiếng đạn đại bác nổ vang
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'bounce') {
      // Tiếng đạn nảy kít kít vào tường sắt
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'explode') {
      // Tiếng nổ tung xác xe tank
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'flag') {
      // Tiếng cướp cờ vang lên
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // Note C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // Note E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // Note G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Không hỗ trợ âm thanh thì bỏ qua
  }
}

// ==========================================
// 4. LỚP XE TANK (TANK TROUBLE STYLE)
// ==========================================
class Tank {
  constructor(x, y, angle, isEnemy = false, colorScheme = TANK_COLORS.player) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.isEnemy = isEnemy;
    this.color = colorScheme;
    this.width = 34;
    this.height = 26;
    this.radius = 16;
    
    this.speed = 0;
    this.maxSpeed = isEnemy ? 2.1 : 2.5;
    this.turnSpeed = 0.055;
    this.reloadTimer = 0;
    this.reloadCooldown = isEnemy ? 80 : 35;
    
    // AI state (dành riêng cho kẻ địch)
    this.aiTargetAngle = angle;
    this.aiChangeTimer = 0;
    this.aiState = 'roam'; // roam, chase, ambush
    this.alive = true;
    this.hasFlag = false;
  }

  update(walls) {
    if (!this.alive) return;
    if (this.reloadTimer > 0) this.reloadTimer--;

    if (this.isEnemy) {
      this.updateAI(walls);
    }

    // Tính toán di chuyển
    if (this.speed !== 0) {
      const nextX = this.x + Math.cos(this.angle) * this.speed;
      const nextY = this.y + Math.sin(this.angle) * this.speed;

      if (!this.checkWallCollision(nextX, nextY, walls)) {
        this.x = nextX;
        this.y = nextY;
      } else {
        this.speed = 0;
        if (this.isEnemy) this.aiTargetAngle += Math.PI * 0.7; // Va vào tường tự quay đầu
      }
    }
  }

  checkWallCollision(x, y, walls) {
    for (const wall of walls) {
      // Khoảng cách từ tâm tank tới mép hình chữ nhật bức tường gần nhất
      const nearestX = Math.max(wall.x, Math.min(x, wall.x + wall.w));
      const nearestY = Math.max(wall.y, Math.min(y, wall.y + wall.h));
      const dist = Math.hypot(x - nearestX, y - nearestY);
      if (dist < this.radius + 2) return true;
    }
    return false;
  }

  updateAI(walls) {
    this.aiChangeTimer--;
    const target = Game.player;
    if (!target || !target.alive) return;

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distToPlayer = Math.hypot(dx, dy);
    const angleToPlayer = Math.atan2(dy, dx);

    // Quyết định hành vi theo độ khó
    if (this.aiChangeTimer <= 0) {
      this.aiChangeTimer = 25 + Math.random() * 30;

      // Kiểm tra xem có đường ngắm bắn thẳng tới người chơi không
      const hasLineOfSight = this.hasClearSight(this.x, this.y, target.x, target.y, walls);

      if (hasLineOfSight && distToPlayer < 450) {
        this.aiState = 'aim_and_fire';
        this.aiTargetAngle = angleToPlayer;
      } else {
        this.aiState = 'roam';
        // Đi lang thang hoặc tiến về cờ/người chơi
        if (Game.mode === 'capture_flag' && Game.flag && !Game.flag.carrier) {
          const fdx = Game.flag.x - this.x;
          const fdy = Game.flag.y - this.y;
          this.aiTargetAngle = Math.atan2(fdy, fdx) + (Math.random() - 0.5) * 0.4;
        } else {
          this.aiTargetAngle = angleToPlayer + (Math.random() - 0.5) * 1.2;
        }
      }
    }

    // Xoay góc xe mượt mà hướng tới mục tiêu
    let angleDiff = this.aiTargetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

    if (Math.abs(angleDiff) > 0.06) {
      this.angle += Math.sign(angleDiff) * this.turnSpeed;
    } else {
      this.speed = this.maxSpeed * (this.aiState === 'aim_and_fire' ? 0.4 : 0.85);
      
      // Bắn nếu đang ngắm chuẩn
      if (this.aiState === 'aim_and_fire' && Math.abs(angleDiff) < 0.25 && this.reloadTimer <= 0) {
        this.shoot();
      }
    }
  }

  hasClearSight(x1, y1, x2, y2, walls) {
    // Bắn raycast đơn giản kiểm tra xem tia có cắt tường nào không
    const steps = 12;
    for (let i = 1; i < steps; i++) {
      const cx = x1 + (x2 - x1) * (i / steps);
      const cy = y1 + (y2 - y1) * (i / steps);
      for (const w of walls) {
        if (cx >= w.x && cx <= w.x + w.w && cy >= w.y && cy <= w.y + w.h) {
          return false;
        }
      }
    }
    return true;
  }

  shoot() {
    if (this.reloadTimer > 0 || !this.alive) return;
    this.reloadTimer = this.reloadCooldown;
    
    const barrelLength = 22;
    const bx = this.x + Math.cos(this.angle) * barrelLength;
    const by = this.y + Math.sin(this.angle) * barrelLength;
    
    Game.bullets.push(new Bullet(bx, by, this.angle, this));
    playSound('fire');

    // Hiệu ứng giật lùi (recoil) và khói lửa nòng súng
    this.x -= Math.cos(this.angle) * 2;
    this.y -= Math.sin(this.angle) * 2;
    createMuzzleFlash(bx, by, this.angle);
  }

  draw(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // 1. Vẽ Vết Xích Xe Tank (Treads)
    ctx.fillStyle = this.color.track;
    // Xích trái & xích phải
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, 7);
    ctx.fillRect(-this.width / 2, this.height / 2 - 7, this.width, 7);
    
    // Gân xích xe tank
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let gx = -this.width / 2 + 3; gx < this.width / 2; gx += 6) {
      ctx.fillRect(gx, -this.height / 2, 2, 7);
      ctx.fillRect(gx, this.height / 2 - 7, 2, 7);
    }

    // 2. Thân Xe Tank (Body)
    ctx.fillStyle = this.color.body;
    ctx.strokeStyle = '#080a10';
    ctx.lineWidth = 2.5;
    
    ctx.beginPath();
    ctx.roundRect(-this.width / 2 + 4, -this.height / 2 + 5, this.width - 8, this.height - 10, 4);
    ctx.fill();
    ctx.stroke();

    // 3. Nòng Pháo Đại Bác (Barrel)
    ctx.fillStyle = this.color.turret;
    ctx.fillRect(0, -3.5, 22, 7);
    ctx.strokeRect(0, -3.5, 22, 7);

    // Miệng nòng pháo (Muzzle)
    ctx.fillStyle = '#080a10';
    ctx.fillRect(20, -4.5, 3, 9);

    // 4. Tháp Pháo Tròn (Turret Dome)
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fillStyle = this.color.turret;
    ctx.fill();
    ctx.stroke();

    // Điểm nhấn sáng tâm tháp pháo
    ctx.beginPath();
    ctx.arc(-2, -2, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();

    // 5. Cờ đang cầm trên xe (nếu có trong chế độ CTF)
    if (this.hasFlag) {
      ctx.font = '16px sans-serif';
      ctx.fillText('🚩', -8, -16);
    }

    ctx.restore();
  }
}

// ==========================================
// 5. LỚP ĐẠN NẢY (BOUNCING CANNON BULLETS)
// ==========================================
class Bullet {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * 4.6;
    this.vy = Math.sin(angle) * 4.6;
    this.radius = 4;
    this.owner = owner;
    this.bouncesLeft = 5; // Đạn nảy 5 lần mới biến mất (kinh điển Tank Trouble)
    this.life = 360; // Tồn tại tối đa 6 giây
  }

  update(walls) {
    this.life--;
    if (this.life <= 0) return false;

    // Di chuyển
    this.x += this.vx;
    this.y += this.vy;

    // Kiểm tra va chạm với các bức tường & Nảy ngược góc
    for (const wall of walls) {
      if (
        this.x + this.radius > wall.x &&
        this.x - this.radius < wall.x + wall.w &&
        this.y + this.radius > wall.y &&
        this.y - this.radius < wall.y + wall.h
      ) {
        // Xác định nảy theo phương ngang hay phương dọc
        const overlapL = Math.abs(this.x + this.radius - wall.x);
        const overlapR = Math.abs(wall.x + wall.w - (this.x - this.radius));
        const overlapT = Math.abs(this.y + this.radius - wall.y);
        const overlapB = Math.abs(wall.y + wall.h - (this.y - this.radius));
        
        const minOverlap = Math.min(overlapL, overlapR, overlapT, overlapB);
        if (minOverlap === overlapL || minOverlap === overlapR) {
          this.vx = -this.vx;
        } else {
          this.vy = -this.vy;
        }

        this.bouncesLeft--;
        playSound('bounce');
        createSparks(this.x, this.y);

        if (this.bouncesLeft <= 0) {
          createSparks(this.x, this.y, 10);
          return false;
        }
      }
    }

    // Kiểm tra bắn trúng xe tank nào
    const allTanks = [Game.player, ...Game.enemies];
    for (const tank of allTanks) {
      if (!tank || !tank.alive) continue;
      const dist = Math.hypot(this.x - tank.x, this.y - tank.y);
      if (dist < tank.radius + this.radius) {
        // Tiêu diệt xe tank!
        tank.alive = false;
        createExplosion(tank.x, tank.y);
        playSound('explode');

        // Nếu xe tank đang giữ cờ bị tiêu diệt, trả cờ về vị trí ban đầu
        if (tank.hasFlag && Game.flag) {
          Game.flag.carrier = null;
          Game.flag.x = Game.selectedMap.flagSpawn.x;
          Game.flag.y = Game.selectedMap.flagSpawn.y;
          updateFlagHUD();
        }

        // Cập nhật điểm & kiểm tra thắng thua
        if (tank === Game.player) {
          // Bạn bị tiêu diệt
          endGame(false, 'Xe tăng của bạn đã bị bắn nổ!');
        } else {
          // Địch bị tiêu diệt
          Game.score += 100;
          document.getElementById('scorePlayer').textContent = Game.score;
          checkGameStatus();
        }
        return false;
      }
    }

    return true;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.shadowColor = '#ff3300';
    ctx.shadowBlur = 8;
    ctx.fill();

    // Vệt sáng đạn
    ctx.beginPath();
    ctx.arc(this.x - this.vx * 1.5, this.y - this.vy * 1.5, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 100, 0, 0.4)';
    ctx.fill();
    ctx.restore();
  }
}

// ==========================================
// 6. LỚP CỜ (DÀNH CHO CHẾ ĐỘ CƯỚP CỜ - CTF)
// ==========================================
class Flag {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.carrier = null;
  }

  update() {
    if (this.carrier) {
      this.x = this.carrier.x;
      this.y = this.carrier.y;

      // Nếu người chơi cướp được cờ và đem về căn cứ của mình -> CHIẾN THẮNG!
      if (this.carrier === Game.player) {
        const base = Game.selectedMap.playerBase;
        const distToBase = Math.hypot(this.x - base.x, this.y - base.y);
        if (distToBase < base.r) {
          playSound('flag');
          endGame(true, 'XUẤT SẮC! BẠN ĐÃ CƯỚP ĐƯỢC CỜ ĐỊCH VÀ MANG VỀ CĂN CỨ THÀNH CÔNG!');
        }
      }
    } else {
      // Kiểm tra xe tank nào nhặt cờ
      const allTanks = [Game.player, ...Game.enemies];
      for (const t of allTanks) {
        if (!t || !t.alive) continue;
        const dist = Math.hypot(this.x - t.x, this.y - t.y);
        if (dist < this.radius + t.radius) {
          this.carrier = t;
          t.hasFlag = true;
          playSound('flag');
          updateFlagHUD();
          break;
        }
      }
    }
  }

  draw(ctx) {
    if (this.carrier) return; // Khi có người cầm thì vẽ trên nóc xe tank

    ctx.save();
    // Vòng phát sáng hào quang quanh cờ
    const pulse = 14 + Math.sin(Date.now() / 200) * 4;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 204, 0, 0.2)';
    ctx.fill();

    // Cột cờ
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚩', this.x, this.y);
    ctx.restore();
  }
}

// ==========================================
// 7. HIỆU ỨNG HẠT (PARTICLES & NỔ TUNG TÉ)
// ==========================================
function createExplosion(x, y) {
  for (let i = 0; i < 28; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4.5;
    Game.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      color: ['#ff3366', '#ff9900', '#ffcc00', '#333'][Math.floor(Math.random() * 4)],
      life: 30 + Math.random() * 20
    });
  }
}

function createSparks(x, y, count = 4) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2.5;
    Game.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 2,
      color: '#ffdd55',
      life: 12 + Math.random() * 10
    });
  }
}

function createMuzzleFlash(x, y, angle) {
  for (let i = 0; i < 6; i++) {
    const spread = (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 3;
    Game.particles.push({
      x, y,
      vx: Math.cos(angle + spread) * speed,
      vy: Math.sin(angle + spread) * speed,
      size: 3 + Math.random() * 3,
      color: '#ffaa00',
      life: 8 + Math.random() * 6
    });
  }
}

// ==========================================
// 8. KHỞI TẠO VÁN ĐẤU (INIT MATCH)
// ==========================================
function startMatch() {
  Game.over = false;
  Game.bullets = [];
  Game.particles = [];
  document.getElementById('gameResultBanner').style.display = 'none';

  const map = Game.selectedMap;
  // Tạo xe người chơi
  Game.player = new Tank(map.playerSpawn.x, map.playerSpawn.y, map.playerSpawn.angle, false, TANK_COLORS.player);

  // Tạo xe địch bot
  Game.enemies = [];
  const enemyColorKeys = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];
  
  // Tọa độ các vị trí spawn địch phân tán trên bản đồ
  const spawnPoints = [
    { x: 800, y: 100, angle: Math.PI },
    { x: 800, y: 500, angle: Math.PI },
    { x: 450, y: 520, angle: -Math.PI / 2 },
    { x: 120, y: 500, angle: -0.5 },
    { x: 450, y: 80, angle: Math.PI / 2 },
    { x: 700, y: 300, angle: Math.PI },
    { x: 250, y: 220, angle: 0 }
  ];

  for (let i = 0; i < Game.enemyCount; i++) {
    const sp = spawnPoints[i % spawnPoints.length];
    const color = TANK_COLORS[enemyColorKeys[i % enemyColorKeys.length]];
    const enemyTank = new Tank(sp.x + (Math.random() - 0.5) * 20, sp.y + (Math.random() - 0.5) * 20, sp.angle, true, color);
    
    // Điều chỉnh tốc độ theo độ khó
    if (Game.botDifficulty === 'easy') enemyTank.maxSpeed = 1.6;
    if (Game.botDifficulty === 'hard') enemyTank.maxSpeed = 2.4;
    
    Game.enemies.push(enemyTank);
  }

  // Khởi tạo cờ nếu ở chế độ Cướp cờ (CTF)
  if (Game.mode === 'capture_flag') {
    Game.flag = new Flag(map.flagSpawn.x, map.flagSpawn.y);
    document.getElementById('flagStatusBox').style.display = 'flex';
    document.getElementById('hudGameMode').textContent = 'CHẾ ĐỘ: CƯỚP CỜ (CTF)';
  } else {
    Game.flag = null;
    document.getElementById('flagStatusBox').style.display = 'none';
    document.getElementById('hudGameMode').textContent = 'CHẾ ĐỘ: TIÊU DIỆT TOÀN BỘ';
  }

  updateEnemyCountHUD();
  updateFlagHUD();
}

function updateEnemyCountHUD() {
  const aliveEnemies = Game.enemies.filter(e => e.alive).length;
  document.getElementById('enemyCountDisplay').textContent = aliveEnemies;
}

function updateFlagHUD() {
  const box = document.getElementById('flagStatusText');
  if (!Game.flag) return;
  if (!Game.flag.carrier) {
    box.textContent = 'Cờ: Tại cứ điểm';
  } else if (Game.flag.carrier === Game.player) {
    box.textContent = 'Bạn đang giữ Cờ! Hãy chạy về!';
  } else {
    box.textContent = 'Địch đang giữ Cờ!';
  }
}

function checkGameStatus() {
  updateEnemyCountHUD();
  const aliveEnemies = Game.enemies.filter(e => e.alive).length;
  if (aliveEnemies === 0 && Game.mode === 'deathmatch') {
    endGame(true, 'XUẤT SẮC! BẠN ĐÃ TIÊU DIỆT TOÀN BỘ XE TĂNG KẺ THÙ!');
  }
}

function endGame(isWin, message) {
  Game.over = true;
  const banner = document.getElementById('gameResultBanner');
  const icon = document.getElementById('bannerIcon');
  const title = document.getElementById('bannerTitle');
  const desc = document.getElementById('bannerDesc');

  if (isWin) {
    icon.textContent = '🏆';
    title.textContent = 'CHIẾN THẮNG!';
    title.style.color = '#ffcc00';
    desc.textContent = message;
  } else {
    icon.textContent = '💥';
    title.textContent = 'THẤT BẠI!';
    title.style.color = '#ff3366';
    desc.textContent = message;
  }
  banner.style.display = 'flex';
}

// ==========================================
// 9. VÒNG LẶP CHÍNH CỦA GAME (GAME LOOP)
// ==========================================
function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);
  if (Game.paused) return;

  const ctx = Game.ctx;
  const walls = Game.selectedMap.walls;

  // Xóa màn hình
  ctx.fillStyle = '#141724';
  ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

  // Vẽ lưới sàn chiến trường (Battle Grid Background)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < Game.canvas.width; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Game.canvas.height); ctx.stroke();
  }
  for (let y = 0; y < Game.canvas.height; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Game.canvas.width, y); ctx.stroke();
  }

  // Vẽ Căn cứ của người chơi trong chế độ Cướp Cờ
  if (Game.mode === 'capture_flag') {
    const base = Game.selectedMap.playerBase;
    ctx.save();
    ctx.beginPath();
    ctx.arc(base.x, base.y, base.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.1)';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.fill();
    ctx.stroke();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('CĂN CỨ BẠN', base.x - 30, base.y + 4);
    ctx.restore();
  }

  // 1. Cập nhật người chơi
  const p = Game.player;
  if (p && p.alive) {
    if (Game.keys.left) p.angle -= p.turnSpeed;
    if (Game.keys.right) p.angle += p.turnSpeed;
    if (Game.keys.up) p.speed = p.maxSpeed;
    else if (Game.keys.down) p.speed = -p.maxSpeed * 0.6;
    else p.speed = 0;

    if (Game.keys.fire) p.shoot();
    p.update(walls);
    p.draw(ctx);
  }

  // 2. Cập nhật & Vẽ kẻ địch
  for (const enemy of Game.enemies) {
    enemy.update(walls);
    enemy.draw(ctx);
  }

  // 3. Cập nhật & Vẽ Cờ
  if (Game.flag) {
    Game.flag.update();
    Game.flag.draw(ctx);
  }

  // 4. Cập nhật & Vẽ Đạn
  for (let i = Game.bullets.length - 1; i >= 0; i--) {
    const bullet = Game.bullets[i];
    if (!bullet.update(walls)) {
      Game.bullets.splice(i, 1);
    } else {
      bullet.draw(ctx);
    }
  }

  // 5. Cập nhật & Vẽ Hạt Hiệu Ứng (Particles)
  for (let i = Game.particles.length - 1; i >= 0; i--) {
    const pt = Game.particles[i];
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
    if (pt.life <= 0) {
      Game.particles.splice(i, 1);
    } else {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
    }
  }

  // 6. Vẽ Các Bức Tường (Walls)
  ctx.fillStyle = '#2b3145';
  ctx.strokeStyle = '#3e4663';
  ctx.lineWidth = 2;
  for (const w of walls) {
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeRect(w.x, w.y, w.w, w.h);
    
    // Viền sáng bóng 3D trên tường
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(w.x + 2, w.y + 2, w.w - 4, 3);
    ctx.fillStyle = '#2b3145';
  }
}

// ==========================================
// 10. LẮNG NGHE SỰ KIỆN ĐIỀU KHIỂN & GIAO DIỆN
// ==========================================
function setupControls() {
  // Bàn phím máy tính
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') Game.keys.up = true;
    if (key === 'arrowdown' || key === 's') Game.keys.down = true;
    if (key === 'arrowleft' || key === 'a') Game.keys.left = true;
    if (key === 'arrowright' || key === 'd') Game.keys.right = true;
    if (key === ' ' || key === 'j') {
      Game.keys.fire = true;
      e.preventDefault();
    }
    if (key === 'r') startMatch();
  });

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') Game.keys.up = false;
    if (key === 'arrowdown' || key === 's') Game.keys.down = false;
    if (key === 'arrowleft' || key === 'a') Game.keys.left = false;
    if (key === 'arrowright' || key === 'd') Game.keys.right = false;
    if (key === ' ' || key === 'j') Game.keys.fire = false;
  });

  // Hỗ trợ Nút Cảm Ứng Di Động
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) {
    document.getElementById('mobileControls').style.display = 'flex';
  }

  const bindTouch = (id, keyName) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); Game.keys[keyName] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); Game.keys[keyName] = false; });
  };
  bindTouch('btnUp', 'up');
  bindTouch('btnDown', 'down');
  bindTouch('btnLeft', 'left');
  bindTouch('btnRight', 'right');
  bindTouch('btnFire', 'fire');

  // Nút trên thanh Header
  document.getElementById('btnRestartQuick').addEventListener('click', startMatch);
  document.getElementById('btnPlayAgain').addEventListener('click', startMatch);

  // Modal Settings
  const settingsModal = document.getElementById('settingsModal');
  document.getElementById('btnSettings').addEventListener('click', () => {
    settingsModal.classList.add('active');
  });
  document.getElementById('btnChangeSettings').addEventListener('click', () => {
    document.getElementById('gameResultBanner').style.display = 'none';
    settingsModal.classList.add('active');
  });
  document.getElementById('btnCloseSettings').addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  // Slider số lượng địch
  const slider = document.getElementById('enemyCountSlider');
  const sliderDisplay = document.getElementById('sliderValDisplay');
  slider.addEventListener('input', (e) => {
    sliderDisplay.textContent = `${e.target.value} chiếc`;
  });

  // Render danh sách chọn Map vào Modal
  const mapGrid = document.getElementById('mapSelectorGrid');
  mapGrid.innerHTML = MAPS.map((m, idx) => `
    <div class="map-card ${idx === 0 ? 'selected' : ''}" data-map-id="${m.id}">
      <div class="map-thumb-preview">${m.icon}</div>
      <div class="map-name">${m.name}</div>
    </div>
  `).join('');

  mapGrid.querySelectorAll('.map-card').forEach(card => {
    card.addEventListener('click', () => {
      mapGrid.querySelectorAll('.map-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Nút Lưu & Bắt đầu trận đấu
  document.getElementById('btnSaveAndPlay').addEventListener('click', () => {
    // 1. Chế độ chơi
    const modeEl = document.querySelector('input[name="gameMode"]:checked');
    if (modeEl) Game.mode = modeEl.value;

    // 2. Map được chọn
    const selectedMapCard = mapGrid.querySelector('.map-card.selected');
    if (selectedMapCard) {
      const mapId = selectedMapCard.getAttribute('data-map-id');
      Game.selectedMap = MAPS.find(m => m.id === mapId) || MAPS[0];
    }

    // 3. Số lượng xe tăng địch
    Game.enemyCount = parseInt(slider.value, 10) || 3;

    // 4. Độ khó
    Game.botDifficulty = document.getElementById('botDifficultySelect').value || 'medium';

    settingsModal.classList.remove('active');
    startMatch();
  });
}

// Khởi chạy khi tải trang
window.addEventListener('DOMContentLoaded', () => {
  Game.ctx = Game.canvas.getContext('2d');
  setupControls();
  startMatch();
  requestAnimationFrame(gameLoop);
});
