import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonesRegistroComponent } from './botones-registro.component';

describe('BotonesRegistroComponent', () => {
  let component: BotonesRegistroComponent;
  let fixture: ComponentFixture<BotonesRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotonesRegistroComponent]
    });
    fixture = TestBed.createComponent(BotonesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
