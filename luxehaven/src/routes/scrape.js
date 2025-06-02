import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

router.post('/', async (req, res) => {
  const targetUrl = req.body.url;
  if (!targetUrl) {
    return res.status(400).json({ error: '缺少 url 参数' });
  }
  let browser = null;
  try {
    browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto(targetUrl);
    const title = await page.title();
    const html = await page.content();
    await browser.close();
    res.json({ title, html });
  } catch (err) {
    if (browser) await browser.close();
    res.status(500).json({ error: err.toString() });
  }
});

export default router; 