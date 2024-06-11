import { Component, Input } from '@angular/core';
import { Result } from '../../models/result/result';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [],
  templateUrl: './prediction.component.html',
  styleUrl: './prediction.component.scss'
})
export class PredictionComponent {
  @Input() prediction: Result | undefined;

}
