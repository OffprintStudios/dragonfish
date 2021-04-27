import { ApiProperty } from '@nestjs/swagger';
import { Decision } from '@dragonfish/shared/models/contrib';

export class DecisionDTO implements Decision {
    @ApiProperty()
    readonly docId: string;

    @ApiProperty()
    readonly workId: string;

    @ApiProperty()
    readonly authorId: string;
}
