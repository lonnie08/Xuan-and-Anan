// --- 粒子系统 ---
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.isStar = this.y < canvas.height * 0.7;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * (this.isStar ? 0.05 : 0.3);
        this.speedY = (Math.random() - 0.5) * (this.isStar ? 0.05 : 0.3);
        this.alpha = Math.random();
        this.fade = Math.random() * 0.02 + 0.005;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += this.fade;
        if (this.alpha > 1 || this.alpha < 0) this.fade *= -1;

        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.isStar ? "#ffffff" : "#adff2f";
        if (!this.isStar) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#adff2f";
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) particlesArray.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}

// --- 音乐逻辑 ---
const musicBtn = document.getElementById('musicControl');
const bgm = document.getElementById('bgm');

musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play();
        musicBtn.classList.add('playing');
    } else {
        bgm.pause();
        musicBtn.classList.remove('playing');
    }
});

// 首次点击页面任意处尝试开启音乐
document.body.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
    }
}, { once: true });

init();
animate();
