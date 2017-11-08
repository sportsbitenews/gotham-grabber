const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));

const url = argv.url;
const outdir = argv.outdir || '.';
let offset = url.indexOf('.com');

let filename = url.substring(offset + 5).replace(/\//g,'-');

if (filename.endsWith('.php')) {
    filename = filename.slice(0,-4);
}

(async () => {
    const browser = await puppeteer.launch({ignoreHTTPSErrors:true});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Charset': 'utf-8'});
    
    try {
        await page.goto(url, {timeout: 0});
    } catch (e) {
        console.log(e);
        return
    }

    if (url.includes('dnainfo.com')) {
        await page.addStyleTag({path: 'dnainfotweaks.css'})
    }

    await page.emulateMedia('screen');
    await page.pdf({displayHeaderFooter: true, margin: {top: '.5in', bottom: '.5in', left: '.5in', right: '.5in'}, printBackground: true, path: outdir + '/' + filename + '.pdf'});

    await browser.close();
})();