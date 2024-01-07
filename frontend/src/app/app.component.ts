import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PianoComponent } from './piano/piano.component';
import {
  Result,
  SearchResultsComponent,
} from './search-results/search-results.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ndbi034-root',
  standalone: true,
  imports: [
    CommonModule,
    PianoComponent,
    SearchResultsComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  results: Result[] = [];
  loading = false;

  constructor(
    private http: HttpClient,
    private dRef: DestroyRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  search(file: Uint8Array) {
    const formData = new FormData();
    formData.append(
      'midi',
      new File([file], 'upload.mid', { type: 'audio/midi' })
    );
    this.loading = true;
    this.http
      .post('http://localhost:5000/api/midi_match', formData)
      .pipe(takeUntilDestroyed(this.dRef))
      .subscribe((data) => {
        this.results = data as Result[];
        this.loading = false;
        this.changeDetector.markForCheck();
      });
  }
}
