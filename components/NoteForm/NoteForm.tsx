// 'use client';

// import css from './NoteForm.module.css';
// import { useId } from 'react';
// import { Formik, Form, Field, type FormikHelpers, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createNote } from '@/lib/api';

// interface NoteFormProps {
//   onClose?: () => void;
// }

// interface NoteFormValues {
//   title: string;
//   content: string;
//   tag: string;
// }

// const initialValues: NoteFormValues = {
//   title: '',
//   content: '',
//   tag: 'Todo',
// };

// const NoteFormSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, 'Title must be at least 3 characters')
//     .max(50, 'Title is too long')
//     .required('Title is required'),
//   content: Yup.string().max(500, 'Content is too long'),
//   tag: Yup.string()
//     .oneOf(
//       ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
//       'Invalid tag value',
//     )
//     .required('Tag is required'),
// });

// export default function NoteForm({ onClose }: NoteFormProps) {
//   const fieldId = useId();
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: createNote,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notes'] });
//       onClose?.();
//     },
//   });

//   const handleSubmit = (
//     values: NoteFormValues,
//     actions: FormikHelpers<NoteFormValues>,
//   ) => {
//     mutation.mutate(values);
//     actions.resetForm();
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       onSubmit={handleSubmit}
//       validationSchema={NoteFormSchema}
//     >
//       <Form className={css.form}>
//         <fieldset>
//           <div className={css.formGroup}>
//             <label htmlFor={`${fieldId}-title`}>Title</label>
//             <Field
//               id={`${fieldId}-title`}
//               type="text"
//               name="title"
//               className={css.input}
//             />
//             <ErrorMessage name="title" component="span" className={css.error} />
//           </div>

//           <div className={css.formGroup}>
//             <label htmlFor={`${fieldId}-content`}>Content</label>
//             <Field
//               id={`${fieldId}-content`}
//               name="content"
//               rows={8}
//               className={css.textarea}
//               as="textarea"
//             />
//             <ErrorMessage
//               name="content"
//               component="span"
//               className={css.error}
//             />
//           </div>

//           <div className={css.formGroup}>
//             <label htmlFor={`${fieldId}-tag`}>Tag</label>
//             <Field
//               id={`${fieldId}-tag`}
//               name="tag"
//               as="select"
//               className={css.select}
//             >
//               <option value="Todo">Todo</option>
//               <option value="Work">Work</option>
//               <option value="Personal">Personal</option>
//               <option value="Meeting">Meeting</option>
//               <option value="Shopping">Shopping</option>
//             </Field>
//             <ErrorMessage name="tag" component="span" className={css.error} />
//           </div>

//           <div className={css.actions}>
//             <button
//               type="button"
//               className={css.cancelButton}
//               onClick={onClose}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className={css.submitButton}
//               disabled={mutation.isPending}
//             >
//               {mutation.isPending ? 'Creating note...' : 'Create note'}
//             </button>
//           </div>
//         </fieldset>
//       </Form>
//     </Formik>
//   );
// }

'use client';

import css from './NoteForm.module.css';
import { useId } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteDraftStore } from '@/lib/store/noteStore';

interface NoteFormProps {
  onClose?: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long')
    .required('Title is required'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const draft = useNoteDraftStore((state) => state.draft);
  const setDraft = useNoteDraftStore((state) => state.setDraft);
  const clearDraft = useNoteDraftStore((state) => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      onClose?.();
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    mutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={draft}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, handleChange }) => (
        <Form className={css.form}>
          <fieldset>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field
                id={`${fieldId}-title`}
                name="title"
                type="text"
                className={css.input}
                value={values.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setDraft({ ...values, title: e.target.value });
                }}
              />
              <ErrorMessage name="title" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-content`}>Content</label>
              <Field
                id={`${fieldId}-content`}
                name="content"
                as="textarea"
                rows={8}
                className={css.textarea}
                value={values.content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  handleChange(e);
                  setDraft({ ...values, content: e.target.value });
                }}
              />
              <ErrorMessage name="content" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-tag`}>Tag</label>
              <Field
                id={`${fieldId}-tag`}
                name="tag"
                as="select"
                className={css.select}
                value={values.tag}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(e);
                  setDraft({ ...values, tag: e.target.value });
                }}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={css.submitButton}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Creating note...' : 'Create note'}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
}