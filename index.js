const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.goto("https://www.mamedica.co.uk/repeat-prescription/");
    await page.waitForSelector('#field_3_31')
    await page.click('#label_3_31_0');
    await page.click('#label_3_45_0');
    await page.click('#label_3_32_0');
    await page.waitForSelector('#field_3_50 .selectric-scroll');

    // capture all the items in stock list
    let elements = await page.$$('#field_3_50 .selectric-scroll ul li');

    // loop trough items
    availableFlowers = [];
    for (let i = 1; i < elements.length; i++) {
      await page.click('#field_3_50 b.button');
      await page.click(`#field_3_50 .selectric-items .selectric-scroll ul li[data-index*="${i}"]`);
      const flower = await page.$eval(`#field_3_50 .selectric-items .selectric-scroll ul li[data-index*="${i}"]`, e => e.innerText);
      await page.waitForTimeout(10) 
      await page.$eval('#input_3_53', el => el.value = '1');
      await page.click('#field_3_77');
      await page.waitForTimeout(20) 
      const getCosts = await page.$eval('#input_3_67', e => e.value);
      const cost = getCosts.replace(/\s/g, '');
      await page.waitForTimeout(20) 
      availableFlowers.push({ "item": 
        {"flower": flower, "cost": cost}
      })
    }
    lastScrapeTimestamp = new Date().toLocaleString('en-GB', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    console.log('Scraped data at', lastScrapeTimestamp);
    await browser?.close();
    console.log('Closed browser')
    res.send(availableFlowers);
  } catch (err) {
    console.error(err);
    return null;
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});

module.exports = app;
