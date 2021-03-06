import React, {FC, useState} from 'react';
import {Modal, Button, message} from 'antd';
import Avatar from 'react-avatar-edit';
import styled from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
`;

export interface IProps {
  visible: boolean;
  src?: string;
}
export interface IHandlers {
  onApply?(image: string): void;
  onCancel?(): void;
}

export const AvatarDialogComponent: FC<IProps & IHandlers> = ({visible, src, onApply, onCancel}) => {
  const [preview, setPreview] = useState();

  function onCrop(preview: any) {
    setPreview(preview);
  }

  function onBeforeFileLoad(elem: any) {
    if (elem.target.files[0].size > 71680) {
      message.error('File is too big!');
      elem.target.value = '';
    }
  }

  function onClose() {
    setPreview(null);
  }

  return (
    <Modal
      visible={visible}
      title={'Avatar Editor'}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button disabled={!preview} key="submit" type="primary" onClick={() => onApply && onApply(preview)}>
          Apply
        </Button>,
      ]}>
      <Wrapper>
        <Avatar
          width={520 - 24 * 2}
          height={295}
          onCrop={onCrop}
          onClose={onClose}
          onBeforeFileLoad={onBeforeFileLoad}
          src={src}
        />
        {preview && <img src={preview} alt="Preview" />}
      </Wrapper>
    </Modal>
  );
};
