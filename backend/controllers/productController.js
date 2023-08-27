const cheerio = require("cheerio");
const axios = require("axios");

const getProductInformation = async (request, response) => {
    const { upc } = "05620076227";

    const pageUrl = `https://www.nofrills.ca/search?search-bar=${upc}`;

    const config = {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        },
    };

    // const axiosResponse = await axios.request({
    //     method: "GET",
    //     url: pageUrl,
    //     headers: {
    //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    //     }
    // });

    axios.get(pageUrl)
        .then(({ data }) => {
            console.log(data);
        });

    // console.log(newAxios.data);

    // console.log(axiosResponse);

    // parsing the HTML source of the target web page with Cheerio
    //const $ = cheerio.load(newAxios.data);


    //const itemBrand = $("body").html();

    // console.log(itemBrand);

    return response.status(200);
}

module.exports = { getProductInformation };