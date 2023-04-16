import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioAvaliacaoFormComponent } from './usuario-avaliacao-form.component';

describe('UsuarioAvaliacaoFormComponent', () => {
  let component: UsuarioAvaliacaoFormComponent;
  let fixture: ComponentFixture<UsuarioAvaliacaoFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioAvaliacaoFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioAvaliacaoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
