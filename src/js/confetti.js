// 声明全局变量
var canvas1, ctx, W, H;
var mp = 25;    //纸屑数量
var deactivationTimerHandler, reactivationTimerHandler, animationHandler;
var particles = [];
var angle = 0;
var tiltAngle = 0;
var confettiActive = true;
var animationComplete = true;

// 定义纸屑颜色选项
var particleColors = {
    colorOptions: ["DodgerBlue", "OliveDrab", "Gold", "pink", "SlateBlue", "lightblue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"],
    colorIndex: 0,
    colorIncrementer: 0,
    colorThreshold: 10,
    // 获取纸屑的颜色
    getColor: function () {
        if (this.colorIncrementer >= 10) {
            this.colorIncrementer = 0;
            this.colorIndex++;
            if (this.colorIndex >= this.colorOptions.length) {
                this.colorIndex = 0;
            }
        }
        this.colorIncrementer++;
        return this.colorOptions[this.colorIndex];
    }
};

// 定义纸屑粒子的构造函数
function confettiParticle(t, size) {
    this.x = Math.random() * W;
    this.y = Math.random() * H - H;
    this.r = size; // 使用传递的纸屑大小
    this.d = Math.random() * mp + 10;
    this.color = t;
    this.tilt = Math.floor(10 * Math.random()) - 10;
    this.tiltAngleIncremental = 0.07 * Math.random() + 0.05;
    this.tiltAngle = 0;
    this.draw = function () {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
        ctx.stroke();
    }
}

// 设置全局变量
function SetGlobals() {
    canvas1 = document.getElementById("canvas");
    ctx = canvas1.getContext("2d");
    W = window.innerWidth;
    H = window.innerHeight;
    canvas1.width = W;
    canvas1.height = H;
}

// 初始化纸屑效果
function InitializeConfetti() {
    particles = [];
    animationComplete = false;
    var containerWidth = document.querySelector('.userInfo').offsetWidth;
    var containerHeight = document.querySelector('.userInfo').offsetHeight;
    var maxParticleSize = Math.min(containerWidth, containerHeight) * 0.15; // 调整这个系数以控制纸屑大小
    for (var t = 0; t < mp; t++) {
        var i = particleColors.getColor();
        var particleSize = RandomFromTo(maxParticleSize * 0.5, maxParticleSize); // 随机生成纸屑大小
        particles.push(new confettiParticle(i, particleSize));
    }
    StartConfetti();
}

// 绘制纸屑效果
function Draw() {
    ctx.clearRect(0, 0, W, H);
    var i = [];
    for (var n = 0; n < mp; n++) {
        var t = n;
        i.push(particles[t].draw());
    }
    Update();
    return i;
}

// 生成指定范围内的随机整数
function RandomFromTo(t, i) {
    return Math.floor(Math.random() * (i - t + 1) + t);
}

// 更新纸屑效果
function Update() {
    var i = 0;
    angle += 0.01;
    tiltAngle += 0.1;
    for (var n = 0; n < mp; n++) {
        var t = particles[n];
        if (animationComplete) return;
        if (!confettiActive && t.y < -15) {
            t.y = H + 100;
        } else {
            stepParticle(t, n);
            if (t.y <= H) i++;
            CheckForReposition(t, n);
        }
    }
    if (i === 0) StopConfetti();
}

// 检查纸屑是否需要重新定位
function CheckForReposition(t, i) {
    if (t.x > W + 20 || t.x < -20 || t.y > H) {
        if (confettiActive) {
            if (i % 5 > 0 || i % 2 == 0) {
                repositionParticle(t, Math.random() * W, -10, Math.floor(10 * Math.random()) - 10);
            } else {
                if (Math.sin(angle) > 0) {
                    repositionParticle(t, -5, Math.random() * H, Math.floor(10 * Math.random()) - 10);
                } else {
                    repositionParticle(t, W + 5, Math.random() * H, Math.floor(10 * Math.random()) - 10);
                }
            }
        }
    }
}

// 移动纸屑粒子
function stepParticle(t, i) {
    t.tiltAngle += t.tiltAngleIncremental;
    t.y += (Math.cos(angle + t.d) + 3 + t.r / 2) / 5;   //下降速度
    t.x += Math.sin(angle);
    t.tilt = 15 * Math.sin(t.tiltAngle - i / 3);
}

// 重新定位纸屑粒子
function repositionParticle(t, i, n, e) {
    t.x = i;
    t.y = n;
    t.tilt = e;
}

// 启动纸屑效果
function StartConfetti() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas1.width = W;
    canvas1.height = H;
    (function t() {
        if (animationComplete) return null;
        animationHandler = requestAnimFrame(t);
        Draw();
    })();
}

// 清除定时器
function ClearTimers() {
    clearTimeout(reactivationTimerHandler);
    clearTimeout(animationHandler);
}

// 停止纸屑效果
function DeactivateConfetti() {
    confettiActive = false;
    ClearTimers();
}

// 停止纸屑效果并清除画布
function StopConfetti() {
    animationComplete = true;
    if (ctx !== null) ctx.clearRect(0, 0, W, H);
}

// 重新启动纸屑效果
function RestartConfetti() {
    ClearTimers();
    StopConfetti();
    reactivationTimerHandler = setTimeout(function () {
        confettiActive = true;
        animationComplete = false;
        InitializeConfetti();
    }, 100);
}

// 当页面加载完毕后执行的初始化函数
document.addEventListener("DOMContentLoaded", function () {
    SetGlobals();
    InitializeConfetti();

    // 当窗口大小变化时，重新设置画布大小
    window.addEventListener("resize", function () {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas1.width = W;
        canvas1.height = H;
    });
});

window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
};


// 导出需要在外部使用的函数
export {
    InitializeConfetti,
    SetGlobals,
    DeactivateConfetti,
    RestartConfetti
};