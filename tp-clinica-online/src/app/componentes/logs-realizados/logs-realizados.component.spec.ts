import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsRealizadosComponent } from './logs-realizados.component';

describe('LogsRealizadosComponent', () => {
  let component: LogsRealizadosComponent;
  let fixture: ComponentFixture<LogsRealizadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogsRealizadosComponent]
    });
    fixture = TestBed.createComponent(LogsRealizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
