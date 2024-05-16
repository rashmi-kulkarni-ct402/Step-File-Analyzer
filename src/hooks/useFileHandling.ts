// Custom hook to handle file selection, uploading, translation, and URN generation.

import { useEffect, useRef, useState } from "react";
import {
  checkFileUploaded,
  uploadFileToBucket,
} from "../api/fileManagementAPI";
import { createUrn } from "../utils/urn.utils";
import { translateFile } from "../api/translationManagementAPI";
import { checkJobStatus } from "../api/jobStatusAPI";
import { STEP_FILES_BUCKET_KEY } from "../model/constants/index.constants";
import { useLocation } from "react-router-dom";

export type FileHandlingResponse = {
  urn: string | undefined;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: any) => void;
  handleButtonClick: () => void;
};

const useFileHandling = (token: string | null): FileHandlingResponse => {
  const [urn, setUrn] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state } = useLocation();
  const { file } = state;

  useEffect(() => {
    if (file) {
      handleFileChange(file);
    }
  }, [file, token]);

  // Handles file selection via input element
  const handleFileChange = (eventOrFile: any) => {
    const file = eventOrFile.target ? eventOrFile.target.files[0] : eventOrFile;
    if (!file) {
      console.error("No file selected.");
      return;
    }

    // Check if file has already been uploaded
    if (token) {
      checkFileUploaded(STEP_FILES_BUCKET_KEY, file.name, token).then(
        async (fileCheckResp) => {
          console.log("fileCheckResp: ", fileCheckResp);

          if (fileCheckResp?.objectId) {
            // If file exists, create a URN
            setUrn(createUrn(STEP_FILES_BUCKET_KEY, file.name));
            console.log("urn: ", urn);
            console.log(
              "createURN: ",
              createUrn(STEP_FILES_BUCKET_KEY, file.name)
            );
          } else {
            // If file doesn't exist, upload it
            console.log("uploading file to bucket ... ");
            const uploadResp = await uploadFileToBucket(
              file,
              token,
              `stepfile_uploads`
            );
            console.log("uploadResp : ", uploadResp);
            const { objectId } = uploadResp;

            // Translate the uploaded file
            console.log("Sending uploaded file for translation ... ");
            const translationResp = await translateFile(objectId, token);
            console.log("translationResp : ", translationResp);
            const { urn } = translationResp;

            // Check the status of the translation job
            checkJobStatus(urn, token, (urn) => setUrn(urn));
          }
        }
      );
    }
  };

  // Triggers the file input when the button is clicked
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return { urn, fileInputRef, handleFileChange, handleButtonClick };
};

export default useFileHandling;
