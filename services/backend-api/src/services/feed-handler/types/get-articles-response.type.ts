import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export enum GetArticlesResponseRequestStatus {
  ParseError = "parse_error",
  Pending = "pending",
  Success = "success",
}

class FilterStatus {
  @IsBoolean()
  passed: boolean;
}

class Result {
  @IsIn(Object.values(GetArticlesResponseRequestStatus))
  requestStatus: GetArticlesResponseRequestStatus;

  @IsArray()
  @IsObject({ each: true })
  articles: Array<Record<string, string>>;

  @IsObject({ each: true })
  @IsArray()
  @Type(() => FilterStatus)
  @ValidateNested({ each: true })
  @IsOptional()
  filterStatuses?: Array<FilterStatus>;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  selectedProperties?: string[];
}

export class GetArticlesResponse {
  @ValidateNested()
  @IsObject()
  result: Result;
}
