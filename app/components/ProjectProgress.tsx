// ~/components/ProjectProgress.tsx (Updated Styling)

import type { Project, Phase } from "~/database/schema";

interface ProjectProgressProps {
    phases: Phase[];
    currentPhase: Phase | null;
    nextPhase: Phase | null;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ phases, currentPhase, nextPhase }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="font-semibold text-lg">Project Progress</h2>
            <div className="flex gap-2 mt-3">
                {phases.map((phase) => (
                    <div
                        key={phase.id}
                        className={`flex-1 h-8 rounded-md ${
                            phase.status === "Completed"
                                ? "bg-green-500"
                                : phase.status === "In Progress"
                                ? "bg-orange-400"
                                : "bg-gray-300"
                        }`}
                    ></div>
                ))}
            </div>
            <p className="mt-3 text-sm text-gray-700">
                {currentPhase ? (
                    <>
                        You're currently in <span className="text-orange-500 font-semibold">{currentPhase.name}</span>. Complete the initial <span className="font-semibold">MVP</span> to
                        {nextPhase ? (
                            <> move forward to <span className="font-semibold">{nextPhase.name}</span>.</>
                        ) : (
                            <> complete the project.</>
                        )}
                    </>
                ) : (
                    <>No phase in progress. Project may be completed or not started yet.</>
                )}
            </p>
        </div>
    );
};