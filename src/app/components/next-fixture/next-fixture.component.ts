import { Component, OnInit } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../models/fixture/fixture';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-next-fixture',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './next-fixture.component.html',
  styleUrl: './next-fixture.component.scss'
})
export class NextFixtureComponent implements OnInit {
  public fixture?: Fixture

  public constructor(private fixtureService: FixtureService) {
  }

  ngOnInit(): void {
    this.fixture = this.fixtureService.getNextFixture();
  }
}
