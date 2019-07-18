import * as trc from 'typed-rest-client';
import * as http from 'typed-rest-client/HttpClient';
import * as fs from 'fs';
import * as os from 'os';

interface BingImage {
    startdate: string;
    fullstartdate: string;
    enddate: string;
    url: string;
    urlbase: string;
    copyright: string;
    copyrightlink: string;
    title: string;
    quiz: string;
    wp: boolean;
    hsh: string;
    drk: number;
    top: number;
    bot: number;
    hs: [];
}

interface BingTooltip {
    loading: string;
    previous: string;
    next: string;
    walle: string;
    walls: string;
}

interface Bing {
    images: BingImage[];
    tooltips: BingTooltip[];
}

let index : number = 0;

if (process.argv.length >= 3){
    index = Number(process.argv[2]);
}

const bingBaseUrl = "http://www.bing.com";
const dataUrl = `/HPImageArchive.aspx?format=js&idx=${index}&n=1`;
const userAgent = "";
const filename = "bing-wallpaper.jpeg";

async function getWallpaperUrl(): Promise<string> {
    let client = new trc.RestClient(userAgent, bingBaseUrl);
    let result: trc.IRestResponse<Bing> = await client.get<Bing>(dataUrl);

    if (!result.result || result.result.images.length < 1) {
        throw "No results";
    }

    return bingBaseUrl + result.result.images[0].url;
}

function getWallpaper() {
    getWallpaperUrl().then((url: string) => {
        let client = new http.HttpClient(userAgent);
        let response = client.get(url);

        response.then((data) => {
            let fileStream = fs.createWriteStream(filename);
            data.message.on('data', (chunk: Buffer) => {
                fileStream.write(chunk);
            }).on('end', () => {
                fileStream.end();
                fs.copyFileSync(filename, `${os.homedir()}/Pictures/bing-wallpaper.jpeg`);
            });
        });
    });
}

fs.access(filename, fs.constants.F_OK, (error) => {
    if (!error) {
        fs.unlinkSync(filename);
    }
    getWallpaper();
});
