import {Avatar} from "antd";
import {tryGetFavicon, tryGetFavicon1} from "@/utils/urlUtils";
import {QuestionCircleTwoTone} from "@ant-design/icons";
import {FC} from "react";

interface props {
  iconUrl?: string;             // 图标URL
  url?: string;                 // 没有图标时，使用此URL获取图标
  size?: number;                // 图标大小
  errSize?: number;             // 获取图标失败时，使用此图标大小
  backgroundColor?: string;     // 背景颜色
  shape?: 'circle' | 'square'   // 形状 circle：圆形   square：方形
}

const TryFavicon: FC<props> = ({iconUrl, url, size = 20, errSize = 16, backgroundColor = 'unset', shape = 'square'}) =>
  <Avatar
    size={size}
    icon={
      <Avatar
        size={size}
        shape={shape}
        src={tryGetFavicon1(url)}   // ✨ 第二 优先级：尝试获取网站原生图标
        icon={<QuestionCircleTwoTone style={{color: '#888', fontSize: errSize}}/>}  // ✨ 第三 优先级：获取网站图标失败
        style={{backgroundColor}}
      />}
    shape={shape}
    style={{backgroundColor}}
    src={iconUrl || tryGetFavicon(url)}   // ✨最高优先级：尝试获取网站原生图标
  />

export default TryFavicon;
