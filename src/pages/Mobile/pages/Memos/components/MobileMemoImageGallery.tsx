import {Image, ImageViewer} from 'antd-mobile';
import {splitMemoImages} from '@/utils/memoImageUtils.js';
import {thumbUrl} from '@/utils/urlUtils.js';
import styles from '@/pages/Mobile/styles/mobile.module.css';

interface MobileMemoImageGalleryProps {
  /** 逗号分隔的备忘原图地址 */
  imgArr?: string
}

/** 移动端备忘 45px 缩略图列表 */
const MobileMemoImageGallery = ({imgArr}: MobileMemoImageGalleryProps) => {
  const images = splitMemoImages(imgArr); // 有效原图地址
  if (!images.length) return null;

  return (
    <div className={styles.memoImageGallery}>
      {images.map((url: string, index: number) =>
        <Image
          key={url}
          src={thumbUrl(url)}
          width={45}
          height={45}
          fit="cover"
          className={styles.memoImageThumbnail}
          onClick={event => {
            event.stopPropagation();
            ImageViewer.Multi.show({
              images,
              defaultIndex: index,
              classNames: {mask: styles.imgListViewer},
            });
          }}
        />
      )}
    </div>
  )
}

export default MobileMemoImageGallery;
