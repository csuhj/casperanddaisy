import { Component, Input } from '@angular/core';
import { Result } from '../../models/result/result';

@Component({
  selector: 'app-scores-list',
  standalone: true,
  imports: [],
  templateUrl: './scores-list.component.html',
  styleUrl: './scores-list.component.scss'
})
export class ScoresListComponent {
  @Input() results: Result[] | undefined;
}
