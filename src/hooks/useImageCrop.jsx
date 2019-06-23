import React, { useState, useRef } from "react";
import { Modal, Button, Icon } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor'


const useImageCrop = (crop, onComplete) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [uploadedImage, setUploadedImage] = useState('');
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);

    let editor = useRef(null);

    const onClickSave = () => {
        if (editor) {
            const canvasScaled = editor.current.getImageScaledToCanvas();
            return new Promise((resolve, reject) => {
                canvasScaled.toBlob(blob => {
                    blob.lastModifiedDate = new Date();
                    blob.name = 'cropped.jpg';
                    resolve(blob);
                }, 'image/jpeg');
            });
        }
    }

    const getCroppedUrl = async () => {
        let file = await onClickSave();
        onComplete(file);
        setCroppedImageUrl(URL.createObjectURL(file));
    }

    const cropModal = () => {
        if (!uploadedImage) {
            return;
        }

        const handleClose = () => {
            getCroppedUrl();
            setModalOpen(false);
        }

        return (
            <Modal align='center' size='large' open={modalOpen}>
                <Modal.Header>Crop Image</Modal.Header>
                <Modal.Content image>
                    <Modal.Description align='center'>
                        <AvatarEditor
                            ref={editor}
                            image={uploadedImage}
                            width={crop.width}
                            height={crop.height}
                            border={80}
                            color={[255, 255, 255, 0.8]} // RGBA
                            scale={2}
                            rotate={0}
                        />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={handleClose} inverted>
                        <Icon name='close' /> No
                    </Button>
                    <Button color='green' onClick={handleClose} inverted>
                        <Icon name='checkmark' /> OK
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    return { cropModal, croppedImageUrl, setModalOpen, setUploadedImage, setCroppedImageUrl }
}

export { useImageCrop };
