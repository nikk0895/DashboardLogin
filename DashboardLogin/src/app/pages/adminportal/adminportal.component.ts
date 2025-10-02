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
selectedTab: string = 'students';  // Default tab

students: any[] = [];
batches: any[] = [];
uniqueCourses: any[] = [];
payments: any[] = [];
bills: any[] = [];
courses: any[] = [];

selectedCourse: string | null = null;

constructor(private adminService: AdminService) {}

ngOnInit(): void {
this.loadTabData(this.selectedTab);
}

selectTab(tab: string): void {
this.selectedTab = tab;
this.loadTabData(tab);
}


private loadTabData(tab: string): void {
switch (tab) {
case 'students':
this.adminService.getStudents().subscribe(data => {
console.log('Students:', data);
this.students = data;
});
break;
case 'batches':
  this.adminService.getBatches().subscribe(data => {
    console.log('Batches:', data);
    this.batches = data;

    // 🔹 Hardcoded grouping for now
    this.uniqueCourses = [
      { course: "Computer Science", timings: ["Morning", "Evening"] },
      { course: "Business Administration", timings: ["Morning", "Evening"] },
      { course: "Design & Media", timings: ["Morning", "Evening"] }
    ];
  });
  break;

break;
case 'payments':
this.adminService.getPayments().subscribe(data => {
console.log('Payments:', data);
this.payments = data;
});
break;
case 'bills':
this.adminService.getBills().subscribe(data => {
console.log('Bills:', data);
this.bills = data;
});
break;
case 'courses':
this.adminService.getCourses().subscribe(data => {
console.log('Courses:', data);
this.courses = data;
});
break;
}
}

// 🔹 Called when a course is clicked
selectCourse(course: string): void {
console.log('Selected Course:', course);
this.selectedCourse = course;
}
// 🔹 Get unique list of courses from students
getUniqueCourses(): string[] {
  const courses = this.students.map(s => s.course);
  return [...new Set(courses)]; // remove duplicates
}

// 🔹 Filter batches belonging to the selected course
getBatchesForCourse(course: string): any[] 
{ return this.batches.filter(b => b.course === course); }

// 🔹 Filter students belonging to a batch
getStudentsForBatch(batchName: string): any[] 
{ return this.students.filter(s => s.batch === batchName && s.course === this.selectedCourse);

 }
 
}
