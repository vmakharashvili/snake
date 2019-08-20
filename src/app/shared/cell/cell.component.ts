import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  @Input() active = false;
  @Input() isHead = false;

  @Input() food: boolean | null = false;

  constructor() { }

  ngOnInit() {
  }

}
