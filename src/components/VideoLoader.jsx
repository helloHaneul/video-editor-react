import { Upload, message } from 'antd';
import { MdUploadFile } from 'react-icons/md';

const VideoLoader = ({ disabled, onChange = () => {} }) => {
  const handleVideoFile = (file) => {
    onChange(file);
  };

  const { Dragger } = Upload;

  const draggerProps = {
    name: 'file',
    multiple: false,
    accept: 'video/*',
    disabled: disabled,
    beforeUpload() {
      return false;
    },
    onChange(info) {
      if (info.fileList && info.fileList.length > 0) {
        handleVideoFile(info.fileList[0].originFileObj);
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    onDrop(e) {
      //console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <>
      {
        <Dragger {...draggerProps} style={{ color: '#383838' }}>
          <p style={{ fontWeight: 'bold', fontSize: '36px' }}>
            <MdUploadFile />
          </p>
          <p style={{ fontWeight: 'bold', fontSize: '22px' }}>
            비디오 업로드하기
          </p>
          <p>
            최대 5MB 영상파일(.avi, .mp4)
            <br />
            파일을 선택하거나 여기에 끌어다 놓아주세요.
          </p>
        </Dragger>
      }
    </>
  );
};

export default VideoLoader;
