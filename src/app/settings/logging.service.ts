import { Injectable } from '@angular/core';
import { DEBUG } from './debug';

@Injectable({ providedIn: 'root' })
export class LogService {
  private debugLogging: Boolean = DEBUG.LOGGING.log;
  private debugSource: Boolean = DEBUG.LOGGING.source;

  private style_title: string;
  private style_body: string;
  private style_origin: string;

  constructor() {
    this.style_title = 'color: OliveDrab; font-size: 0.9rem; font-weight: 600;';
    this.style_body = 'color: Olive; font-size: 0.9rem; font-weight: normal;';
    this.style_origin =
      'color: DarkSlateGrey; font-size: 0.7rem; font-weight: normal;';
  }

  obj(obj) {
    if (this.debugLogging) {
      let callSite = '';
      if (this.debugSource) {
        callSite = new Error().stack!.split('\n')[2].trim();
      }
      console.log(
        '%c%s %c%s',
        this.style_body,
        'OBJECT:',
        this.style_origin,
        callSite
      );
      console.log(obj);
    }
  }

  log(...args: any[]) {
    if (this.debugLogging) {
      let a = [...args];
      // Check for objects, stringify if found for logging
      for (var key in a) {
        if (a.hasOwnProperty(key)) {
          if (typeof a[key] == 'object') {
            a[key] = JSON.stringify(a[key]);
          }
        }
      }
      let b = a.join(': ');
      let callSite = '';
      if (this.debugSource) {
        callSite = new Error().stack!.split('\n')[2].trim();
      }
      console.log('%c%s %c%s', this.style_body, b, this.style_origin, callSite);
    }
  }

  title(...args: any[]) {
    if (this.debugLogging) {
      let a = [...args];
      let b = a.join(' ');
      console.log(
        '%c' + '-----------------------------------------',
        this.style_title
      );
      console.log('%c' + b, this.style_title);
      console.log(
        '%c' + '-----------------------------------------',
        this.style_title
      );
    }
  }
}
