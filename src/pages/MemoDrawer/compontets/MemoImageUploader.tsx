import {PlusOutlined} from '@ant-design/icons';
import {App, Image, Upload} from 'antd';
import type {UploadFile, UploadProps} from 'antd';
import {useState} from 'react';
import CommonStore from '@/store/CommonStore';
import {uploadImgByJD} from '@/request/toolsRequest';
import {MAX_MEMO_IMAGES, joinMemoImages, splitMemoImages} from '@/utils/memoImageUtils.js';
import {thumbUrl} from '@/utils/urlUtils.js';

interface UploadImageResponse {
  /** 上传后的原图地址 */
  url?: string
}

interface MemoImageUploaderProps {
  /** 逗号分隔的原图地址 */
  value?: string
  /** 图片值变化 */
  onChange: (value: string) => void
  /** 是否存在上传任务 */
  onUploadingChange: (uploading: boolean) => void
}

/** 读取上传项的原图地址 */
const getOriginalUrl = (file: UploadFile<UploadImageResponse>) => file.response?.url || file.url;

/** 将已保存图片转换为上传列表 */
const createInitialFileList = (value?: string): UploadFile<UploadImageResponse>[] =>
  splitMemoImages(value).map((url: string, index: number) => ({
    uid: `memo-image-${index}-${url}`,
    name: `memo-image-${index + 1}.webp`,
    status: 'done',
    url,
    thumbUrl: thumbUrl(url),
  }));

/** 桌面端备忘图片上传组件 */
const MemoImageUploader = ({value, onChange, onUploadingChange}: MemoImageUploaderProps) => {
  const [fileList, setFileList] = useState<UploadFile<UploadImageResponse>[]>(
    () => createInitialFileList(value)
  ); // 当前上传列表
  const {msg} = CommonStore;
  const {modal} = App.useApp(); // 原图预览弹窗

  /** 上传单张图片到现有图床 */
  const uploadImage: UploadProps<UploadImageResponse>['customRequest'] = async ({file, onSuccess, onError}) => {
    try {
      const result = await uploadImgByJD(file as File); // 图床上传结果
      if (!result.success || !result.data?.url) throw new Error(result.message ?? '上传失败');
      onSuccess?.({url: result.data.url});
    } catch (error) {
      msg.error(error instanceof Error ? error.message : '上传失败');
      onError?.(error as Error);
    }
  };

  /** 同步上传列表与表单图片字段 */
  const syncFileList = (nextFiles: UploadFile<UploadImageResponse>[]) => {
    const limitedFiles = nextFiles.slice(0, MAX_MEMO_IMAGES).map(file => {
      const originalUrl = getOriginalUrl(file); // 当前图片原图地址
      return originalUrl ? {...file, url: originalUrl, thumbUrl: thumbUrl(originalUrl)} : file;
    });
    setFileList(limitedFiles);
    onUploadingChange(limitedFiles.some(file => file.status === 'uploading'));
    onChange(joinMemoImages(limitedFiles.map(getOriginalUrl).filter((url): url is string => Boolean(url))));
  };

  return (
    <Upload<UploadImageResponse>
      className="memo-image-uploader"
      listType="picture-card"
      accept="image/*"
      multiple
      maxCount={MAX_MEMO_IMAGES}
      fileList={fileList}
      customRequest={uploadImage}
      onChange={({fileList: nextFiles}) => syncFileList(nextFiles)}
      onPreview={file => {
        const originalUrl = getOriginalUrl(file); // 预览原图地址
        if (!originalUrl) return msg.info('图片上传中，暂时无法预览');
        modal.info({
          title: '图片预览',
          icon: null,
          width: '70vw',
          centered: true,
          mask: {closable: true},
          okText: '关闭',
          content: (
            <div style={{textAlign: 'center'}}>
              <Image
                src={originalUrl}
                preview={false}
                style={{maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain'}}
              />
            </div>
          ),
        });
      }}
    >
      {fileList.length >= MAX_MEMO_IMAGES ? null :
        <button type="button" className="memo-image-upload-button">
          <PlusOutlined/>
          <span>添加图片</span>
        </button>
      }
    </Upload>
  )
}

export default MemoImageUploader;
