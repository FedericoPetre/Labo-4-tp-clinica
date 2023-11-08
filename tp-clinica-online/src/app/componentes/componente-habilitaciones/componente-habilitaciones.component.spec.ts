import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteHabilitacionesComponent } from './componente-habilitaciones.component';

describe('ComponenteHabilitacionesComponent', () => {
  let component: ComponenteHabilitacionesComponent;
  let fixture: ComponentFixture<ComponenteHabilitacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponenteHabilitacionesComponent]
    });
    fixture = TestBed.createComponent(ComponenteHabilitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
