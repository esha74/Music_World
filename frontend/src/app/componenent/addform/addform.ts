import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Musicservices } from '../../services/musicservices';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-addform',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './addform.html',
  styleUrl: './addform.css'
})
export class Addform implements OnInit {
  MusicForm!:FormGroup;

  constructor(private musicservice:Musicservices,private router:Router,private fb:FormBuilder){}
ngOnInit(): void {
  this.initform();
}

initform():void{
  this.MusicForm=this.fb.group({
    title:['',[Validators.required]],
    artist:['',[Validators.required]],
    year:['',[Validators.required,Validators.pattern(/^[0-9]{4}$/)]],
    image:['',[Validators.required,Validators.pattern(/^https?:\/\/[\w\-\.]+(\.[\w\-]+)+([\/#?]?.*)$/i)]],
    genre:['',[Validators.required]],
    audio:['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?[\w-]+(\S*)?$/)
]]
  })
}

onsubmit(){
if(this.MusicForm.invalid){
  this.MusicForm.markAllAsTouched();
  return;
}

console.log("submittingform",this.MusicForm.value);
this.musicservice.create(this.MusicForm.value).subscribe(()=>{
  this.router.navigate(['/list']);
})

  }
}
