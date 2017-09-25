function Field(width, height, target = '#field') {
    this.target = target
    this.rows = height;
    this.cols = width;
    this.bwidth = $(target).width() / this.cols - 2*2;
    this.bheight = $(target).height() / this.rows - 2*2;
    this._blocks = [];
    this.count = 0;
	this.moves_count = 0;  // SYSOEV: added this to use as an indicator for the newly merged blocks
    for (var i=0; i<this.rows; i++) {
        this._blocks[i] = [];
    }
};
Field.prototype.win = function () {
    alert('Congratulations, you are the winner');
    $(this.target).html('');
    $('#main').hide()
};
Field.prototype.lose = function () {
    if(confirm('Seems that you need to try again...')) {$(this.target).html(''); $('#main').hide()}
};
Field.prototype.spawnTest = function () {
    b = new Block(this);
    b.move(2, 1);
    b = new Block(this);
    b.move(2, 2);
    b = new Block(this);
    b.move(2, 3);
    b.grow();
    b = new Block(this);
    b.move(2, 4);
    b = new Block(this);
    b.move(1, 2);
    //b.findNeighbour('left').target.css('background-color', 'red');
    
};
Field.prototype.spawn = function (score) {
    if (this.count == this.cols * this.rows) {this.lose(); return;}
    var i = Math.floor(Math.random() * this.rows) + 1;
    var j = Math.floor(Math.random() * this.cols) + 1;
    while (this.get(i,j) != undefined) {
        i = Math.floor(Math.random() * this.rows) + 1;
        j = Math.floor(Math.random() * this.cols) + 1;
    }
    b = new Block(this);
    if (score == undefined) {
        score = 2;
        for (var _=0; _<2; _++) {
            if (Math.random < 0.3) {score *= 2;}
        }
    }
    b.score = score;
    b.move(i,j);
    if (Math.random > 0.6) this.spawn()
}
Field.prototype.get = function (i, j) {
    return this._blocks[i-1][j-1];
}
Field.prototype.up = function () {
    var flag = false;
    for (var j=1; j<=this.cols; j++)
        for (var i=1; i<=this.rows; i++) {
            if (this.get(i,j) != undefined) {
                //здесь важен порядок операндов!
                flag = this.get(i,j).up() || flag;
            }
        }
	this.moves_count++;  // SYSOEV
    if (flag) this.spawn()
    else if (this.count == this.cols * this.rows) this.lose();
}
Field.prototype.down = function () {
    var flag = false;
    for (var j=1; j<=this.cols; j++)
        for (var i=this.rows; i>0; i--) {
            if (this.get(i,j) != undefined) {
                flag = this.get(i,j).down() || flag;
            }
        }
	this.moves_count++;  // SYSOEV
    if (flag) this.spawn()
    else if (this.count == this.cols * this.rows) this.lose();
}
Field.prototype.left = function () {
    var flag = false;
    for (var i=1; i<=this.rows; i++)
        for (var j=1; j<=this.cols; j++) {
            if (this.get(i,j) != undefined) {
                flag = this.get(i,j).left() || flag;
            }
        }
	this.moves_count++;  // SYSOEV
    if (flag) this.spawn()
    else if (this.count == this.cols * this.rows) this.lose();
}
Field.prototype.right = function () {
    var flag = false;
    for (var i=1; i<=this.rows; i++)
        for (var j=this.cols; j>0; j--) {
            if (this.get(i,j) != undefined) {
                flag = this.get(i,j).right() || flag;
            }
        }		
	this.moves_count++;  // SYSOEV
    if (flag) this.spawn()
    else if (this.count == this.cols * this.rows) this.lose();
}

function Block(field) {
    this.field = field;
    this.score = 2;
    this.field.count += 1;
	this.merged_on_move = -1;
}
Block.prototype.move = function (i, j) {
    if (i < 1 || i > this.field.rows || j < 1 || j > this.field.cols) throw new Error('ValueError: move');
    if (this.field.get(i,j) !== undefined) throw new Error('Moving to an occupied place');
    if (this.row != undefined && this.col != undefined) this.field._blocks[this.row-1][this.col-1] = undefined;
    this.row = i; this.col = j;
    this.field._blocks[i-1][j-1] = this;
    
    if (this.target == undefined) {
        var size = Math.min(this.field.bwidth, this.field.bheight); 
        this.target = $('<div>'); 
        this.target.html(this.score).addClass('cell')
            .width(this.field.bwidth).height(this.field.bheight).attr('data-score', this.score)
            .css('font-size', size + 'px').css('line-height', this.field.bwidth + 'px');
        this.target.appendTo(this.field.target);
    }
    this.target.attr('data-rows', i).attr('data-cols', j)
        .css('top', (i-1)*(this.field.bheight + 2*2) + 'px').css('left', (j-1)*(this.field.bwidth + 2*2) + 'px');
}
Block.prototype.grow = function () {
    this.score *=2;
    var size = Math.min(this.target.height(), this.target.width());
	// SYSOEV: removed power notation
/*    if (this.score == 128) {
        this.target.css('font-size', size*0.4  + 'px').html('2 <sup>7</sup>');
        this.target.children('sup').css('font-size', size*0.9  + 'px');
    }
    else if (this.target.has('sup').length) {
        this.target.children('sup').html(Math.log2(this.score));
    }
    else this.target.html(this.score);
	*/
	if (this.score >= 128 && this.score < 1024) {
        this.target.css('font-size', size*0.4  + 'px');
    }
    if (this.score >= 1024) {
        this.target.css('font-size', size*0.2  + 'px');
    }
	this.target.html(this.score);
	// SYSOEV: end of the modified code
	
    this.target.attr('data-score', this.score);
    if (this.score == 2048) this.field.win();
}
Block.prototype.purge = function () {
    this.target.remove();
    this.target = undefined;
    this.field._blocks[this.row-1][this.col-1] = undefined;
    this.field.count -= 1;
}
Block.prototype.findNeighbour = function (dir) {
    switch(dir) {
        case 'up':
            var i = this.row-1;
            while (i > 1 && this.field.get(i, this.col) === undefined) i--;
            return this.field.get(i, this.col);
        case 'down':
            var i = this.row+1;
            while (this.field.get(i, this.col) === undefined && i < this.field.rows) i++;
            return this.field.get(i, this.col);
        case 'left':
            var j = this.col-1;
            while (this.field.get(this.row, j) === undefined && j > 1) j--;
            return this.field.get(this.row, j);
        case 'right':
            var j = this.col+1;
            while (this.field.get(this.row, j) === undefined && j < this.field.cols) j++;
            return this.field.get(this.row, j);
    }
}
Block.prototype.up = function () {
    if (this.row == 1) return false;
    n = this.findNeighbour('up');
    if (n != undefined) {
		// SYSOEV: modified the condition
        if (this.score == n.score && this.merged_on_move != this.field.moves_count) {
            n.purge();
            this.grow();
            this.move(n.row, n.col);
			// SYSOEV: set here some flag for this block, do not touch it on this move
			this.merged_on_move = this.field.moves_count;
			// SYSOEV: end of the insertion
        }
        else try {this.move(n.row+1, n.col);} catch (e) {return false;}
    }
    else this.move(1, this.col);
    return true;
}
Block.prototype.down = function () {
    if (this.row == this.field.rows) return false;
    n = this.findNeighbour('down');
    if (n != undefined) {
        if (this.score == n.score) {
            n.purge();
            this.grow();
            this.move(n.row, n.col);
        }
        else try {this.move(n.row-1, n.col);} catch (e) {return false;}
    }
    else this.move(this.field.rows, this.col);
    return true;
}
Block.prototype.left = function () {
    if (this.col == 1) return false;
    n = this.findNeighbour('left');
    if (n != undefined) {
        if (this.score == n.score) {
            n.purge();
            this.grow();
            this.move(n.row, n.col);
        }
        else try {this.move(n.row, n.col+1);} catch (e) {return false;}
    }
    else this.move(this.row, 1);
    return true;
}
Block.prototype.right = function () {
    if (this.col == this.field.cols) return false;
    n = this.findNeighbour('right');
    if (n != undefined) {
        if (this.score == n.score) {
            n.purge();
            this.grow();
            this.move(n.row, n.col);
        }
        else try {this.move(n.row, n.col-1);} catch (e) {return false;}
    }
    else this.move(this.row, this.field.cols);
    return true;
}