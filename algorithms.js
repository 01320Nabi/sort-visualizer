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
SortVisualizer.prototype.getRadix = function(a, base, i) {
    this.actions.push({type: 'compare', a: a, b: -1});
    return Math.floor((this.array[a]%Math.pow(base,i+1))/Math.pow(base, i));
};

SortVisualizer.prototype.bubbleSort = function() {
    for(let i=0; i<this.length-1; i++) {
        let swapped = false;
        for(let j=0; j<this.length-i-1; j++) {
            if(this.compare(j+1, j)) {
                this.swap(j, j+1);
                swapped = true;
            }
        }
        if(!swapped) {
            break;
        }
    }
};

SortVisualizer.prototype.selectionSort = function() {
    for(let i=0; i<this.length-1; i++) {
        let m = i;
        for(let j=i+1; j<this.length; j++) {
            if(this.compare(j, m)) {
                m = j;
            }
        }
        this.swap(i, m);
    }
};

SortVisualizer.prototype.insertionSort = function() {
    for(let i=1; i<this.length; i++) {
        for(let j=i; j>0 && this.compare(j, j-1); j--) {
            this.swap(j-1, j);
        }
    }
};

SortVisualizer.prototype.shellSort = function() {
    for(let gap=Math.floor(this.length/2); gap>0; gap = Math.floor(gap/2)) {
        for(let i=gap; i<this.length; i++) {
            let tmp = this.array[i];
            let j;
            for(j=i; j>=gap && this.compareRaw(tmp, j-gap, true, false); j-=gap) {
                this.set(j, this.array[j-gap]);
            }
            this.set(j, tmp);
        }
    }
};

SortVisualizer.prototype.mergeSort = function() {
    let merge = function(v, low, high) {
        if(high-low>1) {
            let middle = Math.floor(low + (high-low)/2);
            merge(v, low, middle);
            merge(v, middle, high);
            let tmp = [];
            let ai = low;
            let bi = middle;
            while(ai<middle || bi<high) {
                if(ai<middle && (!(bi<high) || v.compare(ai, bi))) {
                    tmp.push(v.array[ai++]);
                }
                else {
                    tmp.push(v.array[bi++]);
                }
            }
            for(let i=low; i<high; i++) {
                v.set(i, tmp.shift());
            }
        }
    }
    merge(this, 0, this.length);
};

SortVisualizer.prototype.quickSort = function() {
    let quick = function(v, low, high) {
        if(high-low>1) {
            v.swap(Math.floor((high+low)/2), high-1);
            pivot = high-1;
            let i = low-1;
            for(let j=low; j<high-1; j++) {
                if(v.compare(j, pivot)) {
                    i++;
                    v.swap(i, j);
                }
            }
            v.swap(pivot, i+1);
            pivot = i+1;
            quick(v, low, pivot);
            quick(v, pivot+1, high);
        }
    }
    quick(this, 0, this.length);
};

SortVisualizer.prototype.heapSort = function() {
    let heap = function(v, i, l) {
        let mx = i;
        let lft = 2*i+1;
        let rgt = lft+1;
        if(lft<l && v.compare(mx, lft)) {
            mx = lft;
        }
        if(rgt<l && v.compare(mx, rgt)) {
            mx = rgt;
        }
        if(mx != i) {
            v.swap(i, mx);
            heap(v, mx, l);
        }
    }
    for(let i=Math.floor(this.length/2)-1; i>=0; i--) {
        heap(this, i, this.length);
    }
    for(let i=this.length-1; i>0; i--) {
        this.swap(0, i);
        heap(this, 0, i);
    }
};

SortVisualizer.prototype.radixSort = function(base) {
    let length = 0;
    let max = this.max;
    while(max) {
        max = Math.floor(max/base);
        length++;
    }
    for(let i=0; i<length; i++) {
        let arr = [...this.array];
        let cnt = [];
        for(let j=0; j<base; j++) {
            cnt.push(0);
        }
        let radixes = new Array(this.length);
        for(let j=0; j<this.length; j++) {
            radixes[j] = this.getRadix(j, base, i);
            cnt[radixes[j]]++;
        }
        for(let j=1; j<base; j++) {
            cnt[j] += cnt[j-1];
        }
        for(let j=this.length-1; j>=0; j--) {
            this.set([--cnt[radixes[j]]], arr[j]);
        }
    }
}