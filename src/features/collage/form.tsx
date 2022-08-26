import { uploadFile } from "@shared/blobstorage";
import { useSasToken } from "@shared/hooks/useSasToken";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { useGifMessage } from "@features/upload/useGifMessage";
import { isValidDomain } from "@features/collage/util";

interface FormState {
  url?: string;
  file?: File;
}

const Form: React.FC<{ className: string }> = ({ className }) => {
  const [isFileUpload, setFileUploadForm] = useState(false);
  const sasToken = useSasToken();
  const { sendGif } = useGifMessage();

  const validate = (values: FormState) => {
    const errors: Record<string, string> = {};
    if (!isFileUpload && values.url) {
      if (!isValidDomain(values.url)) errors.url = "Invalid URL";
      if (!values.url.includes(".gif"))
        errors.url = "Input supports .gif format only";
    }
    return errors;
  };

  const onSubmit = (
    values: FormState,
    { setSubmitting }: FormikHelpers<FormState>
  ) => {
    if (isFileUpload) {
      setTimeout(async () => {
        if (sasToken && values.file) await uploadFile(sasToken, values.file);
        setSubmitting(false);
      }, 400);
    } else {
      setTimeout(async () => {
        if (values.url) await sendGif(values.url);
        setSubmitting(false);
      }, 400);
    }
  };

  return (
    <Formik<FormState>
      initialValues={{
        url: "",
      }}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <form className={className} onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="upload">Use File Upload</label>
            <input
              type="checkbox"
              name="upload"
              onChange={(event) => {
                handleChange(event);
                setFileUploadForm(event.target.checked);
              }}
              onBlur={handleBlur}
              checked={isFileUpload}
            />
          </div>
          <br />
          {isFileUpload && (
            <>
              <label htmlFor="file">Upload file</label>
              <input
                type="file"
                name="file"
                required={isFileUpload}
                onChange={({ target: { files } }) => {
                  if (files && files.length) setFieldValue("file", files[0]);
                }}
                onBlur={handleBlur}
                accept="image/gif"
              />
            </>
          )}
          {!isFileUpload && (
            <>
              <label htmlFor="url">Enter URL</label>
              <input
                type="url"
                name="url"
                required={!isFileUpload}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.url}
              />
            </>
          )}
          {errors.url && touched.url && errors.url}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
};

export default Form;
