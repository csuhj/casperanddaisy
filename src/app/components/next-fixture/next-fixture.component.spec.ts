import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextFixtureComponent } from './next-fixture.component';

describe('NextFixtureComponent', () => {
  let component: NextFixtureComponent;
  let fixture: ComponentFixture<NextFixtureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextFixtureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextFixtureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
