import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketStockDetailComponent } from './market-stock-detail.component';

describe('MarketStockDetailComponent', () => {
  let component: MarketStockDetailComponent;
  let fixture: ComponentFixture<MarketStockDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketStockDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketStockDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
