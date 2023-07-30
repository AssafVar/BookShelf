import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor( 
    private userService: UserService,
    private router: Router,

    ){}

  ngOnInit() :void {
    if (localStorage.getItem('token') != null) {
      this.userService.checkToken().subscribe({
        next: (response)=>{
          this.router.navigate(['/']);
        },
        error: (err)=>{
          console.error(err);
        }
      })
    }
  };
  
}
