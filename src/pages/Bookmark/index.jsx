import { Button, Flex } from "antd"
// import { PoweroffOutlined } from "@ant-design/icons"
export default function Bookmark() {
  return (
    <Flex wrap="wrap" gap="middle" style={{ margin: "20px 70px " }}>
    {Array.from({ length: 24 }, (_, i) => (
     <>
     <Button 
      key={i} 
      type="primary" 
      ghost={true} 
      shape="circle"
      size="large" 
      icon={<img src="https://x.chatmindai.net/Logo.png" style={{width:39,position:"relative",top:-6}}/>}
      />
    <p>ikun</p>
      </>
        
    ))}

  </Flex>
  )
}
