import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private configService: ConfigService,
    private toastr: ToastrService,
    private router: Router
  ) {
    console.log(this.configService.config);
  }

  @ViewChild('registerForm', { static: false }) myForm!: NgForm;

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log(form);
      this.auth.register(form.value).subscribe({
        next: (res: any) => {
          this.toastr.success(res.message, 'success');
          console.log(res);
          form.resetForm();
          this.myForm.resetForm();
        },
        error: (error) => {
          this.toastr.error('An error occured', 'Error');
          console.log(error);
        },
      });
      // Form is valid, perform your registration logic here
      console.log(form.value);
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
