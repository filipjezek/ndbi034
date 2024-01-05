import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Inject,
  Input,
} from '@angular/core';
import { GlobalEventService } from '../../services/global-event.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import WebAudioTinySynth from 'webaudio-tinysynth';
import { WEBAUDIO_SYNTH, getNoteNumber, noteNames } from '../synth.token';
import { RangePipe } from '../../pipes/range.pipe';

@Component({
  selector: 'ndbi034-keys',
  standalone: true,
  imports: [RangePipe],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss',
})
export class KeysComponent {
  @Input() octaves: number;
  @Input() firstOctave: number;
  scale = noteNames.toReversed();
  @HostBinding('class.mousedown') isMouseDown = false;

  constructor(
    private gEventS: GlobalEventService,
    @Inject(WEBAUDIO_SYNTH) private synth: WebAudioTinySynth,
    private changeDetector: ChangeDetectorRef
  ) {
    this.gEventS.mousePressed.pipe(takeUntilDestroyed()).subscribe((e) => {
      this.isMouseDown = true;
      this.changeDetector.markForCheck();
    });
    this.gEventS.mouseReleased.pipe(takeUntilDestroyed()).subscribe((e) => {
      this.isMouseDown = false;
      this.changeDetector.markForCheck();
    });
  }

  openNote(note: string) {
    this.synth.noteOn(1, getNoteNumber(note), 100);
  }

  endNote(note: string) {
    this.synth.noteOff(1, getNoteNumber(note));
  }
}
