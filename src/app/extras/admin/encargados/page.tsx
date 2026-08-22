import { getAdminUsers } from '../../actions';
import EncargadosClient from './EncargadosClient';

export default async function AdminEncargadosPage() {
  const users = await getAdminUsers();
  
  return (
    <div className="animate-in fade-in duration-500">
      <EncargadosClient initialUsers={users} />
    </div>
  );
}
