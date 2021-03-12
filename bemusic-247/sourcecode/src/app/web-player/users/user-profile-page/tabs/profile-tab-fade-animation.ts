import {animate, state, style, transition, trigger} from '@angular/animations';

export const ProfileTabFadeAnimation = trigger('fadeIn',
    [
        state('false', style({'opacity': '0'})),
        state('true', style({'opacity': '1'})),

        transition('false => true', [
            animate('200ms ease-in')
        ]),
    ]);
