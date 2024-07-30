const puppeteer = require("puppeteer");

const getProductInformation = async (request, response) => {

    const { upcArray } = request.body;
    var items = [];
    console.log(upcArray);

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: null,
    });

    var [page] = await browser.pages();

    for(let i = 0; i < upcArray.length; i++){
        let pageUrl = `https://www.nofrills.ca/search?search-bar=${upcArray[i]}`;

        page[i] = await browser.newPage();
        page[i].setDefaultNavigationTimeout(60000);
        await page[i].goto(pageUrl, {
            waitUntil: "networkidle0",
        });

        let { productBrand, productName, productWeight, productWeightUnit } = await page[i].evaluate(() => {
            let query = document.querySelector('[data-testid="product-brand"]');
            let brand = "";
            let title = "";
            let weight = "";
            let weightUnit = "";
            if (query) {
                brand = query.innerText;
            }

            query = document.querySelector('[data-testid="product-title"]');
            if (query) {
                title = query.innerText;
            } else {
                title = "";
            }
            
            let regEx = new RegExp("[0-9]+");
            query = document.querySelector('[data-testid="product-package-size"]');
            if (query) {
                weight = query.innerText.split(",")[0];
                weightUnit = 'g';

                if (weight.includes('kg')){
                    weightUnit = 'kg';
                } else if (weight.includes('g')){
                    weightUnit = 'g';
                } else if (weight.includes('mL') || weight.includes('ml')){
                    weightUnit = 'mL';
                } else if (weight.includes('L') || weight.includes('l')){
                    weightUnit = 'L';
                } else {
                    weightUnit = 'g';
                }

                weight = regEx.exec(weight)[0];

            }
            return { productBrand: brand, productName: title, productWeight: weight, productWeightUnit: weightUnit };
        });

        let productInfo = {
            title: productName,
            brand: productBrand,
            weight: productWeight,
            weightUnit: productWeightUnit,
            id: i
        };

        console.log(productInfo);
        items.push(productInfo);

        await page[i].close();
    }

    await browser.close();
    return response.status(200).json(items);
}

module.exports = { getProductInformation };