import { ApiError, UserUpdateError } from "@/types";

const ErrorDisplay = ({
  isError,
  error,
}: {
  isError: boolean;
  error: ApiError<UserUpdateError> | null;
}) => {
  if (!isError) return null;

  return (
    <div className="w-full">
      <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-2xl shadow-md border border-red-200 dark:border-red-700 font-sans text-sm leading-relaxed break-words transition-colors duration-300 ease-in-out">
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-600 dark:text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <strong className="text-red-900 dark:text-red-100">Error</strong>
        </div>

        {error?.response?.data?.error &&
        Array.isArray(error.response.data.error) ? (
          <ul className="space-y-1">
            {error.response.data.error.map((err, index) => (
              <li
                key={index}
                className="bg-red-50 dark:bg-red-800 p-2 rounded border border-red-200 dark:border-red-700"
              >
                <strong className="text-red-700 dark:text-red-300 mr-2">
                  {err.field}:
                </strong>
                <span className="text-red-600 dark:text-red-200">
                  {err.message}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="bg-red-50 dark:bg-red-800 p-2 rounded border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200">
            {(error?.response?.data?.message &&
              error.response?.data?.message) ||
              "An unexpected error occurred"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
