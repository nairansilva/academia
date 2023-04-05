import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [FormsModule, ReactiveFormsModule, IonicModule],
  exports: [FormsModule, ReactiveFormsModule, IonicModule],
})
export class SharedModule {}
