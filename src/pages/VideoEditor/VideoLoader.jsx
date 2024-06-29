import { Upload, message } from "antd";
import { UploadFileOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

const VideoLoader = ({ disabled, onChange = () => {}, onRemove = () => {} }) => {

    const [file, setFile] = useState();

    useEffect(() => {
        onChange(file);
    }, [file]);

    const { Dragger } = Upload;

    const props = {
        name: 'file',
        multiple: false,
        accept:"video/*",
        disabled: disabled,
        beforeUpload() {
            return false;
        },
        onChange(info) {
            if (info.fileList && info.fileList.length > 0) {
                setFile(info.fileList[0].originFileObj);
                message.success(`${info.file.name} file uploaded successfully.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            {
                <Dragger {...props} style={{ color: "#f3f3f3" }}>
                    <p>
                        <UploadFileOutlined />
                    </p>
                    <p style={{ fontWeight: "bold", fontSize: "22px" }}>
                        비디오 업로드하기
                    </p>
                    <p>
                        최대 5MB 영상파일(.avi, .mp4)<br />
                        파일을 선택하거나 여기에 끌어다 놓아주세요.
                    </p>
                </Dragger>
            }
            
        </>
    );
}

export default VideoLoader;