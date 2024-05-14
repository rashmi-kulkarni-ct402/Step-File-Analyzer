import { useRef, useState } from "react";
import {
  checkFileUploaded,
  uploadFileToBucket,
} from "../api/fileManagementAPI";
import { createUrn } from "../utils/urnUtils";
import { translateFile } from "../api/translationManagementAPI";
import { checkJobStatus } from "../api/jobStatusAPI";
import { STEP_FILES_BUCKET_KEY } from "../model/constants";

export type FileHandlingResponse = {
  urn: string | undefined;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: any) => void;
  handleButtonClick: () => void;
};

const useFileHandling = (token: string | null): FileHandlingResponse => {
  const [urn, setUrn] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected.");
      return;
    }

    if (token) {
      checkFileUploaded(STEP_FILES_BUCKET_KEY, file.name, token).then(
        async (fileCheckResp) => {
          console.log("fileCheckResp: ", fileCheckResp);

          if (fileCheckResp) {
            setUrn(createUrn(STEP_FILES_BUCKET_KEY, file.name));
          } else {
            console.log("uploading file to bucket ... ");
            const uploadResp = await uploadFileToBucket(
              file,
              token,
              `stepfile_uploads`
            );
            console.log("uploadResp : ", uploadResp);
            const { objectId } = uploadResp;

            console.log("Sending uploaded file for translation ... ");
            const translationResp = await translateFile(objectId, token);
            console.log("translationResp : ", translationResp);
            const { urn } = translationResp;

            checkJobStatus(urn, token, (urn) => setUrn(urn));
          }
        }
      );
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return { urn, fileInputRef, handleFileChange, handleButtonClick };
};

export default useFileHandling;
