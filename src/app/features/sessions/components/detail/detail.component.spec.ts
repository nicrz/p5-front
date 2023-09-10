import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { DetailComponent } from '../../../../features/sessions/components/detail/detail.component';
import { SessionApiService } from '../../../../features/sessions/services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionService } from 'src/app/services/session.service';
import { Session } from '../../../../features/sessions/interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockSessionService: Partial<SessionService>;
  let matSnackBar: MatSnackBar;
  let testSession: Session;
  let testTeacher: Teacher;
  
  beforeEach(async () => {

    const sessionApiServiceSpy = {
      detail: jest.fn(),
      delete: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn()
    } as unknown as jest.Mocked<SessionApiService>;

    const teacherServiceSpy = {
      detail: jest.fn()
    } as unknown as jest.Mocked<TeacherService>;

    mockSessionService = {
        sessionInformation: {
          id: 1,
          firstName:"Nicolas",
          lastName:"Ruiz",
          token:"token",
          type:"alchimie",
          username:"manon",
          admin: true 
        }
      };

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [MatSnackBarModule, RouterTestingModule.withRoutes([
        { path: 'sessions', component: DetailComponent }
        ])],
      providers: [
        { provide: SessionApiService, useValue: sessionApiServiceSpy },
        { provide: TeacherService, useValue: teacherServiceSpy },
        { provide: FormBuilder },
        {provide: SessionService, useValue: mockSessionService },
        MatSnackBar 
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    mockSessionApiService = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;
    mockTeacherService = TestBed.inject(TeacherService) as jest.Mocked<TeacherService>;
    matSnackBar = TestBed.inject(MatSnackBar);

    jest.spyOn(matSnackBar, 'open').mockReturnValue({} as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session details on ngOnInit', () => {
    testSession = {
      id: 1,
      name: 'Yoga',
      description: 'session de test',
      users: [1, 2, 3], 
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      teacher_id: 101
    };
    testTeacher = {
      id: 101,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockSessionApiService.detail.mockReturnValue(of(testSession));
    mockTeacherService.detail.mockReturnValue(of(testTeacher));
    component.sessionId = "1";
    component.ngOnInit();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith("1");
    expect(mockTeacherService.detail).toHaveBeenCalledWith('101');
    expect(component.session).toEqual(testSession);
    expect(component.teacher).toEqual(testTeacher);
    expect(component.isParticipate).toBeTruthy();
  });

  it('should delete the session', () => {
    mockSessionApiService.delete.mockReturnValue(of({}));
    component.sessionId = "1";
    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith("1"); 
    expect(matSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
  });

  it('should show the delete button when user is an admin', () => {
    component.isAdmin = true; 
    testSession = {
    id: 1,
    name: 'Yoga',
    description: 'session de test',
    users: [1, 2, 3], 
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 101
    };
    testTeacher = {
    id: 101,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    };

    
    mockSessionApiService.detail.mockReturnValue(of(testSession));
    mockTeacherService.detail.mockReturnValue(of(testTeacher));
    component.sessionId = "1";
    component.ngOnInit();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith("1");
    expect(mockTeacherService.detail).toHaveBeenCalledWith('101');
    
    fixture.detectChanges(); 
    const deleteButtonTextSpan = fixture.nativeElement.querySelector('.m3 mat-card mat-card-title button span.ml1');
    expect(deleteButtonTextSpan).toBeTruthy(); 

    const deleteButtonText = deleteButtonTextSpan.textContent.trim();
    expect(deleteButtonText).toBe('Delete'); 
    
    const deleteButton = deleteButtonTextSpan.parentElement;
    expect(deleteButton).toBeTruthy(); 
    expect(deleteButton.tagName).toBe('BUTTON'); 
  });

  it('should not show the delete button when user is not an admin', () => {
    component.isAdmin = false; 
    testSession = {
    id: 1,
    name: 'Yoga',
    description: 'session de test',
    users: [1, 2, 3], 
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 101
    };
    testTeacher = {
    id: 101,
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    };

    mockSessionApiService.detail.mockReturnValue(of(testSession));
    mockTeacherService.detail.mockReturnValue(of(testTeacher));
    component.sessionId = "1";
    component.ngOnInit();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith("1");
    expect(mockTeacherService.detail).toHaveBeenCalledWith('101');
    
    fixture.detectChanges(); 
    const deleteButtonTextSpan = fixture.nativeElement.querySelector('.m3 mat-card mat-card-title button span.ml1');
    expect(deleteButtonTextSpan).toBeTruthy(); 

    const deleteButtonText = deleteButtonTextSpan.textContent.trim();
    expect(deleteButtonText).toBe('Do not participate'); 
  });
  it('should go back when calling back()', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });
});
