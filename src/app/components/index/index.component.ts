import {Component, OnInit} from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
	//TODO truncate player names
	constructor() {
	}

	ngOnInit(): void {
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
