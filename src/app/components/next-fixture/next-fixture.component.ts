import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Fixture } from '../../models/fixture/fixture';
import { Venue } from '../../models/venue/venue';

@Component({
  selector: 'app-next-fixture',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './next-fixture.component.html',
  styleUrl: './next-fixture.component.scss'
})
export class NextFixtureComponent {
  @Input() fixture: Fixture | undefined;
  @Input() venue: Venue | undefined;
}
