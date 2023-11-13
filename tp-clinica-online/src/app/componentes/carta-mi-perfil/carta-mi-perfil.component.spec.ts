import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaMiPerfilComponent } from './carta-mi-perfil.component';

describe('CartaMiPerfilComponent', () => {
  let component: CartaMiPerfilComponent;
  let fixture: ComponentFixture<CartaMiPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartaMiPerfilComponent]
    });
    fixture = TestBed.createComponent(CartaMiPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
