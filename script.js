let highestZ = 1;

class Paper {
    holdingPaper = false;
    touchActive = false;
    touchIdentifier = null;
    touchX = 0;
    touchY = 0;
    prevTouchX = 0;
    prevTouchY = 0;
    mouseActive = false;
    mouseX = 0;
    mouseY = 0;
    prevMouseX = 0;
    prevMouseY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {
        const moveHandler = (x, y) => {
            if (!this.rotating) {
                if (this.mouseActive) {
                    this.mouseX = x;
                    this.mouseY = y;
                    this.velX = this.mouseX - this.prevMouseX;
                    this.velY = this.mouseY - this.prevMouseY;
                } else if (this.touchActive) {
                    this.touchX = x;
                    this.touchY = y;
                    this.velX = this.touchX - this.prevTouchX;
                    this.velY = this.touchY - this.prevTouchY;
                }
            }
            const dirX = x - this.touchX;
            const dirY = y - this.touchY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;
            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;
            if (this.rotating) {
                this.rotation = degrees;
            }
            if (this.holdingPaper) {
                if (!this.rotating) {
                    if (this.mouseActive) {
                        this.currentPaperX += this.velX;
                        this.currentPaperY += this.velY;
                        this.prevMouseX = this.mouseX;
                        this.prevMouseY = this.mouseY;
                    } else if (this.touchActive) {
                        this.currentPaperX += this.velX;
                        this.currentPaperY += this.velY;
                        this.prevTouchX = this.touchX;
                        this.prevTouchY = this.touchY;
                    }
                }
                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        };

        const startHandler = (x, y) => {
            if (this.mouseActive) {
                this.mouseX = x;
                this.mouseY = y;
                this.prevMouseX = x;
                this.prevMouseY = y;
            } else if (this.touchActive) {
                const touch = x.changedTouches[0];
                this.touchIdentifier = touch.identifier;
                this.touchX = touch.clientX;
                this.touchY = touch.clientY;
                this.prevTouchX = touch.clientX;
                this.prevTouchY = touch.clientY;
                if (x.touches.length === 1) {
                    this.holdingPaper = true;
                    paper.style.zIndex = highestZ;
                    highestZ += 1;
                }
                if (x.touches.length === 2) {
                    this.rotating = true;
                }
            }
        };

        const moveListener = (e) => {
            e.preventDefault();
            const x = (e.clientX !== undefined) ? e.clientX : e.changedTouches[0].clientX;
            const y = (e.clientY !== undefined) ? e.clientY : e.changedTouches[0].clientY;
            moveHandler(x, y);
        };

        paper.addEventListener('mousedown', (e) => {
            this.mouseActive = true;
            startHandler(e.clientX, e.clientY);
        });

        paper.addEventListener('touchstart', (e) => {
            this.touchActive = true;
            startHandler(e);
        });

        paper.addEventListener('mousemove', moveListener);
        paper.addEventListener('touchmove', (e) => moveListener(e));

        const endHandler = () => {
            if (this.touchActive || this.mouseActive) {
                this.holdingPaper = false;
                this.rotating = false;
                this.touchActive = false;
                this.mouseActive = false;
            }
        };

        window.addEventListener('mouseup', endHandler);
        paper.addEventListener('touchend', endHandler);
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
