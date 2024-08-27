import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacadeControlComponent } from './facade-control.component';

describe('FacadeControlComponent', () => {
  let component: FacadeControlComponent;
  let fixture: ComponentFixture<FacadeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacadeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacadeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
