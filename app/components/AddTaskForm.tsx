// ~/components/AddTaskForm.tsx
import { Form } from "react-router";
export const AddTaskForm: React.FC = () => {
    return (
        <>
            <h2 className="mt-6 font-semibold text-lg">Add Task</h2>
            <Form method="post" className="mt-2 space-y-2">
                <input type="text" name="title" placeholder="Task Name" required className="w-full border p-2 rounded" />
                <select name="priority" className="w-full border p-2 rounded">
                    <option value="High">🔥 High</option>
                    <option value="Medium">⚡ Medium</option>
                    <option value="Low">🟢 Low</option>
                </select>
                <button type="submit" name="intent" value="add" className="w-full bg-green-500 text-white py-2 rounded">
                    ➕ Add Task
                </button>
            </Form>
        </>
    )
}