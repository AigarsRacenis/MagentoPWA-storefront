// /var/www/magentostorefront/src/components/ImageViewerModal/imageViewerModal.js
import React, { useState, useRef } from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import { X as CloseIcon, ZoomIn, ZoomOut } from 'react-feather';

import defaultClasses from './imageViewerModal.module.css';

const ImageViewerModal = props => {
    const { isOpen, onClose, image, altText } = props;
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const classes = useStyle(defaultClasses, props.classes);

    if (!isOpen || !image) {
        return null;
    }

    const handleZoomIn = () => {
        setZoom(prevZoom => Math.min(prevZoom + 0.5, 3));
    };

    const handleZoomOut = () => {
        setZoom(prevZoom => Math.max(prevZoom - 0.5, 1));
        if (zoom <= 1.5) {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            const touch = e.touches[0];
            dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - dragStart.current.x,
            y: touch.clientY - dragStart.current.y,
        });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    return (
        <Portal>
            <div className={classes.root}>
                <div className={classes.modal}>
                    <button onClick={onClose} className={classes.closeButton}>
                        <Icon src={CloseIcon} size={24} />
                    </button>
                    <div
                        className={classes.imageContainer}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                    >
                        <Image
                            alt={altText}
                            classes={{
                                image: classes.image,
                                root: classes.imageRoot
                            }}
                            resource={image.file}
                            style={{
                                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                                transition: isDragging ? 'none' : 'transform 0.3s ease'
                            }}
                        />
                    </div>
                    <div className={classes.zoomControls}>
                        <button onClick={handleZoomIn} className={classes.zoomButton}>
                            <Icon src={ZoomIn} size={24} />
                        </button>
                        <button onClick={handleZoomOut} className={classes.zoomButton}>
                            <Icon src={ZoomOut} size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ImageViewerModal;
