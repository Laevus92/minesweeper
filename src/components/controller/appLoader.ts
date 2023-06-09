import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: '0bf35020cb354d8a8c6dfe45e9ad1b6d', // получите свой ключ https://newsapi.org/
        });
    }
}

export default AppLoader;
