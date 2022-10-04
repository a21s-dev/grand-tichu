import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IndexComponent} from './components/index/index.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {SetScoreComponent} from './components/set-score/set-score.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatOptionModule} from "@angular/material/core";
import {MatMenuModule} from "@angular/material/menu";
import {ChangePlayerDialogComponent} from "./components/index/change-player-dialog/change-player-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatRadioModule} from "@angular/material/radio";

@NgModule({
	declarations: [AppComponent, IndexComponent, SetScoreComponent, ChangePlayerDialogComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			// Register the ServiceWorker as soon as the app is stable
			// or after 30 seconds (whichever comes first).
			registrationStrategy: 'registerWhenStable:30000',
		}),
		MatButtonToggleModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule,
		MatMenuModule,
		MatDialogModule,
		MatRadioModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {
}
