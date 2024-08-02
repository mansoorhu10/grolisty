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
            let query = document.querySelector('[class="product-name__item product-name__item--brand"]');
            let brand = "";
            let title = "";
            let weight = "";
            let weightUnit = 'g';
            let price = 0.0;
            let pricePerUnit = 0.0;
            let weightPerUnit = 0;
            if (query) {
                brand = query.innerText;
            }

            query = document.querySelector('[class="product-name__item product-name__item--name"]');
            if (query) {
                title = query.innerText;
            } else {
                title = "";
            }
            
            let regEx = new RegExp("[0-9]+");
            query = document.querySelector('[class="price__value selling-price-list__item__price selling-price-list__item__price--now-price__value"]')
            if (query) {
                price = parseFloat(query.innerText.trim("$"));

                query = document.querySelector('[class="price__unit comparison-price-list__item__price__unit"]');
                if (query) {
                    pricePerUnit = parseFloat(query.innerText.trim("$"));

                    query = document.querySelector('[class="price__unit comparison-price-list__item__price__unit"]');
                    if (query) {
                        weightPerUnit = query.innerText.trim("/");
                        console.log(weightPerUnit);

                        if (weightPerUnit.includes('kg')){
                            weightUnit = 'kg';
                        } else if (weight.includes('g')){
                            weightUnit = 'g';
                        } else if (weightPerUnit.includes('mL') || weightPerUnit.includes('ml')){
                            weightUnit = 'mL';
                        } else if (weightPerUnit.includes('L') || weightPerUnit.includes('l')){
                            weightUnit = 'L';
                        } else {
                            weightUnit = 'g';
                        }
        
                        weightPerUnit = parseInt(regEx.exec(weightPerUnit)[0]);

                        weight = Math.round(weightPerUnit * (price / pricePerUnit)).toString();
                    } else {
                        price = 0.0;
                        pricePerUnit = 0.0;
                        weightPerUnit = 0;
                        weight = "";
                    }
                } else {
                    price = 0.0;
                    pricePerUnit = 0.0;
                    weightPerUnit = 0;
                    weight = "";
                }
            } else {
                price = 0.0;
                pricePerUnit = 0.0;
                weightPerUnit = 0;
                weight = "";
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