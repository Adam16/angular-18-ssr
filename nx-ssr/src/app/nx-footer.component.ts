import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-nx-footer',
  template: ` <style>
      #love {
        color: rgba(107, 114, 128, 1);
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 3.5rem;
        opacity: 0.6;
        text-align: center;
      }
      #love svg {
        color: rgba(252, 165, 165, 1);
        width: 1.25rem;
        height: 1.25rem;
        display: inline;
        margin-top: -0.25rem;
      }
    </style>
    <p id="love">
      Carefully crafted with
      <svg
        fill="currentColor"
        stroke="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </p>`,
  standalone: true,
  host: {
    ngSkipHydration: 'true',
  },
  encapsulation: ViewEncapsulation.None,
})
export class NxFooterComponent {}
