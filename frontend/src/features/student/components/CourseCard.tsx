// import React, { useState } from 'react';
// import type { ICourse } from '../../../types/course';

// interface CourseCardProps {
//   course: Pick<
//     ICourse,
//     'title' | 'semester' | 'thumbnail' | 'price' | 'offer' | 'actualPrice' | 'details' | '_id'
//   >;
//   isPurchased: boolean;
//   onExplore: (id: string) => void;
//   onGoToCourse: (id: string) => void;
// }

// const CourseCard: React.FC<CourseCardProps> = ({
//   course,
//   isPurchased,
//   onExplore,
//   onGoToCourse,
// }) => {
//   const {
//     // _id,
//     title,
//     semester,
//     thumbnail,
//     details = '',
//     price,
//     offer,
//     actualPrice,
//   } = course;

//   const [expanded, setExpanded] = useState(false);
//   const maxChars = 100;
//   const isLong = details.length > maxChars;
//   const displayText = isLong && !expanded ? details.slice(0, maxChars) + '...' : details;

//   return (
//     <div className="flex flex-col overflow-hidden rounded-lg border shadow-sm">
//       {/* Thumbnail */}
//       {thumbnail && (
//         <img src={thumbnail} alt={`${title} thumbnail`} className="h-48 w-full object-cover" />
//       )}

//       <div className="flex flex-1 flex-col p-4">
//         {/* Semester badge */}
//         <span className="self-end rounded-full bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-700">
//           Semester {semester}
//         </span>

//         {/* Title & Details */}
//         <h2 className="mt-2 text-lg font-semibold">{title}</h2>
//         <p className="mt-2 flex-1 text-sm text-gray-600">{displayText}</p>
//         {isLong && (
//           <button
//             onClick={() => setExpanded((e) => !e)}
//             className="mt-1 text-sm text-blue-600 focus:outline-none"
//           >
//             {expanded ? 'Show less' : 'Read more'}
//           </button>
//         )}

//         {/* Pricing */}
//         <div className="mt-4">
//           {offer ? (
//             <div className="flex items-baseline space-x-2">
//               <span className="text-sm text-gray-500 line-through">₹{price}</span>
//               <span className="text-lg font-bold text-indigo-600">₹{actualPrice}</span>
//             </div>
//           ) : (
//             <span className="text-lg font-bold text-indigo-600">₹{price}</span>
//           )}
//         </div>

//         {isPurchased ? (
//           <button
//             onClick={() => onGoToCourse(course._id)}
//             className="mt-4 w-full rounded bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700"
//           >
//             Go to Course
//           </button>
//         ) : (
//           <button
//             onClick={() => onExplore(course._id)}
//             className="mt-4 w-full rounded bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//           >
//             Explore
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseCard;
import React, { useState } from 'react';
import type { ICourse } from '../../../types/course';

interface CourseCardProps {
  course: Pick<
    ICourse,
    'title' | 'semester' | 'thumbnail' | 'price' | 'offer' | 'actualPrice' | 'details' | '_id'
  >;
  isPurchased: boolean;
  onExplore: (id: string) => void;
  onGoToCourse: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isPurchased,
  onExplore,
  onGoToCourse,
}) => {
  const {
    // _id,
    title,
    semester,
    thumbnail,
    details = '',
    price,
    offer,
    actualPrice,
  } = course;

  const [expanded, setExpanded] = useState(false);
  const maxChars = 100;
  const isLong = details.length > maxChars;
  const displayText = isLong && !expanded ? details.slice(0, maxChars) + '...' : details;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm">
      {/* Thumbnail */}
      {thumbnail && (
        <div className="h-48 w-full overflow-hidden sm:h-56 md:h-64">
          <img
            src={thumbnail}
            alt={`${title} thumbnail`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Semester badge */}
        <span className="self-end rounded-full bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-700">
          Semester {semester}
        </span>

        {/* Title & Details */}
        <h2 className="mt-2 text-base sm:text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 break-words">
          {displayText}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 inline-block text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded px-1 py-0.5"
            aria-expanded={expanded}
            aria-controls={`details-${course._id}`}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Pricing */}
        <div className="mt-4">
          {offer ? (
            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-gray-500 line-through">₹{actualPrice}</span>
              <span className="text-lg font-bold text-indigo-600">₹{price}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-indigo-600">₹{price}</span>
          )}
        </div>

        {isPurchased ? (
          <button
            onClick={() => onGoToCourse(course._id)}
            className="mt-4 w-full rounded bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            aria-label={`Go to course ${title}`}
          >
            Go to Course
          </button>
        ) : (
          <button
            onClick={() => onExplore(course._id)}
            className="mt-4 w-full rounded bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label={`Explore ${title}`}
          >
            Explore
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
