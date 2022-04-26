import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('Home => FilterPage', [
    query(
      ':enter',
      style({ position: 'fixed', width: '100%', 'z-index': 100 }),
      {
        optional: true,
      }
    ),

    query(':leave', style({ position: 'absolute', width: '100%' }), {
      optional: true,
    }),

    group([
      query(
        ':enter ',
        [
          style({ transform: 'translateX(100%)' }),
          animate('500ms ease-in-out', style({ transform: 'translateX(0%)' })),
        ],
        { optional: true }
      ),
      query(':leave *', [style({ transform: 'translateX(0%)' })], {
        optional: true,
      }),
    ]),
    query(':enter', animateChild()),
  ]),

  transition('FilterPage => Home', [
    query(':enter', style({ position: 'absolute', width: '100%' }), {
      optional: true,
    }),

    query(':leave ', style({ position: 'fixed', width: '100%' }), {
      optional: true,
    }),
    group([
      query(
        ':enter ',
        [
          style({
            transform: 'translateX(0%)',
            position: 'absolute',
            width: '100%',
          }),
        ],
        { optional: true }
      ),

      query(
        ':leave ',
        [
          style({ transform: 'translateX(0%)', 'z-index': 1000 }),
          animate(
            '500ms ease-in-out',
            style({ transform: 'translateX(100%)' })
          ),
        ],
        { optional: true }
      ),
    ]),
    query(':leave ', animateChild()),
  ]),
]);
