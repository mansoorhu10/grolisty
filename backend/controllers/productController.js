const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");
const { Exception } = require("@techstark/opencv-js");

const getProductInformation = async (request, response) => {
    const { upc } = request.params;
    const pageUrl = `https://www.nofrills.ca/search?search-bar=${upc}`;

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(pageUrl, {
        waitUntil: "domcontentloaded",
    });

    // console.log(page);

    const productInfo = await page.evaluate(() => {
        const brand = document.querySelector("#root").innerText;
        return brand;
    });

    console.log(productInfo);
    

    // console.log(productInfo);

    

    // const config = {
    //     headers: {
    //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    //     },
    // };

    // const axiosResponse = await axios.request({
    //     method: "GET",
    //     url: pageUrl,
    //     headers: {
    //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    //     }
    // });

    // console.log(newAxios.data);

    // console.log(axiosResponse);

    // parsing the HTML source of the target web page with Cheerio
    //const $ = cheerio.load(newAxios.data);


    //const itemBrand = $("body").html();

    // console.log(itemBrand);

    return response.status(200);
}

module.exports = { getProductInformation };