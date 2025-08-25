import imageCompression from 'browser-image-compression';

/**
 * 图片压缩工具方法
 *
 * @author 𝓒𝓱𝓮𝓷𝓖𝓾𝓪𝓷𝓰𝓛𝓸𝓷𝓰
 * @since 2025/7/18 0:04
 */
export const compressImageToXMB = async (file: File, xMb = 5) => {
  // 1. 检查是否非图片类型
  if (!file.type.match('image.*')) {
    console.log('非图片文件，直接返回:', file.name);
    return file;
  }

  // 2. 检查文件大小是否小于xMB
  const MAX_SIZE = xMb * 1024 * 1024; // 5MB
  if (file.size <= MAX_SIZE) {
    console.log(`文件小于${xMb}MB，直接返回:`, file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB');
    return file;
  }

  // 3. 压缩图片到xMB以下
  console.log('开始压缩图片:', file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB');

  try {
    const options = {
      maxSizeMB: xMb,             // 目标最大文件大小 (MB)
      maxWidthOrHeight: 1920,     // 最大宽度或高度
      useWebWorker: true,         // 使用WebWorker提高性能
      initialQuality: 0.85,       // 初始压缩质量
      maxIteration: 10            // 最大压缩迭代次数
    };

    const compressedFile = await imageCompression(file, options);

    // 验证压缩结果是否小于xMB
    if (compressedFile.size > MAX_SIZE) {
      console.warn(`压缩后文件仍大于${xMb}MB:`, (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB');
      return file; // 返回原始文件（不符合要求，但避免上传失败）
    }

    console.log('压缩成功:',
      (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB',
      '节省: ' + (100 - (compressedFile.size / file.size * 100)).toFixed(1) + '%'
    );

    return compressedFile;
  } catch (error) {
    console.error('图片压缩失败:', error);
    return file; // 压缩失败返回原始文件
  }
};