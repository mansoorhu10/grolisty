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
        waitUntil: "networkidle0",
    });

    // console.log(page);
    const productBrand = await page.evaluate(() => {
        if (document.querySelector("span.product-name__item.product-name__item--brand")){
            const brand = document.querySelector("span.product-name__item.product-name__item--brand").innerText;
            return brand;
        } else {
            return null;
        }
    });

    const productName = await page.evaluate(() => {
        if (document.querySelector("span.product-name__item.product-name__item--name")){
            const name = document.querySelector("span.product-name__item.product-name__item--name").innerText;
            return name;
        } else {
            return null;
        }
    });
    
    const productWeight = await page.evaluate(() => {
        const regEx = new RegExp("[0-9]+");
        if (document.querySelector("span.product-name__item.product-name__item--package-size")){
            var weight = document.querySelector("span.product-name__item.product-name__item--package-size").innerText;

            if (weight.includes('kg')){
                weightUnit = 'kg';
            } else if (weight.includes('g')){
                weightUnit = 'g';
            } else if (weight.includes('mL') || weight.includes('ml')){
                weightUnit = 'mL';
            } else if (weight.includes('L') || weight.includes('l')){
                weightUnit = 'L';
            }

            weight = regEx.exec(weight)[0];

            return { weight, weightUnit };
        } else {
            return null;
        }
    });

    const productInfo = {
        title: productName,
        brand: productBrand,
        weight: productWeight.weight,
        weightUnit: productWeight.weightUnit,
    }

    console.log(productInfo);

    await browser.close();

    return response.status(200).json(productInfo);
}

module.exports = { getProductInformation };