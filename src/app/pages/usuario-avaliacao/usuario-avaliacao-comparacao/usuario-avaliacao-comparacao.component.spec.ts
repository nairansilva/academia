import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioAvaliacaoComparacaoComponent } from './usuario-avaliacao-comparacao.component';

describe('UsuarioAvaliacaoComparacaoComponent', () => {
  let component: UsuarioAvaliacaoComparacaoComponent;
  let fixture: ComponentFixture<UsuarioAvaliacaoComparacaoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioAvaliacaoComparacaoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioAvaliacaoComparacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
