 import React, { useState, useEffect } from 'react';
 import { useTeamInvite } from '../../context/TeamInviteContext';
 import './ModalCommon.css';
 import { FaTimes } from 'react-icons/fa';
 
 export const GroupInviteModal = ({ onClose, teamId }) => {
   const [email, setEmail] = useState('');
   const [selectedRole, setSelectedRole] = useState('');
   const [localError, setLocalError] = useState(null); 
   const { userRoles, error, success, fetchUserRoles, createInvite, clearMessages } = useTeamInvite();
  
   useEffect(() => {
     fetchUserRoles();
   }, [fetchUserRoles]);
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setLocalError(null); 
     try {
       await createInvite(teamId, email, selectedRole);
       setEmail('');
       setSelectedRole('');
     } catch (err) {
       console.error(err);
       setLocalError(err);
     }
   };
 
   const handleClose = () => {
     clearMessages();
     setLocalError(null);
     onClose();
   };
 
   return (
     <div className="modal-overlay" onClick={handleClose}>
       <div className="modal" onClick={(e) => e.stopPropagation()}>
         <button className="close-btn" onClick={onClose}><FaTimes /></button>
         <h2>Zaproś użytkownika do grupy</h2>
 
         <form onSubmit={handleSubmit}>
           <input
             type="email"
             placeholder="Email użytkownika"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
 
           <div className="role-change">
             <select
               value={selectedRole}
               onChange={(e) => setSelectedRole(e.target.value)}
               required
             >
               <option value="">Wybierz rolę</option>
               {userRoles.map((role) => (
                 <option key={role} value={role}>
                   {role}
                 </option>
               ))}
             </select>
           </div>
 
           <div className="form-buttons">
             <button type="submit" className="btn-green">
               Wyślij zaproszenie
             </button>
           </div>
         </form>
 
         {(localError || error) && (
           <p className="error-message">{localError || error}</p>
         )}
 
         {success && <p className="success-message">{success}</p>}
       </div>
     </div>
   );
 };
 
 export default GroupInviteModal;