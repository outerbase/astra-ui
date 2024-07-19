import { css } from 'lit'

export default css`
  /* Light theme */
  code[class*='language-'],
  pre[class*='language-'],
  .freedom .token.operator {
    color: #e11d48 !important;
  }

  .freedom .token.invalid {
    color: #ff0000 !important;
  }

  .freedom .token.keyword {
    color: #1d4ed8 !important;
  }

  .freedom .token.comment {
    color: #a3a3a3 !important;
  }

  .freedom .token.variable {
    color: #000 !important;
  }

  .freedom .token.function {
    color: #795e26 !important;
  }

  .freedom .token.punctuation {
    color: var(--color-primary-light) !important;
  }

  .freedom .token.number {
    color: #0000ff !important;
  }

  .freedom .token.string {
    color: black !important;
  }

  /* Dark theme */
  .freedom .dark {
    color: #f43f5e;
  }
  .freedom .dark code[class*='language-'],
  .freedom .dark pre[class*='language-'],
  .freedom .dark .token.operator {
    color: #fb7185 !important;
  }

  .freedom .dark .token.invalid {
    color: #ff0000 !important;
  }

  .freedom .dark .token.keyword {
    color: #3b82f6 !important;
  }

  .freedom .dark .token.comment {
    color: #737373 !important;
  }

  .freedom .dark .token.variable,
  .freedom .dark .token.function {
    color: #60a5fa !important;
  }

  .freedom .dark .token.punctuation {
    color: var(--color-primary-dark) !important;
  }

  .freedom .dark .token.number {
    color: #60a5fa !important;
  }

  .freedom .dark .token.string {
    color: white !important;
  }
`
