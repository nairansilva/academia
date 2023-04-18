import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UsuarioAvaliacaoPollockComponent } from './usuario-avaliacao-pollock.component';

describe('UsuarioAvaliacaoPollockComponent', () => {
  let component: UsuarioAvaliacaoPollockComponent;
  let fixture: ComponentFixture<UsuarioAvaliacaoPollockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioAvaliacaoPollockComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioAvaliacaoPollockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
