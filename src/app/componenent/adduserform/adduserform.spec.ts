import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adduserform } from './adduserform';

describe('Adduserform', () => {
  let component: Adduserform;
  let fixture: ComponentFixture<Adduserform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adduserform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adduserform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
