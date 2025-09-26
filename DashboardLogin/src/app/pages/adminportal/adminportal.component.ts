import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-adminportal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adminportal.component.html',
  styleUrls: ['./adminportal.component.css']
})
export class AdminportalComponent implements OnInit {
  selectedTab: string = 'students';  // ✅ Default tab
  students: any[] = [];
  batches: any[] = [];
  payments: any[] = [];
  bills: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // ✅ Load students by default
    this.adminService.getStudents().subscribe((data: any[]) => {
      console.log('Default Students data:', data);
      this.students = data;
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;

    if (tab === 'students') {
      this.adminService.getStudents().subscribe((data: any[]) => {
        console.log('Students data:', data);
        this.students = data;
      });
    }

    if (tab === 'batches') {
      this.adminService.getBatches().subscribe((data: any[]) => {
        console.log('Batches data:', data);
        this.batches = data;
      });
    }

    if (tab === 'payments') {
      this.adminService.getPayments().subscribe((data: any[]) => {
        console.log('Payments data:', data);
        this.payments = data;
      });
    }

    if (tab === 'bills') {
      this.adminService.getBills().subscribe((data: any[]) => {
        console.log('Bills data:', data);
        this.bills = data;
      });
    }
  }
}
