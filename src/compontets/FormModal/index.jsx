import { Modal } from 'antd';
const FormModal = ({isFormModalOpen,setFormModal,data}) => {

    const handleOk = () => {
        setFormModal(false);
    };

    return (
        <>
            <Modal title={data?"编辑备忘":"新增备忘"} open={isFormModalOpen} onOk={handleOk} onCancel={()=>setFormModal(false)}>
                <p>Some  还没写呢  contents...</p>
                <p>{data?.content}</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
};
export default FormModal;