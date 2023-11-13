//导入antd输入框
import { Input, Button } from 'antd';
import './App.css';
import Search from './pages/Search';


export default function App() {
  return (
    <div className="App" >
      {/* antd居中输入框 */}
      <div className="ant-input-group">
        <div className="ant-input-group-addon">
          <i className="anticon anticon-user"></i>
        </div>
        <Search />
      </div>
    </div>
  );
}

