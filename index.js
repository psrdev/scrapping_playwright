const { chromium } = require('playwright');
const { axios } = require('axios');
const config = require('./config/config.js');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(config.site);
  const data = await page.evaluate(() => {
    const visalist = document.querySelector('#visa_list');
    const visaItems = visalist?.querySelectorAll('.cover') || [];

    return Array.from(visaItems).map((item) => {
      const title = item.querySelector('h3')?.innerText.trim() || '';
      const tag = item.querySelector('span.title')?.innerText.trim() || '';

      const thumb = item.querySelector('a.thumb');
      const style = thumb?.getAttribute('style') || '';
      const href = thumb?.getAttribute('href') || '';
      const bgImageMatch = style.match(/url\((.*?)\)/);
      const imageUrl = bgImageMatch ? bgImageMatch[1].replace(/['"]/g, '') : '';

      return { title, tag, imageUrl, href };
    });
  });
  await fs.writeFile('visa.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File has been written successfully');
    }
  });


  // Navigate to the login page


})();