import React, { useState } from "react";
import type { ICourse } from "../../../types/course";

interface CourseCardProps {
  course: Pick<
    ICourse,
    | "title"
    | "semester"
    | "thumbnail"
    | "price"
    | "offer"
    | "actualPrice"
    | "details"
    | "_id"
  >;
   isPurchased: boolean;
  onExplore: (id: string) => void;
  onGoToCourse: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isPurchased,
  onExplore,
  onGoToCourse, }) => {
  const {
    // _id,
    title,
    semester,
    thumbnail,
    details="",
    price,
    offer,
    actualPrice,
  } = course;

   const [expanded, setExpanded] = useState(false);
  const maxChars = 100;
  const isLong = details.length > maxChars;
  const displayText = isLong && !expanded
    ? details.slice(0, maxChars) + "..."
    : details;

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Thumbnail */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt={`${title} thumbnail`}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="p-4 flex-1 flex flex-col">
        {/* Semester badge */}
        <span className="self-end bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full uppercase">
          Semester {semester}
        </span>

        {/* Title & Details */}
        <h2 className="mt-2 font-semibold text-lg">{title}</h2>
         <p className="mt-2 text-sm text-gray-600 flex-1">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-1 text-blue-600 text-sm focus:outline-none"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Pricing */}
        <div className="mt-4">
          {offer ? (
            <div className="flex items-baseline space-x-2">
              <span className="text-gray-500 line-through text-sm">
                ₹{price}
              </span>
              <span className="text-lg font-bold text-indigo-600">
                ₹{actualPrice}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-indigo-600">₹{price}</span>
          )}
        </div>

        {/* Explore button */}
        {/* <button
          onClick={() => onExplore(_id)}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium"
        >
          Explore
        </button> */}

        {isPurchased ? (
          <button
            onClick={() => onGoToCourse(course._id)}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium"
          >
            Go to Course
          </button>
        ) : (
          <button
            onClick={() => onExplore(course._id)}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium"
          >
            Explore
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
