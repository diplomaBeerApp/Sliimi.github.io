import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  //authForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //private fb: FormBuilder
    ) {
      // use FormBuilder to create a form group
     // this.authForm = this.fb.group({
     //   'email': ['', Validators.required],
      //  'password': ['', Validators.required]
     // });
    }
  ngOnInit(): void {
      this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.title = (this.authType == 'login') ? 'Logowanie' : 'Rejestracja';
    });

  }


  onSubmit() : void {
  
    //this.title = "DZiala";

  }

}
