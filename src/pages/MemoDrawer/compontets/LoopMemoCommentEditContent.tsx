import {useState} from 'react';
import {Input, Upload} from 'antd';
import type {UploadFile, UploadProps} from 'antd';
import type {ReactNode} from 'react';
import type {MemoLoopItemComment} from '@/pages/MemoDrawer/types';
import {thumbUrl} from '@/utils/urlUtils';

const MAX_LOOP_MEMO_COMMENT_IMAGES = 3; // 循环评论最多上传图片数

interface UploadImageResponse {
  /** 上传完成后的原图地址 */
  url?: string
}

interface LoopMemoCommentEditContentProps {
  /** 当前循环评论 */
  comment?: MemoLoopItemComment
  /** 上传图片按钮 */
  uploadButton: ReactNode
  /** 图片上传请求 */
  uploadLoopMemoImage: UploadProps<UploadImageResponse>['customRequest']
  /** 图片预览 */
  previewUploadImage: (file: UploadFile<UploadImageResponse>) => void
  /** 修改评论文本 */
  onTextChange: (text: string) => void
  /** 修改图片字符串 */
  onImgArrChange: (imgArr: string) => void
}

/**
 * 循环备忘记录评论编辑弹窗内容
 *
 * @param comment 当前循环评论
 * @param uploadButton 上传图片按钮
 * @param uploadLoopMemoImage 图片上传请求
 * @param previewUploadImage 图片预览
 * @param onTextChange 修改评论文本
 * @param onImgArrChange 修改图片字符串
 */
const LoopMemoCommentEditContent = ({
  comment,
  uploadButton,
  uploadLoopMemoImage,
  previewUploadImage,
  onTextChange,
  onImgArrChange,
}: LoopMemoCommentEditContentProps) => {
  const [fileList, setFileList] = useState<UploadFile<UploadImageResponse>[]>(
    comment?.imgArr
      ? comment.imgArr.split(',').filter(Boolean).map((url, index) => ({
        uid: `${comment.id}-${index}`,
        name: `comment-image-${index}.webp`,
        status: 'done',
        url,
        thumbUrl: thumbUrl(url),
      }))
      : []
  ); // 当前图片列表

  /** 读取上传列表中的图片地址 */
  const getUploadImageUrl = (fileItem: UploadFile<UploadImageResponse>) =>
    fileItem.response?.url || fileItem.url

  return (
    <div>
      {comment &&
        <div className="loop-memo-edit-meta">
          <div>创建时间：{comment.createTime}</div>
          {comment.updateTime && <div>更新时间：{comment.updateTime}</div>}
        </div>
      }
      <Input.TextArea
        rows={4}
        placeholder="请输入评论"
        defaultValue={comment?.commentText}
        onChange={e => onTextChange(e.target.value)}
      />
      <Upload<UploadImageResponse>
        listType="picture-card"
        multiple
        maxCount={MAX_LOOP_MEMO_COMMENT_IMAGES}
        fileList={fileList}
        customRequest={uploadLoopMemoImage}
        onChange={({fileList}) => {
          const nextFileList = fileList.slice(0, MAX_LOOP_MEMO_COMMENT_IMAGES).map(fileItem => {
            const originalUrl = getUploadImageUrl(fileItem); // 当前图片原图地址
            return originalUrl ? {...fileItem, url: originalUrl, thumbUrl: thumbUrl(originalUrl)} : fileItem
          }); // 控制最多展示三张图片并使用缩略图渲染上传列表
          setFileList(nextFileList)
          onImgArrChange(nextFileList
            .map(fileItem => getUploadImageUrl(fileItem))
            .filter(Boolean)
            .join(',')
          )
        }}
        onPreview={previewUploadImage}
      >
        {fileList.length >= MAX_LOOP_MEMO_COMMENT_IMAGES ? null : uploadButton}
      </Upload>
    </div>
  )
}

export default LoopMemoCommentEditContent;
