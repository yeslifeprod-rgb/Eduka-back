import { PartialType } from "@nestjs/swagger";
import { UpdateModifProfileDto } from "./update-modifprofile.dto";

export class UpdateModifProfile extends PartialType(UpdateModifProfileDto) { }