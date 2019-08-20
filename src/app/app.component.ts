import { Component, OnInit, HostListener } from '@angular/core';
import { CellItem, Direction, HeadDirection, Coordinates } from './models/cell.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cells: CellItem[][] = new Array<Array<CellItem>>();
  defaultCell = { isActive: false, isLast: false, isStart: false, direction: null, headDirection: null } as CellItem;
  head = { isStart: true, isLast: false, isActive: true, direction: null, headDirection: HeadDirection.left } as CellItem;
  middle = { isStart: false, isLast: false, isActive: true, direction: Direction.leftRight, headDirection: null } as CellItem;
  last = { isStart: false, isLast: true, isActive: true, direction: Direction.leftRight, headDirection: null } as CellItem;
  foodCell = { isStart: false, isLast: false, isActive: false, direction: null, headDirection: null, food: true } as CellItem;
  x = 10;
  y = 2;
  direc: HeadDirection = HeadDirection.right;

  dim = 40;
  mlength = 1;
  snakeOn: Coordinates[] = [];

  food: Coordinates = { x: 0, y: 0};
  interval: any;

  gameOn = false;
  score = 0;
  neverStarted = true;
  private doKeyDown = true;

  private initialSpeed = 300;
  private speed = this.initialSpeed;

  @HostListener('document:keydown', ['$event']) onKeyDownHandler (event: KeyboardEvent) {
    if (this.doKeyDown) {
      switch (event.key) {
        case 'ArrowLeft':
          this.left();
          break;
        case 'ArrowRight':
          this.right();
          break;
        case 'ArrowUp':
          this.up();
          break;
        case 'ArrowDown':
          this.down();
          break;
      }
      this.doKeyDown = !this.doKeyDown;
    }
  }

  ngOnInit() {

  }

  start() {
    this.gameOn = true;
    this.speed = this.initialSpeed;
    for (let i = 0; i < this.dim; i++) {
      const row: CellItem[] = new Array<CellItem>();
      for (let j = 0; j < this.dim; j ++) {
        row.push({ isActive: false, isLast: false, isStart: false, direction: null, headDirection: null } as CellItem);
      }
      this.cells.push(row);
    }
    this.snakeOn.push({ x: this.x, y: this.y - 3 }, { x: this.x, y: this.y - 2 }, {x: this.x, y: this.y - 1 }, { x: this.x, y: this.y });
    this.generateRandomDot();

    this.interval = setInterval(() => this.process(), this.speed);
  }

  process() {
    let last = this.snakeOn.length - 1;
    this.cells[this.food.x][this.food.y] = this.foodCell;

    for (let i = 0; i < this.snakeOn.length; i++) {
      if (i === last) {
        this.cells[this.snakeOn[i].x][this.snakeOn[i].y] = this.head;
      } else if (i === 1) {
        this.cells[this.snakeOn[i].x][this.snakeOn[i].y] = this.last;
      } else if (i === 0) {
        this.cells[this.snakeOn[i].x][this.snakeOn[i].y] = this.defaultCell;
      } else {
        this.cells[this.snakeOn[i].x][this.snakeOn[i].y] = this.middle;
      }
    }

    const snakeOnCopy = Array.from(this.snakeOn);
    snakeOnCopy.splice(last, 1);
    snakeOnCopy.shift();
    if (snakeOnCopy.filter(c => c.x === this.snakeOn[last].x && c.y === this.snakeOn[last].y).length > 0) {
      clearInterval(this.interval);
      this.gameOn = false;
      this.snakeOn = [];
      this.cells = [];
      this.neverStarted = false;
      this.direc = HeadDirection.right;
      this.speed = this.initialSpeed;
      return;
    }

    if (this.snakeOn[last].x === this.food.x && this.snakeOn[last].y === this.food.y) {
      switch (this.direc) {
        case HeadDirection.right:
          this.snakeOn.push({ x: this.snakeOn[last].x,
            y: this.snakeOn[last].y === this.dim - 1 ? 0 : this.snakeOn[last].y + 1 } as Coordinates);
          break;
        case HeadDirection.down:
          this.snakeOn.push({ x: this.snakeOn[last].x === this.dim - 1 ? 0 : this.snakeOn[last].x + 1, y: this.snakeOn[last].y });
          break;
        case HeadDirection.left:
          this.snakeOn.push({ x: this.snakeOn[last].x,
          y: this.snakeOn[last].y === 0 ? this.dim - 1 : this.snakeOn[last].y - 1 } as Coordinates);
          break;
        case HeadDirection.up:
          this.snakeOn.push({ x: this.snakeOn[last].x === 0 ? this.dim - 1 : this.snakeOn[last].x - 1, y: this.snakeOn[last].y });
          break;
      }
      this.generateRandomDot();
      last = this.snakeOn.length - 1;
      this.score = this.score + 10;
      if (this.score > 30 && this.score % 40 === 0) {
        this.speed = this.speed - 50;
        clearInterval(this.interval);
        this.interval = setInterval(() => this.process(), this.speed);
      }
    }

    switch (this.direc) {
      case HeadDirection.right:
        this.snakeOn.push({ x: this.snakeOn[last].x,
          y: this.snakeOn[last].y === this.dim - 1 ? 0 : this.snakeOn[last].y + 1 } as Coordinates);
        this.snakeOn.shift();
        break;
      case HeadDirection.down:
        this.snakeOn.push({ x: this.snakeOn[last].x === this.dim - 1 ? 0 : this.snakeOn[last].x + 1, y: this.snakeOn[last].y });
        this.snakeOn.shift();
        break;
      case HeadDirection.left:
        this.snakeOn.push({ x: this.snakeOn[last].x,
        y: this.snakeOn[last].y === 0 ? this.dim - 1 : this.snakeOn[last].y - 1 } as Coordinates);
        this.snakeOn.shift();
        break;
      case HeadDirection.up:
        this.snakeOn.push({ x: this.snakeOn[last].x === 0 ? this.dim - 1 : this.snakeOn[last].x - 1, y: this.snakeOn[last].y });
        this.snakeOn.shift();
        break;
    }
    this.doKeyDown = true;
  }

  down() {
    if (this.direc === HeadDirection.left || this.direc === HeadDirection.right) {
      this.direc = HeadDirection.down;
    }
  }

  left() {
    if (this.direc === HeadDirection.up || this.direc === HeadDirection.down) {
      this.direc = HeadDirection.left;
    }
  }

  right() {
    if (this.direc === HeadDirection.up || this.direc === HeadDirection.down) {
      this.direc = HeadDirection.right;
    }
  }

  up() {
    if (this.direc === HeadDirection.left || this.direc === HeadDirection.right) {
      this.direc = HeadDirection.up;
    }
  }

  generateRandomDot() {
    this.food = { x: Math.floor(Math.random() * 40), y: Math.floor(Math.random() * 40) };
  }

}
