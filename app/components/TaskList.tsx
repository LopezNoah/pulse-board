// ~/components/TaskList.tsx

import type { Task } from "~/database/schema";
import { useFetcher } from "react-router"; // Import useFetcher
import { useState, useRef, useEffect } from "react";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [modalTaskId, setModalTaskId] = useState<number | null>(null);
  const [modalTask, setModalTask] = useState<Task | undefined>();

  // Fetchers for different actions
  const titleFetcher = useFetcher();
  const updateFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTaskId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTaskId]);

  // No useEffect for navigation.state needed

  const handleTitleClick = (taskId: number) => {
    setEditingTaskId(taskId);
  };

  const handleTitleBlur = () => {
    //  No need to set to null on blur, we'll let the fetcher submission do it on enter.
  };

  const handleTitleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    taskId: number
  ) => {
    if (event.key === "Enter") {
      const newTitle = inputRef.current?.value;
      if (newTitle) {
        // Use the titleFetcher to submit
        titleFetcher.submit(
          { intent: "updateTitle", id: taskId.toString(), title: newTitle },
          { method: "post" }
        );
        setEditingTaskId(null); // Optimistically close the edit
      }
    } else if (event.key === "Escape") {
      setEditingTaskId(null);
    }
  };

  const openModal = (taskId: number) => {
    setModalTaskId(taskId);
    setModalTask(tasks.find((task) => task.id === taskId));
  };

  const closeModal = () => {
    setModalTaskId(null);
    setModalTask(undefined);
  };

  const cyclePriority = (currentPriority: string): string => {
    const priorities = ["High", "Medium", "Low"];
    const currentIndex = priorities.indexOf(currentPriority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    return priorities[nextIndex];
  };
  // Helper function to check if a fetcher is submitting for a specific task
  const isSubmitting = (fetcher: any, taskId: number) => {
        return fetcher.formData?.get('id') === String(taskId) && fetcher.state !== "idle"
    }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="font-semibold text-lg">To-Do's</h2>
      <ul className="mt-3 space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center">
             <div
              className={`w-1 h-8 mr-3 rounded-sm cursor-pointer ${
                task.priority === "High"
                ? "bg-red-500"
                : task.priority === "Medium"
                ? "bg-yellow-500"
                : "bg-green-500"
              }`}
            ></div>
            {/* Checkbox (visually styled, no functionality) */}
            <div className="w-4 h-4 rounded-md bg-gray-200 mr-3"></div>

            {/* Inline Title Editing */}
            {editingTaskId === task.id ? (
              <input
                ref={inputRef}
                type="text"
                defaultValue={task.title}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => handleTitleKeyDown(e, task.id)}
                className="flex-1 text-sm border rounded p-1"
                disabled={titleFetcher.state !== "idle"}
              />
            ) : (
              <span
                onClick={() => handleTitleClick(task.id)}
                className={`flex-1 text-sm cursor-pointer hover:underline ${isSubmitting(titleFetcher, task.id) ? 'text-gray-400' : ''}`} //disable clicking during submit
              >
                {task.title}
                 {isSubmitting(titleFetcher, task.id) && <span className="ml-1 text-gray-400">(Updating...)</span>} {/* Show loading indicator */}
              </span>
            )}

            {/* Placeholder avatars */}
            <span className="inline-flex items-center gap-1">
              <span className="w-6 h-6 rounded-full bg-gray-300"></span>
              <span className="w-6 h-6 rounded-full bg-gray-300"></span>
              <span className="w-6 h-6 rounded-full bg-gray-300"></span>
            </span>

            {/* Meatballs Menu Button */}
            <button
              onClick={() => openModal(task.id)}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              disabled={isSubmitting(updateFetcher, task.id) || isSubmitting(deleteFetcher, task.id)}
            >
              …
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalTaskId !== null && modalTask && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-25 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            {/* Use Fetcher.Form for the modal */}
            <updateFetcher.Form method="post">
              <input type="hidden" name="id" value={modalTaskId} />
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  defaultValue={modalTask.status}
                  disabled={updateFetcher.state !== "idle"}
                >
                  {["To Do", "In Progress", "Done"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div
                  className={`mt-1 w-8 h-8 rounded-md cursor-pointer ${
                    modalTask.priority === "High"
                      ? "bg-red-500"
                      : modalTask.priority === "Medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  onClick={() => {
                    const nextPriority = cyclePriority(modalTask.priority);
                    setModalTask({ ...modalTask, priority: nextPriority });
                  }}
                ></div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={closeModal}
                   disabled={updateFetcher.state !== "idle"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="update"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                   disabled={updateFetcher.state !== "idle"}
                >
                  Update
                </button>

                {/* Delete Button with its own Fetcher */}
               <deleteFetcher.Form method="post">
                    <input type="hidden" name="id" value={modalTaskId} />
                    <button
                        type="submit"
                        name="intent"
                        value="delete"
                        className="ml-3 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                       disabled={deleteFetcher.state !== "idle"}
                    >
                    Delete
                    </button>
                </deleteFetcher.Form>
              </div>
            </updateFetcher.Form>
          </div>
        </div>
      )}
    </div>
  );
};