const app = require("express")();
const chromium = require('@sparticuz/chromium-min');
const puppeteer = require("puppeteer-core");

  try {
    // const browser = await puppeteer.launch({
    //   // args: chromium.args,
    //   args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    //   defaultViewport: chromium.defaultViewport,
    //   executablePath: await chromium.executablePath(
    //     `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    //   ),
    //   headless: chromium.headless,
    //   ignoreHTTPSErrors: true,
    // });

    async function getBrowser() {
      // local development is broken for this 👇
      // but it works in vercel so I'm not gonna touch it
      return puppeteer.launch({
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
        ),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    }

    const browser = await getBrowser();
  
    const page = await browser.newPage();
    await page.goto("https://www.mamedica.co.uk/repeat-prescription/");
    const pageTitle = await page.title();
    console.log(pageTitle)

    // await page.waitForSelector('#field_3_31')
    // await page.click('#label_3_31_0');
    // await page.click('#label_3_45_0');
    // await page.click('#label_3_32_0');
    // await page.waitForSelector('#field_3_50 .selectric-scroll');

    // // capture all the items in stock list
    // let elements = await page.$$('#field_3_50 .selectric-scroll ul li');

    // // loop trough items
    // availableFlowers = [];
    // for (let i = 1; i < elements.length; i++) {
    //   await page.click('#field_3_50 b.button');
    //   await page.click(`#field_3_50 .selectric-items .selectric-scroll ul li[data-index*="${i}"]`);
    //   const flower = await page.$eval(`#field_3_50 .selectric-items .selectric-scroll ul li[data-index*="${i}"]`, e => e.innerText);
    //   await page.waitForTimeout(10) 
    //   await page.$eval('#input_3_53', el => el.value = '1');
    //   await page.click('#field_3_77');
    //   await page.waitForTimeout(20) 
    //   const getCosts = await page.$eval('#input_3_67', e => e.value);
    //   const cost = getCosts.replace(/\s/g, '');
    //   await page.waitForTimeout(20) 
    //   availableFlowers.push({ "item": 
    //     {"flower": flower, "cost": cost}
    //   })
    // }
    // lastScrapeTimestamp = new Date().toLocaleString('en-GB', {
    //   year: 'numeric',
    //   month: 'numeric',
    //   day: 'numeric',
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   second: 'numeric',
    //   hour12: false,
    // });
    // console.log('Scraped data at', lastScrapeTimestamp);
    await browser?.close();
    console.log('Closed browser')
    res.send(availableFlowers);
  } catch (err) {
    console.error(err);
    return null;
  }

  module.exports = async (req, res) => {
    if (!req.query.url) return res.status(400).send('No url query specified.');
    if (!checkUrl(req.query.url))
      return res.status(400).send('Invalid url query specified.');
    try {
      res.status(200).send(pageTitle);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send(
          'The server encountered an error. You may have inputted an invalid query.'
        );
    }
  };
