import express from 'express';
import { VALIDATE_SCRAPPING } from './helpers/validation.js';
import { handleScrappingURL, handleReceiveCrawlerPagesData } from './controller.js';
import uuid4 from "uuid4";
import DBManager from './helpers/db.js';
import cors from 'cors';
import './models/index.js';

const app = express();
new DBManager();

app.use(express.json());
app.use(cors());

app.post('/crawl', async (req, res) => {
    const params = req.body;
    const validation = VALIDATE_SCRAPPING(params);
    if (validation.error) {
        return res.status(400).json({
            error: validation.error.message
        })
    }
    const id = uuid4();
    handleScrappingURL(params, id);
    res.status(202).json({id});
});

app.get('/crawl', async (req, res) => {
    const { url, id } = req.query;
    if (!url && !id) {
        return res.status(404).json({error: 'Missing either id or url'});
    }
    const pages = await handleReceiveCrawlerPagesData(id || url);
    res.json(pages);
});

app.listen(3001, () => console.log('Running'));