import {Image} from 'antd';
import {splitMemoImages} from '@/utils/memoImageUtils.js';
import {thumbUrl} from '@/utils/urlUtils.js';

interface MemoImageGalleryProps {
  /** 逗号分隔的备忘原图地址 */
  imgArr?: string
  /** 缩略图尺寸 */
  size?: number
}

/** 桌面端备忘缩略图列表，预览时使用原图 */
const MemoImageGallery = ({imgArr, size = 60}: MemoImageGalleryProps) => {
  const images = splitMemoImages(imgArr); // 有效原图地址
  if (!images.length) return null;

  return (
    <Image.PreviewGroup>
      <div className="memo-image-gallery">
        {images.map((url: string) =>
          <Image
            key={url}
            src={thumbUrl(url)}
            width={size}
            height={size}
            preview={{src: url}}
          />
        )}
      </div>
    </Image.PreviewGroup>
  )
}

export default MemoImageGallery;
