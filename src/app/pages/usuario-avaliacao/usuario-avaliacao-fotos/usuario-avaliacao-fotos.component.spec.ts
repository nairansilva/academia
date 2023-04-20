import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioAvaliacaoFotosComponent } from './usuario-avaliacao-fotos.component';

describe('UsuarioAvaliacaoFotosComponent', () => {
  let component: UsuarioAvaliacaoFotosComponent;
  let fixture: ComponentFixture<UsuarioAvaliacaoFotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioAvaliacaoFotosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioAvaliacaoFotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
