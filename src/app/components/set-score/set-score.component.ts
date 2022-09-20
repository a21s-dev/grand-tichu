import { Component, OnInit } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';

@Component({
  selector: 'app-set-score',
  templateUrl: './set-score.component.html',
  styleUrls: ['./set-score.component.scss'],
})
export class SetScoreComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  toggleChange(event: MatButtonToggleChange) {
    const toggle: MatButtonToggle | undefined = event.source;
    if (toggle === undefined) {
      return;
    }
    const group: MatButtonToggleGroup = toggle.buttonToggleGroup;
    if (event.value.some((item: any) => item == toggle.value)) {
      group.value = [toggle.value];
    }
  }
}
