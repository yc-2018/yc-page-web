import axios from 'axios';


/**
 * 获取首页背景图
 * @returns {Promise<null|string>}
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
            // https://img.xjh.me/random_img.php?return=json&type=bg
            const response = await axios.get('/bz2Api/random_img.php?return=json&type=bg');
            return 'https:' + response.data.img;
        }


        return bz2Api();
    } catch (error) {
        return null;
    }
}

