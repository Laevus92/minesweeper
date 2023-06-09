import { NewsItem, NewsSource } from '../../types';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    private news: News;
    private sources: Sources;
  
    constructor() {
      this.news = new News();
      this.sources = new Sources();
    }
  
    public drawNews(data: { articles?: NewsItem[] }): void {
      const values: NewsItem[] = data?.articles ?? [];
      this.news.draw(values);
    }
  
    public  drawSources(data: { sources?: NewsSource[] }): void {
      const values: NewsSource[] = data?.sources ?? [];
      this.sources.draw(values);
    }
  }
  
  export default AppView;