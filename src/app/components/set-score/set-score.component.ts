import {Component, OnInit} from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup,} from '@angular/material/button-toggle';

@Component({
	selector: 'app-set-score',
	templateUrl: './set-score.component.html',
	styleUrls: ['./set-score.component.scss'],
})
export class SetScoreComponent implements OnInit {
	team1Points: number[];
	team2Points: number[];
	players: string[];

	constructor() {
		this.team1Points = [1, 2, 3];
		this.team2Points = [1, 2, 3];
		this.players = ['raf', 'rouf'];
	}

	ngOnInit() {
	}

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
