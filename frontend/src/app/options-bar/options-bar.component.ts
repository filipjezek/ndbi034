import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'ndbi034-options-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './options-bar.component.html',
  styleUrl: './options-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsBarComponent {
  @Output() bpmChange = new EventEmitter<number>();
  @Output() play = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() search = new EventEmitter<void>();
  @Input() playing = false;
  bpm = new FormControl(120, Validators.min(1));

  constructor() {
    this.bpm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((bpm) => this.bpmChange.emit(bpm));
  }
}
