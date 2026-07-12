# Memo Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add up to six uploadable, thumbnail-rendered, previewable images to desktop and mobile memo create/edit/list/detail flows while persisting a comma-separated value of at most 999 characters.

**Architecture:** Add `memo.img_arr varchar(999)` and expose it through the existing `Memo` entity and endpoints. Keep original image URLs as the persisted value, centralize parsing/serialization/length rules in a small frontend utility, use platform-specific upload controls, and use existing thumbnail URL conversion only for small rendering. English memo UI remains untouched and the backend does not branch on memo type.

**Tech Stack:** Java 8, Spring Boot 2.7, MyBatis Plus, JUnit 5, MySQL, React 18, TypeScript/JavaScript, Ant Design 6, Ant Design Mobile 5, Node test runner, Yarn/Vite.

---

## File map

The workspace contains two Git repositories:

- Frontend root: `D:/AllCode/yc/yc-web`
- Backend root: `D:/AllCode/yc/yc-page`

Backend files:

- Create `yc-page/sql/20260713_add_memo_img_arr.sql`: production database migration.
- Modify `yc-page/src/main/java/ikun/yc/ycpage/entity/Memo.java`: add `imgArr` and the 999-character domain validation.
- Modify `yc-page/src/main/java/ikun/yc/ycpage/service/impl/MemoServiceImpl.java`: invoke image validation on add and update.
- Create `yc-page/src/test/java/ikun/yc/ycpage/entity/MemoTest.java`: cover 999/1000-character boundaries and prove image count is not validated.

Frontend shared files:

- Create `yc-web/src/utils/memoImageUtils.js`: parse, serialize, compare, and validate memo image URL strings.
- Create `yc-web/src/utils/memoImageUtils.test.js`: Node-native unit tests without adding a test dependency.
- Modify `yc-web/src/interface/IMemo.ts`: expose `imgArr` to typed desktop/request code.
- Create `yc-web/src/pages/MemoDrawer/compontets/MemoImageGallery.tsx`: desktop thumbnail gallery with original-image preview.
- Create `yc-web/src/pages/Mobile/pages/Memos/components/MobileMemoImageGallery.tsx`: mobile 45px thumbnail gallery with multi-image original preview.

Desktop files:

- Create `yc-web/src/pages/MemoDrawer/compontets/MemoImageUploader.tsx`: Ant Design picture-card uploader, six-image cap, thumbnails, progress reporting, and preview.
- Modify `yc-web/src/pages/MemoDrawer/compontets/FormModal.tsx`: persist form images, block pending uploads, validate length, and detect unsaved image changes.
- Modify `yc-web/src/pages/MemoDrawer/compontets/MemoListItem.tsx`: render gallery directly below memo text.
- Modify `yc-web/src/pages/MemoDrawer/compontets/MemoPreviewContent.tsx`: render gallery below full memo text.
- Modify `yc-web/src/pages/MemoDrawer/index.tsx`: pass `imgArr` into the detail preview.
- Modify `yc-web/src/pages/MemoDrawer/MemoDrawer.css`: desktop gallery/uploader spacing and 60px list thumbnails.

Mobile files:

- Modify `yc-web/src/pages/Mobile/pages/Memos/components/types.ts`: add `imgArr`.
- Modify `yc-web/src/pages/Mobile/pages/Memos/components/MemoEditPopup.tsx`: add the controlled 45px single-row uploader.
- Modify `yc-web/src/pages/Mobile/pages/Memos/components/MemoDetailPopup.tsx`: render gallery below detail text.
- Modify `yc-web/src/pages/Mobile/pages/Memos/Memo.jsx`: own image/upload state, submit `imgArr`, and render list galleries.
- Modify `yc-web/src/pages/Mobile/styles/mobile.module.css`: 45px single-row upload/list styling and horizontal overflow.

## Task 1: Add backend persistence and the 999-character contract

**Files:**

- Create: `yc-page/src/test/java/ikun/yc/ycpage/entity/MemoTest.java`
- Create: `yc-page/sql/20260713_add_memo_img_arr.sql`
- Modify: `yc-page/src/main/java/ikun/yc/ycpage/entity/Memo.java`
- Modify: `yc-page/src/main/java/ikun/yc/ycpage/service/impl/MemoServiceImpl.java`

- [ ] **Step 1: Write the failing entity boundary tests**

Create `MemoTest.java`:

```java
package ikun.yc.ycpage.entity;

import ikun.yc.ycpage.common.exception.ParamException;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * 备忘图片字段校验测试
 *
 * @author Codex
 * @since 2026/07/13
 */
class MemoTest {

    /** 校验 999 个字符允许保存 */
    @Test
    void validateImgArrShouldAllow999Characters() {
        Memo memo = new Memo(); // 待校验备忘
        memo.setImgArr(String.join("", Collections.nCopies(999, "a")));

        assertDoesNotThrow(memo::validateImgArr);
    }

    /** 校验超过 999 个字符会被拒绝 */
    @Test
    void validateImgArrShouldReject1000Characters() {
        Memo memo = new Memo(); // 待校验备忘
        memo.setImgArr(String.join("", Collections.nCopies(1000, "a")));

        assertThrows(ParamException.class, memo::validateImgArr);
    }

    /** 校验后端不限制图片地址数量 */
    @Test
    void validateImgArrShouldNotRejectImageCount() {
        Memo memo = new Memo(); // 包含七个短图片地址的备忘
        memo.setImgArr("a,b,c,d,e,f,g");

        assertDoesNotThrow(memo::validateImgArr);
    }
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run from `yc-page`:

```powershell
mvn -Dtest=MemoTest test
```

Expected: compilation fails because `Memo#setImgArr` and `Memo#validateImgArr` do not exist.

- [ ] **Step 3: Add the minimal entity field and validation**

In `Memo.java`, import `ParamException`, add the field beside `okText`, and add the method before `toReviseInfo`:

```java
import ikun.yc.ycpage.common.exception.ParamException;

/** 备忘图片地址，多个地址用逗号分隔 */
private String imgArr;

/** 校验备忘图片字段长度 */
public void validateImgArr() {
    if (imgArr != null && imgArr.length() > 999) {
        throw new ParamException("备忘图片地址总长度不能超过999个字符");
    }
}
```

Do not split the string or count URLs in this method.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```powershell
mvn -Dtest=MemoTest test
```

Expected: 3 tests pass.

- [ ] **Step 5: Wire validation into both existing write paths**

In `MemoServiceImpl.addItem`, validate before database/tag writes:

```java
memo.validateImgArr(); // 校验备忘图片字段长度
memo.setCreateTime(null);
```

In `MemoServiceImpl.updateItem`, validate before completion-time normalization:

```java
memo.validateImgArr(); // 校验备忘图片字段长度
if (Objects.equals(memo.getCompleted(), 1) && Objects.isNull(memo.getOkTime())) {
```

- [ ] **Step 6: Add the database migration**

Create `yc-page/sql/20260713_add_memo_img_arr.sql`:

```sql
ALTER TABLE `memo`
  ADD COLUMN `img_arr` varchar(999) DEFAULT NULL COMMENT '备忘图片地址，多个地址用逗号分隔';
```

- [ ] **Step 7: Run backend verification**

Run:

```powershell
mvn test
```

Expected: all backend tests pass. If the Spring context test requires unavailable MySQL/Redis configuration, record that exact environmental failure and retain the passing focused test evidence.

- [ ] **Step 8: Commit the backend change**

Run from `yc-page`:

```powershell
git add -- sql/20260713_add_memo_img_arr.sql src/main/java/ikun/yc/ycpage/entity/Memo.java src/main/java/ikun/yc/ycpage/service/impl/MemoServiceImpl.java src/test/java/ikun/yc/ycpage/entity/MemoTest.java
git commit -m "feat(memo): 支持备忘图片字段"
```

## Task 2: Add tested frontend image value utilities and types

**Files:**

- Create: `yc-web/src/utils/memoImageUtils.js`
- Create: `yc-web/src/utils/memoImageUtils.test.js`
- Modify: `yc-web/src/interface/IMemo.ts`
- Modify: `yc-web/src/pages/Mobile/pages/Memos/components/types.ts`

- [ ] **Step 1: Write the failing utility tests**

Create `memoImageUtils.test.js`:

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_MEMO_IMAGES,
  MAX_MEMO_IMAGE_VALUE_LENGTH,
  isMemoImageValueValid,
  joinMemoImages,
  splitMemoImages,
} from './memoImageUtils.js'

test('splitMemoImages filters empty values and whitespace', () => {
  assert.deepEqual(splitMemoImages(' a.jpg, ,b.jpg,, '), ['a.jpg', 'b.jpg'])
})

test('joinMemoImages serializes non-empty original URLs', () => {
  assert.equal(joinMemoImages(['a.jpg', '', ' b.jpg ']), 'a.jpg,b.jpg')
})

test('memo image constants keep the agreed limits', () => {
  assert.equal(MAX_MEMO_IMAGES, 6)
  assert.equal(MAX_MEMO_IMAGE_VALUE_LENGTH, 999)
})

test('isMemoImageValueValid only checks the 999-character storage boundary', () => {
  assert.equal(isMemoImageValueValid('a'.repeat(999)), true)
  assert.equal(isMemoImageValueValid('a'.repeat(1000)), false)
  assert.equal(isMemoImageValueValid('a,b,c,d,e,f,g'), true)
})
```

- [ ] **Step 2: Run the utility test and verify RED**

Run from `yc-web`:

```powershell
node --test src/utils/memoImageUtils.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `memoImageUtils.js`.

- [ ] **Step 3: Implement the minimal utility**

Create `memoImageUtils.js`:

```javascript
/** 备忘前端最多添加图片数 */
export const MAX_MEMO_IMAGES = 6

/** 备忘图片数据库字段最大字符数 */
export const MAX_MEMO_IMAGE_VALUE_LENGTH = 999

/** 将备忘图片字段解析为有效原图地址列表 */
export const splitMemoImages = (imgArr) =>
  (imgArr ?? '').split(',').map(url => url.trim()).filter(Boolean)

/** 将原图地址列表序列化为备忘图片字段 */
export const joinMemoImages = (images) =>
  (images ?? []).map(url => url.trim()).filter(Boolean).join(',')

/** 判断备忘图片字段是否满足数据库长度限制 */
export const isMemoImageValueValid = (imgArr) =>
  (imgArr ?? '').length <= MAX_MEMO_IMAGE_VALUE_LENGTH
```

- [ ] **Step 4: Run the utility test and verify GREEN**

Run:

```powershell
node --test src/utils/memoImageUtils.test.js
```

Expected: 4 tests pass.

- [ ] **Step 5: Add the shared field to frontend types**

Add to `IMemo.ts` after `okText`:

```typescript
/** 备忘图片地址，多个地址用逗号分隔 */
imgArr?: string
```

Add to `MobileMemoItem` in `components/types.ts` after `okText`:

```typescript
imgArr?: string
```

- [ ] **Step 6: Commit the utility and type contract**

Run:

```powershell
git add -- src/utils/memoImageUtils.js src/utils/memoImageUtils.test.js src/interface/IMemo.ts src/pages/Mobile/pages/Memos/components/types.ts
git commit -m "feat(memo): 添加备忘图片前端数据规则"
```

## Task 3: Build desktop uploader and galleries

**Files:**

- Create: `yc-web/src/pages/MemoDrawer/compontets/MemoImageUploader.tsx`
- Create: `yc-web/src/pages/MemoDrawer/compontets/MemoImageGallery.tsx`
- Modify: `yc-web/src/pages/MemoDrawer/compontets/FormModal.tsx`
- Modify: `yc-web/src/pages/MemoDrawer/compontets/MemoListItem.tsx`
- Modify: `yc-web/src/pages/MemoDrawer/compontets/MemoPreviewContent.tsx`
- Modify: `yc-web/src/pages/MemoDrawer/index.tsx`
- Modify: `yc-web/src/pages/MemoDrawer/MemoDrawer.css`

- [ ] **Step 1: Add the desktop thumbnail gallery**

Create `MemoImageGallery.tsx`:

```tsx
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
        {images.map(url =>
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
```

- [ ] **Step 2: Add the desktop picture-card uploader**

Create `MemoImageUploader.tsx` with these complete behaviors:

```tsx
import {PlusOutlined} from '@ant-design/icons';
import {App, Image, Upload} from 'antd';
import type {UploadFile, UploadProps} from 'antd';
import {useEffect, useState} from 'react';
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

const getOriginalUrl = (file: UploadFile<UploadImageResponse>) => file.response?.url || file.url;

/** 桌面端备忘图片上传组件 */
const MemoImageUploader = ({value, onChange, onUploadingChange}: MemoImageUploaderProps) => {
  const [fileList, setFileList] = useState<UploadFile<UploadImageResponse>[]>([]); // 当前上传列表
  const {msg} = CommonStore;
  const {modal} = App.useApp(); // 原图预览弹窗

  useEffect(() => {
    setFileList(splitMemoImages(value).map((url, index) => ({
      uid: `memo-image-${index}-${url}`,
      name: `memo-image-${index + 1}.webp`,
      status: 'done',
      url,
      thumbUrl: thumbUrl(url),
    })));
  }, [value]);

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
```

- [ ] **Step 3: Integrate images into the desktop form**

In `FormModal.tsx`:

1. Import `MemoImageUploader` and `isMemoImageValueValid`.
2. Add `const [imageUploading, setImageUploading] = useState(false)`.
3. Because `formData` is initialized from `data`, `imgArr` automatically hydrates for edit and starts empty for add.
4. In `handleOk`, before `setConfirmLoading(true)`, add:

```typescript
if (imageUploading) return msg.warning('图片还在上传中，请稍等')
if (!isMemoImageValueValid(formData.imgArr)) return msg.error('图片地址总长度不能超过999个字符，请删除部分图片')
```

5. Include changed images in the update body, using an empty string to clear all images:

```typescript
if ((formData.imgArr ?? '') !== (data?.imgArr ?? '')) body.imgArr = formData.imgArr ?? '';
```

6. Expand the unsaved-change condition in `closeModal`:

```typescript
const hasUnsavedChanges = formData?.content !== (data?.content ?? null)
  || formData?.itemType !== (data?.itemType ?? currentMemoType)
  || !sameIds(formData?.tagIds, data?.tagIds)
  || (formData?.imgArr ?? '') !== (data?.imgArr ?? '');
```

7. Render directly below `TextArea`:

```tsx
<MemoImageUploader
  value={formData?.imgArr}
  onChange={imgArr => setFormData(current => ({...(current ?? {}), imgArr}))}
  onUploadingChange={setImageUploading}
/>
```

Reset `imageUploading` to `false` when a new form session initializes or closes.

- [ ] **Step 4: Render desktop list and detail galleries**

In `MemoListItem.tsx`, destructure `imgArr` and render immediately after the content block, before tags:

```tsx
<MemoImageGallery imgArr={imgArr}/>
```

In `MemoPreviewContent.tsx`, add `imgArr?: string` to props and render below the `<pre>`:

```tsx
<MemoImageGallery imgArr={imgArr}/>
```

In `MemoDrawer/index.tsx`, change detail construction to:

```tsx
content: <MemoPreviewContent content={itemObj.content ?? ''} imgArr={itemObj.imgArr}/>,
```

- [ ] **Step 5: Add focused desktop styles**

Append to `MemoDrawer.css`:

```css
.memo-image-gallery {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  overflow-x: auto;
}

.memo-image-gallery .ant-image,
.memo-image-gallery img {
  flex: 0 0 auto;
  border-radius: 6px;
  object-fit: cover;
}

.memo-image-uploader {
  margin-top: 10px;
}

.memo-image-upload-button {
  display: flex;
  border: 0;
  background: none;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}
```

- [ ] **Step 6: Verify the desktop slice**

Run:

```powershell
node --test src/utils/memoImageUtils.test.js
yarn lint
yarn build
```

Expected: utility tests pass; lint and build exit 0.

Manual check at desktop width:

- Add one memo with six images and confirm the seventh cannot be selected.
- Confirm small images request URLs containing `/jdcms/s80x80_jfs` for JD-hosted originals.
- Click a list thumbnail and confirm the original URL, not the thumbnail URL, is previewed.
- Edit, remove all images, submit, reopen, and confirm `imgArr` is cleared.
- Start an upload and immediately submit; confirm the waiting message appears.

- [ ] **Step 7: Commit the desktop slice**

```powershell
git add -- src/pages/MemoDrawer/compontets/MemoImageUploader.tsx src/pages/MemoDrawer/compontets/MemoImageGallery.tsx src/pages/MemoDrawer/compontets/FormModal.tsx src/pages/MemoDrawer/compontets/MemoListItem.tsx src/pages/MemoDrawer/compontets/MemoPreviewContent.tsx src/pages/MemoDrawer/index.tsx src/pages/MemoDrawer/MemoDrawer.css
git commit -m "feat(memo): 添加桌面端备忘图片"
```

## Task 4: Add the mobile 45px single-row flow

**Files:**

- Create: `yc-web/src/pages/Mobile/pages/Memos/components/MobileMemoImageGallery.tsx`
- Modify: `yc-web/src/pages/Mobile/pages/Memos/components/MemoEditPopup.tsx`
- Modify: `yc-web/src/pages/Mobile/pages/Memos/components/MemoDetailPopup.tsx`
- Modify: `yc-web/src/pages/Mobile/pages/Memos/Memo.jsx`
- Modify: `yc-web/src/pages/Mobile/styles/mobile.module.css`

- [ ] **Step 1: Add the mobile gallery component**

Create `MobileMemoImageGallery.tsx`:

```tsx
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
      {images.map((url, index) =>
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
```

- [ ] **Step 2: Extend the mobile edit popup contract and UI**

In `MemoEditPopup.tsx`, import `ImageUploader` and `ImageViewer` from `antd-mobile`, then import the uploader types exactly as follows:

```typescript
import type {ImageUploadItem, UploadTask} from 'antd-mobile/es/components/image-uploader'
```

Add props:

```typescript
memoImages: ImageUploadItem[]
onMemoImagesChange: (items: ImageUploadItem[]) => void
onImageUploadQueueChange: (tasks: UploadTask[]) => void
onUploadImage: (file: File) => Promise<ImageUploadItem>
```

Render immediately below `TextArea`:

```tsx
<div className={styles.memoImageUploaderRow}>
  <ImageUploader
    className={styles.memoImageUploader}
    value={memoImages}
    columns={6}
    maxCount={MAX_MEMO_IMAGES}
    multiple
    accept="image/*"
    showFailed={false}
    upload={onUploadImage}
    onChange={onMemoImagesChange}
    onUploadQueueChange={onImageUploadQueueChange}
    onPreview={index => ImageViewer.Multi.show({
      images: memoImages.map(item => item.url),
      defaultIndex: index,
      classNames: {mask: styles.imgListViewer},
    })}
  />
</div>
```

Import `MAX_MEMO_IMAGES` from `memoImageUtils.js`. Change the existing textarea height expression so the 45px image row fits without hiding the submit controls:

```tsx
style={{height: memoTags.length > 0 ? '200px' : '245px'}}
```

- [ ] **Step 3: Own mobile image state and submit behavior**

In `Memo.jsx` add state beside other form state:

```javascript
const [memoImages, setMemoImages] = useState([]) // 当前备忘原图与缩略图
const [memoImageUploading, setMemoImageUploading] = useState(false) // 是否正在上传备忘图片
const [initialMemoForm, setInitialMemoForm] = useState(null) // 打开表单时的数据快照
```

Change `uploadToJD` to return the Ant Design Mobile item with both original and thumbnail URLs:

```javascript
const uploadToJD = async (file) => {
  if (file.size > 1024 * 1024 * 6) Toast.show({content: '图片超6M,自动压缩中...'})
  const result = await uploadImgByJD(file);
  if (!result.success || !result.data?.url) {
    Toast.show({icon: 'fail', content: result.message ?? '上传失败'})
    throw new Error(result.message ?? '上传失败')
  }
  return {url: result.data.url, thumbnailUrl: thumbUrl(result.data.url)}
}
```

This return shape remains compatible with the existing loop/comment `ImageUploader` usages because they read `item.url`.

In `openAdd`, reset `memoImages` and the upload flag:

```javascript
setMemoImages([])
setMemoImageUploading(false)
setInitialMemoForm({content: '', itemType: type, tagIds: [], imgArr: ''})
```

In the `edit` action, hydrate original and thumbnail values:

```javascript
setMemoImages(splitMemoImages(obj.imgArr).map(url => ({url, thumbnailUrl: thumbUrl(url)})))
setMemoImageUploading(false)
setInitialMemoForm({
  content: obj.content ?? '',
  itemType: obj.itemType,
  tagIds: obj.tagIds ?? [],
  imgArr: obj.imgArr ?? '',
})
```

At the start of `submit`, add:

```javascript
if (memoImageUploading) return Toast.show({icon: 'fail', content: '图片还在上传中，请稍等'})
const nextImgArr = joinMemoImages(memoImages.map(item => item.url)); // 待提交图片字段
if (!isMemoImageValueValid(nextImgArr)) {
  return Toast.show({icon: 'fail', content: '图片地址总长度不能超过999个字符，请删除部分图片'})
}
```

Include changed image data, using `''` to clear:

```javascript
if (nextImgArr !== (editVisible?.imgArr ?? '')) body.imgArr = nextImgArr;
```

Replace the no-change test with an explicit undefined check so clearing all images (`body.imgArr === ''`) still submits:

```javascript
if (body.content === null && body.itemType === null && body.tagIds === undefined && body.imgArr === undefined) {
  Toast.show({icon: 'fail', content: '没有变化'})
  setEditVisible(false)
  return
}
```

Compute the complete dirty state in `Memo.jsx`:

```javascript
const currentMemoImgArr = joinMemoImages(memoImages.map(item => item.url)); // 当前表单图片字段
const memoFormChanged = Boolean(initialMemoForm) && (
  content !== initialMemoForm.content
  || itemType !== initialMemoForm.itemType
  || !sameIds(tagIds, initialMemoForm.tagIds)
  || currentMemoImgArr !== initialMemoForm.imgArr
);
```

Add a `hasUnsavedChanges: boolean` prop to `MemoEditPopup`. Replace its current mask-close content comparison with:

```typescript
onMaskClick={async () => {
  if (!hasUnsavedChanges) return onClose()
  const result = await Dialog.confirm({
    content: '检测到内容已修改，直接返回已编辑的内容会丢失哦,确定退出吗？',
    closeOnMaskClick: true,
  })
  if (result) onClose()
}}
```

Pass the dirty flag and uploader props to `MemoEditPopup`:

```tsx
hasUnsavedChanges={memoFormChanged}
memoImages={memoImages}
onMemoImagesChange={setMemoImages}
onImageUploadQueueChange={tasks => setMemoImageUploading(tasks.some(task => task.status === 'pending'))}
onUploadImage={uploadToJD}
```

- [ ] **Step 4: Render mobile list and detail images**

In `Memo.jsx`, render directly after the `HighlightKeyword`/`Ellipsis` content block and before tags:

```tsx
<MobileMemoImageGallery imgArr={item.imgArr}/>
```

In `MemoDetailPopup.tsx`, render inside the bordered detail area immediately after the memo `<pre>`:

```tsx
<MobileMemoImageGallery imgArr={visibleMemo.imgArr}/>
```

- [ ] **Step 5: Add 45px single-row mobile styles**

Append to `mobile.module.css`:

```css
.memoImageUploaderRow,
.memoImageGallery {
  display: flex;
  width: 100%;
  margin-top: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  -webkit-overflow-scrolling: touch;
}

.memoImageUploader {
  flex: 0 0 auto;
  --cell-size: 45px;
  --gap: 5px;
}

.memoImageUploader :global(.adm-grid) {
  width: max-content;
  grid-template-columns: repeat(6, 45px) !important;
}

.memoImageGallery {
  gap: 5px;
}

.memoImageThumbnail {
  flex: 0 0 45px;
  border-radius: 5px;
  overflow: hidden;
}
```

- [ ] **Step 6: Verify the mobile slice**

Run:

```powershell
node --test src/utils/memoImageUtils.test.js
yarn lint
yarn build
```

Expected: utility tests pass; lint and build exit 0.

Manual check in portrait mobile layout:

- Upload six images and confirm all cells remain 45px on one horizontally scrollable line.
- Confirm the add cell disappears at six images.
- Confirm list thumbnails sit directly below memo text and do not open the memo detail when tapped.
- Confirm tapping a thumbnail opens original-image multi-preview.
- Edit and remove a saved image; confirm only `imgArr` changes and no remote delete request occurs.
- Confirm an image upload in progress blocks submission.

- [ ] **Step 7: Commit the mobile slice**

```powershell
git add -- src/pages/Mobile/pages/Memos/components/MobileMemoImageGallery.tsx src/pages/Mobile/pages/Memos/components/MemoEditPopup.tsx src/pages/Mobile/pages/Memos/components/MemoDetailPopup.tsx src/pages/Mobile/pages/Memos/Memo.jsx src/pages/Mobile/styles/mobile.module.css
git commit -m "feat(memo): 添加移动端备忘图片"
```

## Task 5: Final cross-repository verification

**Files:**

- Verify only; do not change unrelated files.

- [ ] **Step 1: Confirm migrations and repository diffs**

Run from `D:/AllCode/yc`:

```powershell
git -C yc-page status --short
git -C yc-page log -3 --oneline
git -C yc-web status --short
git -C yc-web log -5 --oneline
```

Expected: only intentional work remains; the backend log includes the memo field commit and the frontend log includes utility, desktop, and mobile commits.

- [ ] **Step 2: Run final automated verification**

Run:

```powershell
mvn -f yc-page/pom.xml test
node --test yc-web/src/utils/memoImageUtils.test.js
yarn --cwd yc-web lint
yarn --cwd yc-web build
```

Expected: all commands exit 0, except any explicitly documented backend infrastructure dependency.

- [ ] **Step 3: Inspect encoding and diff hygiene**

Run:

```powershell
rg -n "\?\?\?|\\u[0-9a-fA-F]{4}" yc-page/src/main/java/ikun/yc/ycpage/entity/Memo.java yc-page/src/main/java/ikun/yc/ycpage/service/impl/MemoServiceImpl.java yc-page/sql/20260713_add_memo_img_arr.sql yc-web/src/utils/memoImageUtils.js yc-web/src/pages/MemoDrawer yc-web/src/pages/Mobile/pages/Memos
git -C yc-page diff HEAD~1 --check
git -C yc-web diff HEAD~3 --check
```

Expected: no encoding corruption matches and both diff checks are clean.

- [ ] **Step 4: Report deployment ordering**

Hand off in this order:

1. Apply `yc-page/sql/20260713_add_memo_img_arr.sql` to the target MySQL database.
2. Deploy the backend containing the new entity field and validation.
3. Deploy the frontend.

Report automated test results, manual checks performed, and any checks blocked by missing database, Redis, browser session, or external image service.
