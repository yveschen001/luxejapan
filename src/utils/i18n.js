import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export function useLocalePath() {
  const { locale } = useI18n();
  const router = useRouter();

  const localePath = (path) => {
    // 移除开头的斜线
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // 如果路径已经包含语言前缀，直接返回
    const supportedLocales = ['en', 'zh-tw', 'ko', 'vi', 'es'];
    const hasLocale = supportedLocales.some(lang => cleanPath.startsWith(`${lang}/`));
    if (hasLocale) {
      return `/${cleanPath}`;
    }
    // 添加当前语言前缀
    return `/${locale.value}/${cleanPath}`;
  };

  const switchLocalePath = (newLocale) => {
    const currentRoute = router.currentRoute.value;
    const { path } = currentRoute;
    // 移除当前语言前缀
    const pathWithoutLocale = path.replace(/^\/[^/]+/, '');
    // 添加新语言前缀
    return `/${newLocale}${pathWithoutLocale}`;
  };

  return {
    localePath,
    switchLocalePath
  };
} 