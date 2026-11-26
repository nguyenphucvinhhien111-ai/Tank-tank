/**
 * TANK TROUBLE 2026 - ULTIMATE ANDROID EDITION
 * - Hòm Vũ Khí Tiếp Tế: Tên Lửa Đuổi, Laser Xuyên Tường, Đạn Chùm Shotgun, Khiên Năng Lượng
 * - Cần Joystick Ảo Cảm Ứng Đa Điểm (Virtual Joystick) chuẩn Android
 * - Hiệu ứng Rung Màn Hình (Screen Shake) + Rung máy điện thoại (Haptics API)
 * - Vệt Bánh Xích Xe Tăng (Tank Tread Marks)
 * - Nhiều Map & Chế Độ Cướp Cờ (Capture The Flag)
 */

// ==========================================
// 1. CẤU HÌNH & HỆ THỐNG BẢN ĐỒ (MAPS)
// ==========================================
const MAPS = [
  {
    id: 'maze_classic',
    name: 'Mê Cung Kinh Điển',
    icon: '🧱',
    walls: [
      { x: 0, y: 0, w: 900, h: 14 },
      { x: 0, y: 586, w: 900, h: 14 },
      { x: 0, y: 0, w: 14, h: 600 },
      { x: 886, y: 0, w: 14, h: 600 },
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
    flagSpawn: { x: 820, y: 520 },
    playerBase: { x: 70, y: 70, r: 45 }
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
      { x: 380, y: 240, w: 140, h: 14 },
      { x: 440, y: 180, w: 14, h: 140 },
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
    playerBase: { x: 80, y: 300, r: 45 }
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
      { x: 220, y: 80, w: 20, h: 160 },
      { x: 220, y: 360, w: 20, h: 160 },
      { x: 660, y: 80, w: 20, h: 160 },
      { x: 660, y: 360, w: 20, h: 160 },
      { x: 340, y: 180, w: 220, h: 18 },
      { x: 340, y: 400, w: 220, h: 18 }
    ],
    playerSpawn: { x: 90, y: 90, angle: 0.5 },
    flagSpawn: { x: 810, y: 510 },
    playerBase: { x: 90, y: 90, r: 45 }
  }
];

const TANK_COLORS = {
  player: { 
    body: '#38bdf8', 
    bodyDark: '#0284c7', 
    turret: '#0ea5e9', 
    turretDark: '#0369a1',
    highlight: '#bae6fd',
    track: '#334155',
    trackWheel: '#64748b',
    name: 'Bạn' 
  },
  enemy1: { 
    body: '#fb7185', 
    bodyDark: '#e11d48', 
    turret: '#f43f5e', 
    turretDark: '#be123c',
    highlight: '#fecdd3',
    track: '#334155',
    trackWheel: '#64748b',
    name: 'Địch Đỏ' 
  },
  enemy2: { 
    body: '#4ade80', 
    bodyDark: '#16a34a', 
    turret: '#22c55e', 
    turretDark: '#15803d',
    highlight: '#bbf7d0',
    track: '#334155',
    trackWheel: '#64748b',
    name: 'Địch Xanh Lá' 
  },
  enemy3: { 
    body: '#facc15', 
    bodyDark: '#ca8a04', 
    turret: '#eab308', 
    turretDark: '#a16207',
    highlight: '#fef08a',
    track: '#334155',
    trackWheel: '#64748b',
    name: 'Địch Vàng' 
  },
  enemy4: { 
    body: '#c084fc', 
    bodyDark: '#9333ea', 
    turret: '#a855f7', 
    turretDark: '#7e22ce',
    highlight: '#f3e8ff',
    track: '#334155',
    trackWheel: '#64748b',
    name: 'Địch Tím' 
  },
  enemy5: { 
    body: '#fb923c', 
    bodyDark: '#ea580c', 
    turret: '#f97316', 
    turretDark: '#c2410c',
    highlight: '#ffedd5',
    track: '#334155',
    trackWheel: '#64748b',
    name: 'Địch Cam' 
  }
};

// Loại Vũ Khí
const WEAPON_TYPES = {
  CANNON: { name: 'ĐẠN THƯỜNG', icon: '💣', ammo: Infinity },
  MISSILE: { name: 'TÊN LỬA ĐUỔI', icon: '🚀', ammo: 3 },
  LASER: { name: 'LASER XUYÊN TƯỜNG', icon: '⚡', ammo: 2 },
  SHOTGUN: { name: 'ĐẠN CHÙM SHOTGUN', icon: '💥', ammo: 4 },
  SHIELD: { name: 'KHIÊN BẢO VỆ', icon: '🛡️', ammo: 1 }
};

// ==========================================
// 2. STATE GAME TỔNG QUAN
// ==========================================
const Game = {
  canvas: document.getElementById('gameCanvas'),
  ctx: null,
  mode: 'deathmatch',
  selectedMap: MAPS[0],
  enemyCount: 3,
  botDifficulty: 'medium',
  score: 0,
  over: false,
  screenShake: 0,

  player: null,
  enemies: [],
  bullets: [],
  missiles: [],
  lasers: [],
  particles: [],
  treadMarks: [],
  powerups: [],
  flag: null,

  keys: { up: false, down: false, left: false, right: false, fire: false },
  joystick: { active: false, x: 0, y: 0, angle: 0, power: 0 },
  audioCtx: null
};

// ==========================================
// 3. SOUND SYNTHESIZER & HAPTICS (RUNG ANDROID)
// ==========================================
function triggerHaptic(duration = 40) {
  try {
    if (navigator.vibrate) navigator.vibrate(duration);
  } catch (e) {}
}

function playSound(type) {
  try {
    if (!Game.audioCtx) Game.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = Game.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'fire') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'missile') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'laser') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'bounce') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
      osc.start(); osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'explode') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.55, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      osc.start(); osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'powerup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {}
}

// ==========================================
// 4. LỚP XE TANK (TANK TROUBLE ENGINE)
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
    this.maxSpeed = isEnemy ? 2.1 : 2.6;
    this.turnSpeed = 0.058;
    this.reloadTimer = 0;
    this.reloadCooldown = isEnemy ? 75 : 30;

    this.weapon = WEAPON_TYPES.CANNON;
    this.ammoLeft = Infinity;
    this.hasShield = false;
    this.alive = true;
    this.hasFlag = false;

    // AI
    this.aiTargetAngle = angle;
    this.aiTimer = 0;
  }

  equipWeapon(weaponType) {
    if (weaponType === WEAPON_TYPES.SHIELD) {
      this.hasShield = true;
    } else {
      this.weapon = weaponType;
      this.ammoLeft = weaponType.ammo;
    }
    if (!this.isEnemy) updateWeaponHUD();
    playSound('powerup');
  }

  update(walls) {
    if (!this.alive) return;
    if (this.reloadTimer > 0) this.reloadTimer--;

    // Lưu vết xích xe tank
    if (Math.abs(this.speed) > 0.5 && Math.random() < 0.35) {
      const offsetX = Math.cos(this.angle + Math.PI / 2) * 10;
      const offsetY = Math.sin(this.angle + Math.PI / 2) * 10;
      Game.treadMarks.push({ x: this.x + offsetX, y: this.y + offsetY, angle: this.angle, life: 250 });
      Game.treadMarks.push({ x: this.x - offsetX, y: this.y - offsetY, angle: this.angle, life: 250 });
      if (Game.treadMarks.length > 200) Game.treadMarks.splice(0, 2);
    }

    if (this.isEnemy) {
      this.updateAI(walls);
    }

    if (this.speed !== 0) {
      const nextX = this.x + Math.cos(this.angle) * this.speed;
      const nextY = this.y + Math.sin(this.angle) * this.speed;

      if (!this.checkWallCollision(nextX, nextY, walls)) {
        this.x = nextX;
        this.y = nextY;
      } else {
        this.speed = 0;
        if (this.isEnemy) this.aiTargetAngle += Math.PI * 0.75;
      }
    }
  }

  checkWallCollision(x, y, walls) {
    for (const w of walls) {
      const nx = Math.max(w.x, Math.min(x, w.x + w.w));
      const ny = Math.max(w.y, Math.min(y, w.y + w.h));
      if (Math.hypot(x - nx, y - ny) < this.radius + 2) return true;
    }
    return false;
  }

  updateAI(walls) {
    this.aiTimer--;
    const target = Game.player;
    if (!target || !target.alive) return;

    // Ưu tiên chạy đi nhặt hòm vũ khí nếu gần
    let targetX = target.x;
    let targetY = target.y;

    if (Game.powerups.length > 0 && Math.random() < 0.6) {
      const nearestBox = Game.powerups[0];
      targetX = nearestBox.x;
      targetY = nearestBox.y;
    }

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (this.aiTimer <= 0) {
      this.aiTimer = 30 + Math.random() * 30;
      const hasClear = this.hasLineOfSight(this.x, this.y, target.x, target.y, walls);

      if (hasClear && dist < 450) {
        this.aiTargetAngle = Math.atan2(target.y - this.y, target.x - this.x);
        this.aiShootReady = true;
      } else {
        this.aiTargetAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.0;
        this.aiShootReady = false;
      }
    }

    let angleDiff = this.aiTargetAngle - this.angle;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

    if (Math.abs(angleDiff) > 0.08) {
      this.angle += Math.sign(angleDiff) * this.turnSpeed;
    } else {
      this.speed = this.maxSpeed * 0.8;
      if (this.aiShootReady && Math.abs(angleDiff) < 0.25 && this.reloadTimer <= 0) {
        this.shoot();
      }
    }
  }

  hasLineOfSight(x1, y1, x2, y2, walls) {
    const steps = 14;
    for (let i = 1; i < steps; i++) {
      const cx = x1 + (x2 - x1) * (i / steps);
      const cy = y1 + (y2 - y1) * (i / steps);
      for (const w of walls) {
        if (cx >= w.x && cx <= w.x + w.w && cy >= w.y && cy <= w.y + w.h) return false;
      }
    }
    return true;
  }

  shoot() {
    if (this.reloadTimer > 0 || !this.alive) return;
    this.reloadTimer = this.reloadCooldown;
    const barrelLen = 22;
    const bx = this.x + Math.cos(this.angle) * barrelLen;
    const by = this.y + Math.sin(this.angle) * barrelLen;

    if (this.weapon === WEAPON_TYPES.MISSILE) {
      // 1. Tên Lửa Đuổi
      Game.missiles.push(new HomingMissile(bx, by, this.angle, this));
      playSound('missile');
      triggerHaptic(60);
      Game.screenShake = 6;
      this.consumeAmmo();
    } else if (this.weapon === WEAPON_TYPES.LASER) {
      // 2. Laser Xuyên Tường
      Game.lasers.push(new LaserBeam(bx, by, this.angle, this));
      playSound('laser');
      triggerHaptic(80);
      Game.screenShake = 9;
      this.consumeAmmo();
    } else if (this.weapon === WEAPON_TYPES.SHOTGUN) {
      // 3. Đạn Chùm Shotgun (5 viên bắn xòe)
      for (let i = -2; i <= 2; i++) {
        Game.bullets.push(new Bullet(bx, by, this.angle + i * 0.15, this));
      }
      playSound('fire');
      triggerHaptic(50);
      Game.screenShake = 7;
      this.consumeAmmo();
    } else {
      // 4. Đạn Nảy Tiêu Chuẩn
      Game.bullets.push(new Bullet(bx, by, this.angle, this));
      playSound('fire');
      triggerHaptic(30);
    }

    createMuzzleFlash(bx, by, this.angle);
  }

  consumeAmmo() {
    this.ammoLeft--;
    if (this.ammoLeft <= 0) {
      this.weapon = WEAPON_TYPES.CANNON;
      this.ammoLeft = Infinity;
    }
    if (!this.isEnemy) updateWeaponHUD();
  }

  draw(ctx) {
    if (!this.alive) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // 0. Đổ bóng hoạt hình (Cartoon Drop Shadow) dưới thân xe
    ctx.save();
    ctx.rotate(this.angle);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.roundRect(-this.width / 2 + 2, -this.height / 2 + 5, this.width, this.height, 8);
    ctx.fill();
    ctx.restore();

    ctx.rotate(this.angle);

    // 1. Khiên Năng Lượng Hoạt Hình Bong Bóng (nếu có)
    if (this.hasShield) {
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fill();
      ctx.stroke();

      // Vệt sáng phản chiếu bong bóng
      ctx.beginPath();
      ctx.arc(-10, -10, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
    }

    // 2. Hai Dải Xích Xe Tăng Phong Cách Hoạt Hình (Chibi Treads)
    const drawTrack = (offsetY) => {
      // Khung xích chính viền đậm
      ctx.fillStyle = this.color.track;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-this.width / 2 - 1, offsetY, this.width + 2, 8, 4);
      ctx.fill();
      ctx.stroke();

      // Bánh xe lăn bên trong xích (Wheels)
      ctx.fillStyle = this.color.trackWheel;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      for (let wx = -this.width / 2 + 5; wx <= this.width / 2 - 5; wx += 8) {
        ctx.beginPath();
        ctx.arc(wx, offsetY + 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    };
    drawTrack(-this.height / 2 - 1);
    drawTrack(this.height / 2 - 7);

    // 3. Thân Xe Tăng Bo Tròn Hoạt Hình (Chibi Armor Body)
    ctx.fillStyle = this.color.body;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2 + 3, -this.height / 2 + 4, this.width - 6, this.height - 8, 6);
    ctx.fill();
    ctx.stroke();

    // Vạt màu bóng tối dưới thân xe (Shading)
    ctx.fillStyle = this.color.bodyDark;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2 + 3, 2, this.width - 6, this.height / 2 - 6, [0, 0, 6, 6]);
    ctx.fill();

    // Vệt sáng bóng phía trên (Highlight)
    ctx.fillStyle = this.color.highlight;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2 + 6, -this.height / 2 + 6, this.width - 12, 4, 2);
    ctx.fill();

    // 4. Nòng Pháo Mập Mạp Hoạt Hình (Chibi Cannon Barrel)
    ctx.fillStyle = this.color.turret;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(0, -4.5, 23, 9, 3);
    ctx.fill();
    ctx.stroke();

    // Đầu họng pháo (Muzzle Cap)
    ctx.fillStyle = this.color.turretDark;
    ctx.beginPath();
    ctx.roundRect(19, -6, 5, 12, 2);
    ctx.fill();
    ctx.stroke();

    // Lỗ bắn tròn xoe
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(23, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Tháp Pháo Tròn Nổi Bật (Turret Dome)
    ctx.beginPath();
    ctx.arc(-2, 0, 11, 0, Math.PI * 2);
    ctx.fillStyle = this.color.turret;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3.5;
    ctx.fill();
    ctx.stroke();

    // Nắp cửa hầm xe tăng (Hatch)
    ctx.beginPath();
    ctx.arc(-2, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = this.color.turretDark;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Đốm sáng phản chiếu mắt hoạt hình trên nóc
    ctx.beginPath();
    ctx.arc(-5, -3, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();

    // 6. Cờ CTF trên nóc xe
    if (this.hasFlag) {
      ctx.font = '20px sans-serif';
      ctx.fillText('🚩', -10, -18);
    }

    ctx.restore();
  }
}

// ==========================================
// 5. CÁC LOẠI ĐẠN & VŨ KHÍ CAO CẤP
// ==========================================

// Đạn thường nảy tường
class Bullet {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * 4.8;
    this.vy = Math.sin(angle) * 4.8;
    this.radius = 4;
    this.owner = owner;
    this.bounces = 5;
    this.life = 360;
  }

  update(walls) {
    this.life--;
    if (this.life <= 0) return false;
    this.x += this.vx;
    this.y += this.vy;

    for (const w of walls) {
      if (this.x + this.radius > w.x && this.x - this.radius < w.x + w.w &&
          this.y + this.radius > w.y && this.y - this.radius < w.y + w.h) {
        const oL = Math.abs(this.x + this.radius - w.x);
        const oR = Math.abs(w.x + w.w - (this.x - this.radius));
        const oT = Math.abs(this.y + this.radius - w.y);
        const oB = Math.abs(w.y + w.h - (this.y - this.radius));
        const minO = Math.min(oL, oR, oT, oB);

        if (minO === oL || minO === oR) this.vx = -this.vx;
        else this.vy = -this.vy;

        this.bounces--;
        playSound('bounce');
        createSparks(this.x, this.y, 4);
        if (this.bounces <= 0) return false;
      }
    }

    return checkHitTank(this.x, this.y, this.radius, this.owner);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

// Tên Lửa Đuổi (Homing Missile)
class HomingMissile {
  constructor(x, y, angle, owner) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = 3.6;
    this.owner = owner;
    this.life = 240;
  }

  update(walls) {
    this.life--;
    if (this.life <= 0) {
      createExplosion(this.x, this.y);
      return false;
    }

    // Tìm mục tiêu gần nhất
    const targets = (this.owner.isEnemy ? [Game.player] : Game.enemies).filter(t => t && t.alive);
    if (targets.length > 0) {
      let nearest = targets[0];
      let minDist = Math.hypot(nearest.x - this.x, nearest.y - this.y);
      for (const t of targets) {
        const d = Math.hypot(t.x - this.x, t.y - this.y);
        if (d < minDist) { minDist = d; nearest = t; }
      }

      // Xoay hướng đuổi theo
      const targetAngle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += Math.sign(diff) * 0.055;
    }

    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Vệt khói tên lửa
    if (Math.random() < 0.6) {
      Game.particles.push({
        x: this.x - Math.cos(this.angle) * 10,
        y: this.y - Math.sin(this.angle) * 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 3 + Math.random() * 2,
        color: 'rgba(255, 100, 0, 0.6)',
        life: 20
      });
    }

    // Va vào tường thì nổ
    for (const w of walls) {
      if (this.x >= w.x && this.x <= w.x + w.w && this.y >= w.y && this.y <= w.y + w.h) {
        createExplosion(this.x, this.y);
        playSound('explode');
        Game.screenShake = 6;
        return false;
      }
    }

    return checkHitTank(this.x, this.y, 6, this.owner);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(-8, -3, 16, 6);
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(8, -4); ctx.lineTo(13, 0); ctx.lineTo(8, 4); ctx.fill();
    ctx.restore();
  }
}

// Laser Xuyên Tường
class LaserBeam {
  constructor(x, y, angle, owner) {
    this.startX = x;
    this.startY = y;
    this.endX = x + Math.cos(angle) * 1200;
    this.endY = y + Math.sin(angle) * 1200;
    this.angle = angle;
    this.owner = owner;
    this.life = 15; // Tia chớp 15 frame

    // Kiểm tra trúng tất cả tank nằm trên đường thẳng laser
    const allTanks = [Game.player, ...Game.enemies];
    for (const tank of allTanks) {
      if (!tank || !tank.alive || tank === this.owner) continue;
      // Khoảng cách từ tâm tank đến đoạn thẳng laser
      const dist = distToSegment({ x: tank.x, y: tank.y }, { x: this.startX, y: this.startY }, { x: this.endX, y: this.endY });
      if (dist < tank.radius + 6) {
        destroyTank(tank);
      }
    }
  }

  update() {
    this.life--;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.strokeStyle = `rgba(0, 242, 254, ${this.life / 15})`;
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Lõi laser trắng
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

function distToSegment(p, v, w) {
  const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

// Kiểm tra trúng đạn xe tank
function checkHitTank(x, y, radius, owner) {
  const allTanks = [Game.player, ...Game.enemies];
  for (const t of allTanks) {
    if (!t || !t.alive) continue;
    if (Math.hypot(x - t.x, y - t.y) < t.radius + radius) {
      // Nếu có Khiên thì vỡ khiên trước
      if (t.hasShield) {
        t.hasShield = false;
        createSparks(t.x, t.y, 16);
        playSound('bounce');
        return false;
      }

      destroyTank(t);
      return false;
    }
  }
  return true;
}

function destroyTank(tank) {
  tank.alive = false;
  createExplosion(tank.x, tank.y);
  playSound('explode');
  triggerHaptic(120);
  Game.screenShake = 12;

  if (tank.hasFlag && Game.flag) {
    Game.flag.carrier = null;
    Game.flag.x = Game.selectedMap.flagSpawn.x;
    Game.flag.y = Game.selectedMap.flagSpawn.y;
    updateFlagHUD();
  }

  if (tank === Game.player) {
    endGame(false, 'Xe tăng của bạn đã bị bắn nổ!');
  } else {
    Game.score += 100;
    document.getElementById('scorePlayer').textContent = Game.score;
    checkGameStatus();
  }
}

// ==========================================
// 6. THÙNG VŨ KHÍ TIẾP TẾ (POWER-UP CRATES)
// ==========================================
class PowerupBox {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = 22;
  }

  update() {
    const allTanks = [Game.player, ...Game.enemies];
    for (const t of allTanks) {
      if (!t || !t.alive) continue;
      if (Math.hypot(this.x - t.x, this.y - t.y) < t.radius + this.size / 2) {
        t.equipWeapon(this.type);
        return false;
      }
    }
    return true;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const pulse = 1 + Math.sin(Date.now() / 150) * 0.1;
    ctx.scale(pulse, pulse);

    // Hòm gỗ viền kim loại
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-this.size / 2, -this.size / 2, this.size, this.size, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.type.icon, 0, 1);
    ctx.restore();
  }
}

function spawnRandomPowerup(walls) {
  if (Game.powerups.length >= 3) return;
  const types = [WEAPON_TYPES.MISSILE, WEAPON_TYPES.LASER, WEAPON_TYPES.SHOTGUN, WEAPON_TYPES.SHIELD];
  const type = types[Math.floor(Math.random() * types.length)];

  // Tìm vị trí trống không trùng tường
  for (let attempt = 0; attempt < 20; attempt++) {
    const rx = 60 + Math.random() * 780;
    const ry = 60 + Math.random() * 480;
    let hit = false;
    for (const w of walls) {
      if (rx >= w.x - 20 && rx <= w.x + w.w + 20 && ry >= w.y - 20 && ry <= w.y + w.h + 20) {
        hit = true; break;
      }
    }
    if (!hit) {
      Game.powerups.push(new PowerupBox(rx, ry, type));
      break;
    }
  }
}

// ==========================================
// 7. LỚP CỜ (CHẾ ĐỘ CƯỚP CỜ)
// ==========================================
class Flag {
  constructor(x, y) {
    this.x = x; this.y = y; this.radius = 16; this.carrier = null;
  }
  update() {
    if (this.carrier) {
      this.x = this.carrier.x;
      this.y = this.carrier.y;
      if (this.carrier === Game.player) {
        const base = Game.selectedMap.playerBase;
        if (Math.hypot(this.x - base.x, this.y - base.y) < base.r) {
          endGame(true, 'XUẤT SẮC! BẠN ĐÃ CƯỚP ĐƯỢC CỜ ĐỊCH VỀ CĂN CỨ!');
        }
      }
    } else {
      const all = [Game.player, ...Game.enemies];
      for (const t of all) {
        if (!t || !t.alive) continue;
        if (Math.hypot(this.x - t.x, this.y - t.y) < this.radius + t.radius) {
          this.carrier = t;
          t.hasFlag = true;
          updateFlagHUD();
          break;
        }
      }
    }
  }
  draw(ctx) {
    if (this.carrier) return;
    ctx.save();
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚩', this.x, this.y);
    ctx.restore();
  }
}

// Hiệu ứng nổ & tia lửa
function createExplosion(x, y) {
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 5.0;
    Game.particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      color: ['#ff3366', '#ff9900', '#ffcc00', '#444'][Math.floor(Math.random() * 4)],
      life: 30 + Math.random() * 20
    });
  }
}

function createSparks(x, y, count = 4) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    Game.particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      size: 2.5, color: '#ffdd55', life: 14
    });
  }
}

function createMuzzleFlash(x, y, angle) {
  for (let i = 0; i < 6; i++) {
    const sp = (Math.random() - 0.5) * 0.5;
    Game.particles.push({
      x, y, vx: Math.cos(angle + sp) * 3, vy: Math.sin(angle + sp) * 3,
      size: 3.5, color: '#ffaa00', life: 8
    });
  }
}

// ==========================================
// 8. BẮT ĐẦU TRẬN ĐẤU (START MATCH)
// ==========================================
function startMatch() {
  Game.over = false;
  Game.bullets = [];
  Game.missiles = [];
  Game.lasers = [];
  Game.particles = [];
  Game.powerups = [];
  Game.treadMarks = [];
  document.getElementById('gameResultBanner').style.display = 'none';

  const map = Game.selectedMap;
  Game.player = new Tank(map.playerSpawn.x, map.playerSpawn.y, map.playerSpawn.angle, false, TANK_COLORS.player);

  Game.enemies = [];
  const enemyColorKeys = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];
  const spawns = [
    { x: 800, y: 100, angle: Math.PI },
    { x: 800, y: 500, angle: Math.PI },
    { x: 450, y: 520, angle: -Math.PI / 2 },
    { x: 120, y: 500, angle: -0.5 },
    { x: 450, y: 80, angle: Math.PI / 2 },
    { x: 700, y: 300, angle: Math.PI }
  ];

  for (let i = 0; i < Game.enemyCount; i++) {
    const sp = spawns[i % spawns.length];
    const color = TANK_COLORS[enemyColorKeys[i % enemyColorKeys.length]];
    const e = new Tank(sp.x + (Math.random() - 0.5) * 20, sp.y + (Math.random() - 0.5) * 20, sp.angle, true, color);
    if (Game.botDifficulty === 'easy') e.maxSpeed = 1.7;
    if (Game.botDifficulty === 'hard') e.maxSpeed = 2.4;
    Game.enemies.push(e);
  }

  if (Game.mode === 'capture_flag') {
    Game.flag = new Flag(map.flagSpawn.x, map.flagSpawn.y);
    document.getElementById('flagStatusBox').style.display = 'flex';
    document.getElementById('hudGameMode').textContent = 'CƯỚP CỜ (CTF)';
  } else {
    Game.flag = null;
    document.getElementById('flagStatusBox').style.display = 'none';
    document.getElementById('hudGameMode').textContent = 'SINH TỒN';
  }

  updateEnemyCountHUD();
  updateWeaponHUD();
  updateFlagHUD();
}

function updateWeaponHUD() {
  const p = Game.player;
  const icon = document.getElementById('hudWeaponIcon');
  const name = document.getElementById('hudWeaponName');
  if (!p) return;
  icon.textContent = p.weapon.icon;
  name.textContent = p.weapon === WEAPON_TYPES.CANNON ? 'ĐẠN THƯỜNG' : `${p.weapon.name} (${p.ammoLeft})`;
}

function updateEnemyCountHUD() {
  document.getElementById('enemyCountDisplay').textContent = Game.enemies.filter(e => e.alive).length;
}

function updateFlagHUD() {
  const box = document.getElementById('flagStatusText');
  if (!Game.flag) return;
  if (!Game.flag.carrier) box.textContent = 'Cờ: Căn cứ địch';
  else if (Game.flag.carrier === Game.player) box.textContent = 'Bạn giữ cờ! Chạy về!';
  else box.textContent = 'Địch đang giữ cờ!';
}

function checkGameStatus() {
  updateEnemyCountHUD();
  const alive = Game.enemies.filter(e => e.alive).length;
  if (alive === 0 && Game.mode === 'deathmatch') {
    endGame(true, 'XUẤT SẮC! BẠN ĐÃ TIÊU DIỆT TOÀN BỘ XE TĂNG KẺ THÙ!');
  }
}

function endGame(isWin, message) {
  Game.over = true;
  const banner = document.getElementById('gameResultBanner');
  const icon = document.getElementById('bannerIcon');
  const title = document.getElementById('bannerTitle');
  const desc = document.getElementById('bannerDesc');
  icon.textContent = isWin ? '🏆' : '💥';
  title.textContent = isWin ? 'CHIẾN THẮNG!' : 'THẤT BẠI!';
  title.style.color = isWin ? '#ffcc00' : '#ff3366';
  desc.textContent = message;
  banner.style.display = 'flex';
}

// ==========================================
// 9. VÒNG LẶP CHÍNH CỦA GAME (GAME LOOP)
// ==========================================
let lastPowerupSpawnTime = 0;

function gameLoop(time) {
  requestAnimationFrame(gameLoop);

  // Sinh ngẫu nhiên hòm vũ khí sau mỗi 8-12 giây
  if (time - lastPowerupSpawnTime > 9000) {
    lastPowerupSpawnTime = time;
    spawnRandomPowerup(Game.selectedMap.walls);
  }

  const ctx = Game.ctx;
  const walls = Game.selectedMap.walls;

  ctx.save();
  // Rung màn hình (Screen Shake)
  if (Game.screenShake > 0) {
    const sx = (Math.random() - 0.5) * Game.screenShake;
    const sy = (Math.random() - 0.5) * Game.screenShake;
    ctx.translate(sx, sy);
    Game.screenShake *= 0.88;
    if (Game.screenShake < 0.5) Game.screenShake = 0;
  }

  // 0. Mặt sàn chiến trường phong cách hoạt hình (Cartoon Sand / Arena Floor)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

  // Hoa văn chấm bi / ô gạch hoạt hình nhẹ nhàng
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < Game.canvas.width; x += 35) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, Game.canvas.height); ctx.stroke();
  }
  for (let y = 0; y < Game.canvas.height; y += 35) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Game.canvas.width, y); ctx.stroke();
  }

  // Vẽ Vết Xích Xe Tank (Tread marks)
  for (let i = Game.treadMarks.length - 1; i >= 0; i--) {
    const t = Game.treadMarks[i];
    t.life--;
    if (t.life <= 0) { Game.treadMarks.splice(i, 1); continue; }
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(t.angle);
    ctx.fillStyle = `rgba(0, 0, 0, ${t.life / 600})`;
    ctx.fillRect(-2, -3, 4, 6);
    ctx.restore();
  }

  // Căn cứ CTF
  if (Game.mode === 'capture_flag') {
    const b = Game.selectedMap.playerBase;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.12)';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    ctx.fill(); ctx.stroke();
  }

  // 1. Cập nhật Người chơi (Joystick Android + Phím)
  const p = Game.player;
  if (p && p.alive) {
    if (Game.joystick.active && Game.joystick.power > 0.15) {
      let diff = Game.joystick.angle - p.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      p.angle += Math.sign(diff) * Math.min(Math.abs(diff), p.turnSpeed * 1.6);
      p.speed = p.maxSpeed * Game.joystick.power;
    } else {
      if (Game.keys.left) p.angle -= p.turnSpeed;
      if (Game.keys.right) p.angle += p.turnSpeed;
      if (Game.keys.up) p.speed = p.maxSpeed;
      else if (Game.keys.down) p.speed = -p.maxSpeed * 0.6;
      else p.speed = 0;
    }

    if (Game.keys.fire) p.shoot();
    p.update(walls);
    p.draw(ctx);
  }

  // 2. Kẻ địch
  for (const e of Game.enemies) { e.update(walls); e.draw(ctx); }

  // 3. Hòm vũ khí
  for (let i = Game.powerups.length - 1; i >= 0; i--) {
    if (!Game.powerups[i].update()) Game.powerups.splice(i, 1);
    else Game.powerups[i].draw(ctx);
  }

  // 4. Cờ
  if (Game.flag) { Game.flag.update(); Game.flag.draw(ctx); }

  // 5. Đạn & Tên lửa & Laser
  for (let i = Game.bullets.length - 1; i >= 0; i--) {
    if (!Game.bullets[i].update(walls)) Game.bullets.splice(i, 1);
    else Game.bullets[i].draw(ctx);
  }
  for (let i = Game.missiles.length - 1; i >= 0; i--) {
    if (!Game.missiles[i].update(walls)) Game.missiles.splice(i, 1);
    else Game.missiles[i].draw(ctx);
  }
  for (let i = Game.lasers.length - 1; i >= 0; i--) {
    if (!Game.lasers[i].update()) Game.lasers.splice(i, 1);
    else Game.lasers[i].draw(ctx);
  }

  // 6. Hạt Particles
  for (let i = Game.particles.length - 1; i >= 0; i--) {
    const pt = Game.particles[i];
    pt.x += pt.vx; pt.y += pt.vy; pt.life--;
    if (pt.life <= 0) Game.particles.splice(i, 1);
    else {
      ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fillStyle = pt.color; ctx.fill();
    }
  }

  // 7. Bức tường gạch hoạt hình (Cartoon Brick Walls)
  for (const w of walls) {
    // Đổ bóng tường (Drop Shadow)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(w.x + 4, w.y + 4, w.w, w.h);

    // Thân tường gạch màu cam đất ấm áp
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(w.x, w.y, w.w, w.h, 4);
    ctx.fill();
    ctx.stroke();

    // Mặt trên sáng của tường (Highlight top)
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.roundRect(w.x + 2, w.y + 2, w.w - 4, Math.min(w.h - 4, 4), 2);
    ctx.fill();

    // Khắc rãnh gạch hoạt hình
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1.5;
    if (w.w > w.h) {
      for (let gx = w.x + 24; gx < w.x + w.w - 10; gx += 28) {
        ctx.beginPath(); ctx.moveTo(gx, w.y + 3); ctx.lineTo(gx, w.y + w.h - 3); ctx.stroke();
      }
    } else {
      for (let gy = w.y + 24; gy < w.y + w.h - 10; gy += 28) {
        ctx.beginPath(); ctx.moveTo(w.x + 3, gy); ctx.lineTo(w.x + w.w - 3, gy); ctx.stroke();
      }
    }
  }

  ctx.restore();
}

// ==========================================
// 10. ĐIỀU KHIỂN CẢM ỨNG JOYSTICK CHO ANDROID
// ==========================================
function setupAndroidJoystick() {
  const zone = document.getElementById('joystickZone');
  const base = document.getElementById('joystickBase');
  const stick = document.getElementById('joystickStick');
  const fireBtn = document.getElementById('touchFireBtn');

  let touchId = null;
  const maxRadius = 45;

  const handleTouch = (touch) => {
    const rect = base.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);

    Game.joystick.active = true;
    Game.joystick.angle = Math.atan2(dy, dx);
    Game.joystick.power = Math.min(1, dist / maxRadius);

    const clampedDist = Math.min(dist, maxRadius);
    const stickX = Math.cos(Game.joystick.angle) * clampedDist;
    const stickY = Math.sin(Game.joystick.angle) * clampedDist;
    stick.style.transform = `translate(${stickX}px, ${stickY}px)`;
  };

  zone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (touchId === null) {
      touchId = e.changedTouches[0].identifier;
      handleTouch(e.changedTouches[0]);
    }
  }, { passive: false });

  zone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        handleTouch(e.changedTouches[i]);
        break;
      }
    }
  }, { passive: false });

  const resetJoystick = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId) {
        touchId = null;
        Game.joystick.active = false;
        Game.joystick.power = 0;
        stick.style.transform = `translate(0px, 0px)`;
        break;
      }
    }
  };
  zone.addEventListener('touchend', resetJoystick);
  zone.addEventListener('touchcancel', resetJoystick);

  // Nút Bắn Cảm Ứng
  fireBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    Game.keys.fire = true;
    if (Game.player) Game.player.shoot();
  }, { passive: false });

  fireBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    Game.keys.fire = false;
  }, { passive: false });

  // Bàn phím máy tính hỗ trợ song song
  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowup' || k === 'w') Game.keys.up = true;
    if (k === 'arrowdown' || k === 's') Game.keys.down = true;
    if (k === 'arrowleft' || k === 'a') Game.keys.left = true;
    if (k === 'arrowright' || k === 'd') Game.keys.right = true;
    if (k === ' ' || k === 'j') { Game.keys.fire = true; e.preventDefault(); }
    if (k === 'r') startMatch();
  });
  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'arrowup' || k === 'w') Game.keys.up = false;
    if (k === 'arrowdown' || k === 's') Game.keys.down = false;
    if (k === 'arrowleft' || k === 'a') Game.keys.left = false;
    if (k === 'arrowright' || k === 'd') Game.keys.right = false;
    if (k === ' ' || k === 'j') Game.keys.fire = false;
  });
}

function setupModals() {
  const modal = document.getElementById('settingsModal');
  document.getElementById('btnSettings').addEventListener('click', () => modal.classList.add('active'));
  document.getElementById('btnCloseSettings').addEventListener('click', () => modal.classList.remove('active'));
  document.getElementById('btnRestartQuick').addEventListener('click', startMatch);
  document.getElementById('btnPlayAgain').addEventListener('click', startMatch);
  document.getElementById('btnChangeSettings').addEventListener('click', () => {
    document.getElementById('gameResultBanner').style.display = 'none';
    modal.classList.add('active');
  });

  const slider = document.getElementById('enemyCountSlider');
  const disp = document.getElementById('sliderValDisplay');
  slider.addEventListener('input', (e) => disp.textContent = `${e.target.value} chiếc`);

  const mapGrid = document.getElementById('mapSelectorGrid');
  mapGrid.innerHTML = MAPS.map((m, idx) => `
    <div class="map-card ${idx === 0 ? 'selected' : ''}" data-map-id="${m.id}">
      <div class="map-thumb-preview">${m.icon}</div>
      <div class="map-name">${m.name}</div>
    </div>
  `).join('');

  mapGrid.querySelectorAll('.map-card').forEach(c => {
    c.addEventListener('click', () => {
      mapGrid.querySelectorAll('.map-card').forEach(card => card.classList.remove('selected'));
      c.classList.add('selected');
    });
  });

  document.getElementById('btnSaveAndPlay').addEventListener('click', () => {
    const modeEl = document.querySelector('input[name="gameMode"]:checked');
    if (modeEl) Game.mode = modeEl.value;

    const sel = mapGrid.querySelector('.map-card.selected');
    if (sel) {
      const id = sel.getAttribute('data-map-id');
      Game.selectedMap = MAPS.find(m => m.id === id) || MAPS[0];
    }
    Game.enemyCount = parseInt(slider.value, 10) || 3;
    Game.botDifficulty = document.getElementById('botDifficultySelect').value || 'medium';
    modal.classList.remove('active');
    startMatch();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  Game.ctx = Game.canvas.getContext('2d');
  setupAndroidJoystick();
  setupModals();
  startMatch();
  requestAnimationFrame(gameLoop);
});
