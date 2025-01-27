import Route from '@ember/routing/route';
import { action } from '@ember/object';
import Swal from 'sweetalert2';

export default class MembersRoute extends Route {
  async model() {
    try {
      let response = await fetch('https://teams-management-backend-ylb9.onrender.com/api/members');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let members = await response.json();
      return members;
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  }

  @action
  async deleteMember(id) {
    try {
      const response = await fetch(`https://teams-management-backend-ylb9.onrender.com/api/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete member. Status: ${response.status}`);
      }

      alert('Member deleted successfully!');

      window.location.reload();
    } catch (error) {
      Swal.fire({
              icon: 'error',
              title: 'Failed to delete the member. Please try again.',
              text: `Error delete member: ${error}`,
            });
    }
  }
}
