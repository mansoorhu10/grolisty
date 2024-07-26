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
        await page[i].goto(pageUrl, {
            waitUntil: "networkidle0",
        });

        let productBrand = await page[i].evaluate(() => {
            let query = document.querySelector('[data-testid="product-brand"]');
            if (query){
                return query.innerText
            } else {
                return "";
            }
        });

        let productName = await page[i].evaluate(() => {
            let query = document.querySelector('[data-testid="product-title"]');
            if (query){
                return query.innerText;
            } else {
                return "";
            }
        });
        
        let productWeight = await page[i].evaluate(() => {
            let regEx = new RegExp("[0-9]+");
            let query = document.querySelector('[data-testid="product-package-size"]');
            if (query){
                var weight = query.innerText.split(",")[0];

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

                return { weight, weightUnit };
            } else {
                return "";
            }
        });

        let productInfo = {
            title: productName,
            brand: productBrand,
            weight: productWeight.weight,
            weightUnit: productWeight.weightUnit,
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