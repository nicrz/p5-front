import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormComponent } from '../../../../features/sessions/components/form/form.component';
import { SessionApiService } from '../../../../features/sessions/services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../../../features/sessions/interfaces/session.interface';
import { expect } from '@jest/globals';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let matSnackBar: MatSnackBar;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockSessionService: Partial<SessionService>;
  let router: Router;
  let sessionApiServiceMock: Partial<SessionApiService>;
  let teacherServiceMock: Partial<TeacherService>;
  let routerMock: Partial<Router>;

  beforeEach(
    waitForAsync(() => {
        sessionApiServiceMock = {
          create: jest.fn().mockReturnValue(of({ id: 'new-session-id' })),
          update: jest.fn().mockReturnValue(of({ id: 'updated-session-id' })),
          detail: jest.fn().mockReturnValue(of({
            id: 'session-id',
            name: 'Test Session',
            date: '2023-08-30',
            teacher_id: 'teacher-id',
            description: 'Session de test'
          }))
          };
    
          teacherServiceMock = {
            all: jest.fn()
          };
    
          routerMock = {
            navigate: jest.fn(), 
            url: '/sessions/create', 
            createUrlTree: jest.fn(), 
            serializeUrl: jest.fn()
          };
      
          mockSessionService = {
              sessionInformation: {
                id: 1,
                firstName:"Ruiz",
                lastName:"Nicolas",
                token:"token",
                type:"type",
                username:"nicrz",
                admin: true 
              }
            };
      
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes([{ path: 'sessions', component: FormComponent }]),
            MatSnackBarModule, ReactiveFormsModule],
        declarations: [FormComponent],
        providers: [
            FormBuilder,
            MatSnackBar,
            { provide: SessionApiService, useValue: sessionApiServiceMock  },
            { provide: TeacherService, useValue: teacherServiceMock  },
            { provide: FormBuilder },
            { provide: Router, useValue: routerMock },
            {provide: SessionService, useValue: mockSessionService },
            {
                provide: ActivatedRoute,
                useValue: { snapshot: { paramMap: { get: jest.fn() } } }
              }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    mockSessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;
    mockTeacherService = TestBed.inject(TeacherService) as jest.Mocked<TeacherService>;
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form in Create mode', () => {
    expect(component.onUpdate).toBeFalsy();
    expect(component.sessionForm).toBeDefined();
  });

  
  it('should initialize the form in Update mode', () => {
    
    const session: Session = {
        id: 1,
        name: 'Test Session',
        date: new Date(),
        description: 'Test Description',
        teacher_id:101,
        users:[1,2,3],
        createdAt:new Date,
        updatedAt: new Date
      };

    (sessionApiServiceMock.detail as jest.Mock).mockReturnValue(of(session));
    (routerMock.url as string) = '/sessions/update/1';

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.onUpdate).toBe(true);
    expect(component.sessionForm).toBeDefined();

    expect(component.sessionForm?.value).toEqual({
      date: new Date().toISOString().split('T')[0],
      name: session.name,
      teacher_id: session.teacher_id,
      description: session.description
    });
  });

  it('should display "Create session" title when onUpdate is false', () => {
    
    component.onUpdate = false;
    fixture.detectChanges();

    const titleElement: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(titleElement.textContent).toContain('Create session');
  });

  it('should display "Update session" title when onUpdate is true', () => {
    
    component.onUpdate = true;
    fixture.detectChanges();

    const titleElement: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(titleElement.textContent).toContain('Update session');
  });

  it('should show snackbar and navigate to "sessions" when calling exitPage()', fakeAsync(() => {
   
    component.sessionForm = TestBed.inject(FormBuilder).group({
      name: ['Test Session', []],
      date: ['2023-08-28', []],
      teacher_id: ['1', []],
      description: ['Test Description', []]
    });
    component.submit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);
  }));

  it('should call SessionApiService.update() when submitting in Update mode', () => {
    const updateSessionSpy = mockSessionApiService.update;

    
    component.onUpdate = true;
    component.sessionForm = TestBed.inject(FormBuilder).group({
      name: ['Updated Session', []],
      date: ['2023-08-28', []],
      teacher_id: ['updated-teacher-id', []],
      description: ['Updated Description', []]
    });

    
    component.submit();

    expect(updateSessionSpy).toHaveBeenCalledWith( undefined, {"date": "2023-08-28", "description": "Updated Description", "name": "Updated Session", "teacher_id": "updated-teacher-id"});
    expect(matSnackBar.open).toHaveBeenCalledWith("Session updated !", 'Close', { duration: 3000 });
  });

 it('should call SessionApiService.create() when submitting in Create mode', () => {
    const createSessionSpy = mockSessionApiService.create;

    
    component.onUpdate = false;
    component.sessionForm = TestBed.inject(FormBuilder).group({
      name: ['Test Session', []],
      date: ['2023-08-28', []],
      teacher_id: ['1', []],
      description: ['Test Description', []]
    });

    
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    component.submit();
    expect(createSessionSpy).toHaveBeenCalledWith( {"date": "2023-08-28", "description": "Test Description", "name": "Test Session", "teacher_id": "1"});
    expect(matSnackBar.open).toHaveBeenCalledWith("Session created !", 'Close', { duration: 3000 });
  });

});