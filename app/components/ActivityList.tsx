// ~/components/ActivityList.tsx (Updated Styling and Avatars)

import type { Activity } from "~/database/schema";

interface ActivityListProps {
    activities: Activity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="font-semibold text-lg">Recent Activity</h2>
            <ul className="mt-3 space-y-4">
                {activities.map((activity) => (
                    <li key={activity.id} className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">●</span>
                        <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {/* Placeholder avatar (replace with actual data) */}
                                <span className="inline-flex items-center gap-1 mr-1">
                                     <span className="w-4 h-4 rounded-full bg-gray-300"></span>
                                </span>

                                {new Date(activity.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};