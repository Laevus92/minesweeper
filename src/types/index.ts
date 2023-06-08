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

export interface NewsSource {
  name:string;
  id: string
}

export interface SourcesInterface {
  draw(data: NewsSource[]): void;
}