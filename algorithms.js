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
        for(let j=this.length; j>i; j--) {
            if(this.compare(j, i)) {
                this.swap(i, j);
            }
        }
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