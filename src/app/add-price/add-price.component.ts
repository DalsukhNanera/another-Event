import { Component } from '@angular/core';
import { APICallService } from '../api-call.service';
import { FormBuilder, Validators } from '@angular/forms';
import { EventEntity } from '../Models/EventEntity';
import { ActivityEntity } from '../Models/ActivityEntity';
import { EventService } from '../event.service';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.css']
})
export class AddPriceComponent {
  Message!: any;
  //List of Event which we will take from API.
  EventData!: EventEntity[];
  //Array of Activity objects
  ActivityData!: any;

  //user form object 
  userForm: any;
  //it will be true when we go in submit functiona nd thenw e will so the errors 
  submitetd!: any;



  constructor(public eventServiec:EventService,public service: APICallService, private formBuilder: FormBuilder) {

  } 

  // first time it is called for fetching event data for admin which is not published
  ngOnInit(): void {
    this.Message = null;
    console.log(this.ActivityData);

    let obj = {
      Flag: "AdminEvents"
    }
    this.service.showEventOrActivity(obj).subscribe(
      {
        next: (data: any) => {
          if (data.ID == 1) {
            this.EventData = data.ArrayOfResponse;


            console.log(data);

          }
          else if(data.ID == 0) {
            this.Message = data.Message;
          }
          else{
            this.Message = "something went wrong";
          }
        },
        Error: (err: Error) => {
          window.alert("ENTER VALID credetails");

        }

      });

    this.userForm = this.formBuilder.group({
      EventId: ['', Validators.required],
      ActivityId: ['', Validators.required],
      Price: ['', Validators.required],
    });


  }

  //this is called when event dropdown is change for fetching that event Activity
  EventChange() {
    this.ActivityData = null;
    this.Message = null;
    console.log("aaya chhe");

    let obj = {
      EventId: this.userForm.value.EventId,
      Flag: "AdminActibityShow"
    }

    this.service.showEventOrActivity(obj).subscribe(
      {
        next: (data: any) => {
          if (data.ID == 1) {
            this.ActivityData = data.ArrayOfResponse;
          }
          else if(data.ID == 0) {
            this.Message = data.Message;
            console.log(this.ActivityData)
            this.userForm.reset(this.userForm.value);
            this.userForm.reset();

          }
          else{
            this.Message = "something went wrong";
          }
        },
        Error: (err: Error) => {
          window.alert("ENTER VALID credetails");

        }

      });




  }

  //this API is called for adding a price at the end 
  async submitForm(): Promise<void> {
    this.submitetd = true;
    console.log("i am in submit form");
    console.log(this.userForm.value);
    console.log(this.userForm.value.Image);

    if (this.userForm?.valid) {


      let at = new ActivityEntity();


      //making object for sending to an API.
      let obj = {
        ActivityId: this.userForm.value.ActivityId,
        Price: this.userForm.value.Price,
        Flag: "AddPrice"
      }
      console.log("ok");

     await this.service.PublishOrAddPrice(obj).subscribe(
        {
          next: (data: any) => {

            //setting message to the our message variable 
            this.Message = data.Message;
            //resetting an form 
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
      this.EventChange();

    }

  }
}


