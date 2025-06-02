import express from 'express';
import bodyParser from 'body-parser';
import { config } from './config/envConfig.js';
import { log } from './utils/logger.js';
import scrapeRouter from './routes/scrape.js';
import healthzRouter from './routes/healthz.js';

const app = express();

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/scrape', scrapeRouter);
app.use('/healthz', healthzRouter);

app.get('/', (req, res) => {
  res.send(`
    <h2>CityHeaven Puppeteer 服务（增强版）</h2>
    <p>健康检查：<a href="/healthz">/healthz</a></p>
    <p>示例爬虫接口：POST /scrape</p>
    <pre>
      Content-Type: application/json
      Body:
        { "url": "https://www.cityheaven.net/……" }
    </pre>
  `);
});

app.listen(config.port, () => {
  log(`Puppeteer Scraper 服务已启动，监听端口 ${config.port}`);
}); 