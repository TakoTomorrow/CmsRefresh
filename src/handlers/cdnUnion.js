const fetch = require('node-fetch');

/** CDN聯合 操作物件 */
class CdnUnion{
    constructor(url)
    {                
        /** Api post parameter */
        this.data = '';

        /** API 端點 */
        this.endpoint = url;
    }

    /** 設定API的參數 */
    SetApiData(data){
        this.data = JSON_to_URLEncoded(data);
    }

    /** 刷新 */
    async Refresh(){
        if(this.data != ''){

            console.log('Send CDN Refresh Post.');

            return await fetch(
                this.endpoint,
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: this.data,
                }
            )
                .then(respon => respon.json())
                .then(result => {       
                    if(result.rt == true){
                        console.log(`CDN Refresh success. task_id:${result.task_id}`);
                    }
                    else{
                        console.log(`CDN Refresh false. error:${result.error}`);
                    }
                })
                .catch(error => {
                    console.log('CDN Refresh fetch Error! ' + error)
                });                     
        }
        else
            console.log('CDN Data is null!');
    }
}

/** 將Json物件轉換為 x-www-form-urlencoded格式 */
function JSON_to_URLEncoded(element,key,list){
    var list = list || [];
    
    if(typeof(element)=='object'){
      for (var idx in element)
        JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
    } else {
      list.push(key+'=' + element);
    }
    return list.join('&');
}

module.exports = CdnUnion;