import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  studentId: string = '';
  password: string = '';
  showRegister = false;

  // 🔹 Store bills fetched from backend
  bills: any[] = [];

  registerData: any = {
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    join_date: '',
    course: '',
    course_fee: 0,
    amount_paid: 0,
    amount_remaining: 0,
    due_date: '',
    batch: ''
  };

  constructor(private http: HttpClient) {}

  // 🔹 Toggle Login/Register
  toggleRegister(event: Event) {
    event.preventDefault();
    this.showRegister = !this.showRegister;
  }

  // 🔹 Auto update fee when course selected
  onCourseSelect() {
    const fees: Record<string, number> = {
      'Computer Science': 20000,
      'Business Administration': 18000,
      'Design & Media': 15000
    };
    this.registerData.course_fee = fees[this.registerData.course] || 0;
    this.calculateRemaining();
    this.setDueDate();
  }

  // 🔹 Auto Remaining
  calculateRemaining() {
    const paid = Number(this.registerData.amount_paid) || 0;
    const fee = Number(this.registerData.course_fee) || 0;
    this.registerData.amount_remaining = fee - paid;
  }

  // 🔹 Auto Due Date
  setDueDate() {
    if (this.registerData.join_date) {
      const joinDate = new Date(this.registerData.join_date);
      joinDate.setMonth(joinDate.getMonth() + 2);
      this.registerData.due_date = joinDate.toISOString().split('T')[0];
    }
  }

  // 🔹 Register Student
  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    this.http.post('http://localhost:3000/register', this.registerData).subscribe({
      next: (res) => {
        alert('✅ Registration successful!');
        this.registerData = {
          name: '',
          mobile: '',
          email: '',
          password: '',
          confirmPassword: '',
          join_date: '',
          course: '',
          course_fee: 0,
          amount_paid: 0,
          amount_remaining: 0,
          due_date: '',
          batch: ''
        };
        this.showRegister = false;

        // 🔹 Fetch bills again so UI updates
        this.loadBills();
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        alert('Error during registration! Check server logs.');
      }
    });
  }

  // 🔹 Login
  onLogin() {
    this.http.post('http://localhost:3000/login', {
      studentId: this.studentId,
      password: this.password
    }).subscribe({
      next: (res) => {
        alert('✅ Login successful!');
        this.studentId = '';
        this.password = '';
      },
      error: () => {
        alert('❌ Invalid credentials!');
      }
    });
  }

  // 🔹 Load bills from backend
  loadBills() {
    this.http.get<any[]>('http://localhost:3000/bills').subscribe({
      next: (data) => {
        this.bills = data;
        console.log('📌 Bills loaded:', this.bills);
      },
      error: (err) => {
        console.error('❌ Error fetching bills:', err);
      }
    });
  }
}
