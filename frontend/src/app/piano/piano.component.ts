import { Component } from '@angular/core';
import { KeysComponent } from './keys/keys.component';
import { GridComponent } from './grid/grid.component';

@Component({
  selector: 'ndbi034-piano',
  standalone: true,
  imports: [KeysComponent, GridComponent],
  templateUrl: './piano.component.html',
  styleUrl: './piano.component.scss',
})
export class PianoComponent {}
