import Route from '@ember/routing/route';
import { action } from '@ember/object';
import Swal from 'sweetalert2';

export default class TeamsRoute extends Route {
  async model() {
    try {
      let response = await fetch('https://teams-management-backend-ylb9.onrender.com/api/teams');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let teams = await response.json();
      return teams;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  }

  @action
  async deleteTeam(id) {
    try {
      const response = await fetch(`https://teams-management-backend-ylb9.onrender.com/api/teams/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete team. Status: ${response.status}`);
      }

      Swal.fire({
              title: 'Success!',
              text: 'Team delete successfully!',
              icon: 'success',
            }).then(() => window.location.reload());
    } catch (error) {
      Swal.fire({
              icon: 'error',
              title: 'Failed to delete the team. Please try again.',
              text: `Error deleting team: ${error}`,
            });
    }
  }
}
