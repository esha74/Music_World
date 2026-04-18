import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Musicservices } from '../../services/musicservices';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-editform',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './editform.html',
  styleUrl: './editform.css'
})
export class Editform implements OnInit{
MusicForm!:FormGroup;
ids?:number;

  constructor(private musicservice:Musicservices,private router:Router,private fb:FormBuilder,private route:ActivatedRoute){}

  ngOnInit(): void {
  this.initform();
}

initform():void{
  this.MusicForm=this.fb.group({
    id:[0],
    title:['',[Validators.required]],
    artist:['',[Validators.required]],
    year:['',[Validators.required,Validators.pattern(/^[0-9]{4}$/)]],
    image:['',[Validators.required,Validators.pattern(/^https?:\/\/[\w\-\.]+(\.[\w\-]+)+([\/#?]?.*)$/i)]],
    genre:['',[Validators.required]],
    audio:['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?[\w-]+(\S*)?$/
)]]

  })

  const id=this.route.snapshot.paramMap.get('id');

  if(id){
    this.ids=+id;
    this.musicservice.getById(this.ids).subscribe((data)=>{
      this.MusicForm.patchValue(data);
    })

  }
}

onsubmit(){
if(this.MusicForm.invalid){
  this.MusicForm.markAllAsTouched();
  return;
}

console.log("submitting updated form ",this.MusicForm.value);
this.musicservice.update(this.MusicForm.value).subscribe(()=>{
  this.router.navigate(['/list']);
})

  }
}


