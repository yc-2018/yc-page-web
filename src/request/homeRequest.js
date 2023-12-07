import axios from 'axios';


/**
 * 获取首页背景图（搞多几个做备份）
 * @returns {Promise<null|string>} 随机壁纸URL
 */
export async function reImagesUrl()  {
    try {
        async function jfApi() {
            const response = await axios.get('/jfApi/home/bg/ajaxbg');
            const images = response.data;
            if (images.length > 0)
                return 'https://i0.wp.com/www.jianfast.com' + images[0].replace('/400', '');
        }

        async function bz1Api() {
            // https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json
            const response = await axios.get('/bz1Api/sjbz/api.php?lx=dongman&format=json');
            return response.data.imgurl;
        }

        async function bz2Api() {
            // 如诗 - API接口文档 https://api.likepoems.com/
            // https://api.likepoems.com/img/pc/?type=json
            const response = await axios.get('/bz2Api/img/pc/?type=json');
            return response.data.url;
        }
        return jfApi();
    } catch (error) {
        return null;
    }
}

