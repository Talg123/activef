import axios from 'axios';
import cheerio from 'cheerio';

const DEFAULT_DATA_START = {
    currentPages: 0,
    currentDepth: 0,
    currentPageOnDepth: 0,
    crawlData: {}
}

const crawlURLAndExportData = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const title = $('title').text();
        const links = $('a').map((i, element) => element.attribs.href).filter(e => e !== url).toArray();
        return { links, title, url };
    } catch (error) {
        console.error('Error occurred while fetching URL:', url);
        return { links: [] };
    }
}

const clearResults = async (url) => {
    const result = await crawlURLAndExportData(url);
    const sliceAmount = maxTotalPages - data.currentPages;
    const links = result.links.slice(0, sliceAmount);
    return { links, result };
}

export const crawlURL = async ({ maxDepth, startUrl, maxTotalPages }, data = {...DEFAULT_DATA_START}) => {
    if (data?.currentDepth == maxDepth || data?.currentPages == maxTotalPages || !startUrl) {
        DEFAULT_DATA_START.crawlData = [];
        return data.crawlData;
    }
    const { links, result } = await clearResults(startUrl);
    data.currentPages+= links.length;
    if (data.crawlData[data.currentDepth]) {
        data.crawlData[data.currentDepth].push({ ...result, links });
    } else {
        data.crawlData[data.currentDepth] = [{ ...result, links }];
    }
    const lastOnDepth = data.crawlData[data.currentDepth].length - 1;
    for (const url of data.crawlData[data.currentDepth][lastOnDepth].links) {
        if (data?.currentDepth == maxDepth || data?.currentPages == maxTotalPages) {
            DEFAULT_DATA_START.crawlData = [];
            return data.crawlData;
        }
        const { links, result } = await clearResults(url);
        data.currentPages+= links.length;
        if (data.crawlData[data.currentDepth + 1]) {
            data.crawlData[data.currentDepth + 1].push({ ...result, links });
        } else {
            data.crawlData[data.currentDepth + 1] = [{ ...result, links }];
        }
    }
    if (data.currentPageOnDepth + 1 == data.crawlData[data.currentDepth].length) {
        data.currentPageOnDepth = 0;
        data.currentDepth++;
    } else {
        data.currentPageOnDepth++;
    }
    const url = data.crawlData[data.currentDepth][data.currentPageOnDepth].url;
    return crawlURL({ maxDepth, startUrl: url , maxTotalPages }, data);
}
