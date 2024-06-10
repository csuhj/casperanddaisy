import { Component, OnDestroy, OnInit } from '@angular/core';
import { FixtureService } from '../../services/fixture.service';
import { Fixture } from '../../models/fixture/fixture';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-next-fixture',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './next-fixture.component.html',
  styleUrl: './next-fixture.component.scss'
})
export class NextFixtureComponent implements OnInit, OnDestroy {
  public fixture?: Fixture;

  private readonly destroy$ = new Subject<void>();

  public constructor(private fixtureService: FixtureService) {
  }

  ngOnInit(): void {
    this.fixtureService.getNextFixture()
    .pipe(takeUntil(this.destroy$))
    .subscribe(fixture => (this.fixture = fixture));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
