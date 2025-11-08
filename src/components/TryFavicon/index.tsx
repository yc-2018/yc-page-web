import {useState, useEffect} from "react";
import {QuestionCircleTwoTone} from "@ant-design/icons";
import {tryGetFavicon, tryGetFavicon1} from "@/utils/urlUtils";
import {FC} from "react";
import {Skeleton} from "antd";

interface Props {
  iconUrl?: string;                       // 直接提供的图标URL（最高优先级）
  url?: string;                           // 网站URL，用于自动获取图标
  size?: number;                          // 图标显示大小
  errSize?: number;                       // 错误状态下图标大小
  backgroundColor?: string;               // 背景颜色
  shape?: "circle" | "square";            // 形状：圆形或方形
  initElm?: 'loading' | 'skeleton';       // 初始化时加载图标样式
}

const TryFavicon: FC<Props> = ({
                                 iconUrl,
                                 url,
                                 size = 20,
                                 errSize = 16,
                                 backgroundColor = "unset",
                                 shape = "square",
                                 initElm = "skeleton"
                               }) => {
  // 状态管理
  const [currentSrc, setCurrentSrc] = useState<string | null>(null); // 当前成功加载的图标URL
  const [loading, setLoading] = useState(true);  // 加载状态
  const [error, setError] = useState(false);     // 错误状态

  // 图标加载效果：按优先级尝试不同的图标源
  useEffect(() => {
    // 重置状态
    setLoading(true);
    setError(false);
    setCurrentSrc(null);

    // 按优先级构建图标源数组：
    // 1. 直接提供的iconUrl（最高优先级）
    // 2. 通过tryGetFavicon从URL获取
    // 3. 通过tryGetFavicon1从URL获取（最低优先级）
    const sources = [
      iconUrl,
      url ? tryGetFavicon(url) : null,
      url ? tryGetFavicon1(url) : null,
    ].filter(Boolean) as string[]; // 过滤掉null/undefined值

    // 如果没有可用的图标源，直接显示错误状态
    if (sources.length === 0) {
      setLoading(false);
      setError(true);
      return;
    }

    let currentIndex = 0;    // 当前尝试的图标源索引
    let mounted = true;      // 组件挂载状态，防止内存泄漏

    // 递归函数：按顺序尝试每个图标源
    const tryNextSource = () => {
      // 检查组件是否仍挂载或已尝试所有源
      if (!mounted || currentIndex >= sources.length) {
        if (mounted) {
          setError(true);
          setLoading(false);
        }
        return;
      }

      // 获取当前要尝试的图标源
      const src = sources[currentIndex];
      const img = new Image(); // 创建图片对象进行预加载

      // 图片加载成功
      img.onload = () => {
        if (mounted) {
          setCurrentSrc(src);
          setLoading(false);
          setError(false);
        }
      };

      // 图片加载失败，尝试下一个源
      img.onerror = () => {
        if (mounted) {
          currentIndex++;
          tryNextSource(); // 递归尝试下一个源
        }
      };

      // 开始加载图片
      img.src = src;
    };

    // 开始尝试图标源
    tryNextSource();

    // 清理函数：组件卸载时设置mounted为false
    return () => {
      mounted = false;
    };
  }, [iconUrl, url]); // 依赖项：当iconUrl或url变化时重新执行

  // 计算样式
  const borderRadius = shape === "circle" ? "50%" : "4px";
  const containerStyle = {
    width: size,
    height: size,
    backgroundColor,
    borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0, // 防止容器被压缩
  };

  // ========== 加载状态 ==========
  // 当图标正在加载时显示旋转动画
  if (loading) {
    return initElm === 'skeleton' ?
      <Skeleton.Avatar active={true} size={size} shape={shape}/>
      :
      <div style={containerStyle}>
        {/* 旋转加载指示器 */}
        <div
          style={{
            width: size * 0.6,  // 加载动画大小为图标的60%
            height: size * 0.6,
            border: `2px solid #f0f0f0`,        // 外围灰色边框
            borderTop: `2px solid #1890ff`,     // 顶部蓝色边框形成旋转效果
            borderRadius: "50%",                // 圆形
            animation: "spin 1s linear infinite", // 无限旋转动画
          }}
        />
        {/* 内联CSS动画定义 */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
  }

  // ========== 错误状态 ==========
  // 当所有图标源都加载失败时显示默认图标
  if (error || !currentSrc) {
    return (
      <div style={containerStyle}>
        <QuestionCircleTwoTone style={{color: "#888", fontSize: errSize}}/>
      </div>
    );
  }

  // ========== 成功状态 ==========
  // 图标成功加载，显示实际图标
  return (
    <div style={containerStyle}>
      <img
        src={currentSrc}
        alt="" // 空alt，因为这是装饰性图标
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // 保持图标比例完整显示
          borderRadius,
        }}
        // 防止图片加载后出错（理论上不会发生，但作为保险）
        onError={() => setError(true)}
      />
    </div>
  );
};

export default TryFavicon;
