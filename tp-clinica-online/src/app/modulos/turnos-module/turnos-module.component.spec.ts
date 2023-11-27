import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosModuleComponent } from './turnos-module.component';

describe('TurnosModuleComponent', () => {
  let component: TurnosModuleComponent;
  let fixture: ComponentFixture<TurnosModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnosModuleComponent]
    });
    fixture = TestBed.createComponent(TurnosModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
