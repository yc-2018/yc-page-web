import {useState} from 'react';

/**
 * 本身的State状态就是异步的，所以如果同步，就可以用本方法，
 * 但是setValueView就丧失了传方法的功能，而且因为value的值改变会导致他的地址改变，所以在使用时需要使用数组[0]
 * const [valueL, valueView, setValue] = MyState(initValue)
 * 使用：console.log(value[0])
 * */
const MyState = obj => {
    const [valueView, setValueView] = useState(obj);
    const valueList = [obj];  // 同步的   因为直接用值地址会改变 所以要用数组

    const setValue = v => {
        valueList[0] = v
        setValueView(v);
    }


    return [valueList, valueView, setValue];
};

export default MyState;