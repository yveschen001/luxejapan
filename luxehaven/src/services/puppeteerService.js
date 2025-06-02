import puppeteer from 'puppeteer';
import { config } from '../config/envConfig.js';

console.log('[DEBUG] 当前 Puppeteer Executable Path:', process.env.PUPPETEER_EXECUTABLE_PATH);
console.log('[DEBUG] 从 config 读取的 puppeteerExecutablePath:', config.puppeteerExecutablePath);

export async function scrapePage(targetUrl) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      executablePath: config.puppeteerExecutablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      headless: 'new',
      defaultViewport: null
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/115.0.5790.102 Safari/537.36'
    );
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 45000
    });
    await page.waitForSelector('.container', { timeout: 10000 }).catch(() => {});
    const html = await page.content();
    return html;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
} 