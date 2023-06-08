export interface NewsItem {
  urlToImage?: string;
  author?: string;
  source: {
    name: string;
  };
  publishedAt: string;
  title: string;
  description: string;
  url: string;
}

