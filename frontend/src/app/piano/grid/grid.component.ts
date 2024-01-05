import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Note, NoteComponent } from './note/note.component';
import { JsonPipe } from '@angular/common';
import { GlobalEventService } from '../../services/global-event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import WebAudioTinySynth from 'webaudio-tinysynth';
import { WEBAUDIO_SYNTH, getNoteNumber, noteNames } from '../synth.token';

enum Action {
  None,
  Move,
  Resize,
  Seek,
}

@Component({
  selector: 'ndbi034-grid',
  standalone: true,
  imports: [JsonPipe, NoteComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements AfterViewInit {
  @Output() notesChange = new EventEmitter<(Note & { name: string })[]>();
  @Input() timePosition: number;
  @Output() timePositionChange = new EventEmitter<number>();

  @ViewChild('canv') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChildren(NoteComponent) noteComponents: QueryList<NoteComponent>;

  private ctx: CanvasRenderingContext2D;
  rowHeight = 12;
  colWidth = 20;
  colCount = 100;
  rowCount = 12;
  private firstOctave = 3;
  private playingNote: number = null;
  private initialPosition: { x: number; y: number };
  private action: Action = Action.None;

  // sorted according to x
  notes: Note[] = [];
  currNote: Note;
  private backupNote: Note;

  constructor(
    private gEventS: GlobalEventService,
    private changeDetector: ChangeDetectorRef,
    @Inject(WEBAUDIO_SYNTH) private synth: WebAudioTinySynth
  ) {
    this.gEventS.mouseReleased.pipe(takeUntilDestroyed()).subscribe(() => {
      switch (this.action) {
        case Action.Resize:
        case Action.Move:
          this.endNote();
          break;
        case Action.Seek:
          this.stopSeeking();
          break;
      }
    });
    this.gEventS.mouseMoved.pipe(takeUntilDestroyed()).subscribe((e) => {
      switch (this.action) {
        case Action.Move:
          this.moveNote(e);
          break;
        case Action.Resize:
          this.resizeNote(e);
          break;
        case Action.Seek:
          this.seekProgress(e);
          break;
      }
    });
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.drawGrid();
  }

  private drawGrid(): void {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.ctx.fillStyle = '#f8f8f8';
    this.ctx.lineWidth = 0.5;
    for (let i = 0; i < this.rowCount; i += 2) {
      this.ctx.fillRect(
        0,
        i * this.rowHeight,
        this.colCount * this.colWidth,
        this.rowHeight
      );
    }

    for (let i = 0; i < this.rowCount; i++) {
      this.ctx.strokeStyle = i % 12 ? '#ccc' : '#aaa';
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.rowHeight - 0.5);
      this.ctx.lineTo(this.colCount * this.colWidth, i * this.rowHeight - 0.5);
      this.ctx.stroke();
    }
    for (let i = 0; i < this.colCount; i++) {
      this.ctx.strokeStyle = i % 8 ? '#ccc' : '#aaa';
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.colWidth - 0.5, 0);
      this.ctx.lineTo(i * this.colWidth - 0.5, this.rowHeight * this.rowCount);
      this.ctx.stroke();
    }
  }

  startNote(e: MouseEvent): void {
    this.action = Action.Resize;
    const x = Math.floor(e.offsetX / this.colWidth);
    const y = Math.floor(e.offsetY / this.rowHeight);
    this.currNote = { x, y, length: 1 };
    this.playCurrentNote();
  }

  resizeNote(e: MouseEvent): void {
    if (this.action != Action.Resize) return;
    const bbox = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.floor((e.clientX - bbox.left) / this.colWidth);
    const length = x - this.currNote.x + 1;
    if (length !== this.currNote.length) {
      this.currNote = { ...this.currNote, length };
      this.changeDetector.markForCheck();
      this.playCurrentNote();
    }
  }

  endNote(): void {
    this.action = Action.None;
    if (!this.currNote) return;
    if (this.currNote.length < 1) {
      this.currNote.x += this.currNote.length - 1;
      this.currNote.length = -this.currNote.length + 2;
    }
    const ok = this.verifyNote(this.currNote);
    let noteToFocus: Note = null;
    if (ok) {
      this.notes.push(this.currNote);
      noteToFocus = this.currNote;
    } else if (this.backupNote) {
      this.notes.push(this.backupNote);
      noteToFocus = this.backupNote;
    }
    this.currNote = null;
    this.backupNote = null;
    this.initialPosition = null;

    this.notes.sort((a, b) => a.x - b.x);
    this.changeDetector.markForCheck();
    this.stopPlaying();
    if (ok) {
      this.notesChange.emit(
        this.notes.map((n) => ({ name: this.getNoteName(n), ...n }))
      );
    }
    if (noteToFocus) {
      setTimeout(() => {
        this.noteComponents.forEach((n) => {
          if (n.note === noteToFocus) {
            n.focus();
          }
        });
      });
    }
  }

  private verifyNote(note: Note): boolean {
    for (const n of this.notes) {
      if (n === note) continue;
      if (n.x > note.x + note.length) break;

      if (n.x <= note.x && n.x + n.length > note.x) {
        return false;
      }
      if (n.x > note.x && n.x < note.x + note.length) {
        return false;
      }
    }
    return true;
  }

  deleteNote(note: Note): void {
    this.notes = this.notes.filter((n) => n !== note);
  }

  startResize(note: Note, left: boolean): void {
    this.action = Action.Resize;
    this.backupNote = note;
    this.currNote = { ...note };
    this.notes = this.notes.filter((n) => n !== note);
    if (left) {
      this.currNote.x += note.length - 1;
      this.currNote.length = -note.length + 2;
    }
    this.playCurrentNote();
  }

  startMove(note: Note, e: MouseEvent): void {
    this.action = Action.Move;
    this.backupNote = note;
    this.currNote = { ...note };
    this.notes = this.notes.filter((n) => n !== note);
    this.initialPosition = { x: e.clientX, y: e.clientY };
    this.playCurrentNote();
  }

  moveNote(e: MouseEvent) {
    if (this.action != Action.Move) return;
    const dx = this.clamp(
      this.floorTo0((e.clientX - this.initialPosition.x) / this.colWidth),
      -this.currNote.x,
      this.colCount - this.currNote.x - this.currNote.length
    );
    const dy = this.clamp(
      this.floorTo0((e.clientY - this.initialPosition.y) / this.rowHeight),
      -this.currNote.y,
      this.rowCount - this.currNote.y - 1
    );
    if (dx || dy) {
      this.initialPosition = {
        x: this.initialPosition.x + dx * this.colWidth,
        y: this.initialPosition.y + dy * this.rowHeight,
      };
      this.currNote = {
        ...this.currNote,
        x: this.currNote.x + dx,
        y: this.currNote.y + dy,
      };
      this.changeDetector.markForCheck();
      this.playCurrentNote();
    }
  }

  private clamp(x: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, x));
  }

  floorTo0(x: number): number {
    if (x < 0) return Math.ceil(x);
    return Math.floor(x);
  }

  private playCurrentNote(): void {
    if (!this.currNote) return;
    const note = getNoteNumber(this.getNoteName(this.currNote));
    if (note !== this.playingNote) {
      this.stopPlaying();
      this.synth.noteOn(1, note, 100);
      this.playingNote = note;
    }
  }

  private stopPlaying(): void {
    if (this.playingNote !== null) {
      this.synth.noteOff(1, this.playingNote);
      this.playingNote = null;
    }
  }

  private getNoteName(note: Note): string {
    return (
      noteNames[11 - (note.y % 12)] +
      (this.firstOctave + Math.floor(note.y / 12))
    );
  }

  startSeeking(e: MouseEvent): void {
    this.action = Action.Seek;
    this.initialPosition = { x: e.clientX, y: e.clientY };
  }

  private seekProgress(e: MouseEvent): void {
    if (this.action != Action.Seek) return;
    const bbox = this.canvas.nativeElement.getBoundingClientRect();
    const dx = this.clamp(
      e.clientX - this.initialPosition.x,
      bbox.left - this.initialPosition.x,
      bbox.width + bbox.left - this.initialPosition.x
    );
    this.timePosition += (dx / this.colWidth) * 64;
    this.initialPosition.x = this.clamp(
      e.clientX,
      bbox.left,
      bbox.left + bbox.width
    );
    this.timePositionChange.emit(this.timePosition);
    this.changeDetector.markForCheck();
  }

  private stopSeeking(): void {
    this.action = Action.None;
  }
}
