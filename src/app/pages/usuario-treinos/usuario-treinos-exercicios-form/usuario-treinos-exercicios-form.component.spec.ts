import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioTreinosExerciciosFormComponent } from './usuario-treinos-exercicios-form.component';

describe('UsuarioTreinosExerciciosFormComponent', () => {
  let component: UsuarioTreinosExerciciosFormComponent;
  let fixture: ComponentFixture<UsuarioTreinosExerciciosFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioTreinosExerciciosFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioTreinosExerciciosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
