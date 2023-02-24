const CdnUnion = require('./cdnUnion');
const MD5 = require('md5');
var AWS = require('aws-sdk');

/** SQS url */ 
const queueURL = process.env.SQS_URL;

/* cdn網址 */
const cdnURL = process.env.CDNUNION_URL;
/** 使用者名稱 */
const cdnUsername = process.env.CDNUNION_USERNAME;
/** 接口密碼 */
const cdnPWD = process.env.CDNUNION_PWD;

/** 取代路徑 */ 
const replaceHostName = process.env.REPLACE_HOST_NAME;
const region = process.env.REGION;

// *AWS*
AWS.config.update({ region: region });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var deleteParams = {
    /** 收據名稱 */
    ReceiptHandle: "",
    /** Queue網址 */
    QueueUrl: queueURL
};

/**
 * 呼叫API
 * @param {需要刷新的網誌串接而成的字串} key 
 * @returns 
 */
async function callAPI(key) { // replace with call to Akamai, pass - json token named detail - request accepted
    /** CDN instance */
    var cdnUnion = new CdnUnion(cdnURL);    
    
    /** 時間戳記 */
    var cuTimestamp = now_time();
    /** API Parameter */
    var data = {
        name: cdnUsername,
        token: MD5(cdnUsername + cdnPWD + cuTimestamp + 'B5186C929D3EA9'),
        timestamp : cuTimestamp,
        opt : '',
        urls: [],
        rt_url : '',
        // 以下參數只有當opt 為 obj_refresh 才有用
        sort_page : 2,
        sort_load : 1,
        sort_md5 : 1,                
    };    
        
    /** 取代DN */
    let prototypeUrls = [];
    
    prototypeUrls = prototypeUrls.concat(key.split(",").map(x => x.replace(new URL(x).hostname, replaceHostName)));

    console.log(prototypeUrls);

    if (!prototypeUrls)
        return;

    // 判斷清除種類
    if (prototypeUrls.some(x => x.toLowerCase().indexOf("/acerfooter.html") > -1 || x.toLowerCase().indexOf("/acerheader.html") > -1))
    {
        data.opt = "dir_refresh";
        
        let url = new URL(prototypeUrls[0]);
        var host = url.origin;
        var local = url.pathname.substring(1, 6);

        data.urls.push(host + '/' + local);
    }        
    else{
        data.opt = "obj_refresh";

        prototypeUrls.forEach(url => {
            if (url.toLowerCase().indexOf('/pdp/') > -1) {
                data.urls.push(url);
            }
            else {                        
                data.urls = data.urls.concat(formatUrl(url));
            }
        });
    } 
        
    // 設定參數
    cdnUnion.SetApiData(data);
    
    console.log('CDN Refresh Parameter : ' + cdnUnion.data );

    // *CDN刷新*
    await cdnUnion.Refresh();
}

/** 取得時間戳記 */
function now_time()
{
	var now = new Date();
    var y = now.getTime() / 1000;
	
	return Math.ceil(y);
}

/** 格式化網址 */
function formatUrl(url){
    
    let replacedUrl = url.replace("/index.html", "")
        .replace("index.html", "")
        .replace("index", "")
        .replace(/\/$/gm, "");

    return [replacedUrl, `${replacedUrl}/`, `${replacedUrl}/index.html`, `${replacedUrl}/index`];
}

exports.handler = async (event) => {
    if (event.Records[0]) { // grabs message from SQS
        // 紀錄Log
        console.log("SQS Event BODY: " + JSON.stringify(event));
        
        // 將存在body中的字串，轉換成json格式。取得key、endpoint
        /** target urls，為字串。 */
        let key = JSON.parse(event.Records[0].body).key;                
        let endpoint = JSON.parse(event.Records[0].body).endpoint;

        // 設定SQS DeleteMessage的ReceiptHandle
        deleteParams.ReceiptHandle = event.Records[0].receiptHandle; // setup - delete msg out of SQS once done
                
        switch (endpoint) { //endpoint in SQS msg
            case 'purge/pages': 
            case 'purge/binaries':
                // 呼叫API清理dns
                await callAPI(key); 
                break;            
            default:                
                break;
        }

        // 紀錄Log
        console.log("SQS DeleteParams: " + JSON.stringify(deleteParams));
        
        if (deleteParams) {
            sqs.deleteMessage(deleteParams, function (err, data) {
                if (err) { console.log("Delete Error", err); }
                else { console.log("SQS Cleared", data); }
            });
        }
    }
    else { console.log("No messages received"); }

    return (200, { body: "It's fine stop yelling at me." });
}
