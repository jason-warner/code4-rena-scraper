import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
import TurndownService from 'turndown';

const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 });


const scrapeReportRefs = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36');
    await page.setViewport({ width: 1000, height: 926 });
    await page.goto('https://code4rena.com/reports');
    await page.waitForSelector('div.report-tile');

    const reports = await page.evaluate(() => {
        const anchor = document.body.querySelectorAll('a.report-tile__report-link');
        const hrefs = [];
        for (let i = 0; i < anchor?.length; i++) {
            hrefs.push(anchor[i].getAttribute('href'));
        }
        return hrefs;
    });

    await browser.close();
    return reports;
};


const writeReports = async () => {

    const reportRefs = await scrapeReportRefs();

    reportRefs.forEach((ref) => {
        if (ref.includes('https')) return;
        http.get(`https://code4rena.com${ref}`).then((res) => {
            const $ = cheerio.load(res.data);
            const targetData = $('div.type__article');
            const targetHtml = $.html(targetData);
            const turndownService = new TurndownService();
            const markdown = turndownService.turndown(targetHtml);
            return fs.writeFile(`.${ref}.md`, markdown, (err) => console.log(err ? err : `success: ${ref}`));
        });
    });
}

writeReports();



