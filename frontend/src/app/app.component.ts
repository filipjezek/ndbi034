import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PianoComponent } from './piano/piano.component';
import { OptionsBarComponent } from './options-bar/options-bar.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultsComponent } from './search-results/search-results.component';

@Component({
  selector: 'ndbi034-root',
  standalone: true,
  imports: [
    CommonModule,
    PianoComponent,
    SearchFormComponent,
    SearchResultsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
