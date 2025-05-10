import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
// import Services from '@/pages/Services.vue';
import ProcessFaq from '@/pages/ProcessFaq.vue';
import Contact from '@/pages/Contact.vue';
import ServiceNotes from '@/pages/ServiceNotes.vue';
import Testimonials from '@/pages/Testimonials.vue';
import ServiceTerms from '@/pages/ServiceTerms.vue';
import PrivacyPolicy from '@/pages/PrivacyPolicy.vue';

const localePattern = ':locale(zh-tw|en|ko|vi|es)';

const routes = [
  {
    path: `/:locale(zh-tw|en|ko|vi|es)`,
    name: 'Home',
    component: Home,
    meta: {
      title: 'Luxe Japan Elite Escorts',
      description: 'Experience the finest companionship and luxury services in Japan.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/about`,
    name: 'About',
    component: About,
    meta: {
      title: 'About Us - Luxe Japan Elite Escorts',
      description: 'Learn about our brand philosophy and service commitment.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/process-faq`,
    name: 'ProcessFaq',
    component: ProcessFaq,
    meta: {
      title: 'Process & FAQ - Luxe Japan Elite Escorts',
      description: 'Learn about our booking process and find answers to frequently asked questions.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/contact`,
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Contact Us - Luxe Japan Elite Escorts',
      description: 'Get in touch with us for premium companionship services in Japan.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/service-notes`,
    name: 'ServiceNotes',
    component: ServiceNotes,
    meta: {
      title: 'Service Notes - Luxe Japan Elite Escorts',
      description: 'Important information about our service policies and guidelines.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/testimonials`,
    name: 'Testimonials',
    component: Testimonials,
    meta: {
      title: 'Client Testimonials - Luxe Japan Elite Escorts',
      description: 'Read about our clients\' experiences and success stories.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/terms`,
    name: 'ServiceTerms',
    component: ServiceTerms,
    meta: {
      title: 'Terms of Service - Luxe Japan Elite Escorts',
      description: 'Terms and conditions for using our services.'
    }
  },
  {
    path: `/:locale(zh-tw|en|ko|vi|es)/privacy`,
    name: 'PrivacyPolicy',
    component: PrivacyPolicy,
    meta: {
      title: 'Privacy Policy - Luxe Japan Elite Escorts',
      description: 'Our privacy policy and data protection practices.'
    }
  },
  // 404 路由必须放最后，且用:pathMatch(.*)*避免与正常页面冲突
  {
    path: '/:locale(zh-tw|en|ko|vi|es)/:pathMatch(.*)*',
    name: 'Error404',
    component: () => import('@/pages/Error404.vue'),
    meta: {
      title: '404 - Luxe Japan',
      description: '页面未找到'
    }
  },
  // 没有语言前缀的情况，重定向到默认语言
  {
    path: '/',
    redirect: '/en'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/en/404'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.PROD ? '/luxejapan-public/' : '/'),
  routes
});

// 动态设置页面标题和描述
router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta && to.meta.description) {
    let desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', to.meta.description);
  }
});

export default router; 