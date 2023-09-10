import { LoginComponent } from './login.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: LoginComponent }
        ]),
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the submit button when the form is invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should display an error for incorrect email', () => {
    component.form.controls['email'].setValue('nicolas');
    component.form.controls['password'].setValue('wrong');
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should display an error message for incorrect email and password', () => {
    component.form.controls['email'].setValue('incorrect@example.com');
    component.form.controls['password'].setValue('wrong');
    fixture.detectChanges();
    authServiceMock.login.mockReturnValue(throwError({}));
    component.submit();
    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('An error occurred');
  });

});
