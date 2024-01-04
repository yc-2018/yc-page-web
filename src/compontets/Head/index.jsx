import React from 'react';
import {Avatar, Layout} from "antd";
import {Header} from "antd/es/layout/layout";

const Head = () => {

    return (
        <Layout>
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(100deg, #f9e4e4 0%, #afcdcc 100%)',
                boxShadow: '0 9px 66px 1px #39487061',

            }}>
                <Avatar src="/favicon.ico" />
            </Header>
        </Layout>
    );
};
export default Head;