import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HINT_MESSAGES } from '../settings/hint_messages';
import { HintInterface } from './hint.model';

@Injectable({ providedIn: 'root' })
export class HintService {
  private hintListener = new Subject<HintInterface>();
  private hintMessages = HINT_MESSAGES;
  constructor() {}

  getHintListener() {
    return this.hintListener.asObservable();
  }

  throwHint({ name }: HintInterface) {
    let hint_string = this.hintMessages.find((i) => i.name === name);
    if (hint_string) {
      this.hintListener.next({
        message: hint_string.message,
        icon: hint_string.icon,
        name: hint_string.name,
      });
    }
  }

  clearError() {
    this.hintListener.next({ name: '', icon: '', message: '' });
  }
}
