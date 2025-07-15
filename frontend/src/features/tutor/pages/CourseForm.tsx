// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { AppDispatch, RootState } from '../../../redux/store';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   createCourseThunk,
//   updateCourseThunk,
// } from '../../../redux/slices/courseSlice';
// import { IMAGE_BASE } from '../../../constants/api';

// const CourseForm = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const existingCourse = useSelector((state: RootState) =>
//     state.courses.courses.find((c) => c._id === id)
//   );

//   const [formData, setFormData] = useState({
//     title: '',
//     code: '',
//     semester: '',
//     price: '',
//     offer: '',
//     actualPrice: '',
//     details: '',
//   });

//   const [thumbnail, setThumbnail] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     if (existingCourse) {
//        console.log(existingCourse.thumbnail);
//       setFormData({
//         title: existingCourse.title,
//         code: existingCourse.code,
//         semester: existingCourse.semester.toString(),
//         price: existingCourse.price.toString(),
//         offer: existingCourse.offer?.toString() || '',
//         actualPrice: existingCourse.actualPrice?.toString() || '',
//         details: existingCourse.details || '',
//       });
//       setPreviewUrl(`${IMAGE_BASE}/courses/${existingCourse.thumbnail}`);

//     }
//   }, [existingCourse]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setThumbnail(file);
//       setPreviewUrl(URL.createObjectURL(file));
//       setFormErrors((prev) => ({ ...prev, thumbnail: '' }));
//     }
//   };

//   const validateForm = () => {
//     const errors: { [key: string]: string } = {};

//     if (!formData.title.trim()) errors.title = 'Title is required';
//     if (!formData.code.trim()) errors.code = 'Code is required';
//     if (!formData.semester.trim()) errors.semester = 'Semester is required';
//     if (!formData.price.trim()) errors.price = 'Price is required';
//     if (!formData.details.trim()) errors.details = 'Details are required';
//     if (!id && !thumbnail) errors.thumbnail = 'Thumbnail is required';

//     return errors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     const data = new FormData()
//     Object.entries(formData).forEach(([key, value]) => data.append(key, value));
//     if (thumbnail) data.append('thumbnail', thumbnail);

//     if (id) {
//       await dispatch(updateCourseThunk({ id, data }));
//     } else {
//       await dispatch(createCourseThunk(data));
//     }

//     navigate('/tutor/course');
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Course' : 'Add Course'}</h2>
//       <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
//         <div>
//           <input
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Title"
//             className="border p-2 w-full"
//           />
//           {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
//         </div>

//         <div>
//           <input
//             name="code"
//             value={formData.code}
//             onChange={handleChange}
//             placeholder="Code"
//             className="border p-2 w-full"
//           />
//           {formErrors.code && <p className="text-red-500 text-sm">{formErrors.code}</p>}
//         </div>

//         <div>
//           <input
//             name="semester"
//             value={formData.semester}
//             onChange={handleChange}
//             placeholder="Semester"
//             className="border p-2 w-full"
//           />
//           {formErrors.semester && <p className="text-red-500 text-sm">{formErrors.semester}</p>}
//         </div>

//         <div>
//           <input
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             placeholder="Price"
//             className="border p-2 w-full"
//           />
//           {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
//         </div>

//         <div>
//           <input
//             name="offer"
//             value={formData.offer}
//             onChange={handleChange}
//             placeholder="Offer"
//             className="border p-2 w-full"
//           />
//         </div>

//         <div>
//           <input
//             name="actualPrice"
//             value={formData.actualPrice}
//             onChange={handleChange}
//             placeholder="Actual Price"
//             className="border p-2 w-full"
//           />
//         </div>

//         <div className="col-span-2">
//           <textarea
//             name="details"
//             value={formData.details}
//             onChange={handleChange}
//             placeholder="Details"
//             className="border p-2 w-full"
//           />
//           {formErrors.details && <p className="text-red-500 text-sm">{formErrors.details}</p>}
//         </div>

//         <div className="col-span-2">
//           <label className="block mb-1 font-medium">Thumbnail:</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="mb-2"
//           />
//           {formErrors.thumbnail && <p className="text-red-500 text-sm">{formErrors.thumbnail}</p>}
//           {previewUrl && <img src={previewUrl} alt="Preview" className="w-40 h-auto border" />}
//         </div>

//         <div className="col-span-2 flex gap-4">
//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//             {id ? 'Update' : 'Save'}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate('/tutor/course')}
//             className="bg-gray-300 px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CourseForm;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseById,
  getUploadUrl,
  createCourse,
  updateCourse,
  getDemoUploadUrl,
} from "../services/TutorApi";
import type { ICourse } from "../../../types/course";
import type { CoursePayload } from "../services/TutorApi";
import type { AxiosError } from "axios";
export default function AddEditCoursePage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    code: "",
    semester: "",
    price: "",
    offer: "",
    actualPrice: "",
    details: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [previewDemoUrl, setPreviewDemoUrl] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCourseById(id)
      .then((c: ICourse) => {
        setForm({
          title: c.title,
          code: c.code,
          semester: String(c.semester),
          price: String(c.price),
          offer: String(c.offer ?? ""),
          actualPrice: String(c.actualPrice ?? ""),
          details: c.details ?? "",
        });
        if (c.thumbnail) {
          setPreviewUrl(c.thumbnail);
        }
        if (c.demoVideoUrl) {
          setPreviewDemoUrl(c.demoVideoUrl);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleDemoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const f = e.target.files[0];
    setDemoFile(f);
    const url = URL.createObjectURL(f);
    setPreviewDemoUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageKey: string | undefined;
      let demoKey: string | undefined;

      if (file) {
        const { uploadUrl, key } = await getUploadUrl(file.name, file.type);
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        imageKey = key;
      }

      if (demoFile) {
        const { uploadUrl, key } = await getDemoUploadUrl(
          demoFile.name,
          demoFile.type
        );
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": demoFile.type },
          body: demoFile,
        });
        demoKey = key;
      }
      const payload: CoursePayload = {
        title: form.title,
        code: form.code,
        semester: Number(form.semester),
        price: Number(form.price),
        offer: form.offer ? Number(form.offer) : undefined,
        actualPrice: form.actualPrice ? Number(form.actualPrice) : undefined,
        details: form.details || undefined,
        imageKey,
        demoKey,
      };

      if (id) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }

      navigate("/tutor/courses");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || axiosError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">{id ? "Edit Course" : "Add Course"}</h1>

      {error && <div className="mb-4 text-red-600">Error: {error}</div>}

      {loading && !id ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border p-2 rounded"
            />
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Code"
              required
              className="border p-2 rounded"
            />
            <input
              name="semester"
              type="number"
              value={form.semester}
              onChange={handleChange}
              placeholder="Semester"
              className="border p-2 rounded"
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded"
            />
            <input
              name="offer"
              type="number"
              value={form.offer}
              onChange={handleChange}
              placeholder="Offer"
              className="border p-2 rounded"
            />
            <input
              name="actualPrice"
              type="number"
              value={form.actualPrice}
              onChange={handleChange}
              placeholder="Actual Price"
              className="border p-2 rounded"
            />
          </div>

          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Details"
            rows={3}
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="block mb-1">Thumbnail:</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 max-w-xs border"
              />
            )}
          </div>
          <div>
            <label className="block mb-1">Demo:</label>
            <input type="file" accept="video/*" onChange={handleDemoFile} />
            {previewDemoUrl && (
              <video
                src={previewDemoUrl}
                controls
                className="mt-2 max-w-xs border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading
              ? id
                ? "Updating…"
                : "Saving…"
              : id
              ? "Update Course"
              : "Create Course"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/tutor/courses")}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
