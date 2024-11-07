import { IsNotEmpty } from 'class-validator';

export class CreateSemesterDto {
    @IsNotEmpty()
    year: number;

    @IsNotEmpty()
    season: string;
}