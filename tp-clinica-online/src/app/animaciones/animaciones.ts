import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('bienvenida => login', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(100%)' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0%)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('login => bienvenida', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('login => quien-soy', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0 }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('quien-soy => login', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ opacity: 0, transform: 'rotate(180deg)' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ opacity: 0 }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'rotate(0deg)' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('turnos => mi-perfil', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(100%) translateX(-100%)' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(100%) translateX(-100%)' }))
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0%) translateX(0%)' }))
          ])
        ]),
        query(':enter', animateChild()),
      ]),
      transition('mi-perfil => turnos', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ opacity: 0, backgroundColor: 'white' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0 }))
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ opacity: 1, backgroundColor: 'white' }))
          ])
        ]),
        query(':enter', animateChild()),
      ]),
      transition('login => registro', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ opacity: 0, transform: 'rotateY(-180deg)' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0 }))
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'rotateY(0deg)' }))
          ])
        ]),
        query(':enter', animateChild()),
      ]),
      transition('bienvenida => mi-perfil', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ opacity: 0, transform: 'rotateY(-180deg)' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0 }))
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'rotateY(0deg)' }))
          ])
        ]),
        query(':enter', animateChild()),
      ]),
      transition('* => bienvenida', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('500ms ease-out', style({ opacity: 0, transform: 'scale(0)' })),
        query(':leave', animateChild()),
      ]),
      transition('* => login', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            width: '100%',
          }),
        ]),
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(100%)' }),
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' })),
          ]),
          query(':enter', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' })),
          ]),
        ]),
        query(':enter', animateChild()),
      ]),
    ]);