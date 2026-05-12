import imageCompression from 'browser-image-compression';

type CompressImageType = 'origin' | 'jpeg' | 'webp';

const imageTypeMap = {
  jpeg: 'image/jpeg',
  webp: 'image/webp',
} as const;

const imageExtMap = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

/** 替换图片文件扩展名，保证文件名和实际 MIME 类型一致 */
const replaceImageExt = (name: string, type: string) => {
  const ext = imageExtMap[type as keyof typeof imageExtMap] ?? 'jpg'; // 压缩后文件扩展名
  return name.match(/\.[^.]+$/) ? name.replace(/\.[^.]+$/, `.${ext}`) : `${name}.${ext}`;
};

/** 包装压缩后的图片文件，保证文件名和实际 MIME 类型一致 */
const createImageFile = (file: File, name: string, type: string) => new File(
  [file],
  replaceImageExt(name, type),
  {type, lastModified: file.lastModified}
);

/**
 * 图片压缩工具方法
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/18 0:04
 */
export const compressImageToXMB = async (file: File, xMb = 5, type: CompressImageType = 'origin') => {
  // 1. 检查是否非图片类型
  if (!file.type.match('image.*')) {
    console.log('非图片文件，直接返回:', file.name);
    return file;
  }

  const targetType = type === 'origin' ? file.type : imageTypeMap[type]; // 压缩后的图片类型

  // 2. 检查文件大小是否小于xMB，并且不需要转换格式
  const MAX_SIZE = xMb * 1024 * 1024; // 目标最大文件大小
  if (file.size <= MAX_SIZE && targetType === file.type) {
    console.log(`文件小于${xMb}MB且无需转换格式，直接返回:`, file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB');
    return file;
  }

  // 3. 压缩图片到xMB以下
  console.log('开始压缩图片:', file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB');

  try {
    let sourceFile = file; // 实际参与上传或继续压缩的图片

    // 先只转换格式，不限制宽高；如果转成 WebP 后已经小于目标体积，就不再继续压缩
    if (targetType !== file.type) {
      const convertedFile = await imageCompression(file, {
        maxSizeMB: Number.POSITIVE_INFINITY, // 只转格式，不按大小压缩
        useWebWorker: true,                  // 使用WebWorker提高性能
        initialQuality: 0.95,                // 尽量保留转换后的图片质量
        maxIteration: 10,                    // 最大压缩迭代次数
        alwaysKeepResolution: true,          // 只转换格式时保留原始分辨率
        fileType: targetType                 // 期望输出类型，优先转成 WebP
      });
      const convertedType = convertedFile.type || targetType; // 浏览器实际转换出的图片类型
      sourceFile = createImageFile(convertedFile, file.name, convertedType);

      if (sourceFile.size <= MAX_SIZE) {
        console.log('转换格式后已小于目标大小:',
          (sourceFile.size / 1024 / 1024).toFixed(2) + 'MB',
          '节省: ' + (100 - (sourceFile.size / file.size * 100)).toFixed(1) + '%'
        );
        return sourceFile;
      }
    }

    const options = {
      maxSizeMB: xMb,             // 目标最大文件大小 (MB)
      maxWidthOrHeight: 1920,     // 最大宽度或高度
      useWebWorker: true,         // 使用WebWorker提高性能
      initialQuality: 0.85,       // 初始压缩质量
      maxIteration: 10,           // 最大压缩迭代次数
      fileType: sourceFile.type || targetType // 期望输出类型，优先转成 WebP
    };

    const compressedFile = await imageCompression(sourceFile, options);
    const actualType = compressedFile.type || sourceFile.type || targetType; // 浏览器实际输出的图片类型
    const uploadFile = actualType === sourceFile.type && compressedFile.name === sourceFile.name
      ? compressedFile
      : createImageFile(compressedFile, sourceFile.name, actualType);

    // 验证压缩结果是否小于xMB
    if (uploadFile.size > MAX_SIZE) {
      console.warn(`压缩后文件仍大于${xMb}MB:`, (uploadFile.size / 1024 / 1024).toFixed(2) + 'MB');
      return file; // 返回原始文件（不符合要求，但避免上传失败）
    }

    console.log('压缩成功:',
      (uploadFile.size / 1024 / 1024).toFixed(2) + 'MB',
      '节省: ' + (100 - (uploadFile.size / file.size * 100)).toFixed(1) + '%'
    );

    return uploadFile;
  } catch (error) {
    console.error('图片压缩失败:', error);
    return file; // 压缩失败返回原始文件
  }
};
