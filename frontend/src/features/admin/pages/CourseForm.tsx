import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCourseThunk,
  updateCourseThunk,
} from '../../../redux/slices/courseSlice';
import { IMAGE_BASE } from '../../../constants/api';


const CourseForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();

  const existingCourse = useSelector((state: RootState) =>
    state.courses.courses.find((c) => c._id === id)
  );

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    semester: '',
    price: '',
    offer: '',
    actualPrice: '',
    details: '',
  });

       

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (existingCourse) {
       console.log(existingCourse.thumbnail);
      setFormData({
        title: existingCourse.title,
        code: existingCourse.code,
        semester: existingCourse.semester.toString(),
        price: existingCourse.price.toString(),
        offer: existingCourse.offer?.toString() || '',
        actualPrice: existingCourse.actualPrice?.toString() || '',
        details: existingCourse.details || '',
      });
      setPreviewUrl(`${IMAGE_BASE}/courses/${existingCourse.thumbnail}`);

      
    }
  }, [existingCourse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormErrors((prev) => ({ ...prev, thumbnail: '' }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.code.trim()) errors.code = 'Code is required';
    if (!formData.semester.trim()) errors.semester = 'Semester is required';
    if (!formData.price.trim()) errors.price = 'Price is required';
    if (!formData.details.trim()) errors.details = 'Details are required';
    if (!id && !thumbnail) errors.thumbnail = 'Thumbnail is required';

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (thumbnail) data.append('thumbnail', thumbnail);

    if (id) {
      await dispatch(updateCourseThunk({ id, data }));
    } else {
      await dispatch(createCourseThunk(data));
    }

    navigate('/admin/courses');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Course' : 'Add Course'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 w-full"
          />
          {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
        </div>

       
        <div>
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Code"
            className="border p-2 w-full"
          />
          {formErrors.code && <p className="text-red-500 text-sm">{formErrors.code}</p>}
        </div>

        
        <div>
          <input
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            className="border p-2 w-full"
          />
          {formErrors.semester && <p className="text-red-500 text-sm">{formErrors.semester}</p>}
        </div>

        <div>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 w-full"
          />
          {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
        </div>

      
        <div>
          <input
            name="offer"
            value={formData.offer}
            onChange={handleChange}
            placeholder="Offer"
            className="border p-2 w-full"
          />
        </div>

        
        <div>
          <input
            name="actualPrice"
            value={formData.actualPrice}
            onChange={handleChange}
            placeholder="Actual Price"
            className="border p-2 w-full"
          />
        </div>

        
        <div className="col-span-2">
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Details"
            className="border p-2 w-full"
          />
          {formErrors.details && <p className="text-red-500 text-sm">{formErrors.details}</p>}
        </div>

        
        <div className="col-span-2">
          <label className="block mb-1 font-medium">Thumbnail:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />
          {formErrors.thumbnail && <p className="text-red-500 text-sm">{formErrors.thumbnail}</p>}
          {previewUrl && <img src={previewUrl} alt="Preview" className="w-40 h-auto border" />}
        </div>

       
        <div className="col-span-2 flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {id ? 'Update' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
