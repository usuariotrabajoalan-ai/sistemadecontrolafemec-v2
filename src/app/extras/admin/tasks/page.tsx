import { getTaskTypes } from '../../actions';
import TasksClient from './TasksClient';

export default async function AdminTasksPage() {
  const tasks = await getTaskTypes();
  
  return (
    <div className="animate-in fade-in duration-500">
      <TasksClient initialTasks={tasks} />
    </div>
  );
}
