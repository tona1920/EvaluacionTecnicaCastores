import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenHomeComponent } from './almacen-home.component';

describe('AlmacenHomeComponent', () => {
  let component: AlmacenHomeComponent;
  let fixture: ComponentFixture<AlmacenHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlmacenHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmacenHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
