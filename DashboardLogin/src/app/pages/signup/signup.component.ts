import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Required for ngModel
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // Declare variables for ngModel
  studentId: string = '';
  password: string = '';

  // Simple login handler
  onLogin() {
    console.log('Student ID:', this.studentId);
    console.log('Password:', this.password);

    // Here you can add actual login logic
    if (this.studentId && this.password) {
      alert('Login successful!');
    } else {
      alert('Please enter Student ID and Password.');
    }
  }
}
