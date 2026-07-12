import {Popover} from 'antd';
import LinkifyContent from '@/components/LinkifyContent/index';
import MemoImageGallery from '@/pages/MemoDrawer/compontets/MemoImageGallery';

interface MemoPreviewContentProps {
  /** 备忘内容 */
  content: string
  /** 备忘图片地址 */
  imgArr?: string
}

/**
 * 备忘查看弹窗内容
 *
 * @param {string} content 备忘内容
 */
const MemoPreviewContent = ({content, imgArr}: MemoPreviewContentProps) => (
  <div
    className="gun"
    style={{height: '70vh', border: '1px solid #ccc', borderRadius: '6px', padding: 9, overflow: 'auto'}}
  >
    <pre style={{whiteSpace: 'pre-wrap', fontSize: '14px', margin: 0, fontFamily: 'unset'}}>
      <LinkifyContent   // 会识别链接和视频图片的文本内容/备忘录内容/待办内容
        linkImg={(link, index) =>
          <Popover
            key={index ?? link}
            content={
              <div style={{maxWidth: 400, maxHeight: 400}}>
                <img
                  src={link}
                  alt="备忘录里面识别的图片链接"
                  referrerPolicy="no-referrer"
                  style={{width: '100%', maxHeight: 400, display: 'block', margin: '10px 0'}}
                />
              </div>
            }
          >
            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          </Popover>
        }
        linkVideo={(link, index) =>
          <Popover
            key={index ?? link}
            content={
              <video
                controls
                src={link}
                style={{maxWidth: '100%', maxHeight: 600, margin: '10px 0'}}
              />
            }
          >
            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          </Popover>
        }
      >
        {content}
      </LinkifyContent>
    </pre>
    <MemoImageGallery imgArr={imgArr}/>
  </div>
)

export default MemoPreviewContent;
