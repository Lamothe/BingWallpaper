"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var trc = __importStar(require("typed-rest-client"));
var http = __importStar(require("typed-rest-client/HttpClient"));
var fs = __importStar(require("fs"));
var os = __importStar(require("os"));
var index = 0;
if (process.argv.length >= 3) {
    index = Number(process.argv[2]);
}
var bingBaseUrl = "http://www.bing.com";
var dataUrl = "/HPImageArchive.aspx?format=js&idx=" + index + "&n=1";
var userAgent = "";
var filename = "bing-wallpaper.jpeg";
function getWallpaperUrl() {
    return __awaiter(this, void 0, void 0, function () {
        var client, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new trc.RestClient(userAgent, bingBaseUrl);
                    return [4 /*yield*/, client.get(dataUrl)];
                case 1:
                    result = _a.sent();
                    if (!result.result || result.result.images.length < 1) {
                        throw "No results";
                    }
                    return [2 /*return*/, bingBaseUrl + result.result.images[0].url];
            }
        });
    });
}
function handleError(error) {
    if (error) {
        throw error;
    }
}
function getWallpaper() {
    getWallpaperUrl().then(function (url) {
        var client = new http.HttpClient(userAgent);
        var response = client.get(url);
        response.then(function (data) {
            var fileStream = fs.createWriteStream(filename);
            data.message.on('data', function (chunk) {
                fileStream.write(chunk);
            }).on('end', function () {
                fileStream.close();
                fileStream.end();
                fs.copyFile(filename, os.homedir() + "/Pictures/bing-wallpaper.jpeg", handleError);
            });
        });
    });
}
fs.access(filename, fs.constants.F_OK, function (error) {
    if (!error) {
        fs.unlinkSync(filename);
    }
    getWallpaper();
});
