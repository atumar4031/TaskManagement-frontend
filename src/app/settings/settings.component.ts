import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  username: string = '';
  lastname: string = '';
  email: string = '';
  userId!: number;
  constructor(
    private todoService: TodoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.todoService.fetchUser().subscribe({
      next: (res: any) => {
        (this.userId = res.result.id),
          (this.username = res.result.firstName),
          (this.lastname = res.result.lastName);
        this.email = res.result.email;
        this.toastr.success(res.message, 'Success');
      },
      error: (error) => {
        console.log(error);

        this.toastr.error(error.error.message || 'An error occurred', 'Error');
      },
    });

    (res: any) => {};
  }
  submitForm(userForm: NgForm): void {
    // Here you can implement the logic to submit the form data
    console.log('Username:', this.username);
    console.log('Email:', this.email);

    const payload = {
      firstName: this.username,
      lastName: this.lastname,
      email: this.email,
    };

    console.log(payload);

    this.todoService.updateUser(this.userId, payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'Success');
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error');
      },
    });
  }
}
