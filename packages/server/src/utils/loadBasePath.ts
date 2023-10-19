const BaseInEnv: string = process.env.VAN_BLOG_BASE_PATH || '';
export const BASE_PREFIX: string =
  process.env.NODE_ENV !== 'development' && BaseInEnv && BaseInEnv !== ''
    ? BaseInEnv
    : '';
