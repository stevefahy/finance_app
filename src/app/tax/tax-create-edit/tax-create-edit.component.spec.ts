import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxCreateEditComponent } from './tax-create-edit.component';

describe('TaxCreateEditComponent', () => {
  let component: TaxCreateEditComponent;
  let fixture: ComponentFixture<TaxCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
