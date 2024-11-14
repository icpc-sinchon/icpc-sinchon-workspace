import { Test, TestingModule } from '@nestjs/testing';
import { SemesterController } from '../../src/semester/semester.controller';
import { SemesterService } from '../../src/semester/semester.service';
import { CreateSemesterDto } from '../../src/semester/dto/create-semester.dto';
import { UpdateSemesterDto } from '../../src/semester/dto/update-semester.dto';
import { Semester } from '@prisma/client';

describe('SemesterController', () => {
  let semesterController: SemesterController;
  // let semesterService: SemesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SemesterController],
      providers: [
        {
          provide: SemesterService,
          useValue: {
            getSemesters: jest.fn(),
            getSemesterById: jest.fn(),
            createSemester: jest.fn(),
            updateSemester: jest.fn(),
            deleteSemester: jest.fn(),
          },
        },
      ],
    }).compile();

    semesterController = module.get<SemesterController>(SemesterController);
    // semesterService = module.get<SemesterService>(SemesterService);
  });

  it('should be defined', () => {
    expect(semesterController).toBeDefined();
  });
});