import puppeteer from 'puppeteer';

console.log('PATH:', process.env.PUPPETEER_EXECUTABLE_PATH);

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto('https://www.example.com');
    const title = await page.title();
    console.log('Page title:', title);
    await browser.close();
  } catch (err) {
    console.error('Puppeteer 启动失败:', err);
    process.exit(1);
  }
})(); 