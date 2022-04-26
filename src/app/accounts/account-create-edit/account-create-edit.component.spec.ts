import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreateEditComponent } from './account-create-edit.component';

describe('AccountCreateEditComponent', () => {
  let component: AccountCreateEditComponent;
  let fixture: ComponentFixture<AccountCreateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountCreateEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
