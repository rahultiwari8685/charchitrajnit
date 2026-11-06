'use client'

import { useEffect } from "react"

/**
 * Initializes hover effects for links and buttons.
 *
 * 1. `a.link-effect-1`
 *    Replaces the anchor's text with two span elements:
 *      - `<span class="text-1">` original text
 *      - `<span class="text-2">` duplicated text for the hover animation
 *    Ensures the transformation is performed exactly once per element.
 *
 * 2. `.button-effect-1`
 *    Wraps each button's text in:
 *      `<span class="btn-text">
 *          <span class="btn-text-1">original</span>
 *          <span class="btn-text-2">original</span>
 *      </span>`
 *    Again, guarantees idempotency.
 */
export default function useHoverEffects() {
  useEffect(() => {
    /* ---------- Link hover effect ---------- */
    const linkSelector = 'a.link-effect-1';
    document.querySelectorAll<HTMLAnchorElement>(linkSelector).forEach((anchor) => {
      // Skip if already processed
      if (anchor.querySelector('.text-1') || anchor.querySelector('.text-2')) return;

      const content = anchor.textContent?.trim() ?? '';
      if (!content) return;

      const span1 = document.createElement('span');
      span1.className = 'text-1';
      span1.textContent = content;

      const span2 = document.createElement('span');
      span2.className = 'text-2';
      span2.textContent = content;

      // Clear existing text and append new structure
      anchor.textContent = '';
      anchor.append(span1, span2);
    });

    /* ---------- Button hover effect ---------- */
    const buttonSelector = '.button-effect-1';
    document.querySelectorAll<HTMLButtonElement>(buttonSelector).forEach((button) => {
      if (button.querySelector('.btn-text')) return; // already processed

      const content = button.textContent?.trim() ?? '';
      if (!content) return;

      const wrapper = document.createElement('span');
      wrapper.className = 'btn-text';

      const span1 = document.createElement('span');
      span1.className = 'btn-text-1';
      span1.textContent = content;

      const span2 = document.createElement('span');
      span2.className = 'btn-text-2';
      span2.textContent = content;

      wrapper.append(span1, span2);

      button.textContent = '';
      button.append(wrapper);
    });
  }, []);
}
