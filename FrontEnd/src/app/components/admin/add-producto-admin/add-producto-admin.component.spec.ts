import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductoAdminComponent } from './add-producto-admin.component';

describe('AddProductoAdminComponent', () => {
  let component: AddProductoAdminComponent;
  let fixture: ComponentFixture<AddProductoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
