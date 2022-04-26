import { Component, OnInit, OnDestroy } from '@angular/core';
import { TaxUserService } from '../tax.user.service';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-tax-create-edit',
  templateUrl: './tax-create-edit.component.html',
  styleUrls: ['./tax-create-edit.component.scss'],
})
export class TaxCreateEditComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public isLoading: boolean = false;
  public mode: string = 'create';
  public taxForm: FormGroup;
  public taxId: string;

  constructor(
    public fb: FormBuilder,
    public taxUserService: TaxUserService,
    private marketDataService: MarketDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Stop Polling
    this.marketDataService.stopPolling();

    this.taxForm = new FormGroup({
      _id: new FormControl('', {}),
      tax_type: new FormControl('CGT', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      rate: new FormControl('33', { validators: [Validators.required] }),
      credit: new FormControl('1270', { validators: [Validators.required] }),
      date_start: new FormControl('2021-04-21T23:00:00.000Z', {
        validators: [Validators.required],
      }),
      date_end: new FormControl('2021-04-23T23:00:00.000Z', {
        validators: [Validators.required],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taxId')) {
        this.mode = 'edit';
        this.taxId = paramMap.get('taxId');
        this.taxUserService.getUserTax(this.taxId).subscribe((taxData) => {
          let tax = taxData.taxs[0];
          this.taxForm.patchValue({
            _id: tax._id,
            credit: tax.credit,
            rate: tax.rate,
            tax_type: tax.tax_type,
            date_start: tax.date_start,
            date_end: tax.date_end,
          });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.marketDataService.restartPolling();
  }

  onSaveTax(): void {
    if (this.taxForm.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.taxUserService.addTax(
        this.taxForm.value.tax_type,
        this.taxForm.value.rate,
        this.taxForm.value.credit,
        new Date(this.taxForm.value.date_start).toISOString(),
        new Date(this.taxForm.value.date_end).toISOString()
      );
    } else {
      // Update Tax
      this.taxUserService.updateTax(
        this.taxForm.value._id,
        this.taxForm.value.tax_type,
        this.taxForm.value.rate,
        this.taxForm.value.credit,
        new Date(this.taxForm.value.date_start).toISOString(),
        new Date(this.taxForm.value.date_end).toISOString()
      );
    }
    this.taxForm.reset();
    this.router.navigate(['']);
  }

  deleteTax(taxId: string): void {
    this.taxUserService.deleteTax(taxId);
    this.taxForm.reset();
    this.router.navigate(['']);
  }
}
