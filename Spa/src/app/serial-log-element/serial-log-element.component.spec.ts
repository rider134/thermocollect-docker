import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialLogElementComponent } from './serial-log-element.component';

describe('SerialLogElementComponent', () => {
  let component: SerialLogElementComponent;
  let fixture: ComponentFixture<SerialLogElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerialLogElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialLogElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
