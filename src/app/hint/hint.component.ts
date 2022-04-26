import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { HintInterface } from './hint.model';
import { HintService } from './hint.service';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
})
export class HintComponent implements OnInit, OnDestroy {
  private hintSub: Subscription;
  public hint: HintInterface;
  public show: boolean = false;

  @Input() hint_name: string;

  constructor(private hintService: HintService) {}

  ngOnInit(): void {
    this.hintSub = this.hintService.getHintListener().subscribe((result) => {
      let icon: string;
      if (result.name == this.hint_name) {
        if (result.name) {
          this.show = true;
        } else {
          this.show = false;
        }
        if (result.icon) {
          icon = result.icon;
        }
        this.hint = { message: result.message, icon: icon };
      }
    });
  }

  ngOnDestroy() {
    this.hintSub.unsubscribe();
  }
}
