import {Popup} from "antd-mobile";
import GgComparator from "@/pages/UtilsPage/GgComparator";

export default ({v: [visible, setVisible]}) => {

  return (
    <Popup
      visible={visible}
      onMaskClick={() => setVisible(false)}
      onClose={() => setVisible(false)}
      position='top'
      bodyStyle={{height: '360px'}}
    >
      <GgComparator/>
    </Popup>
  )
}

