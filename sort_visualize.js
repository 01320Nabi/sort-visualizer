function SortVisualizer(canvas, width, height, array, drawMode) {
    canvas.width = width;
    canvas.height = height;
    this.ctx = canvas.getContext('2d');
    this.drawMode = drawMode;
    if(drawMode == 0) {
        this.ctx.scale(width, -height);
        this.ctx.translate(0, -1);
    }
    else if(drawMode == 1) {
        this.ctx.scale(width/2, height/2);
        this.ctx.translate(1, 1);
    }
    this.array = [...array];
    this.__array = [...array];
    this.length = array.length;
    this.max = -2147483648;
    this.min = 2147483647;
    this.array.forEach(i => {
        this.max = Math.max(this.max, i);
        this.min = Math.min(this.min, i);
    });
    this.actions = [];
    this.lastAction = undefined;
}
SortVisualizer.prototype.draw = function() {
    if(this.drawMode == 0) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, 1, 1);
        let c = 'black';
        let a = -1;
        let b = -1;
        if(this.lastAction) {
            if(this.lastAction.type === 'compare') {
                c = 'blue';
                a = this.lastAction.a;
                b = this.lastAction.b;
            }
            else if(this.lastAction.type === 'swap') {
                c = 'red';
                a = this.lastAction.a;
                b = this.lastAction.b;
            }
            else if(this.lastAction.type === 'set') {
                c = 'green';
                a = this.lastAction.a;
            }
        }
        this.__array.forEach((v, i) => {
            this.ctx.fillStyle = 'black';
            if(i == a || i == b) {
                this.ctx.fillStyle = c;
            }
            this.ctx.fillRect(1/this.__array.length*i, 0, 1/this.__array.length, (v)/(this.max-this.min+1));
        });
    }
    else if(this.drawMode == 1) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(-1, -1, 2, 2);
        let c = 'black';
        let a = -1;
        let b = -1;
        if(this.lastAction) {
            if(this.lastAction.type === 'compare') {
                c = 'blue';
                a = this.lastAction.a;
                b = this.lastAction.b;
            }
            else if(this.lastAction.type === 'swap') {
                c = 'red';
                a = this.lastAction.a;
                b = this.lastAction.b;
            }
            else if(this.lastAction.type === 'set') {
                c = 'green';
                a = this.lastAction.a;
            }
        }
        this.__array.forEach((v, i) => {
            this.ctx.fillStyle = `hsl(${360*v/this.max}, 100%, 50%)`;
            if(i == a || i == b) {
                this.ctx.fillStyle = c;
            }
            let r = (v+this.max-this.min)/(this.max-this.min)/2;
            let sp = Math.PI*i*2/this.__array.length;
            let ep = Math.PI*(i+1)*2/this.__array.length;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(sp)*r, Math.sin(sp)*r);
            this.ctx.arc(0, 0, r, sp, ep);
            this.ctx.lineTo(0, 0);
            this.ctx.closePath();
            this.ctx.fill();
        });
    }
};
SortVisualizer.prototype.shiftAction = function() {
    this.lastAction = undefined;
    if(this.actions.length>0) {
        this.lastAction = this.actions.shift();
        if(this.lastAction.type === 'swap') {
            const tmp = this.__array[this.lastAction.a];
            this.__array[this.lastAction.a] = this.__array[this.lastAction.b];
            this.__array[this.lastAction.b] = tmp;
        }
        else if(this.lastAction.type === 'set') {
            this.__array[this.lastAction.a] = this.lastAction.b;
        }
    }
};
SortVisualizer.prototype.compare = function(a, b) {
    this.actions.push({type: 'compare', a: a, b: b});
    return this.array[a] < this.array[b];
};
SortVisualizer.prototype.compareRaw = function(a, b, aR, bR) {
    let aV = a;
    let bV = b;
    if(!aR) {
        aV = this.array[a];
    }
    if(!bR) {
        bV = this.array[b];
    }
    this.actions.push({type: 'compare', a: aR?-1:a, b: bR?-1:b});
    return aV < bV;
};
SortVisualizer.prototype.swap = function(a, b) {
    this.actions.push({type: 'swap', a: a, b: b});
    const tmp = this.array[a];
    this.array[a] = this.array[b];
    this.array[b] = tmp;
};
SortVisualizer.prototype.set = function(a, b) {
    this.actions.push({type: 'set', a: a, b: b});
    this.array[a] = b;
};