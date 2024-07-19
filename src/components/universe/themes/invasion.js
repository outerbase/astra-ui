import { css } from 'lit'

export default css`
  /* Light theme */
  code[class*='language-'],
  pre[class*='language-'],
  .invasion .token.operator {
    color: #24292e !important;
  }

  .invasion .token.invalid {
    color: #ff0000 !important;
  }

  .invasion .token.keyword {
    color: #7f00ff !important;
  }

  .invasion .token.comment {
    color: #a3a3a3 !important;
  }

  .invasion .token.variable,
  .invasion .token.function {
    color: #000000 !important;
  }

  .invasion .token.punctuation {
    color: var(--color-primary-light) !important;
  }

  .invasion .token.number {
    color: #0000ff !important;
  }

  .invasion .token.string {
    color: #228b22 !important;
  }

  /* Dark theme */
  .invasion .dark code[class*='language-'],
  .invasion .dark pre[class*='language-'],
  .invasion .dark .token.operator {
    color: #f6f8fa !important;
  }

  .invasion .dark .token.invalid {
    color: #ff0000 !important;
  }

  .invasion .dark .token.keyword {
    color: #bd93f9 !important;
  }

  .invasion .dark .token.comment {
    color: var(--color-neutral-600) !important;
  }

  .invasion .dark .token.variable,
  .invasion .dark .token.function {
    color: #f8f8f2 !important;
  }

  .invasion .dark .token.punctuation {
    color: var(--color-primary-dark) !important;
  }

  .invasion .dark .token.number {
    color: #8be9fd !important;
  }

  .invasion .dark .token.string {
    color: #50fa7b !important;
  }
`
