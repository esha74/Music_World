import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editform } from './editform';

describe('Editform', () => {
  let component: Editform;
  let fixture: ComponentFixture<Editform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
