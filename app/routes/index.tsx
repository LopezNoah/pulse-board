import * as schema from "~/database/schema";
import type { Route } from "./+types/index";
import { Form, redirect } from "react-router";
import { eq } from "drizzle-orm";
import { getCurrentPhase, getNextPhase } from "~/utils/phaseHelpers";
import { ActivityList } from "~/components/ActivityList";
import { AddTaskForm } from "~/components/AddTaskForm";
import { ProjectProgress } from "~/components/ProjectProgress";
import { TaskList } from "~/components/TaskList";
import * as Effect from "effect/Effect";
import * as Either from "effect/Either";
import * as S from "effect/Schema";
// import * as S from "@effect/schema/Schema";

export async function loader({ context }: Route.LoaderArgs) {
  const project = await context.db.query.projects.findFirst({
    with: {
      phases: { orderBy: (phases, { asc }) => [asc(phases.order)]},
      tasks: true,
      activities: true,
    },
  });

  return { project };
}

const AddTaskSchema = S.Struct({
  intent: S.Literal("add"),
  title: S.String,  // Corrected: S.String
  priority: S.String, // Corrected: S.String
  projectId: S.Number, // Corrected: S.Number
});

const UpdateTaskStatusSchema = S.Struct({
  intent: S.Literal("update"),
  id: S.NumberFromString, // Corrected: S.NumberFromString
  status: S.String,        // Corrected: S.String
});

const UpdateTaskTitleSchema = S.Struct({
    intent: S.Literal("updateTitle"),
    id: S.NumberFromString,   // Corrected: S.NumberFromString
    title: S.String            // Corrected: S.String
});


const DeleteTaskSchema = S.Struct({
  intent: S.Literal("delete"),
  id: S.NumberFromString, // Corrected: S.NumberFromString
});

const formDataSchema = S.Union(
  AddTaskSchema,
  UpdateTaskStatusSchema,
  UpdateTaskTitleSchema,
  DeleteTaskSchema
);

type FormDataValues = typeof formDataSchema.Type;
function parseFormData(formData: FormData): FormDataValues {
  const intent = formData.get("intent");

  if (intent === null) {
      throw new Error("Intent is required");
  }

  if (intent === "add") {
      const title = formData.get("title") as string;
      const priority = formData.get("priority") as string;
      if (title === null || priority === null) {
          throw new Error("Title and priority are required for adding a task");
      }
      return {
          intent,
          title,
          priority,
          projectId: 1, // Replace with route id
      };
  }

  if (intent === "update") {
      const id = formData.get("id") as string;
      const status = formData.get("status") as string;
      if (id === null || status === null) {
          throw new Error("ID and status are required for updating a task");
      }
      const parsedId = parseInt(id, 10);
       if (isNaN(parsedId)) {
          throw new Error("Invalid id");
       }
      return {
          intent,
          id: parsedId,
          status,
      };
  }
  if (intent === "updateTitle") {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    if(id === null || title === null) {
      throw new Error("Id and title are required for update title");
    }
    const parsedId = parseInt(id, 10);
     if (isNaN(parsedId)) {
      throw new Error("Invalid id");
    }

    return {
      intent,
      id: parsedId,
      title,
    }
  }

  if (intent === "delete") {
      const id = formData.get("id") as string;
      if (id === null) {
          throw new Error("ID is required for deleting a task");
      }
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        throw new Error("Invalid Id");
      }
      return {
          intent,
          id: parsedId,
      };
  }

  throw new Error(`Invalid intent: ${intent}`);
}

async function handleAction(formDataValues: FormDataValues, context: any) {
// We don't need context.db.transaction here
  switch (formDataValues.intent) {
      case "add":
          const newTask = {
              title: formDataValues.title,
              status: "To Do",
              priority: formDataValues.priority,
              projectId: formDataValues.projectId,
          };
          await context.db.insert(schema.tasks).values(newTask);
          break; // Important: Add break statements
      case "update":
          await context.db.update(schema.tasks).set({ status: formDataValues.status }).where(eq(schema.tasks.id, formDataValues.id));
          break;
      case "updateTitle":
        await context.db.update(schema.tasks).set({ title: formDataValues.title}).where(eq(schema.tasks.id, formDataValues.id));
        break;
      case "delete":
          await context.db.delete(schema.tasks).where(eq(schema.tasks.id, formDataValues.id));
          break;
  }
  return redirect("/");
}

export async function action({ context, request }: Route.ActionArgs) {
  try {
      const formData = await request.formData();
      const formDataValues = parseFormData(formData);
        // Validate with schema *after* basic parsing.
        console.log("parsed form data");
      const validationResult = S.validateEither(formDataSchema)(formDataValues); // Use validateSync for simplicity
      console.log("now gonna validate");
      if (validationResult._tag === "Left") {
        console.error("Schema Validation Errors:", validationResult.left); // Log for debugging
        throw new Error("Form data did not match schema: " + validationResult.left.toString()); // Throwing custom message
      }
      console.log("now gonna handle action");

      return await handleAction(formDataValues, context);

  } catch (error: any) {
      // Handle errors (both parsing and database errors)
      console.error(error); // Log the error for debugging
      return { error: error.message || "An unexpected error occurred" }; // Return a user-friendly error
  }
}
/*
export async function action ({ context, request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  // 🟠 Add Task
  if (intent === "add") {
    const newTask = {
      title: formData.get("title") as string,
      status: "To Do",
      priority: formData.get("priority") as string,
      projectId: 1 // replace with route id later
    }

    await context.db.insert(schema.tasks).values(newTask);
    return redirect("/");
  }

  // 🟠 Update Task
  if (intent === "update") {
    console.log("updating status")
    const taskId = parseInt(formData.get("id") as string);
    console.log("taskId: ", taskId);
    await context.db.update(schema.tasks).set({ status: formData.get("status") as string}).where(eq(schema.tasks.id, taskId));
    return redirect("/");
  }

  if (intent === "updateTitle") { //New intent to handle
    console.log("updating title")
    const taskId = parseInt(formData.get("id") as string);
    const newTitle = formData.get("title") as string; //get the title
    await context.db.update(schema.tasks).set({ title: newTitle}).where(eq(schema.tasks.id, taskId)); //update with new title
    return redirect("/");
  }

  // 🟠 Delete Task
  if (intent === "delete") {
    const taskId = parseInt(formData.get("id") as string);
    await context.db.delete(schema.tasks).where(eq(schema.tasks.id, taskId));
    return redirect("/");
  }

  return { error: "Invalid action" };
};

*/
export default function ProjectBoard({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;

  if (!project) {
      return (
          <div className="min-h-screen bg-gray-100 flex justify-center py-10">
              <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
                  <p className="text-gray-500">No project found.</p>
              </div>
          </div>
      );
  }

  const currentPhase = getCurrentPhase(project.phases);
  const nextPhase = getNextPhase(project.phases, currentPhase);

  return (
      <div className="min-h-screen bg-gray-100 dark:border-gray-700 flex justify-center py-10">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-gray-500 text-sm mt-1">
                  🧑‍💻 Started on {new Date(project.startDate).toDateString()}
              </p>

              <ProjectProgress phases={project.phases} currentPhase={currentPhase} nextPhase={nextPhase} />
              <TaskList tasks={project.tasks} />
              <AddTaskForm />
              <ActivityList activities={project.activities} />

          </div>
      </div>
  );
}