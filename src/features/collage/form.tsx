import { uploadFile } from "@shared/blobstorage";
import { useSasToken } from "@shared/hooks/useSasToken";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import { useGifMessage } from "../upload/useGifMessage";
import { isValidDomain } from "./util";

interface FormState {
  url?: string;
  file?: File;
}

const Form: React.FC = () => {
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
        <form onSubmit={handleSubmit}>
          <input
            type="checkbox"
            name="upload"
            onChange={(event) => {
              const {
                target: { checked },
              } = event;
              handleChange(event);
              setFileUploadForm(checked);
            }}
            onBlur={handleBlur}
            checked={isFileUpload}
          />
          {isFileUpload && (
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
          )}
          {!isFileUpload && (
            <input
              type="url"
              name="url"
              required={!isFileUpload}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}
            />
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
