import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export function useLocalePath() {
  const { locale } = useI18n();
  const router = useRouter();

  const localePath = (path) => {
    // 获取 base 路径
    const base = import.meta.env.BASE_URL || '/';
    // 移除开头的斜线
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // 如果路径已经包含语言前缀，直接返回（加上 base）
    const supportedLocales = ['en', 'zh-tw', 'ko', 'vi', 'es'];
    const hasLocale = supportedLocales.some(lang => cleanPath.startsWith(`${lang}/`));
    if (hasLocale) {
      return `${base}${cleanPath}`.replace(/\/+/g, '/');
    }
    // 添加当前语言前缀（加上 base）
    return `${base}${locale.value}/${cleanPath}`.replace(/\/+/g, '/');
  };

  const switchLocalePath = (newLocale) => {
    const currentRoute = router.currentRoute.value;
    const { path } = currentRoute;
    // 移除當前語言前綴
    const pathWithoutLocale = path.replace(/^\/[^/]+/, '');
    // 添加新語言前綴
    return `/${newLocale}${pathWithoutLocale}`;
  };

  return {
    localePath,
    switchLocalePath
  };
} 