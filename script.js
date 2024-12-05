document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const controls = document.getElementById('controls');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => fileInput.click());

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImage(file);
        }
    });

    // 文件选择事件
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImage(file);
        }
    });

    // 质量滑块事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        compressImage();
    });

    // 处理图片
    function handleImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            previewContainer.style.display = 'flex';
            controls.style.display = 'block';
            
            // 设置初始尺寸
            originalImage.onload = () => {
                widthInput.value = originalImage.naturalWidth;
                heightInput.value = originalImage.naturalHeight;
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    // 添加尺寸输入事件监听
    widthInput.addEventListener('input', handleDimensionChange);
    heightInput.addEventListener('input', handleDimensionChange);

    // 处理尺寸变化
    function handleDimensionChange(e) {
        if (maintainAspectRatio.checked) {
            const aspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;
            if (e.target === widthInput) {
                heightInput.value = Math.round(widthInput.value / aspectRatio);
            } else {
                widthInput.value = Math.round(heightInput.value * aspectRatio);
            }
        }
        compressImage();
    }

    // 压缩图片
    function compressImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 使用输入的尺寸
        const newWidth = parseInt(widthInput.value) || originalImage.naturalWidth;
        const newHeight = parseInt(heightInput.value) || originalImage.naturalHeight;
        
        // 设置画布尺寸
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // 绘制调整大小后的图片
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
        
        // 压缩
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedImage.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressionRatio = compressedDataUrl.length / originalImage.src.length;
        const originalFileSizeInBytes = originalImage.src.length * 0.75;
        const compressedFileSizeInBytes = originalFileSizeInBytes * compressionRatio;
        compressedSize.textContent = formatFileSize(compressedFileSizeInBytes);
    }

    // 下载按钮事件
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed_image.jpg';
        link.href = compressedImage.src;
        link.click();
    });

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    }
}); 