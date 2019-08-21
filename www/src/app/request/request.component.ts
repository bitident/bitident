import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BitidentService } from '../services/bitident.service';
import { environment } from '../../environments/environment';
import { Request } from 'bitident';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.sass']
})
export class RequestComponent implements OnInit {

  token: string;
  id: string;
  completed = false;
  timedout = false;

  tokenData: any

  checkInterval: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bitident: BitidentService,
  ) {
    const nav = this.router.getCurrentNavigation()
    if (nav === null || nav.extras.state === undefined) {
      console.error('no data provided');
      this.router.navigate([''], { relativeTo: this.activatedRoute.parent });
    }
    const data = nav.extras.state;
    if (!data.token) {
      console.error('no data provided');
    }
    this.token = data.token;
    this.tokenData = Request.decode(this.token);
    this.id = data.id;
    this.checkInterval = setInterval(() => {
      this.bitident.checkRequest(this.id)
        .subscribe(result => {
          if (!this.completed) {
            if (result.success) {
              this.completed = true;
              clearInterval(this.checkInterval);
              this.checkInterval = null;
            }
          }
        });
    }, environment.checkInterval);
  }

  async ngOnInit() {

  }

  timeout() {
    this.timedout = true;
    this.completed = true;
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  cancel() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.router.navigate([''], { relativeTo: this.activatedRoute.parent });
    this.completed = false;
  }

}
