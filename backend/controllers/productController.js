const puppeteer = require("puppeteer");

const getProductInformation = async (request, response) => {

    const { upcArray } = request.body;
    var items = [];
    console.log(upcArray);

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
    });

    var [page] = await browser.pages();

    for(let i = 0; i < upcArray.length; i++){
        let pageUrl = `https://www.nofrills.ca/search?search-bar=${upcArray[i]}`;

        page[i] = await browser.newPage();
        await page[i].goto(pageUrl, {
            waitUntil: "networkidle0",
        });

        let productBrand = await page[i].evaluate(() => {
            if (document.querySelector("span.product-name__item.product-name__item--brand")){
                let brand = document.querySelector("span.product-name__item.product-name__item--brand").innerText;
                return brand;
            } else {
                return null;
            }
        });

        let productName = await page[i].evaluate(() => {
            if (document.querySelector("span.product-name__item.product-name__item--name")){
                let name = document.querySelector("span.product-name__item.product-name__item--name").innerText;
                return name;
            } else {
                return null;
            }
        });
        
        let productWeight = await page[i].evaluate(() => {
            let regEx = new RegExp("[0-9]+");
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

        let productInfo = {
            title: productName,
            brand: productBrand,
            weight: productWeight.weight,
            weightUnit: productWeight.weightUnit,
        };

        console.log(productInfo);

        items.push(productInfo);

        await page[i].close();
    }

    await browser.close();
    
    return response.status(200).json(items);
}

module.exports = { getProductInformation };