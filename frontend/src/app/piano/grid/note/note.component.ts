import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

export interface Note {
  x: number;
  y: number;
  length: number;
}

@Component({
  selector: 'ndbi034-note',
  standalone: true,
  imports: [],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteComponent {
  @Input() note: Note;
  @Input() rowHeight: number;
  @Input() colWidth: number;

  @Output() resizeLeft = new EventEmitter<void>();
  @Output() resizeRight = new EventEmitter<void>();
  @Output() move = new EventEmitter<MouseEvent>();

  @ViewChild('noteEl') noteEl: ElementRef<HTMLDivElement>;

  public focus() {
    this.noteEl.nativeElement.focus();
  }
}
