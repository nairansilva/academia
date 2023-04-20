import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioTreinosExerciciosComponent } from './usuario-treinos-exercicios.component';

describe('UsuarioTreinosExerciciosComponent', () => {
  let component: UsuarioTreinosExerciciosComponent;
  let fixture: ComponentFixture<UsuarioTreinosExerciciosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioTreinosExerciciosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioTreinosExerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
