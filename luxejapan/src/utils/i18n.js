import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export function useLocalePath() {
  const { locale } = useI18n();
  const router = useRouter();

  const localePath = (path) => {
    // 移除開頭的斜線
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // 如果路徑已經包含語言前綴，則直接返回
    if (cleanPath.startsWith('en/') || cleanPath.startsWith('zh-tw/')) {
      return `/${cleanPath}`;
    }
    // 添加當前語言前綴
    return `/${locale.value}/${cleanPath}`;
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