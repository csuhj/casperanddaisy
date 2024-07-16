import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-winner',
  standalone: true,
  imports: [],
  templateUrl: './winner.component.html',
  styleUrl: './winner.component.scss'
})
export class WinnerComponent {
  @Input() teamName: string | undefined;
}
