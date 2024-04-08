import React, {useEffect, useState} from 'react';
import axios from 'axios';
import _ from 'lodash'
import FileTab from './FileTab';
import {v4} from 'uuid';
import './FileUploader.css';

const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [showFileTabs, setShowFileTabs] = useState(false);
    const allowedFileTypes = ['text/plain'];
    const maxFileSize = 30 * 1024 * 1024; // 30 MB
    useEffect(() => {
        document.title = "File Analyser App"; // Change this to the desired title
    }, []);
    const handleFileChange = async (event) => {
        const uploadedFiles = event.target.files;
        const fileDataArray = [];

        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            if (!allowedFileTypes.includes(file.type)) {
                alert(`File ${file.name} is not a valid text file.`);
                continue;
            }
            if (file.size > maxFileSize) {
                alert(`File ${file.name} exceeds the maximum size limit of 30 MB.`);
                continue;
            }
            const fileCode = v4();
            const fileData = {
                name: file.name,
                size: file.size,
                status: 'pending',
                file: file,
                code: fileCode
            };
            fileDataArray.push(fileData);
        }

        setFiles(fileDataArray);
    };

    const handleUpload = async () => {
        try {
            setUploading(true);
            for (const file of files) {
                const preSignedUrlResponse = await axios.get('http://localhost:3000/s3/generate-presigned-url', {
                    params: {
                        fileName: file.name,
                        fileCode: file.code
                    }
                });
                const preSignedUrl = _.get(preSignedUrlResponse, ["data", "pre-signed-url"]);
                await uploadFile(file, preSignedUrl);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setUploading(false);
        }
    };

    const uploadFile = async (fileData, preSignedUrl) => {
        try {
            // Make a PUT request with the binary file data as the request body
            await axios.put(preSignedUrl, fileData.file, {
                headers: {
                    'Content-Type': "text/plain",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`${fileData.name} - ${percentCompleted}% uploaded`);
                },
            });

            console.log(`${fileData.name} - uploaded successfully`);

            // Save metadata
            const saveFileResponse = await axios.post('http://localhost:3000/file-analytics/upload', {
                fileCode: fileData.code,
                fileName: fileData.name,
                fileSize: fileData.size
            });
            if (_.get(saveFileResponse, ["data", "success"], false)) {
                console.log(`${fileData.name} - metadata saved successfully`);
                fileData.status = 'uploaded';
                setShowFileTabs(true); // Show file tabs for each uploaded file
            } else {
                fileData.status = 'failed';
            }
        } catch (error) {
            console.error('Error uploading file to s3:', error);
            fileData.status = 'failed';
        }
    };

    return (
        <div className={'FileUploader'}>
            <h2>File Analyser</h2>
            <input className={'FileUploader-input'} type="file" onChange={handleFileChange} multiple/>
            <button className={'FileUploader-button'} onClick={handleUpload} disabled={uploading || files.length === 0}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <div className={'FileTabs'}>
                {showFileTabs &&
                    files.map((file, index) => (
                        <React.Fragment key={index}>
                            {file.status === "uploaded" ? (
                                <FileTab className={'FileTab'} file={file}/>
                            ) : file.status === "failed" ? (
                                <div>
                                    <p>Error uploading file: {file.name}</p>
                                    <p>Status: {file.status}</p>
                                </div>
                            ) : null}
                        </React.Fragment>
                    ))
                }
            </div>
        </div>
    );
};

export default FileUploader;
