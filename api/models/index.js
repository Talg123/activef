export * from './crawler.js';
import { CrawlerModel } from "./crawler.js";
export * from './pages.js';
import { PagesModel } from "./pages.js";

CrawlerModel.hasMany(PagesModel);
PagesModel.belongsTo(CrawlerModel, {foreignKey: 'crawlerID'});