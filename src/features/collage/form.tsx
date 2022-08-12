import { Formik } from "formik";
import React from "react";
import { useGifMessage } from "../upload/useGifMessage";
import { isValidDomain } from "./util";

interface FormState {
  url: string;
}

const Form: React.FC = () => {
  const { sendGif } = useGifMessage();

  return (
    <Formik<FormState>
      initialValues={{
        url: "",
      }}
      validate={(values) => {
        const errors: Record<string, string> = {};
        if (!isValidDomain(values.url)) errors.url = "Invalid URL";
        if (!values.url.includes(".gif"))
          errors.url = "Input supports .gif format only";
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          await sendGif(values.url);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            name="url"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.url}
          />
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
