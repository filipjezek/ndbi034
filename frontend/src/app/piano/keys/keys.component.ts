import { Component, HostBinding, Inject, Input } from '@angular/core';
import { GlobalEventService } from '../../services/global-event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import WebAudioTinySynth from 'webaudio-tinysynth';
import { WEBAUDIO_SYNTH, getNoteNumber, noteNames } from '../synth.token';

@Component({
  selector: 'ndbi034-keys',
  standalone: true,
  imports: [],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss',
})
export class KeysComponent {
  @Input() octave = 3;
  scale = noteNames;
  @HostBinding('class.mousedown') isMouseDown = false;

  constructor(
    private gEventS: GlobalEventService,
    @Inject(WEBAUDIO_SYNTH) private synth: WebAudioTinySynth
  ) {
    this.gEventS.mousePressed.pipe(takeUntilDestroyed()).subscribe((e) => {
      this.isMouseDown = true;
    });
    this.gEventS.mouseReleased.pipe(takeUntilDestroyed()).subscribe((e) => {
      this.isMouseDown = false;
    });
  }

  openNote(note: string) {
    this.synth.noteOn(1, getNoteNumber(note), 100);
  }

  endNote(note: string) {
    this.synth.noteOff(1, getNoteNumber(note));
  }
}
