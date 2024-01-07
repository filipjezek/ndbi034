import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface Result {
  filename: string;
  score: number;
}

@Component({
  selector: 'ndbi034-search-results',
  standalone: true,
  imports: [],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent {
  @Input() results: Result[] = [];
  @Input() loading = false;

  replaceExt(title: string) {
    return title.replace(/(?:\.([0-9]+))?\.[^/.]+$/, (match, p1) =>
      p1 ? ' (' + p1 + ')' : ''
    );
  }
}
