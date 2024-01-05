import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { KeysComponent } from './keys/keys.component';
import { GridComponent } from './grid/grid.component';
import { Note } from './grid/note/note.component';
import { OptionsBarComponent } from '../options-bar/options-bar.component';
import MidiWriter from 'midi-writer-js';
import { WEBAUDIO_SYNTH } from './synth.token';
import WebAudioTinySynth from 'webaudio-tinysynth';
import { Writer } from 'midi-writer-js/build/types/writer';

@Component({
  selector: 'ndbi034-piano',
  standalone: true,
  imports: [KeysComponent, GridComponent, OptionsBarComponent],
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PianoComponent implements AfterViewInit {
  @ViewChild('flexCont') flexContainer: ElementRef<HTMLDivElement>;

  midiOptions: { notes: (Note & { name: string })[]; bpm: number } = {
    notes: [],
    bpm: 120,
  };
  octaves = 8;
  firstOctave = 0;
  rowHeight = 12;
  private writer: Writer;
  timePosition = 0;
  private timePositionInterval: any;
  playing = false;

  constructor(
    @Inject(WEBAUDIO_SYNTH) private synth: WebAudioTinySynth,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.flexContainer.nativeElement.scrollTo({
      left: 0,
      top: this.rowHeight * 12 * 3.5,
    });
  }

  buildMidi() {
    if (this.playing) {
      this.pause();
    }

    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 20 }));
    track.setTempo(this.midiOptions.bpm);
    let prevNoteEnd = 0;
    this.midiOptions.notes.forEach((note) => {
      track.addEvent(
        new MidiWriter.NoteEvent({
          pitch: note.name,
          duration: `T${64 * note.length}`,
          wait: `T${64 * (note.x - prevNoteEnd)}`,
          velocity: 100,
        })
      );
      prevNoteEnd = note.x + note.length;
    });
    this.writer = new MidiWriter.Writer(track);
  }

  play() {
    if (!this.writer || this.playing) return;

    this.playing = true;
    this.synth.loadMIDI(this.writer.buildFile());
    this.synth.locateMIDI(this.timePosition);

    this.synth.playMIDI();
    this.synth.setProgram(1, 20);

    this.timePositionInterval = setInterval(() => {
      this.timePosition = this.synth.getPlayStatus().curTick;
      if (!this.synth.getPlayStatus().play) {
        this.stop();
      }
      this.changeDetector.detectChanges();
    }, 60000 / this.midiOptions.bpm / 8);
  }

  pause() {
    this.synth.stopMIDI();
    clearInterval(this.timePositionInterval);
    this.playing = false;
  }

  stop() {
    this.pause();
    this.timePosition = 0;
  }
}
