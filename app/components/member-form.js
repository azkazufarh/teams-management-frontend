import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Swal from 'sweetalert2';

export default class MemberFormComponent extends Component {
  @tracked teams = []; // List of teams
  @tracked member;
  @tracked memberId = this.args.memberId;

  constructor() {
    super(...arguments);
    this.fetchTeams();

    if (this.args.memberId) {
      this.fetchMemberById(this.args.memberId); // Fetch member automatically if `id` is passed
    }
  }

  async fetchTeams() {
    try {
      const response = await fetch('https://teams-management-backend-ylb9.onrender.com/api/teams');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const teams = await response.json();
      this.teams = teams;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  }

  async fetchMemberById(id) {
    try {
      const response = await fetch(`https://teams-management-backend-ylb9.onrender.com/api/members/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const member = await response.json();
      this.member = member;
    } catch (error) {
      console.error('Failed to fetch member details:', error);
    }
  }

  @action
  async submitForm(event) {
    event.preventDefault();
    const modal = document.getElementById('crud-modal');

    const name = event.target.name.value;
    const role = event.target.role.value;
    const teamId = event.target.teamId.value;

    const data = { name, role, teamId };

    try {
      const url = event.target.memberId
        ? `https://teams-management-backend-ylb9.onrender.com/api/members/${event.target.memberId.value}`
        : 'https://teams-management-backend-ylb9.onrender.com/api/members';
      const method = event.target.memberId ? 'PUT' : 'POST';

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
        text: event.target.memberId
          ? 'Member updated successfully!'
          : 'Member created successfully!',
        icon: 'success',
      }).then(() => window.location.reload());
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save the member. Please try again.');
    }
  }

  @action
  toggleModal() {
    const modal = document.getElementById('crud-modal');

    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');

      if (this.member !== null) {
        modal.querySelector("input[name='name']").value = this.member.name;
        modal.querySelector("input[name='role']").value = this.member.role;
        modal.querySelector("select[name='teamId']").value = this.member.teamId;
        modal.querySelector('h3').innerText = 'Edit'
        modal.querySelector('button[type="submit"]').innerHTML = 'Edit'

        if (modal.querySelector("input[name='memberId']")) {
          modal.querySelector("input[name='memberId']").value = this.member.id;
        } else {
          this.createMemberIdField(this.member.id);
        }
      }
    } else {
      modal.classList.add('hidden');
      modal.classList.remove('flex');

      this.deleteMemberIdField();

      // Reset the form fields
      modal.querySelector("input[name='name']").value = '';
      modal.querySelector("input[name='role']").value = '';
      modal.querySelector("select[name='teamId']").value = '';
      modal.querySelector('h3').innerText = 'Create New'
        modal.querySelector('button[type="submit"]').innerHTML = `
          <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          Add new Member
        `
    }
  }

  @action
  createMemberIdField(value) {
    const container = document.querySelector('form .grid > .col-span-2'); // Target the first mt-4 container
    if (container) {
      // Create wrapper div with the same classes as the example
      const wrapper = document.createElement('div');
      wrapper.className = 'col-span-2 member-id-field';

      // Create label for the input
      const label = document.createElement('label');
      label.setAttribute('for', 'memberId');
      label.className =
        'block mb-2 text-sm font-medium text-gray-900 dark:text-white';
      label.textContent = 'member ID';

      // Create the input element
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'memberId';
      input.id = 'memberId';
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
  deleteMemberIdField() {
    const memberIdField = document.querySelector('.member-id-field');
    if (memberIdField) {
      memberIdField.remove();
    }
  }
}
