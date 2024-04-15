import React, {useState} from "react";
import {Col, InputNumber, Row} from "antd";


export default () => {
  const [product1Weight, setProduct1Weight] = useState()              // 商品1 重量
  const [product2Weight, setProduct2Weight] = useState()              // 商品2 重量
  const [product1Price, setProduct1Price] = useState()                // 商品1 价格
  const [product2Price, setProduct2Price] = useState()                // 商品2 价格
  
  
  const [price1Ke1, price1Jin1] = getPrice(product1Price, product1Weight)
  const [price1Ke2, price1Jin2] = getPrice(product2Price, product2Weight)
  
  
  return <div style={{padding: 20, textAlign: 'center'}}>
    <Row gutter={20} justify="center">
      <Col span={6} style={{textAlign: 'center'}}>
        <div>商品1</div>
        <InputNumber addonAfter="克" value={product1Weight} onChange={value => setProduct1Weight(value)}
                     style={{margin: 5}}/>
        <InputNumber addonAfter="元" value={product1Price} onChange={value => setProduct1Price(value)}
                     style={{margin: 5}}/>
        <div>每克:{price1Ke1}块</div>
        <div>一斤:{price1Jin1}块</div>
        {getPriceCompare(price1Ke1, price1Ke2)}
      </Col>
      
      <Col span={6} style={{textAlign: 'center'}}>
        <div>商品2</div>
        <InputNumber addonAfter="克" value={product2Weight} onChange={value => setProduct2Weight(value)}
                     style={{margin: 5}}/>
        <InputNumber addonAfter="元" value={product2Price} onChange={value => setProduct2Price(value)}
                     style={{margin: 5}}/>
        <div>每克:{price1Ke2}块</div>
        <div>一斤:{price1Jin2}块</div>
        {getPriceCompare(price1Ke2, price1Ke1)}
      </Col>
    </Row>
    <div>
    </div>
  </div>
}

/**
 * 输入一个金额  和  一个克数
 * 输出每克多少钱   500克多少钱
 * @param price 价格
 * @param weight 重量
 * @return [每克价格, 一斤价格]
 * @author ChenGuangLong
 * @since 2024/4/15 11:18
 */
const getPrice = (price, weight) => {
  if (!price || !weight) return [null, null]
  
  let pricePerGram = price / weight;       // 每克价格
  let oneCattyPrice = pricePerGram * 500;  // 一斤价格
  return [pricePerGram, oneCattyPrice];
}

/**
 * 输入2个价格(当前价格，比较价格)  第一个小就返回平 大就返回贵
 * @author ChenGuangLong
 * @since 2024/4/15 11:47
 */
const getPriceCompare = (price1, price2) => {
  if (!price1 || !price2) return null
  const expensive = price1 > price2
  return <h1 style={{color: expensive ? '#d2ac0c' : 'green'}}>{expensive ? '贵' : '平'}</h1>
}

/**
 * 输入商品1和商品2的克数和价格 输出 每斤差了多少克 和每近差了多少元
 * @author ChenGuangLong
 * @since 2024/4/15 11:59
*/
const getPriceDifference = (price1Ke1, price1Jin1, price1Ke2, price1Jin2) => {
  if (!price1Ke1 || !price1Jin1 || !price1Ke2 || !price1Jin2) return null
  
  

  
  
}