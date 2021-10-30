import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../courses/courses.component';

@Component({
  selector: 'app-viewrequests',
  templateUrl: './viewrequests.component.html',
  styleUrls: ['./viewrequests.component.css']
})
export class ViewrequestsComponent implements OnInit {
  usersSub;
  usrImg;
  usrRole;
  userName;
  reqList = [];
  displayedColumns: string[] = ['name', 'mail', 'type', 'carnet', 'action', 'action2', 'action3'];
  dataSource = new MatTableDataSource(this.reqList);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private authService: AuthServiceService, private snack: MatSnackBar, private AppComp: AppComponent, private route: Router, private dialog: MatDialog) { }

  ngAfterViewInit(){
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.usrImg = this.AppComp.usrImg;
    this.usrRole = this.AppComp.User.role;
    this.userName = this.AppComp.User.name;
    this.usersSub = this.authService.listUsers().subscribe(result =>{
      this.reqList = [];
      for(let s in result){
        if(!result[s].enabled)
        {
          if(result[s].role == 'profesor')
          {
            this.reqList.push(result[s]);
          }          
        } 
      }
      this.dataSource = new MatTableDataSource(this.reqList);
      //this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

      console.log(this.reqList);

    })   

  }

  AcceptRequests(user){
    this.authService.enableUser(user.uid);
  }

  DenyRequests(user){
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '300px',
      data: {data: 's', process: 'delete'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'deleteLectura'){
        //aqui va lo de eliminar
        this.authService.deleteUser(user.uid);
        console.log('borrar?')
      }
    })
    
  }

  AlertRequests(user){
    this.authService.alertUser(user.uid);
    this.snack.open('El usuario ha sido alertado!', '', {duration: 2500});
  }

  goToLink(url: string){
    window.open(url, "_blank");
}

logOutUser(){
  this.AppComp.logOutUser();
}

}
