function SortVisualizer(canvas, width, height, array, drawMode, callback) {
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
        this.ctx.rotate(-Math.PI/2);
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
    this.callback = callback;
}
SortVisualizer.prototype.draw = function() {
    if(this.drawMode == 0) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 1, 1);
        let c = 'white';
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
            else {
                c = this.lastAction.type;
                a = this.lastAction.a;
                b = this.lastAction.b;
            }
        }
        this.__array.forEach((v, i) => {
            this.ctx.fillStyle = 'white';
            if(i == a || i == b) {
                this.ctx.fillStyle = c;
            }
            this.ctx.fillRect(i/this.__array.length, 0, 1/this.__array.length, (v)/(this.max-this.min+1));
        });
    }
    else if(this.drawMode == 1) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(-1, -1, 2, 2);
        let c = 'black';
        let a = -1;
        let b = -1;
        if(this.lastAction) {
            a = this.lastAction.a;
            b = this.lastAction.b;
        }
        this.__array.forEach((v, i) => {
            this.ctx.fillStyle = `hsl(${360*v/this.max}, 100%, 50%)`;
            if(i == a || i == b) {
                this.ctx.fillStyle = c;
            }
            //let r = (v+this.max-this.min)/(this.max-this.min)/2;
            let r = 1;
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
    else {
        this.callback();
    }
};
SortVisualizer.prototype.compare = function(a, b) {
    this.actions.push({type: 'compare', a: a, b: b});
    return this.array[a] < this.array[b];
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