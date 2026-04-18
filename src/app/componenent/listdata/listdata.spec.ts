import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listdata } from './listdata';

describe('Listdata', () => {
  let component: Listdata;
  let fixture: ComponentFixture<Listdata>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listdata]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listdata);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
