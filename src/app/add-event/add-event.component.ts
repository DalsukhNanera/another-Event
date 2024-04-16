import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { APICallService } from '../api-call.service';
import { EventEntity } from '../Models/EventEntity';



@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {

  d = new Date().toISOString().slice(0, 10);
  Base64!: string;
  regex = new RegExp("^[a-zA-Z ]+$");
  

  submit(event: any) {
    console.log(event);
    const file = event.target.files[0];
    this.userForm.get('Image').setErrors(null);
    console.log(file);
    if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/png" || event.target.files[0].type == "image/svg+xml") {

      if (event.target.files[0].size > 5000) {
        const reader = new FileReader();

        reader.onload = () => {
          const base64: string = reader.result as string;
          console.log("i am inside");



          console.log(base64.split(',')[1]);
          this.Base64 = base64.split(',')[1];
        };

        if (file) {
          reader.readAsDataURL(file);
        }
      }

      else {
        this.userForm.get('Image').setErrors({ sizeExceeded: true });
        alert("please select file which have size less than 500kb");

      }

    }
    else {
      alert("please select valid type.. Jpeg,png or svg");
      this.userForm.get('Image').setErrors({ invalidTye: true });
      this.userForm.value.image = null;
    }

    console.log("i am outside");

  }


  userForm: any;
  Message: any;
  Id!: number;

  Flag: boolean = false;
  submitetd = false;
  constructor(private formBuilder: FormBuilder, public service: APICallService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    console.log(this.d);
    this.userForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.pattern(this.regex)]],
      Description: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Image: ['', Validators.required],
    });


  }


  submitForm(): void {
    console.log(this.userForm);
    this.submitetd = true;
    console.log("i am in submit form");
    console.log(this.userForm.value);
    console.log(this.userForm.value.Image);



    // let startYear:number = this.userForm.value.StartDate.substring(0,4);
    // let startMonth:number = this.userForm.value.StartDate.substring(5,7);
    // let startDate:number = this.userForm.value.StartDate.substring(8,10);
    // console.log(startMonth);


    // let endtYear:number = this.userForm.value.EndDate.substring(0,4);
    // let endtMonth:number = this.userForm.value.EndDate.substring(5,7);
    // let endtDate:number = this.userForm.value.EndDate.substring(8,10);
    // console.log(endtMonth);

    // if( ((startDate >endtDate) && (startMonth <= endtDate) && (startYear <= endtYear)) || ((startMonth > endtMonth) && (startYear >= endtYear)))
    //   {
    //     console.log("aaya chhu");
    //     this.userForm.get('EndDate').setErrors(null);
    //     this.userForm.get('EndDate').setErrors({InvalidDateRange:true});
    //   }

    let ev = new EventEntity();

    ev.Name = this.userForm.value.Name;
    ev.Description = this.userForm.value.Description;
    ev.StartDate = this.userForm.value.StartDate;
    ev.EndDate = this.userForm.value.EndDate;
    ev.Image = this.Base64
    ev.ImageType = this.userForm.value.Image.toString().split('.')[1]

    // const ev = new EventEntity(
    //   0,
    //   this.userForm.value.Name,
    //   // this.route.snapshot.paramMap.get('Id')?.slice(1)!,
    //   this.userForm.value.Description,
    //   this.userForm.value.StartDate,
    //   this.userForm.value.EndDate,
    //   this.Base64,
    //   "ok"

    // ) 



    if (this.userForm?.valid) {

      //   console.log('Form data:', this.userForm.value);
      //this.http.post('https://localhost:44315/api/ExpenseManager/RegisterUser',this.userForm.value).subscribe((data)=>console.log(data));
      this.service.callMethod('AddEvent', ev).subscribe(
        {
          next: (data: any) => {


            this.Message = data.Message;
            this.userForm.reset();
            this.submitetd = false;

          },
          Error: (err: Error) => {
            window.alert("ENTER VALID credetails");
            this.userForm.reset(this.userForm.value);
            this.userForm.reset();
            this.submitetd = false;
          }

        }
      );

    }
  }
}

