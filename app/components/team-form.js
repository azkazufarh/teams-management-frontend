import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Swal from 'sweetalert2';

export default class TeamFormComponent extends Component {
  @tracked team = null;
  @tracked teamId = this.args.teamId;

  constructor() {
    super(...arguments);

    console.log(this.args.teamId);

    if (this.args.teamId) {
      this.getTeamById(this.args.teamId);
    }
  }

  @action
  async getTeamById(id) {
    try {
      const response = await fetch(`https://teams-management-backend-ylb9.onrender.com/api/teams/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const team = await response.json();

      console.log(team);
      this.team = team;
    } catch (error) {
      console.error('Failed to fetch team details:', error);
    }
  }

  @action
  toggleModal(event) {
    // Find the modal using its ID
    const modal = document.getElementById('crud-modal');

    if (modal) {
      if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden'); // Show modal
        modal.classList.add('flex'); // Ensure it's displayed as flexbox

        if (this.team !== null) {
          modal.querySelector("input[name='name']").value = this.team.name;
          modal.querySelector("textarea[name='description']").value =
            this.team.description;

          modal.querySelector('h3').innerText = 'Edit'
          modal.querySelector('button[type="submit"]').innerHTML = 'Edit'

          if (modal.querySelector("input[name='teamId']")) {
            modal.querySelector("input[name='teamId']").value = this.team.id;
          } else {
            this.createTeamIdField(this.team.id);
          }
        }
      } else {
        modal.classList.add('hidden'); // Hide modal
        modal.classList.remove('flex');
        modal.querySelector("input[name='name']").value = '';
        modal.querySelector("textarea[name='description']").value = '';
        modal.querySelector('h3').innerText = 'Create New'
        modal.querySelector('button[type="submit"]').innerHTML = `
          <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          Add new Team
        `
        this.deleteTeamIdField();
      }
    }
  }

  @action
  async submitForm(event) {
    event.preventDefault();
    const modal = document.getElementById('crud-modal');

    const name = event.target.name.value;
    const description = event.target.description.value;

    const data = { name, description };

    try {
      const url = event.target.teamId
        ? `https://teams-management-backend-ylb9.onrender.com/api/teams/${event.target.teamId.value}`
        : 'https://teams-management-backend-ylb9.onrender.com/api/teams';
      const method = event.target.teamId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      await response.json();

      modal.classList.add('hidden');
      modal.classList.remove('flex');

      Swal.fire({
        title: 'Success!',
        text: event.target.teamId
          ? 'Team updated successfully!'
          : 'Team created successfully!',
        icon: 'success',
      }).then(() => window.location.reload());
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to save the member. Please try again.',
        text: `Error saving member: ${error}`,
      });
    }
  }

  @action
  createTeamIdField(value) {
    const container = document.querySelector('form .grid > .col-span-2'); // Target the first mt-4 container
    if (container) {
      // Create wrapper div with the same classes as the example
      const wrapper = document.createElement('div');
      wrapper.className = 'col-span-2 team-id-field';

      // Create label for the input
      const label = document.createElement('label');
      label.setAttribute('for', 'teamId');
      label.className =
        'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
      label.textContent = 'Team ID';

      // Create the input element
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'teamId';
      input.id = 'teamId';
      input.className =
        'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
      input.value = value;
      input.disabled = true; // Disable input as per your original code

      // Append label and input to the wrapper div
      wrapper.appendChild(label);
      wrapper.appendChild(input);

      // Insert the wrapper into the DOM before the container
      container.parentNode.insertBefore(wrapper, container);
    }
  }

  @action
  deleteTeamIdField() {
    const teamIdField = document.querySelector('.team-id-field');
    if (teamIdField) {
      teamIdField.remove();
    }
  }
}
