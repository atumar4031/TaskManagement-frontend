import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  login(form: NgForm) {
    this.auth.login(form.value).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message, 'success');
        sessionStorage.setItem('token', res.result.accessToken);
        this.router.navigateByUrl('/dashboard');
        console.log(res);
        form.resetForm();
      },
      error: (error) => {
        this.toastr.error('An error occured', 'Error');
        console.log(error);
      },
    });
  }
}
