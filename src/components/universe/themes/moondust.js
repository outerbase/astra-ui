import { css } from 'lit'

export default css`
  /* Light theme */
  code[class*='language-'],
  pre[class*='language-'],
  .moondust .token.operator,
  .moondust .token.punctuation,
  .moondust .token.number {
    color: var(--color-primary-light) !important;
  }

  .moondust .token.invalid {
    color: #ff0000 !important;
  }

  .moondust .keyword,
  .moondust .comment,
  .moondust .token.string {
    color: var(--color-neutral-500) !important;
  }

  .moondust .token.variable,
  .moondust .token.function {
    color: #111111 !important;
  }

  /* Dark theme */
  .moondust .dark code[class*='language-'],
  .moondust .dark pre[class*='language-'],
  .moondust .dark .token.operator,
  .moondust .dark .token.punctuation,
  .moondust .dark .token.number,
  .moondust .dark .token.variable,
  .moondust .dark .token.function {
    color: var(--color-primary-dark) !important;
  }

  .moondust .dark .token.invalid {
    color: #ff0000 !important;
  }

  .moondust .dark .token.keyword,
  .moondust .dark .token.string {
    color: var(--color-neutral-400) !important;
  }

  .moondust .dark .token.comment {
    color: var(--color-neutral-500) !important;
  }
`
