import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCreateComponent } from './stock-create-edit.component';

describe('StockCreateComponent', () => {
  let component: StockCreateComponent;
  let fixture: ComponentFixture<StockCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
