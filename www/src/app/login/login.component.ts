import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BitidentService } from '../services/bitident.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;

  errorMessage: string;

  constructor(
    formBuilder: FormBuilder,
    private bitident: BitidentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.loginForm = formBuilder.group({
      avatar: new FormControl('', [Validators.required]),
    });
  }

  async submit() {
    try {
      this.loading = true;
      const result = await this.bitident.createRequest(this.loginForm.value.avatar).toPromise()
      this.loading = false;
      this.errorMessage = undefined;
      await this.router.navigate(['request'], { state: result, relativeTo: this.activatedRoute });
    } catch (error) {
      if (error.error === 'ERR_VALIDATE_AVATAR') {
        this.errorMessage = 'Avatar does not exist'
      } else {
        this.errorMessage = 'Oops... An unknown error occured. Please try later'
        console.error(error);
      }
      this.loading = false;
    }
  }

  ngOnInit() {
  }

}
