import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserTax } from '../tax.model';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { HintService } from 'src/app/hint/hint.service';

@Component({
  selector: 'app-tax-list',
  templateUrl: './tax-list.component.html',
  styleUrls: ['./tax-list.component.scss'],
})
export class TaxListComponent implements OnInit {
  public myTaxData: UserTax[] = [];
  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(
    public router: Router,
    private marketDataService: MarketDataService,
    private hintService: HintService
  ) {}

  ngOnInit(): void {
    this.allDataUpdatedListenerSubs = this.marketDataService
      .getAllDataUpdatedistener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        let initial_taxes = res.user_taxes;
        this.myTaxData = [...initial_taxes];
        if (this.myTaxData.length < 1) {
          this.hintService.throwHint({
            name: 'taxs',
          });
        }
      });
  }

  public create(): void {
    this.router.navigate(['/edit-tax']);
  }

  public editTax(id): void {
    this.router.navigate(['/edit-tax', id]);
  }

  ngOnDestroy(): void {
    this.allDataUpdatedListenerSubs.unsubscribe();
    this.ngUnsubscribe.next(void 0);
    this.ngUnsubscribe.complete();
    this.myTaxData = [];
  }
}
