import { crawlURL } from './helpers/crawler.js';
import { CrawlerModel, PagesModel } from './models/index.js';
import DBManager from './helpers/db.js';
const db = new DBManager();
const VALID_UUIDV4 = /[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}/;

/**
 * 
 * handle the scrapping and the inserting into the DB for new scrapping data. 
 */
export const handleScrappingURL = async (params, id) => {
    const scrappingData = await crawlURL(params);
    const transaction = await db.dbConnection.transaction();
    try {
        const newCrawler = await CrawlerModel.create({
            URL: params.startUrl,
            maxDepth: params.maxDepth,
            maxTotalPages: params.maxTotalPages,
            ID: id
        }, { transaction });
        let pagesPromises;
        for (const depth of Object.keys(scrappingData)) {
            pagesPromises = scrappingData[depth].map(page => PagesModel.create({
                crawlerID: newCrawler.ID,
                links: page.links.join(':'),
                title: page.title,
                depth: +depth,
                URL: page.url
            }, { transaction }));
        }
        await Promise.all(pagesPromises);
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        throw new Error(`Error eccoured while inserting new crawler data`);
    }
    await transaction.commit();
}

export const handleReceiveCrawlerPagesData = async (urlOrID) => {
    if (!VALID_UUIDV4.test(urlOrID)) {
        return null;
    }
    const pages = await CrawlerModel.findOne({
        where: {
            ID: urlOrID
        },
        include: [PagesModel]
    });
    return pages;

}