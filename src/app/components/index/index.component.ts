import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {fromEvent, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
	private readonly browserHistorySubject: Subject<void>;

	// TODO truncate player names
	constructor() {
		this.browserHistorySubject = new Subject<void>();
	}

	ngOnInit(): void {
		this.removeBackButtonFunctionality();
	}

	private removeBackButtonFunctionality(): void {
		history.pushState(null, '');
		fromEvent(window, 'popstate').pipe(
			takeUntil(this.browserHistorySubject)
		).subscribe((_) => {
			history.pushState(null, '');
		});
	}

	ngOnDestroy(): void {
		this.browserHistorySubject.next();
		this.browserHistorySubject.complete();
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
