import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jest.fn(),
      login: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the form is invalid', () => {
    component.form.setValue({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    });
    expect(component.form.valid).toBeFalsy();
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();

    component.form.setValue({
      email: 'nicolas@gmail.com',
      password: 'Test64170',
      firstName: '',
      lastName: 'Ruiz',
    });
    expect(component.form.valid).toBeFalsy();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy();

    component.form.setValue({
      email: 'nicolas@gmail.com',
      password: 'Test64170',
      firstName: 'Nicolas',
      lastName: '',
    });
    expect(component.form.valid).toBeFalsy();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy();

    component.form.setValue({
      email: 'nicolas@gmail.com',
      password: '',
      firstName: 'Nicolas',
      lastName: 'Ruiz',
    });
    expect(component.form.valid).toBeFalsy();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy();

    component.form.setValue({
      email: 'nicolas',
      password: 'Test64170',
      firstName: 'Nicolas',
      lastName: 'Ruiz',
    });
    expect(component.form.valid).toBeFalsy();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy();

    component.form.setValue({
      email: 'nicolas@gmail.com',
      password: 'Test64170',
      firstName: 'Nicolas',
      lastName: 'Ruiz',
    });
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should register successfully and navigate to /login', () => {
    const registerRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword',
    };

    authServiceMock.register.mockReturnValue(of(void 0));
    component.form.setValue(registerRequest);
    component.submit();
    fixture.detectChanges();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display an error message on registration failure', () => {
    authServiceMock.register.mockReturnValue(throwError({}));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword',
    });

    component.submit();
    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage.textContent).toContain('An error occurred');
  });

  it('should call authService.register on form submission', () => {
    const registerRequest = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword',
    };

    component.form.setValue(registerRequest);
    authServiceMock.register.mockReturnValue(of(void 0));
    component.submit();
    expect(authServiceMock.register).toHaveBeenCalledWith(registerRequest);
  });
});
