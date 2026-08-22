import { getStaff } from '../../actions';
import StaffClient from './StaffClient';

export default async function AdminStaffPage() {
  const staff = await getStaff();
  
  return (
    <div className="animate-in fade-in duration-500">
      <StaffClient initialStaff={staff} />
    </div>
  );
}
