export const colors = {
  // 主色调
  primary: {
    50: '#EBF5FF',
    100: '#E1EFFE',
    200: '#C3DDFD',
    300: '#A4CAFE',
    400: '#76A9FA',
    500: '#3F83F8',
    600: '#1C64F2',
    700: '#1A56DB',
    800: '#1E429F',
    900: '#233876',
  },
  
  // 中性色
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // 功能色
  success: {
    light: '#10B981',
    dark: '#059669',
  },
  warning: {
    light: '#F59E0B',
    dark: '#D97706',
  },
  danger: {
    light: '#EF4444',
    dark: '#DC2626',
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
}

export const typography = {
  // 字体大小系统
  fontSizes: {
    // 标题系统
    h1: '2.25rem',     // 36px - 主标题
    h2: '1.875rem',    // 30px - 次级标题
    h3: '1.5rem',      // 24px - 段落标题
    h4: '1.25rem',     // 20px - 小标题
    h5: '1.125rem',    // 18px - 强调文本
    
    // 正文系统
    base: '1rem',      // 16px - 正文
    sm: '0.875rem',    // 14px - 次要文本
    xs: '0.75rem',     // 12px - 辅助文本
    
    // 特殊场景
    display: '3rem',    // 48px - 展示性文本
    caption: '0.625rem' // 10px - 标注文本
  },
  
  // 字重系统
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  // 行高系统
  lineHeights: {
    none: '1',          // 用于单行文本
    tight: '1.25',      // 用于紧凑标题
    snug: '1.375',      // 用于短段落
    normal: '1.5',      // 用于正文
    relaxed: '1.625',   // 用于长段落
    loose: '2',         // 用于特殊排版
  },
  
  // 字间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },
  
  // 文本变体
  variants: {
    // 标题
    h1: {
      fontSize: '2.25rem',
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em'
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.025em'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '-0.025em'
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '-0.025em'
    },
    
    // 正文
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'body-sm': {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    
    // 功能文本
    button: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.25',
      letterSpacing: '0.025em'
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.25',
      letterSpacing: '0.025em'
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: '500',
      lineHeight: '1',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }
}

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
}

export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

export const elevation = {
  0: 'none',
  1: `
    0px 1px 2px rgba(0, 0, 0, 0.06),
    0px 1px 3px rgba(0, 0, 0, 0.1)
  `,
  2: `
    0px 2px 4px rgba(0, 0, 0, 0.06),
    0px 4px 6px rgba(0, 0, 0, 0.1)
  `,
  3: `
    0px 4px 6px rgba(0, 0, 0, 0.05),
    0px 10px 15px rgba(0, 0, 0, 0.1)
  `,
  4: `
    0px 10px 15px rgba(0, 0, 0, 0.04),
    0px 20px 25px rgba(0, 0, 0, 0.1)
  `,
} 