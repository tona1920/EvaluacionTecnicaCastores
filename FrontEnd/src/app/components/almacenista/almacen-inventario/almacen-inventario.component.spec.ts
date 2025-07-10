import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenInventarioComponent } from './almacen-inventario.component';

describe('AlmacenInventarioComponent', () => {
  let component: AlmacenInventarioComponent;
  let fixture: ComponentFixture<AlmacenInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlmacenInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmacenInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
