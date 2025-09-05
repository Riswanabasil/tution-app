// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   getCourseById,
//   getUploadUrl,
//   createCourse,
//   updateCourse,
//   getDemoUploadUrl,
// } from '../services/TutorApi';
// import type { ICourse } from '../../../types/course';
// import type { CoursePayload } from '../services/TutorApi';
// import type { AxiosError } from 'axios';

// export default function AddEditCoursePage() {
//   const { id } = useParams<{ id?: string }>();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     code: '',
//     semester: '',
//     price: '',
//     offer: '',
//     actualPrice: '',
//     details: '',
//   });

//   const [file, setFile] = useState<File | null>(null);
//   const [demoFile, setDemoFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | undefined>();
//   const [previewDemoUrl, setPreviewDemoUrl] = useState<string | undefined>();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     getCourseById(id)
//       .then((c: ICourse) => {
//         setFormData({
//           title: c.title,
//           code: c.code,
//           semester: c.semester.toString(),
//           price: c.price.toString(),
//           offer: c.offer?.toString() || '',
//           actualPrice: c.actualPrice?.toString() || '',
//           details: c.details || '',
//         });
//         setPreviewUrl(c.thumbnail);
//         setPreviewDemoUrl(c.demoVideoUrl);
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       let imageKey: string | undefined;
//       let demoKey: string | undefined;

//       if (file) {
//         const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
//         await fetch(uploadUrl, {
//           method: 'PUT',
//           headers: { 'Content-Type': file.type },
//           body: file,
//         });
//         imageKey = key;
//       }

//       if (demoFile) {
//         const { uploadUrl, key } = await getDemoUploadUrl(demoFile.name, demoFile.type);
//         await fetch(uploadUrl, {
//           method: 'PUT',
//           headers: { 'Content-Type': demoFile.type },
//           body: demoFile,
//         });
//         demoKey = key;
//       }

//       const payload: CoursePayload = {
//         title: formData.title,
//         code: formData.code,
//         semester: Number(formData.semester),
//         price: Number(formData.price),
//         offer: formData.offer ? Number(formData.offer) : undefined,
//         actualPrice: formData.actualPrice ? Number(formData.actualPrice) : undefined,
//         details: formData.details || undefined,
//         imageKey,
//         demoKey,
//       };

//       if (id) {
//         await updateCourse(id, payload);
//       } else {
//         await createCourse(payload);
//       }

//       navigate('/tutor/courses');
//     } catch (err: unknown) {
//       const axiosError = err as AxiosError<{ message: string }>;
//       setError(axiosError.response?.data?.message || axiosError.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto mt-6 max-w-4xl space-y-6 rounded-xl bg-white p-6 shadow-md">
//       <h1 className="text-3xl font-bold text-gray-800">{id ? 'Edit Course' : 'Add Course'}</h1>

//       {error && <div className="font-medium text-red-600">{error}</div>}

//       <div className="grid gap-6 md:grid-cols-2">
//         <input
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Course Title"
//           className="w-full rounded-lg border px-4 py-2"
//         />
//         <input
//           name="code"
//           value={formData.code}
//           onChange={handleChange}
//           placeholder="Course Code"
//           className="w-full rounded-lg border px-4 py-2"
//         />
//         <input
//           name="semester"
//           value={formData.semester}
//           onChange={handleChange}
//           placeholder="Semester"
//           className="w-full rounded-lg border px-4 py-2"
//         />
//         <input
//           name="price"
//           value={formData.price}
//           onChange={handleChange}
//           placeholder="Price"
//           className="w-full rounded-lg border px-4 py-2"
//         />
//         <input
//           name="offer"
//           value={formData.offer}
//           onChange={handleChange}
//           placeholder="Offer (Optional)"
//           className="w-full rounded-lg border px-4 py-2"
//         />
//         <input
//           name="actualPrice"
//           value={formData.actualPrice}
//           onChange={handleChange}
//           placeholder="Actual Price (Optional)"
//           className="w-full rounded-lg border px-4 py-2"
//         />
//       </div>

//       <textarea
//         name="details"
//         value={formData.details}
//         onChange={handleChange}
//         placeholder="Course Details"
//         rows={4}
//         className="w-full rounded-lg border px-4 py-2"
//       />

//       <div>
//         <label className="font-semibold">Upload Thumbnail</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             if (e.target.files?.[0]) {
//               setFile(e.target.files[0]);
//               setPreviewUrl(URL.createObjectURL(e.target.files[0]));
//             }
//           }}
//         />
//         {previewUrl && (
//           <img src={previewUrl} alt="Thumbnail" className="mt-2 w-48 rounded border" />
//         )}
//       </div>

//       <div>
//         <label className="font-semibold">Upload Demo Video</label>
//         <input
//           type="file"
//           accept="video/*"
//           onChange={(e) => {
//             if (e.target.files?.[0]) {
//               setDemoFile(e.target.files[0]);
//               setPreviewDemoUrl(URL.createObjectURL(e.target.files[0]));
//             }
//           }}
//         />
//         {previewDemoUrl && (
//           <video src={previewDemoUrl} controls className="mt-2 w-full max-w-md rounded border" />
//         )}
//       </div>

//       <div className="flex gap-4">
//         <button
//           onClick={onSubmit}
//           disabled={loading}
//           className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
//         >
//           {loading ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
//         </button>
//         <button
//           onClick={() => navigate('/tutor/courses')}
//           className="rounded bg-gray-300 px-6 py-2 text-gray-700"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCourseById,
  getUploadUrl,
  createCourse,
  updateCourse,
  getDemoUploadUrl,
} from '../services/TutorApi';
import type { ICourse } from '../../../types/course';
import type { CoursePayload } from '../services/TutorApi';
import type { AxiosError } from 'axios';
import * as yup from 'yup';

const asNum = (msg: string) =>
  yup
    .number()
    .transform((o) => (o === '' || o === null || typeof o === 'undefined' ? undefined : Number(o)))
    .typeError(msg);

const imageFileSchema = yup
  .mixed<File>()
  .nullable()
  .test(
    'type',
    'Thumbnail must be JPEG/PNG/WebP',
    (f) => !f || ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
  )
  .test('size', 'Thumbnail must be ≤ 2MB', (f) => !f || f.size <= 2 * 1024 * 1024);

const videoFileSchema = yup
  .mixed<File>()
  .nullable()
  .test('type', 'Demo must be MP4/WebM', (f) => !f || ['video/mp4', 'video/webm'].includes(f.type))
  .test('size', 'Demo must be ≤ 50MB', (f) => !f || f.size <= 50 * 1024 * 1024);

const courseSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(10, 'Title can be at most 10 characters')
    .required('Title is required'),
  code: yup
    .string()
    .trim()
    .matches(/^[A-Za-z0-9-_]+$/, 'Only letters, numbers, "-" and "_" allowed')
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code can be at most 20 characters')
    .required('Code is required'),
  semester: asNum('Semester must be a number')
    .integer('Semester must be an integer')
    .min(1, 'Minimum semester is 1')
    .max(8, 'Maximum semester is 8')
    .required('Semester is required'),
  price: asNum('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  offer: asNum('Offer must be a number')
    .min(0, 'Offer cannot be negative')
    .max(500, 'Offer looks too high')
    .notRequired(),
  actualPrice: asNum('Actual price must be a number')
    .test('gte-price', 'Actual price must be ≥ Price', function (value) {
      const price = this.parent.price as number | undefined;
      if (value === undefined || price === undefined) return true;
      return value >= price;
    })
    .notRequired(),
  details: yup.string().max(2000, 'Details can be at most 2000 characters').notRequired(),

  file: imageFileSchema.when('$isEdit', {
    is: false,
    then: (s) => s.test('required', 'Thumbnail is required', (f) => !!f),
  }),
  demoFile: videoFileSchema,
});

export default function AddEditCoursePage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    semester: '',
    price: '',
    offer: '',
    actualPrice: '',
    details: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [previewDemoUrl, setPreviewDemoUrl] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCourseById(id)
      .then((c: ICourse) => {
        setFormData({
          title: c.title,
          code: c.code,
          semester: c.semester.toString(),
          price: c.price.toString(),
          offer: c.offer?.toString() || '',
          actualPrice: c.actualPrice?.toString() || '',
          details: c.details || '',
        });
        setPreviewUrl(c.thumbnail);
        setPreviewDemoUrl(c.demoVideoUrl);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const clone = { ...prev };
        delete clone[name];
        return clone;
      });
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await courseSchema.validate(
        {
          ...formData,
          file,
          demoFile,
        },
        { abortEarly: false, context: { isEdit } },
      );

      let imageKey: string | undefined;
      let demoKey: string | undefined;

      if (file) {
        const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        imageKey = key;
      }

      if (demoFile) {
        const { uploadUrl, key } = await getDemoUploadUrl(demoFile.name, demoFile.type);
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': demoFile.type },
          body: demoFile,
        });
        demoKey = key;
      }

      const payload: CoursePayload = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        semester: Number(formData.semester),
        price: Number(formData.price),
        offer: formData.offer ? Number(formData.offer) : undefined,
        actualPrice: formData.actualPrice ? Number(formData.actualPrice) : undefined,
        details: formData.details || undefined,
        imageKey,
        demoKey,
      };

      if (id) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }

      navigate('/tutor/courses');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'inner' in (err as any)) {
        const yupErr = err as yup.ValidationError;
        const fe: Record<string, string> = {};
        yupErr.inner.forEach((e) => {
          if (e.path && !fe[e.path]) fe[e.path] = e.message;
        });
        setFieldErrors(fe);
      } else {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError?.response?.data?.message || axiosError?.message || 'Something went wrong',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl space-y-6 rounded-xl bg-white p-6 shadow-md">
      <h1 className="text-3xl font-bold text-gray-800">{id ? 'Edit Course' : 'Add Course'}</h1>

      {error && <div className="font-medium text-red-600">{error}</div>}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Course Title"
            className="w-full rounded-lg border px-4 py-2"
          />
          {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
        </div>

        <div>
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Course Code"
            className="w-full rounded-lg border px-4 py-2"
          />
          {fieldErrors.code && <p className="mt-1 text-sm text-red-600">{fieldErrors.code}</p>}
        </div>

        <div>
          <input
            name="semester"
            type="number"
            min={1}
            max={8}
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester (1-8)"
            className="w-full rounded-lg border px-4 py-2"
          />
          {fieldErrors.semester && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.semester}</p>
          )}
        </div>

        <div>
          <input
            name="price"
            type="number"
            min={0}
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded-lg border px-4 py-2"
          />
          {fieldErrors.price && <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>}
        </div>

        <div>
          <input
            name="offer"
            type="number"
            min={0}
            max={90}
            step="0.01"
            value={formData.offer}
            onChange={handleChange}
            placeholder="Offer % (Optional)"
            className="w-full rounded-lg border px-4 py-2"
          />
          {fieldErrors.offer && <p className="mt-1 text-sm text-red-600">{fieldErrors.offer}</p>}
        </div>

        <div>
          <input
            name="actualPrice"
            type="number"
            min={0}
            step="0.01"
            value={formData.actualPrice}
            onChange={handleChange}
            placeholder="Actual Price (Optional)"
            className="w-full rounded-lg border px-4 py-2"
          />
          {fieldErrors.actualPrice && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.actualPrice}</p>
          )}
        </div>
      </div>

      <div>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="Course Details"
          rows={4}
          className="w-full rounded-lg border px-4 py-2"
        />
        {fieldErrors.details && <p className="mt-1 text-sm text-red-600">{fieldErrors.details}</p>}
      </div>

      <div>
        <label className="font-semibold">Upload Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            if (f) setPreviewUrl(URL.createObjectURL(f));
            setFieldErrors((p) => {
              const c = { ...p };
              delete c.file;
              return c;
            });
          }}
        />
        {fieldErrors.file && <p className="mt-1 text-sm text-red-600">{fieldErrors.file}</p>}
        {previewUrl && (
          <img src={previewUrl} alt="Thumbnail" className="mt-2 w-48 rounded border" />
        )}
      </div>

      <div>
        <label className="font-semibold">Upload Demo Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setDemoFile(f);
            if (f) setPreviewDemoUrl(URL.createObjectURL(f));
            setFieldErrors((p) => {
              const c = { ...p };
              delete c.demoFile;
              return c;
            });
          }}
        />
        {fieldErrors.demoFile && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.demoFile}</p>
        )}
        {previewDemoUrl && (
          <video src={previewDemoUrl} controls className="mt-2 w-full max-w-md rounded border" />
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
        </button>
        <button
          onClick={() => navigate('/tutor/courses')}
          className="rounded bg-gray-300 px-6 py-2 text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
